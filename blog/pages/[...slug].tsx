import dynamic from 'next/dynamic'
import Shell from 'components/Shell'
import Nav from 'components/Nav'

export default function Post({ component, title, index = [], path }) {
  const Content = component && dynamic(async () =>
    (await context(component)).default
  )

  index = index.map(_ => _.props)

  return (
    <Shell Content={Content}>
      <Shell.Title>{title}</Shell.Title>
      <Shell.Aside>
        <Nav items={index} />
      </Shell.Aside>
    </Shell>
  )
}

import context from '..'

export const getStaticPaths = async() => ({
  paths: await require('../services')
    .pages(context)
    .getStaticPaths(),
  fallback: true
})

export const getStaticProps = async route => ({
  props: await require('../services')
    .pages(context)
    .getStaticProps(route)
})
