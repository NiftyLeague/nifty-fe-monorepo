import { Suspense, LazyExoticComponent } from 'react'

// styles
import styles from './Loadable.module.css'
import { Progress } from '@nl/ui/base/progress'

// ==============================|| LOADER ||============================== //

const Loader = () => (
  <div className={styles.loaderWrapper}>
    <Progress value={100} className="animate-pulse" />
  </div>
)

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

interface LoaderProps extends React.ComponentProps<'div'> {}

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
