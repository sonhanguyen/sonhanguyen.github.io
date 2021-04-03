import * as React from 'react'
import styled from 'astroturf/react'
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
  ...props
}) => {
  const [ { afloat }, dispatch ] = React.useState<State>({})

  const toggleAfloat = () => dispatch(toggle('afloat'))

  return <Layout { ...props }>
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

const Master = withMediaClass(
  styled(motion.aside)<{ afloat?: boolean }>`
    position: absolute;
    top: 0;
    bottom: 0;
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
  position: fixed;
  left: 100%;

  &.on {
    left: unset;
    right: 0;
  }
`

export default withMediaClass(
  styled(SplitPane)`
    position: relative;
    display: flex;  
  `
)
