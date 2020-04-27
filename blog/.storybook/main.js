const config = require('@sonha/web-scripts/.storybook/main')
const { webpack } = require('../next.config')

module.exports = {
  ...config,
  webpackFinal(webpackConfig) {
    webpack(webpackConfig)
    return config.webpackFinal(webpackConfig) 
  }
}