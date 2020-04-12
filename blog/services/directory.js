const memoise = (func, { cache = {}, keyGen = JSON.stringify } = {}) => Object.assign(
  (...args) => {
    const key = keyGen.call(cache, args)
    if (key in cache) return cache[key]
    return cache[key] = func(...args)
  },
  { cache }
)

const meta = memoise(file => {
  if (/\.mdx?$/.test(file)) return new Promise(resolve => {
    const { data } = require('gray-matter').read(file)
    return resolve(data)
  })
})

const { createServer } = require('@sonha/rpc')

module.exports = createServer({ address: 'tcp://127.0.0.1:4242' }, {
  list: memoise(paths => Promise.all(
    paths.map(
      async(path) => ({ path, meta: await meta(path) })
    )
  ))
})
