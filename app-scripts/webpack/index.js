const path = require('path')
const { createPatchWithTsConfig } = require('./aliases')

exports.createPatch = (pattern = require('fs').realpathSync('../..')) => config =>
  [ patchResoverWithAppsNodeModules,
    createPatchWithTsConfig(),
    patchWithAstroturfLoader,
    patchWithMdxLoader,
    createPatchLoadersWithWorkspaceModules(pattern)
  ].reduce(
    (patched, func) => (func(patched), patched),
    config
  )

const createPatchLoadersWithWorkspaceModules = pattern => ({ module: { rules } }) =>
  rules.forEach(cloned => cloned.include = RegExp(pattern + '(?!.*node_modules.*)'))

const patchWithAstroturfLoader = ({ module: { rules } }) =>
  rules.push({
    test: /\.[tj]sx$/,
    enforce: 'pre',
    loader: 'astroturf/loader',
    options: { extension: '.module.css', enableCssProp: true },
  })

const patchWithMdxLoader = ({ module: { rules } }) =>
  rules.push({
    test: /\.mdx$/,
    use: [
      { loader: require.resolve('babel-loader'),
        options: { presets: [require.resolve('next/babel') ] }
      },
      require.resolve('@mdx-js/loader')
    ]
  })

const patchResoverWithAppsNodeModules = ({ resolve }) => {
  const LIB = 'node_modules'
  const { modules = [ LIB ] } = resolve
  resolve.modules = [ path.join(process.cwd(), LIB), ...modules ]
}