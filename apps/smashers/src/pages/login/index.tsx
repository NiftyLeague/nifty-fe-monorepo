import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Card, Typography, Space } from '@nl/ui/supabase';
import { PlayFabAuthForm } from '@nl/playfab/components';

import { withSessionSsr } from '@/utils/session';
import BackButton from '@/components/BackButton';

import useFlags from '@/hooks/useFlags';

const Login = () => {
  const { enableAccountCreation, enableProviderSignOn } = useFlags();
  const mobile = useMediaQuery('(max-width:576px)');
  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'flex',
          maxWidth: '450px',
          height: '100%',
          margin: 'auto',
          overflowY: 'auto',
        }}
      >
        <Card style={{ margin: 'auto' }}>
          <Space direction="vertical" size={8}>
            <div>
              <Image
                src="/img/logos/NL/white.webp"
                alt="Company Logo"
                width={50}
                height={50}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <Typography.Title
                level={3}
                style={{
                  marginTop: mobile ? 70 : 16,
                  fontSize: mobile ? '1.15rem' : '1.35rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Welcome to Nifty League
              </Typography.Title>
            </div>
            <PlayFabAuthForm
              enableAccountCreation={enableAccountCreation}
              enableProviderSignOn={enableProviderSignOn}
              redirectTo="/profile"
              socialButtonSize="xlarge"
              socialLayout="horizontal"
              view="sign_in"
            />
          </Space>
        </Card>
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  // clear session and don't redirect
  if (req.url?.includes('game-token')) {
    req.session.destroy();
    return { props: {} };
  }
  const user = req.session.user;
  // redirect to profile if already logged in
  if (user && user.isLoggedIn) {
    return {
      props: {},
      redirect: { destination: '/profile', permanent: false },
    };
  }
  return { props: {} };
});

export default Login;
