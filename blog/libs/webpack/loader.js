const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const path = require('path')

function compile(config, entry) {
  const output = { path: '/', filename: 'main', libraryTarget: 'commonjs2' }
  const compiler = webpack({ ...config,
    entry: path.resolve(__dirname, entry),
    output
  })

  compiler.outputFileSystem = new MemoryFs()

  return new Promise(
    (resolve, reject) => compiler.run((err, stats) => {
      if (stats.hasWarnings()) console.error(stats.toString({
        errorDetails: true,
        warnings: true
      }))

      if (err || stats.hasErrors()) return reject(Object.assign(err || {}, stats))

      compiler.outputFileSystem.readFile(
        output.path + output.filename,
        (error, buffer) => (error ? reject : resolve)(Object.assign(error || new String(buffer), stats))
      )
    })
  )
}

// This provides a way for nodejs to load modules with regards to all webpack configs
module.exports = entry => compile(require('@sonha/app-scripts/webpack/mdx.config'), entry)
  .then(code => {
    const virtualModule = {}
    new Function('module', code)(virtualModule)

    return virtualModule.exports
  })
