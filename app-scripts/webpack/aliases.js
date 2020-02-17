const { resolve } = require('path')

exports.patchWithTsConfig = (webpackConfig, cwd = process.cwd()) => {
  const alias = {
    ...webpackConfig.resolve.alias || {},
    ...fromTsConfig(cwd)
  }

  Object.assign(webpackConfig.resolve, { alias })
}

const fromTsConfig = cwd => {
  const { compilerOptions } = require(resolve(cwd, 'tsconfig'))
  
  const resolveInCwd = path => resolve(
    cwd,
    compilerOptions.baseUrl,
    path
  )

  return Object
    .keys(compilerOptions.paths)
    .reduce(
      (aliases, alias) => {
        compilerOptions.paths[alias].forEach(resolvedTo => {
          const wildcard = resolveInCwd(resolvedTo)

          const { execSync } = require('child_process')
          String(execSync('echo ' + wildcard))
            .trim()
            .split(' ')
            .forEach(path => {
              const match = path.match(
                RegExp(resolvedTo.replace('*', '([^\\/]+)'))
              )

              if (match) Object.assign(aliases, {
                [alias.replace('*', match.pop())]: path
              })
              else aliases[alias] = path
            })
          })
          
        return aliases 
      },
      {}
    )
}