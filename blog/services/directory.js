const { createServer } = require('../libs/rpc')
const path = require('path')
const glob = require('glob')

class FileListingService {
  constructor(cwd, pattern) {
    cwd = path.resolve(__dirname, cwd)
    const filePaths = new Promise((resolve, reject) => glob(
      pattern,
      { cwd, nodir: true, ignore: 'node_modules/**' },
      (error, files) => error ? reject(error) : resolve(files)
    ))
    
    Object.assign(this, {
      filePaths, cwd, list: async(pattern) => this.children(
        (await filePaths).filter(file => file.match(pattern))
      )
    })
  }
  
  meta(file) {
    if (/\.mdx?$/.test(file)) return new Promise(resolve => {
      const { data } = require('gray-matter').read(path.join(this.cwd, file))
    
      return resolve(data)
    })
  }

  children(paths, rootPath = '') {
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
            map[key] = { filePath, meta: this.meta(filePath) }
            break
          default: 
            const dirPath = rootPath + key
            
            map[key] = {
              filePath: dirPath,
              children: this.children(paths, dirPath)
            }
        }

        return map
      }, {}
    ))
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
  { address: 'tcp://127.0.0.1:4242' },
  new FileListingService('..', 'pages/**')
)
