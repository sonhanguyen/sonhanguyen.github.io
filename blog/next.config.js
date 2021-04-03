const patchWithAstroturfLoader = ({ module: { rules } }) =>
  rules.push({
    test: /\.[tj]sx$/,
    enforce: 'pre',
    loader: 'astroturf/loader',
    options: { extension: '.module.scss', enableCssProp: true },
  })

const config = require('@sonha/app-scripts/next.config')

module.exports = {
  ...config,
  webpack(webpackConfig, ...args) {
    patchWithAstroturfLoader(webpackConfig)

    return config.webpack(webpackConfig, ...args)
  }
}
