const { createServer, createClient } = require('./server')
const grayMatter = require('gray-matter')
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
                children: new LazyPromise(resolve => resolve(children(paths, dirPath)))
              }
          }
    
          return map
        }, 
        {}
      )
    }
    
    const meta = file => new LazyPromise(resolve => {
      const { data } = grayMatter.read(path.join(cwd, file))
    
      return resolve(data)
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

const server = createServer(
  { address: 'tcp://127.0.0.1:4242' },
  serializable(new FileListingService('.', '**'))
)

try{ server.start() }
catch (e) {
  if (!/Address already in use/.test(e)) console.error(e)
}

const { list } = createClient(server).connect()

const flatten = tree => {
  if (tree.filePath && !tree.children) return [ tree ]
  
  const result = []
  for (const descendants of Object.values(tree.children || tree).map(flatten)) {
    result.push(...descendants)
  }

  return result
}

const fromWebpackContext = context => {
  const desc = context.id.split(' ')
  const pattern = desc.pop()
  const dir = desc.shift().replace('./', '')
  const files = list(RegExp(`^${dir}.+${pattern}`))
    .then(flatten)
    .then(collection => collection
      .map(({ filePath, meta: props }) => {
        let slug = filePath.replace(/\.[^.]+$/, '')
        slug = slug.replace(/\/\\/g, '/')
        
        return {
          props, slug,
          name: slug.split('/').pop(),
          component: filePath.replace(RegExp('^' + dir), '.')
        }
      })
    )

  return {
    getStaticPaths: async() => (await files)
      .map(({ name }) => ({ params: { name }}))
    ,
    getStaticProps: async({ params }) => {
      const index = await files
      const { props } = index.find(({ name }) => name === params.name)

      return { index, ...props }
    }
  }
}

module.exports = { list, fromWebpackContext }
