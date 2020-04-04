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

const flattenPromises = async(map) => {
  map = await map

  const clone =
    Array.isArray(map) ? [] :
    typeof map == 'object' ? {} :
    null
  
  if (!clone) return map

  for (const [key, value] of Object.entries(map)) {
    clone[key] = await flattenPromises(value)  
  }

  return clone
}

const isFunction = target => typeof target == 'function'

const serializable = (target, ...methods) => {
  const descriptor = methods[1]
  switch (true) {
    case typeof descriptor == 'object':
      descriptor.value = serializable(descriptor.value)

    case typeof target == 'string':
      return it => serializable(it, target, ...methods)
    case isFunction(target.prototype && target.prototype.constructor):
      return class extends target {
        constructor(...args) {
          super(...args)
          serializable(this, ...methods)
        }
      }

    case isFunction(target):
      return (...args) => flattenPromises(target(...args))
  }
  
  if (!methods.length) methods = Object.keys(target)

  for (const key of methods) {
    const func = target[key]
    if (isFunction(func)) target[key] = serializable(func)
  }

  return target
}

serializable(new FileListingService('.', '**'))
  .list()
  .then(it => JSON.stringify(it, null, 2))
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
