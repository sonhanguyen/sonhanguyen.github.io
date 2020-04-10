#!/usr/bin/env node

const { execSync: $ } = require('child_process')
const path = require('path')

/**
 * call this function at the top of an entrypoint to a module with __filename
 * it will automatically call `npm i` when the file is imported
 */

module.exports = (id, cmd = 'npm') => {
  id = require.resolve(id)
  if (require.cache[id].loaded) return
  
  const node_modules = String($(`cd $(dirname ${id}) && echo $(npm root)`)).trim()

  const list = () => String($(`cd ${node_modules} && echo * @*/*`))
    .trim().split(' ').filter(dep => !dep.match(/^@[^\\/]+$/))

  try { var installed = list() }
  catch (e) {
    if (/No such file or directory/.test(e.stderr)) {
      $(`mkdir ${node_modules}`)
      installed = list()
    }
  }

  const { dependencies, devDependencies } = require(node_modules.replace(/node_modules$/, 'package'))
  
  const toString = map => Object
    .entries(map || {})
    .filter(([name]) => !installed.includes(name))
    .map(([name, version]) => `${name}@${version}`)
    .join` `

  const installMissing = (list, flags = '') => {
    list = toString(list)
    if (list) $(`${cmd} i ${flags} ${list}`, {
      cwd: path.dirname(node_modules),
      stdio: 'inherit'
    })
  }

  installMissing(dependencies)
  installMissing(devDependencies, '-D')
}
