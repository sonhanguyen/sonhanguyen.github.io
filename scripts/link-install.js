#!/usr/bin/env node

const { execSync } = require('child_process')
const LINK = 'link:'

const packageJson = require(process.cwd() + '/package')

const deps = [].concat(
  ...Object
    .entries(packageJson)
    .filter(([key]) => key.match(/(D|d)ependencies$/))
    .map(([_, val]) => Object.values(val || {}))
)

deps
  .filter(dep => dep.startsWith(LINK))
  .map(dep => execSync(
    `cd ${dep.substr(LINK.length)}; npm i`,
    { stdio: 'inherit' }
  ))
