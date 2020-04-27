module.exports = static => ({ module: { rules } }) => {
  const config = require('./base.config')
  rules.push(...config(static).module.rules)
}
