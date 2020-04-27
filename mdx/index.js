module.exports = ({ module: { rules } }) => {
  const { module: { rules: [ mdx ] } } = require('./webpack.config')
  if (rules.some(({ test }) => test && test.source.match(/[.|]mdx/))) { return }
  rules.push(mdx)
}
