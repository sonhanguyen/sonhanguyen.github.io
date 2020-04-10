const path = require('path')

class DirectoryService {
  constructor(cwd, expansion) {
    cwd = path.resolve(__dirname, cwd)
    
    Object.assign(this, {
      cwd,
      list: memoise(async(pattern) => {
        const files = await glob(cwd, expansion)

        return children(
          files.filter(file => file.match(pattern)),
          { cwd }
        )
      })
    })
  }
}

const memoise = (func, { cache = {}, keyGen = JSON.stringify } = {}) => Object.assign(
  (...args) => {
    const key = keyGen.call(cache, args)
    if (key in cache) return cache[key]
    return cache[key] = func(...args)
  },
  { cache }
)

const glob = memoise(
  async(cwd, pattern) => await new Promise((resolve, reject) => require('glob')(
    pattern,
    { cwd, nodir: true, ignore: 'node_modules/**' },
    (error, files) => error ? reject(error) : resolve(files)
  ))
)

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

const meta = memoise((file, cwd) => {
  if (/\.mdx?$/.test(file)) return new Promise(resolve => {
    const { data } = require('gray-matter').read(path.join(cwd, file))
  
    return resolve(data)
  })
})

const children = (paths, { cwd, rootPath = '' } = {}) => {
  if (rootPath) {
    rootPath += path.sep
    paths = paths.filter(file => file.startsWith(rootPath))
  }

  return flattenPromises(paths.reduce(
    (map, filePath) => {
      const relative = filePath.substr(rootPath.length)
      const [ key ] = relative.split(path.sep, 1)

      switch (true) {
        case key in map: break
        case key == relative:
          map[key] = { filePath, meta: meta(filePath, cwd) }
          break
        default: 
          const dirPath = rootPath + key
          
          map[key] = {
            filePath: dirPath,
            children: children(paths, { cwd, rootPath: dirPath })
          }
      }

      return map
    }, {}
  ))
}

const { createServer } = require('@sonha/rpc')

module.exports = createServer(
  { address: 'tcp://127.0.0.1:4242' },
  new DirectoryService('..', 'pages/**')
)
