module.exports = ({ module: { rules }, resolve: { extensions } }) => {
  const { module: { rules: [ mdx ] }, resolve } = require('./webpack.config')

  resolve.extensions = Array.from(
    extensions.reduce(
      (set, element) => set.add(element),
      new Set(resolve.extensions)
    )
  )

  rules.push(mdx)
}
