const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const path = require('path')

function compile(config, entry) {
  const compiler = webpack({ ...config,
    entry: path.resolve(__dirname, entry),
    output: { path: '/', filename: 'main', libraryTarget: 'commonjs2' }
  })

  compiler.outputFileSystem = new MemoryFs()

  return new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (stats.hasWarnings()) console.error(stats.toString({
      errorDetails: true,
      warnings: true
    }))

    if (err || stats.hasErrors()) return reject(Object.assign(error, stats))

    compiler.outputFileSystem.readFile('/main', (error, buffer) => (error ? reject : resolve)
      (Object.assign(error || new String(buffer), stats)))
  }))
}

/**
 * This provides a way for nodejs to load modules with regards to all webpack configs
 * If it's turns out there is no other use, the mechanism could be refactored to glob + parsing those
 * files as yaml, so that webpack doesn't have to compile them twice
 */

exports.load = entry => compile(require('./webpack.config'), entry)
  .then(code => {
    const virtualModule = {}
    new Function('module', code)(virtualModule)

    return virtualModule.exports
  })
