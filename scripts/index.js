const path = require('path') 
const { exec } = require('gulp-execa')

exports.createShell = bin => (cmd, options = {}) => {
  const localDir = path.join(bin, 'node_modules', '.bin')
  const { preferLocal = true, verbose = true } = options 
  
  return exec(cmd, { localDir, ...options, preferLocal, verbose })
}

exports.cli = tasks => {
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

  register(tasks)
  
  let [ task ] = process.argv.slice(2)
  if (!task || task.startsWith('-')) task = 'default'
  if (['-h', '--help'].includes(task)) task = 'help'

  series(task)()
}
