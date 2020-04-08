#!/usr/bin/env node

const { exec } = require('child_process')
const LINK = 'link:'

const packageJson = require(process.cwd() + '/package')

const deps = [
  ...Object
    .entries(packageJson)
    .filter(([key]) => key.match(/^de.+pendencies$/))
    .map(([_, val]) => Object.values(val || {}))
]

deps
  .filter(dep => dep.startsWith(LINK))
  .map(dep => exec(
    `cd ${dep.substr(LINK.length)}; npm i`,
    { stdio: 'inherit' }
  ))
