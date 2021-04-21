const patchWithAstroturfLoader = ({ module: { rules } }) =>
  rules.push({
    test: /\.[tj]sx$/,
    enforce: 'pre',
    loader: 'astroturf/loader',
    options: { extension: '.module.scss', enableCssProp: true },
  })

const { webpack, ...base } = require('@sonha/app-scripts/next.config')

module.exports = {
  ...base,
  webpack(webpackConfig, ...args) {
    const config = webpack(webpackConfig, ...args)
    patchWithAstroturfLoader(config)
    return config
  }
}
