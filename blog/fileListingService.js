const { createServer, createClient } = require('./server')
const { execSync } = require('child_process')
const $ = cmd => String(execSync(cmd)).trim()
const grayMatter = require('gray-matter')
const path = require('path')
const glob = require('glob')

const LazyPromise = require('p-lazy')

class FileListingService {
  constructor(cwd, pattern) {
    const children = (paths, rootPath = '') => {
      if (rootPath) {
        rootPath += path.sep
        paths = paths.filter(file => file.startsWith(rootPath))
      }

      return paths.reduce(
        (map, file) => {
          const relative = file.substr(rootPath.length)
          const [ key ] = relative.split(path.sep, 1)

          switch (true) {
            case key in map: break
            case key == relative:
              // map[key/* .replace(/\.[^.]+$/, '') */] = {
              map[key] = { path: file, meta: meta(file) }
              break
            default: 
              const dirPath = rootPath + key
              
              map[key] = {
                path: dirPath,
                children: new LazyPromise(resolve => resolve(children(paths, dirPath)))
              }
          }

          return map
        }, 
        {}
      )
    }

    const filePaths = new LazyPromise((resolve, reject) => glob(
      pattern,
      { cwd, nodir: true, ignore: 'node_modules/**' },
      (error, files) => error ? reject(error) : resolve(files)
    ))

    const meta = file => new LazyPromise(resolve => {
      const { data } = grayMatter.read(path.join(cwd, file))

      return resolve(data)
    })

    this.list = async () => children(await filePaths)
  }
}

const recursiveResolve = async(map) => {
  const state = { ...map }
  await trampoline(
    flattenPromises({ state, callback() {} })
  )
  return state
} 

const flattenPromises = ({ state, callback }) => {
  console.log(state)
  const pairs = typeof state == 'string'
    ? []
    : Object.entries(state)

  return pairs.reduce(
    (thunk, [key, value]) => async() => {
      value = await value
      const next =
        Array.isArray(value) ? [ ...value ] :
        typeof value == 'object' ? { ...value } :
        value

      return flattenPromises({
        state: next,
        callback() {
          state[key] = next
          return thunk
        }
      })
    },
    callback
  )
}

const trampoline = async(computation, {
  isThunk = thunk => typeof thunk == 'function',
  call = thunk => thunk()
} = {}) => {
  while (isThunk(computation)) {
    computation = await call(computation)
  }

  return computation
}

new FileListingService('.', '**')
  .list()
  .then(recursiveResolve)
  // .then(it => JSON.stringify(it, null, 2))
  .then(console.log)


// const server = createServer(
//   { address: 'tcp://127.0.0.1:4242' },
//   new FileListingService('.', '*')
// )

// server.start()

// createClient(server)
//   .connect()
//   .list()
//   .then(console.log)
