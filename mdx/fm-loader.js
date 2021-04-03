const matter = require('gray-matter')

module.exports = async src => {
  const { data, content } = matter(src)

  return Object
    .entries(data)
    .reduce(
      (code, [key, val]) => code +  
        `\n\nexport const ${key} = ${JSON.stringify(val, null, 2)}`
      , content
    )
}
