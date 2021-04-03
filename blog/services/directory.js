const memoize = (func, { cache = {}, keyGen = JSON.stringify } = {}) => Object.assign(
  (...args) => {
    const key = keyGen.call(cache, args)
    if (key in cache) return cache[key]
    return cache[key] = func(...args)
  },
  { cache }
)

const meta = memoize(file => {
  if (/\.mdx?$/.test(file)) return new Promise(resolve => {
    const { data } = require('gray-matter').read(file)
    return resolve(data)
  })
})

exports.list = memoize(paths => Promise.all(
  paths.map(
    async(path) => ({ path, meta: await meta(path) })
  )
))
