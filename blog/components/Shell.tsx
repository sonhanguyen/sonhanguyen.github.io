import * as React from 'react'
import SplitPane from 'components/SplitPane'
import { MDXProvider } from '@mdx-js/react'
import { Theme, atom } from 'components'
import styled from 'astroturf/react'

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
    <Body>
      {slots.Header.match(children)}
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
        <Main>
          <Title>{slots.Title.match(children)}</Title>
          <MDXProvider>
            { main }
            { Content && <Content /> }
          </MDXProvider>
        </Main>
      </SplitPane>
    </Body>
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
  styled.main`
    composes: ${atom};

    text-align: justify;
    position: relative;

    &.wide {
      max-width: calc(100vw - var(--aside-width));
    }
    
    &.phone {
      max-width: 100vw;
    }

    & img {
      max-width: var(--main-width);
    }
  `
)

const Sidebar = styled.aside`
  flex-direction: column;
  position: relative;
  text-align: right;
  display: flex;
  width: var(--aside-width);
  height: 100%;
`

const Body = styled.div`
  min-height: 100vh;
  flex-direction: column;
  display: flex;
  flex: 1;
`

const Title = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
`

const Header = styled(
  ({
    background = require('./header.jpg'),
    children,
    ...props
  }: JSX.IntrinsicElements['header'] & { background }) => {
    if (typeof background == 'string') background = { src: background }
    if (background.src) background = <img { ...background } />
    
    return <header { ...props }>
      {background}
    </header>
  })`
  position: sticky;
  top: 0;
  max-width: 100%;
  display: flex;
  align-content: flex-end;

  & img {
    width: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }
`

const Aside = styled.nav`
  display: flex;
  flex: 1;
`

const AsideHeader = styled.header`
  position: absolute;
  top: calc(-1 * var(--header-height));
  height: var(--header-height);
  width: var(--aside-width);
  display: flex;
  align-content: flex-end;
`

const AsideFooter = styled.footer`
  align-self: flex-end;
`

const Layout = styled.div`
  --header-height: 7rem;
  --aside-width: 15rem;
  --main-width: 40rem;

  max-width: 100vw;
  font-family: 'Fira Code';
  display: flex;
  margin: auto;
  width: var(--main-width);
  flex: 1;
` 

const Elements = { Title, Aside, Header, AsideHeader, AsideFooter }

const slots: Record<keyof typeof Elements, Slot> = Object
  .entries(Elements)
  .reduce(
    (map, [name, component]) => {
      map[name] = slot(forOne(component))
      return map
    }, {} as any
  )

export default Object.assign(Shell, slots)
