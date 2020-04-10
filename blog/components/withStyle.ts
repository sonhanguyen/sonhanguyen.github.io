/**
 * This util is needed because astroturf has limited dynamic style,
 * and styled-jsx doesn't have a HOC api
 */

import React from 'react'

export default <T extends React.ElementType = 'div'>({
  component, className, createElement: h = React.createElement
}: {
  createElement?: typeof import('react')['createElement']
  className: string
  component?: T
}) => (style, ...args: string[]) => Object.assign(
  ({ children, className: classes = '', ...props }: React.ComponentProps<T>) =>
    h(component || 'div', {
      ...props,
      className: `${classes} ${className}`,
      children: React.Children.toArray(children).concat(
        h('style', {
          children: String.raw(style, ...args).replace(':root', '.' + className)
        })
      )
    })
  , { className }
)
