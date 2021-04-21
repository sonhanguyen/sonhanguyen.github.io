import * as React from 'react'
import styled from 'astroturf/react'
import { button } from '../components'

type Item = Record<'title' | 'path', string>

export type Props = {
  className?: string
  Link?: React.ElementType<JSX.IntrinsicElements['a']>
  items: Item[]
}

const Nav = styled(
  ({
    Link = require('next/link').default,
    items,
    ...props
  }: Props & JSX.IntrinsicElements['ol']) =>
    <ol { ...props }>
      {items.map(({ path, title }) =>
        <Link key={path} href={path}>
          <div><li className={button}>{title}</li></div>
        </Link>
      )}
    </ol>
)`
  list-style-type: none;
`

export default Nav
