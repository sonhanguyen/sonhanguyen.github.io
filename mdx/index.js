module.exports = ({ module: { rules } }) => {
  const { module: { rules: [ mdx ] } } = require('./webpack.config')

  rules.push(mdx)
}
