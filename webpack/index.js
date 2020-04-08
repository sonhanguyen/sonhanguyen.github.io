module.exports = ({ module: { rules } }) => {
  const config = require('./base.config')
  rules.push(...config.module.rules)
}
