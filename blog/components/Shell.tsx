import * as React from 'react'
import SplitPane from 'components/SplitPane'
import { MDXProvider } from '@mdx-js/react'
import { Theme, Styled } from 'components'
import styled from 'astroturf'

import { Slot, slot, forOne, ofUnknownType } from './slot'
import { withMediaClass } from 'components/withHook'

if (typeof window != 'undefined') require('webfontloader').load({
  google: { families: ['Fira Code'] }
})

type Props = React.ComponentProps<typeof Theme> & {
  Content?: React.ElementType
}

const Shell = ({ children, Content, ...props }: Props) => {
  const main = ofUnknownType(
    Object.values(Elements),
    React.Children.toArray(children)
  )
  
  return <Theme { ...props }>
    <SplitPane
      Layout={Layout}
      Switch={Hambuger}
      master={
        <Sidebar>
          {slots.AsideHeader.match(children)}
          {slots.Aside.match(children)}
          {slots.AsideFooter.match(children)}
        </Sidebar>
      }
    >
      <Body>
        {slots.Header.match(children)}
        <Main>
          <MDXProvider>
            { main }
            { Content && <Content /> }
          </MDXProvider>
        </Main>
      </Body>
    </SplitPane>
  </Theme>
}

const Hambuger = styled.div<{ on?: boolean }>`
  position: relative;
  font-size: 3rem;
  height: 3rem;
  width: 3rem;
  
  &:after {
    position: absolute;
    content: '☰';
  }

  &.on:after {
    content: '←';
  }
`

const Main = withMediaClass(
  styled(Styled).attrs({ as: 'main' })`
    width: var(--main-width);
    text-align: justify;
    flex: 1;
    
    &.wide {
      max-width: calc(100vw - var(--aside-width));
    }
    
    &.phone {
      max-width: 100vw;  
    }
  `
)

const Sidebar = styled.aside`
  width: var(--aside-width);
  min-height: 100vh;
  flex-direction: column;
  display: flex;
  text-align: right;
`

const Body = styled.div`
  min-height: 100vh;
  flex-direction: column;
  display: flex;
  flex: 1;

  & img {
    max-width: calc(var(--main-width) + var(--aside-width));
  }
`

const Title = styled.div`
  position: absolute;
  bottom: 0;
`

const Header = styled(
  ({
    background = require('./header.jpg'),
    children,
    ...props
  }: JSX.IntrinsicElements['header'] & { background }) => {
    if (typeof background == 'string') background = { src: background }
    if (background.src) background = <img { ...background } /> 

    let title: any = React.Children.toArray(children)
    if (title.every(child => typeof child != 'object')) {
      title = title.join()
    } 
    
    return <header { ...props }>
      {background}
      <Title>{ title }</Title>
    </header>
  })`
  position: relative;
  margin-left: calc(-1 * var(--aside-width));
  max-width: 100%;

  & img {
    object-fit: none;
    object-position: 50% 50%;
  }
`

const Aside = styled.nav`
  display: flex;
  flex: 1;
`

const AsideHeader = styled.header`
  height: var(--header-height);
  width: var(--aside-width);
`

const AsideFooter = styled.footer`
  background: blue;
`

const Layout = styled.div`
  --header-height: 7rem;
  --aside-width: 15rem;
  --main-width: 40rem;
  
  $width: calc(var(--main-width) + var(--aside-width));
  
  max-width: 100vw;
  font-family: 'Fira Code';
  display: flex;
  margin: auto;
  width: $width;
`

const Elements = { Aside, Header, AsideHeader, AsideFooter }

const slots: Record<keyof typeof Elements, Slot> = Object
  .entries(Elements)
  .reduce(
    (map, [name, component]) => {
      map[name] = slot(forOne(component))
      return map
    }, {} as any
  )

export default Object.assign(Shell, slots)
