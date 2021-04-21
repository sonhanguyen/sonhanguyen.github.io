const path = require('path') 
const { exec } = require('gulp-execa')

exports.createShell = dirname => (cmd, options = {}) => {
  const nodePath = path.join(dirname, 'node_modules')
  const localDir = path.join(nodePath, '.bin')
  const { preferLocal = true, verbose = true } = options 
  
  return exec(`NODE_PATH=${nodePath}:$NODE_PATH ${cmd}`, {
    localDir,
    preferLocal,
    verbose,
    shell: true,
    stdio: 'inherit',
    ...options
  })
}

exports.cli = (tasks, defaultTask = 'default') => {
  const gulp = require('gulp')
  const { series } = gulp
  require('gulp-help-four')(gulp)

  const register = (tasks, namespace) => Object
    .keys(tasks)
    .forEach(name => {
      const task = tasks[name]
      if (typeof task === 'object') return register(task, name)
      if (namespace) name = `${namespace}:${name}`
      gulp.task(name, task.description, task)
    })

  register({ ...defaults, ...tasks })
  
  let [ task ] = process.argv.slice(2)
  if (!task || task.startsWith('-')) task = defaultTask
  if (['-h', '--help'].includes(task)) task = 'help'

  series(task)()
}

const $ = exports.createShell(__dirname)
const args = process.argv.slice(3).join(' ')

const defaults = {
  interactiveUpgrade() {
    let { stdout: pnpm } = require('child_process')
      .spawnSync(`which pnpm; exit 0`, { shell: true, stdio: 'pipe' })

    if (pnpm) pnpm = 'NPM_CHECK_INSTALLER=pnpm'
    
    return $(`${pnpm} npm-check -u ${args}`)
  }
}