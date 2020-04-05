const context = require.context('.', true, /\.mdx/)

module.exports = context.keys()
  .map(context.resolve)
  .map(context)
  .value()
