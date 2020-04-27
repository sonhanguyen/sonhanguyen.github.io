import * as React from 'react'
import styled, { css } from 'astroturf'
import { motion } from 'framer-motion'
import { withMediaClass } from 'components/withHook'

type State = { afloat?: boolean }
type Update<S> = (_: S) => S

const toggle = <K extends keyof State>(key: K) => (state: State) => ({ ...state, [key]: !state[key] })

const SplitPane: React.FC<React.ComponentProps<'div'> & {
  wide?: boolean
  master: React.ReactNode
  children: React.ReactNode
  Switch: React.ComponentType<{ on?: boolean, onClick: Function }>
  Layout: React.ComponentType<{ className?: string }>
}> = ({
  wide,
  master,
  children: detail,
  Layout,
  Switch,
  className = '',
  ...props
}) => {
  const [ { afloat }, dispatch ] = React.useReducer(
    (state: State, update: Update<State>) => update(state),
    {}
  )

  const toggleAfloat = () => dispatch(toggle('afloat'))

  return <Layout
    { ...props }
    className={`${className} ${StyleSheet.Layout}`}
  >
    <Master afloat={afloat} animate>
      {wide ? null :
        <SwitchContainer on={afloat} animate>
          <Switch on={afloat} onClick={toggleAfloat} />
        </SwitchContainer>
      }
      {master}
    </Master>
    {detail}
  </Layout>
}

const StyleSheet = css`
  .Layout {
    position: relative;
    display: flex;
  }
`

const Master = withMediaClass(
  styled(motion.aside)<{ afloat?: boolean }>`
    position: absolute;
    right: 100%;

    &.wide {
      position: unset;
    }

    &.afloat {
      right: unset;
    }
  `
)

const SwitchContainer = styled(motion.div)<{ on?: boolean }>`
  position: absolute;
  left: 100%;

  &.on {
    left: unset;
    right: 0;
  }
`

export default withMediaClass(SplitPane)
