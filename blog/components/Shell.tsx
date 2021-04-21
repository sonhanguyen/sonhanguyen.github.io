import * as React from 'react'
import SplitPane from '../components/SplitPane'
import { MDXProvider } from '@mdx-js/react'
import { Theme, atom } from '../components'
import styled from 'astroturf/react'
import StickyBox from 'react-sticky-box'
import { Slot, slot, forOne, ofUnknownType } from './slot'
import { withMediaClass } from '../components/withHook'

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
        master={
          <StickyBox offsetTop={0} offsetBottom={0}>
            <Sidebar>
              {slots.AsideHeader.match(children)}
              {slots.Aside.match(children)}
              {slots.AsideFooter.match(children)}
            </Sidebar>
          </StickyBox>
        }
      >
        <Main>
          <Title>{slots.Title.match(children)}</Title>
          <MDXProvider>
            { Content && <Content /> }
            { main }
          </MDXProvider>
        </Main>
      </SplitPane>
    </Body>
  </Theme>
}

const Main = withMediaClass(
  styled.main`
    composes: ${atom};

    max-width: var(--main-width);
    text-align: justify;

    &.phone {
      max-width: 100vw;
    }

    & img {
      max-width: var(--main-width);
    }
  `
)

const Sidebar = withMediaClass(
  styled.aside`
    --aside-max-width: calc(.7 * var(--main-width));
    --aside-preferred-width: calc(.5 * (100vw - var(--main-width)));  

    flex-direction: column;
    position: relative;
    display: flex;
    width: var(--aside-width);
    height: 100%;
    background: var(--middleground);
    align-items: flex-end;

    &.desktop {
      width: var(--aside-preferred-width);
    }
  `
)

const Body = withMediaClass(
  styled.div`
    @import './components/_breakpoints.module.scss';

    --header-height: 7rem;
    --main-width: 36rem;
    --aside-width: calc(.5 * (#{map-get($breakpoints, tablet)} - var(--main-width)));

    min-height: 100vh;
    font-family: 'Fira Code';
    flex-direction: column;
    display: flex;
    flex: 1;

    &.desktop {
      ${SplitPane} {
        margin: auto;
      }
    }
  `
)

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
  }: JSX.IntrinsicElements['header'] & { background? }) => {
    if (typeof background == 'string') background = { src: background }
    if (background.src) background = <img { ...background } />
    
    return <header { ...props }>
      {background}
    </header>
  }
)`
  position: sticky;
  top: 0;
  max-width: 100%;
  display: flex;
  align-content: flex-end;
  box-shadow: 0 0 8px 8px var(--background) inset;

  & img {
    width: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }
`

const Aside = styled.nav`
  display: flex;
  flex: 1;

  width: clamp(
    var(--aside-width),
    var(--aside-preferred-width),
    var(--aside-max-width)
  );
`

const AsideHeader = styled.header`
  position: absolute;
  top: calc(-1 * var(--header-height));
  height: var(--header-height);
  display: flex;
  align-content: flex-end;
`

const AsideFooter = styled.footer`
  align-self: flex-end;
`

const Elements = { Header, Title, Aside, AsideHeader, AsideFooter }

type A = React.ComponentProps<typeof Header>

const slots: {
  [K in keyof typeof Elements]: Slot<React.ComponentPropsWithoutRef<(typeof Elements)[K]>>
} = Object
  .entries(Elements)
  .reduce(
    (map, [name, component]) => {
      map[name] = slot(forOne(component))
      return map
    }, {} as any
  )

export default Object.assign(Shell, slots)
