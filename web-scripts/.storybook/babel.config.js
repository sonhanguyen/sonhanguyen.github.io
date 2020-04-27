const { join } = require('path')
module.exports = {
  plugins: [ join(__dirname, '../node_modules/babel-plugin-preval') ]
}