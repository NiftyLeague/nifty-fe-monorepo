import { Button, Typography, Container } from '@mui/material';
import useAuth from '@/hooks/useAuth';

const ProfileVerification = (): React.ReactNode => {
  const { isConnected, handleConnectWallet } = useAuth();

  return (
    <Container style={{ textAlign: 'center', padding: '40px' }}>
      <Typography mb={2}>{isConnected ? 'Please sign message to log in' : 'Please connect your wallet'}</Typography>
      <Button variant="contained" onClick={handleConnectWallet}>
        {isConnected ? 'Log In' : 'Connect Wallet'}
      </Button>
    </Container>
  );
};

export default function withVerification(Component: (props: any) => React.ReactNode) {
  const WrappedComponent = (props: any): React.ReactNode | null => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Component {...props} /> : <ProfileVerification />;
  };

  WrappedComponent.displayName = `withVerification(${Component.name || 'Component'})`;

  return WrappedComponent;
}
