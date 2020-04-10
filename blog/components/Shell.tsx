import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Theme } from 'components'
import styled, { css } from 'astroturf'
import {
  createElement,
  ComponentProps,
  ComponentType,
  ElementType,
  ReactNode,
  Children
} from 'react'

css`@import url(~sanitize.css)`
type Props = {
  Content: ElementType
  children: ReactNode
}

const Shell = ({ children, Content }: Props) => {
  const main = ofUnknownType([], Children.toArray(children))
  
  return <Theme>
    <Layout>
      <aside>
        {portals.AsideHeader.match(children)}
        {portals.Aside.match(children)}
        {portals.AsideFooter.match(children)}
      </aside>
      {portals.header.match(children)}
      <MDXProvider>
        <Layout.main>
          { main }
          <Content />
        </Layout.main>
      </MDXProvider>
      {portals.footer.match(children)}
    </Layout>
  </Theme>
}

import createGrid from './createGrid'

const component = styled.div`
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100px 200px;
`
const Layout = createGrid({
  ...css`.className {}` as any,
  component
} as const)<'Aside' | 'footer' | 'header' | 'main'>(`
  ". AsideHeader header ."
  ". Aside main ."
  ". AsideFooter footer ."
`).withComponents({
  AsideHeader: 'header',
  AsideFooter: 'footer'
})

const filter = <S extends {}, E>(sample: S, elements: E[]): Array<E & S> => {
  const entries = Object.entries(sample)

  return elements.filter((element): element is E & S =>
    entries.every(([key, val]) => element[key] === val)
  )
}

const ofUnknownType = <T, E>(types: T[], elements: E[]) => elements
  .filter(({ type }: any) => !types.includes(type))

type Portal<P extends {}> =
& { match(children: ReactNode | ReactNode[]): typeof children } 
& ComponentType<P>

const slot = <P extends {}>(
  render: (_: P[]) => ReactNode,
  options: { displayName: string } = render as any
) => {
  const type = () => null
  const match = children => {
    const elements = filter({ type }, Children.toArray(children))

    return render(elements.map(({ props }: any) => props))
  }

  return Object.assign(type, {
    displayName: options.displayName,
    match
  }) 
}

const forOne = <P extends {}>(slot: ElementType<P>, defaultProps?: P) => {
  const { 
    name = slot as any,
    displayName = name
  }: Record<string, string> = slot as any

  return Object.assign(
    (propArray: P[]): ReactNode => {
      if (propArray.length > 1) throw Error(
        'only one portal expected for ' + displayName
      )

      const [ props ] = propArray      
      return createElement(slot, {...defaultProps, ...props})
    }, { displayName }
  )
}

const portals: {
  [K in keyof typeof Layout]: typeof Layout[K] extends ElementType
    ? Portal<ComponentProps<typeof Layout[K]>>
    : never 
} = (
  [ 'AsideHeader', 'AsideFooter', 'Aside', 'footer', 'header', 'main' ] as const
).reduce(
  (map, name) => {
    map[name] = slot(forOne(Layout[name]))
    return map
  }, {} as any
)

export default Object.assign(
  Shell,
  {
    Aside: Object.assign(portals.Aside, {
      Header: portals.AsideHeader,
      Footer: portals.AsideFooter
    }),
    Header: portals.header,
    Footer: portals.footer
  }
)