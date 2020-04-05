const { createServer } = require('../libs/rpc')
const path = require('path')
const glob = require('glob')

class FileListingService {
  constructor(cwd, pattern) {
    const filePaths = new Promise((resolve, reject) => glob(
      pattern,
      { cwd, nodir: true, ignore: 'node_modules/**' },
      (error, files) => error ? reject(error) : resolve(files)
    ))

    const children = (paths, rootPath = '') => {
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
                children: children(paths, dirPath)
              }
          }
    
          return map
        }, 
        {}
      ))
    }
    
    const meta = file => {
      const load = require('../libs/webpack/loader')
      return load(path.resolve(cwd, file))
    }

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

module.exports = createServer(
  { address: require('./services').directory },
  new FileListingService('.', '**')
)
