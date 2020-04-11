import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Theme, Styled } from 'components'
import styled from 'astroturf'
import {
  ElementType,
  ReactNode,
  Children
} from 'react'

import { Slot, slot, forOne, ofUnknownType } from './slot'

if (typeof window != 'undefined') require('webfontloader').load({
  google: { families: ['Fira Code'] }
})

type Props = {
  Content: ElementType
  children: ReactNode
}

const Shell = ({ children, Content }: Props) => {
  const main = ofUnknownType(Object.values(Element), Children.toArray(children))
  
  return <Theme>
    <Layout>
      <Sidebar>
        {slots.AsideHeader.match(children)}
        {slots.Aside.match(children)}
        {slots.AsideFooter.match(children)}
      </Sidebar>
      <Body>
        {slots.Header.match(children)}
        <Main>
          <MDXProvider>
            { main }
            <Content />
          </MDXProvider>
        </Main>
      </Body>
    </Layout>
  </Theme>
}


const Layout = styled.div`
  --header-height: 7rem;
  --aside-width: 15rem;
  --main-width: 40rem;

  width: calc(var(--main-width) + calc(2 * var(--aside-width)));
  font-family: 'Fira Code';
  margin: auto;
  display: flex;
`

const Main = styled(Styled).attrs({ as: 'main' })`
  width: var(--main-width);
  text-align: justify;
`

const Sidebar = styled.aside`
  width: var(--aside-width);
  min-height: 100vh;
  text-align: right;
`

const Body = styled.div`
  min-height: 100vh;
  flex: 1;
`

module Element {
  // astroturf will fail to static analyse if Element is an object
  
  export const Header = styled.header`
    height: var(--header-height);
  `

  export const Aside = styled.nav`
    grid-area: main-start / 1 / -1 / auto;
  `
  
  export const AsideHeader = styled.header`
    height: var(--header-height);
    width: var(--aside-width);
  `

  export const AsideFooter = styled.footer`
    background: blue;
  `
}

const slots: Record<keyof typeof Element, Slot> = Object
  .entries(Element)
  .reduce(
    (map, [name, component]) => {
      map[name] = slot(forOne(component))
      return map
    }, {} as any
  )

export default Object.assign(Shell, slots)
