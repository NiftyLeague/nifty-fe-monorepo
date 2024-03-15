import { Component, ErrorInfo } from 'react';
import { isMobileOnly } from 'react-device-detect';

type MyProps = {
  children: React.ReactNode;
};

type State = {
  error?: Error;
  errorInfo?: ErrorInfo;
};

class ErrorBoundary extends Component<MyProps, State> {
  constructor(props: MyProps) {
    super(props);
    const state: State = {
      error: undefined,
      errorInfo: undefined,
    };
    this.state = state;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({ error, errorInfo });
    console.error(error.toString(), errorInfo.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div style={{ padding: 60 }}>
          <h3>Something went wrong.</h3>
          {isMobileOnly ? <h5>If the error persists, we recommend trying on a desktop.</h5> : null}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
