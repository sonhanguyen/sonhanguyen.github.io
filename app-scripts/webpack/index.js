const { patchWithTsConfig } = require('./aliases')
const { patchLoadersWithWorkspaceModules } = require('./libSrcLoaders')

exports.patchForLibSrc = (config, pattern = require('fs').realpathSync('../..')) => {
  pattern = RegExp(pattern + '(?!.*node_modules.*)')

  patchLoadersWithWorkspaceModules(config, pattern)
  patchWithTsConfig(config)

  return config
}
