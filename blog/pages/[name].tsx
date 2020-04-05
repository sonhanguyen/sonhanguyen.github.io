import styled from 'astroturf'
import { MDXProvider } from '@mdx-js/react'

const Theme = styled('div')`
  --background: black;
  --middleground: gray;
  --foreground: white;
`

const Sidebar = styled('div')`
  background: var(--background);
  color: var(--foreground);
`

const Main = styled('div')`
  background: var(--middleground);
  color: blue;
`

export default ({ component, title }) => {
  const { default: Content } = context(component)

  return <Theme>
    <Sidebar>
      { title }
    </Sidebar>
    <Main>
      <MDXProvider>
        <Content />
      </MDXProvider>
    </Main>
  </Theme>
}

// @ts-ignore
const context = require.context(__dirname, true, /\.mdx$/)

export const getStaticPaths = async() => {
  const { fromWebpackContext } = require('../fileListingService')
  const collection = fromWebpackContext(context)

  return {
    paths: await collection.getStaticPaths(),
    fallback: true
  }
}

export const getStaticProps = async(route) => {
  const { fromWebpackContext } = require('../fileListingService')
  const collection = fromWebpackContext(context)

  return { props: await collection.getStaticProps(route)}
}
