const { createServer } = require('./libs/rpc')
const path = require('path')
const glob = require('glob')

const LazyPromise = require('p-lazy')

class FileListingService {
  constructor(cwd, pattern) {
    const filePaths = new LazyPromise((resolve, reject) => glob(
      pattern,
      { cwd, nodir: true, ignore: 'node_modules/**' },
      (error, files) => error ? reject(error) : resolve(files)
    ))

    const children = (paths, rootPath = '') => {
      if (rootPath) {
        rootPath += path.sep
        paths = paths.filter(file => file.startsWith(rootPath))
      }
    
      return paths.reduce(
        (map, filePath) => {
          const relative = filePath.substr(rootPath.length)
          const [ key ] = relative.split(path.sep, 1)
    
          switch (true) {
            case key in map: break
            case key == relative:
              map[key] = {
                filePath,
                ...filePath.match(/\.mdx?$/) && {
                  meta: meta(filePath)
                }
              }
              break
            default: 
              const dirPath = rootPath + key
              
              map[key] = {
                filePath: dirPath,
                children: LazyPromise.from(_ => children(paths, dirPath))
              }
          }
    
          return map
        }, 
        {}
      )
    }
    
    const meta = file => LazyPromise.from(async() => {
      const load = require('./libs/loader')
      return load(path.resolve(cwd, file)).catch(console.error)
    })

    this.list = async(pattern) => children(
      (await filePaths).filter(file => file.match(pattern))
    )
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
  switch (true) {
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

module.exports = createServer(
  { address: require('./libs').fileListingService },
  serializable(new FileListingService('.', '**'))
)
