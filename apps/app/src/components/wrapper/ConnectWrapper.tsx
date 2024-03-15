import { Button } from '@mui/material';
import useAuth from '@/hooks/useAuth';

export interface ConnectWrapperProps {
  variant?: 'contained' | 'outlined';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;
  fullWidth?: boolean;
  children: React.ReactElement;
  buttonText?: string;
}

const ConnectWrapper = (props: ConnectWrapperProps) => {
  const { children, buttonText, ...otherProps } = props;
  const { isConnected, isLoggedIn, handleConnectWallet } = useAuth();

  return isLoggedIn ? (
    children
  ) : (
    <Button variant="contained" {...otherProps} onClick={handleConnectWallet}>
      {isConnected ? buttonText?.replace('Connect Wallet', 'Sign In') || 'Sign In' : buttonText || 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWrapper;
