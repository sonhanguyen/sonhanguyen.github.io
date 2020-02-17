const { produce } = require('immer')

/**
 * @typedef {import('webpack').RuleSetRule} Rule
 * @type {(_: RegExp) => ($: Rule) => Rule}}
 */
const withWorkspaceSrc = pattern => rule => produce(
  rule, /** @type {{(_: Rule): Rule}} */ cloned => {
    cloned.include = pattern
    delete cloned.exclude
  }
)

/** @type {{(_: import('webpack').Configuration): void} */
exports.patchLoadersWithWorkspaceModules = ({ module: { rules } }, pattern) => {
  const inclusive = rules.map(withWorkspaceSrc(pattern))
  rules.push(...inclusive)
}