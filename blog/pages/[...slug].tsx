import dynamic from 'next/dynamic'
import Shell from 'components/Shell'
import Nav from 'components/Nav'

export default ({ component, title, index = [], path }) => {
  const Content = dynamic(async () => (await context(component)).default)
  index = index.map(_ => _.props)

  return (
    <Shell Content={Content}>
      <Shell.Header>{title}</Shell.Header>
      <Shell.Aside>
        <Nav items={index} />
      </Shell.Aside>
    </Shell>
  )
}

// @ts-ignore
const context = require.context(__dirname, true, /\.mdx?$/, 'lazy')

export const getStaticPaths = async() => ({
  paths: await require('../services')
    .pagesFromWebpackContext(context)
    .getStaticPaths(),
  fallback: true
})

export const getStaticProps = async(route) => ({
  props: await require('../services')
    .pagesFromWebpackContext(context)
    .getStaticProps(route)
})
