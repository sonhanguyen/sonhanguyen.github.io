const path = require('path')
const { createPatchWithTsConfig } = require('./aliases')

exports.createPatch = (pattern = require('fs').realpathSync('../..')) => config =>
  [ patchResoverWithAppsNodeModules,
    createPatchWithTsConfig(),
    patchWithAstroturfLoader,
    patchWithWebAssetsLoader,
    patchCssModuleImpure,
    patchWithMdxLoader,
    createPatchLoadersWithWorkspaceModules(pattern)
  ].reduce(
    (patched, func) => (func(patched), patched),
    config
  )

const createPatchLoadersWithWorkspaceModules = pattern => ({ module: { rules } }) =>
  rules.forEach(rule => rule.include = RegExp(pattern + '(?!.*node_modules.*)'))

const patchCssModuleImpure =  ({ module: { rules } }) => {
  const cssModuleOptions = rule => {
    const { options = {} } = rule
    
    return options.modules || {}
  }
  
  deepFind(rules, ({ loader, rule }) =>
    /\/css-loader\//.test(loader) &&
    cssModuleOptions(rule).mode == 'pure'
  ).forEach(({ rule }) => cssModuleOptions(rule).mode = 'local')
}

const patchWithAstroturfLoader = ({ module: { rules } }) =>
  rules.push({
    test: /\.[tj]sx$/,
    enforce: 'pre',
    loader: 'astroturf/loader',
    options: { extension: '.module.scss', enableCssProp: true },
  })

const patchWithMdxLoader = require('@sonha/mdx')
const patchWithWebAssetsLoader = require('@sonha/webpack')

const patchResoverWithAppsNodeModules = ({ resolve }) => {
  const LIB = 'node_modules'
  const { modules = [ LIB ] } = resolve
  resolve.modules = [ path.join(process.cwd(), LIB), ...modules ]
}

const deepFind = (current, match, main = {}) => {
  const {
    use = current,
    loader = use,
    oneOf = loader,
    loaders = oneOf,
    rules = loaders,
    test = main.test,
  } = current

  if(typeof loader == 'string') return [
    { rule: current, loader, test: String(test) }
  ].filter(match)
  
  if (Array.isArray(rules)) return [].concat(
    ...rules.map(rule => deepFind(rule, match, current))
  )
  
  return []
}