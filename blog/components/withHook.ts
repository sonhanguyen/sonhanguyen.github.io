import * as React from 'react'
import { useMedia } from 'react-use'

export type Props<T> = T extends (_: infer P, ...rest: any[]) => any ? P : {}

type HocFactory = <Options extends {}, ToInject extends {}>(
  hook: (_: Options) => ToInject,
  compare?: <P extends {}>(props: P, nextProps: P) => boolean
) => <P>(_: React.ComponentType<P>) => React.ComponentType<
  & Props<typeof compare>
  & Options // of the hook
  & Partial<ToInject> // make injected props optional
  & Omit<P, (keyof P) & (keyof ToInject)>
>

const withHook: HocFactory = (
  hook, propsAreEqual,
  { memo, createElement: h }: Pick<typeof React, 'memo' | 'createElement'> = React
) => component => {
  const { name = component.displayName } = component
  const displayName = hook.name || withHook.name

  const memoized = memo(component, propsAreEqual)

  return Object.assign(
      props => h(memoized, {
      ...hook(props),
      ...props
    } as any),
    { displayName: `${displayName}(${name})` }
  )
}

export default withHook

export const useMediaClass = () => {
  const { phone, tablet } = require('components/breakpoints.module.scss')

  const types = {
    desktop: useMedia(`(min-width: ${tablet})`, false),
    tablet: useMedia(`(min-width: ${phone})`, false),
    phone: true
  }

  const [ device ] = Object
    .entries(types)
    .find((entry): entry is [ keyof typeof types, any ] => !!entry.pop())

  return {
    ...{ [device]: true } as Record<typeof device, boolean>,
    wide: device != 'phone'
  }
}

export const withMediaClass = withHook(useMediaClass)
