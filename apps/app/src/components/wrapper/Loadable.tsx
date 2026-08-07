import { Suspense, LazyExoticComponent } from 'react'

// material-ui
import { LinearProgressProps } from '@mui/material/LinearProgress'
import LinearProgress from '@mui/material/LinearProgress'

// styles
import styles from './Loadable.module.css'

// ==============================|| LOADER ||============================== //

const Loader = () => (
  <div className={styles.loaderWrapper}>
    <LinearProgress color="primary" />
  </div>
)

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

interface LoaderProps extends LinearProgressProps {}

const Loadable = (Component: LazyExoticComponent<() => React.ReactNode>) => {
  const LoadableComponent = (props: LoaderProps) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  )

  LoadableComponent.displayName = `Loadable(${Component.name || 'Component'})`

  return LoadableComponent
}

export default Loadable
