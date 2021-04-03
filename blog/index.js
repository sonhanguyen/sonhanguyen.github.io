const cwd = process.cwd()
const path = require('path')

const key = absolute => absolute.replace(cwd, '.')    

export default Object.assign(
  require.context(__dirname, true, /pages\/.+\.mdx?$/, 'lazy'),
  { path: id => key(id)
      .replace(/\/\\/g, '/')    
      .replace(/^\.\/pages\//, ''),

    resolve: key => path.join(cwd, key),
    key
  }
)
