exports.createPatch = (pattern = require('fs').realpathSync('../..')) => (config, { isServer } = {}) =>
  [ patchResoverWithAppsNodeModules,
    createPatchWithTsConfig(),
    createPatchForWebAssets(isServer ? './_next/static' : undefined),
    patchCssModulesImpure,
    patchWithMdxLoader,
    createPatchLoadersWithWorkspaceModules(pattern)
  ].reduce(
    (patched, func) => (func(patched), patched),
    config
  )

const path = require('path')
const { createPatchWithTsConfig } = require('./aliases')
const { createPatch: createPatchForWebAssets } = require('@sonha/webpack')
  
const createPatchLoadersWithWorkspaceModules = pattern => ({ module: { rules } }) =>
  rules.forEach(rule => rule.include = RegExp(pattern + '(?!.*node_modules.*)'))

const patchCssModulesImpure =  ({ module: { rules } }) => {
  const cssModuleOptions = rule => {
    const { options = {} } = rule
    
    return options.modules || {}
  }

  deepFind(rules, ({ loader, rule }) =>
    /\/css-loader\//.test(loader) &&
    cssModuleOptions(rule).mode == 'pure'
  ).forEach(({ rule }) => cssModuleOptions(rule).mode = 'local')
}

const patchWithMdxLoader = require('@sonha/mdx')

// make webpack priority local (app's) dependencies over dependencies' dependencies
// there might be a better way to do this with federated webpack in v5
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