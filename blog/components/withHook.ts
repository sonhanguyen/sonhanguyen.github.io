import * as React from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

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
  const { phone, tablet } = require('./_breakpoints.module.scss')

  const phoneQuery = `(max-width: ${phone})`
  const desktopQuery = `(min-width: ${tablet})`

  type Flag = 'phone' | 'desktop'

  const [is, setFlags] = React.useState<void | Record<Flag, boolean>>()

  const setFlag = (flag: Flag) => (evt = { matches: true }) => {
    setFlags({
      phone: false,
      desktop: false,
      [flag]: evt.matches,
    })
  }

  useIsomorphicLayoutEffect(() => {
    const setIsPhone = setFlag('phone')
    const setIsDesktop = setFlag('desktop')

    const mobile = window.matchMedia(phoneQuery)
    mobile.addEventListener('change', setIsPhone)

    const desktop = window.matchMedia(desktopQuery)
    desktop.addEventListener('change', setIsDesktop)

    if (mobile.matches) setIsPhone()
    else setIsDesktop(desktop)

    return () => {
      desktop.removeEventListener('change', setIsDesktop)
      mobile.removeEventListener('change', setIsPhone)
    }
  }, [])

  return is ? {
    ...is,
    tablet: !(is.desktop || is.phone),
    wide: !is.phone,
  } : { deviceUnknown: true }
}

export const withMediaClass = withHook(useMediaClass)
