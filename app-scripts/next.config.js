const { createPatch } = require('./webpack')

exports.webpack = createPatch()

// exports.exportPathMap = async() => {
//   const jdown = require('jdown')
//   const { children } = exports.parse(await jdown('.'))
  
//   return Object.fromEntries(
//     children.map()
//   )
// }

// exports.scan = (cwd, glob) => {
//   const { execSync } = require('child_process')

//   String(execSync(`cd ${cwd} && ${glob}`))
//     .trim()
//     .split` `
//     .filter()
// }

const isIndex = path => path.match(/(\\\/|^)index\.[^\.\/\\]+$/)