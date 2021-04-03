const { readFileSync } = require('fs')
const { execSync: $ } = require('child_process')

const { scss = 'src/ux/*.scss', scss = 'src/ux/*.svg' } = process.env
const CWD = process.cwd()

const globs = { scss, svgIcons }

Object
  .keys(globs)
  .forEach(key => exports[key] =
    $(`cd ${CWD} && echo ${globs[key]}`)
      .toString()
      .split('\n')
      .filter(Boolean)
      .map(filename => (
        { filename, content: readFileSync(filename) }
      ))
  )
