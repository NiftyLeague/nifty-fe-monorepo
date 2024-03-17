import { Suspense, LazyExoticComponent } from 'react';

// material-ui
import { LinearProgressProps } from '@mui/material/LinearProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@nl/theme';

// styles
const LoaderWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1301,
  width: '100%',
});

// ==============================|| LOADER ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

interface LoaderProps extends LinearProgressProps {}

const Loadable = (Component: LazyExoticComponent<() => JSX.Element>) => {
  const LoadableComponent = (props: LoaderProps) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

  LoadableComponent.displayName = `Loadable(${Component.name || 'Component'})`;

  return LoadableComponent;
};

export default Loadable;
