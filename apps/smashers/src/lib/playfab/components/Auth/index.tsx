import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  Checkbox,
  Button,
  Space,
  Typography,
  Divider,
  IconKey,
  IconMail,
  IconInbox,
  IconLock,
} from '@nl/ui/supabase';
import { useUserSession, useUserContext } from '@/lib/playfab/hooks';
import { fetchJson } from '@/lib/playfab/utils';
import { buttonStyles, SocialIcons, UserContextProvider } from '@/lib/playfab/components';
import { errorMsgHandler } from '@/utils/errorHandlers';
import type { User, Provider } from '@/lib/playfab/types';
import useFlags from '@/hooks/useFlags';
import AuthStyles from '@/styles/auth.module.css';

const VIEWS: ViewsMap = {
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  FORGOTTEN_PASSWORD: 'forgotten_password',
  UPDATE_PASSWORD: 'update_password',
};

interface ViewsMap {
  [key: string]: ViewType;
}

type ViewType = 'sign_in' | 'sign_up' | 'forgotten_password' | 'update_password';

type RedirectTo = undefined | string;

export interface Props {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  socialLayout?: 'horizontal' | 'vertical';
  socialColors?: boolean;
  socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  providers?: Provider[];
  verticalSocialLayout?: any;
  view?: ViewType;
  redirectTo?: RedirectTo;
  onlyThirdPartyProviders?: boolean;
}

type SetAuthView = React.Dispatch<React.SetStateAction<ViewType>>;

function Auth({
  className,
  style,
  socialLayout = 'vertical',
  socialColors = false,
  socialButtonSize = 'medium',
  providers,
  view = 'sign_in',
  redirectTo,
  onlyThirdPartyProviders = false,
}: Props): JSX.Element | null {
  const [authView, setAuthView] = useState(view);
  const [defaultEmail, setDefaultEmail] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('');

  const verticalSocialLayout = socialLayout === 'vertical' ? true : false;
  let containerClasses = [AuthStyles['sbui-auth']];
  if (className) containerClasses.push(className);

  const Container = (props: any) => (
    <div className={containerClasses.join(' ')} style={style}>
      <Space size={8} direction={'vertical'}>
        <SocialAuth
          verticalSocialLayout={verticalSocialLayout}
          providers={providers}
          socialLayout={socialLayout}
          socialButtonSize={socialButtonSize}
          socialColors={socialColors}
          redirectTo={redirectTo}
          onlyThirdPartyProviders={onlyThirdPartyProviders}
        />
        {!onlyThirdPartyProviders && props.children}
      </Space>
    </div>
  );

  useEffect(() => {
    // handle view override
    setAuthView(view);
  }, [view]);

  switch (authView) {
    case VIEWS.SIGN_IN:
    case VIEWS.SIGN_UP:
      return (
        <Container>
          <EmailAuth
            id={authView === VIEWS.SIGN_UP ? 'auth-sign-up' : 'auth-sign-in'}
            authView={authView}
            setAuthView={setAuthView}
            defaultEmail={defaultEmail}
            defaultPassword={defaultPassword}
            setDefaultEmail={setDefaultEmail}
            setDefaultPassword={setDefaultPassword}
            redirectTo={redirectTo}
          />
        </Container>
      );
    case VIEWS.FORGOTTEN_PASSWORD:
      return (
        <Container>
          <ForgottenPassword setAuthView={setAuthView} />
        </Container>
      );

    case VIEWS.UPDATE_PASSWORD:
      return (
        <Container>
          <UpdatePassword />
        </Container>
      );

    default:
      return null;
  }
}

function SocialAuth({
  className,
  style,
  children,
  socialLayout = 'vertical',
  socialColors = false,
  socialButtonSize,
  providers,
  verticalSocialLayout,
  redirectTo,
  onlyThirdPartyProviders,
  ...props
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true);
    // TODO: handle provider login
    // if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <Space size={8} direction="vertical">
      {providers && providers.length > 0 && (
        <React.Fragment>
          <Space size={4} direction="vertical">
            <Typography.Text type="secondary" className={AuthStyles['sbui-auth-label']}>
              Sign in with
            </Typography.Text>
            <Space size={2} direction={socialLayout}>
              {providers.map(provider => {
                // @ts-ignore
                const AuthIcon = SocialIcons[provider];
                return (
                  <div key={provider} style={!verticalSocialLayout ? { flexGrow: 1 } : {}}>
                    <Button
                      block
                      type="default"
                      shadow
                      size={socialButtonSize}
                      style={socialColors ? buttonStyles[provider] : {}}
                      icon={AuthIcon ? <AuthIcon /> : ''}
                      loading={loading}
                      onClick={() => handleProviderSignIn(provider)}
                      className="flex items-center"
                      placeholder="Sign Up"
                    >
                      {verticalSocialLayout && 'Sign up with ' + provider}
                    </Button>
                  </div>
                );
              })}
            </Space>
          </Space>
          {!onlyThirdPartyProviders && <Divider>or continue with</Divider>}
        </React.Fragment>
      )}
    </Space>
  );
}

function EmailAuth({
  authView,
  defaultEmail,
  defaultPassword,
  id,
  setAuthView,
  setDefaultEmail,
  setDefaultPassword,
  redirectTo,
}: {
  authView: ViewType;
  defaultEmail: string;
  defaultPassword: string;
  id: 'auth-sign-up' | 'auth-sign-in';
  setAuthView: SetAuthView;
  setDefaultEmail: (email: string) => void;
  setDefaultPassword: (password: string) => void;
  redirectTo: RedirectTo;
}) {
  const isMounted = useRef<boolean>(true);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState('');
  const { mutateUser } = useUserSession({ redirectTo, redirectIfFound: true });
  const { enableAccountCreation } = useFlags();

  useEffect(() => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);

    return () => {
      isMounted.current = false;
    };
  }, [authView, defaultEmail, defaultPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const body = JSON.stringify({ email, password, rememberMe });
    switch (authView) {
      case 'sign_in':
        try {
          const res = await fetchJson<User>('/api/playfab/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
          mutateUser(res);
        } catch (error) {
          const msg = errorMsgHandler(error);
          setError(msg);
          setLoading(false);
        }
        break;
      case 'sign_up':
        try {
          const res = await fetchJson<User>('/api/playfab/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
          mutateUser(res);
        } catch (error) {
          const msg = errorMsgHandler(error);
          setError(msg);
          setLoading(false);
        }
        break;
    }

    /*
     * it is possible the auth component may have been unmounted at this point
     * check if component is mounted before setting a useState
     */
    if (isMounted.current) setLoading(false);
  };

  const handleViewChange = (newView: ViewType) => {
    setDefaultEmail(email);
    setDefaultPassword(password);
    setAuthView(newView);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Space size={6} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="Email address"
            autoComplete="email"
            defaultValue={email}
            icon={<IconMail size={21} stroke={'#666666'} />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            defaultValue={password}
            autoComplete="current-password"
            icon={<IconKey size={21} stroke={'#666666'} />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Space>
        <Space direction="vertical" size={6}>
          <Space style={{ justifyContent: 'space-between' }}>
            <Checkbox
              label="Remember me"
              name="remember_me"
              id="remember_me"
              size="medium"
              checked={rememberMe}
              onChange={(value: React.ChangeEvent<HTMLInputElement>) => setRememberMe(value.target.checked)}
            />
            {authView === VIEWS.SIGN_IN && (
              <Typography.Link
                href="#auth-forgot-password"
                style={{ marginBottom: 5 }}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setAuthView(VIEWS.FORGOTTEN_PASSWORD as ViewType);
                }}
              >
                Forgot your password?
              </Typography.Link>
            )}
          </Space>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            icon={<IconLock size={21} />}
            loading={loading}
            block
            placeholder="Sign Up"
          >
            {authView === VIEWS.SIGN_IN ? 'Sign in' : 'Sign up'}
          </Button>
        </Space>
        <Space direction="vertical" style={{ textAlign: 'center' }}>
          {enableAccountCreation && (
            <>
              {authView === VIEWS.SIGN_IN ? (
                <Typography.Link
                  href="#auth-sign-up"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handleViewChange(VIEWS.SIGN_UP as ViewType);
                  }}
                >
                  Don&apos;t have an account? Sign up
                </Typography.Link>
              ) : (
                <Typography.Link
                  href="#auth-sign-in"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handleViewChange(VIEWS.SIGN_IN as ViewType);
                  }}
                >
                  Do you have an account? Sign in
                </Typography.Link>
              )}
            </>
          )}
          {/* {message && <Typography.Text>{message}</Typography.Text>} */}
          {error && <Typography.Text type="danger">{error}</Typography.Text>}
        </Space>
      </Space>
    </form>
  );
}

function ForgottenPassword({ setAuthView }: { setAuthView: SetAuthView }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await fetchJson<User>('/api/playfab/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setMessage('Check your email for the password reset link');
    } catch (error) {
      const msg = errorMsgHandler(error);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="auth-forgot-password" onSubmit={handlePasswordReset}>
      <Space size={4} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="Email address"
            placeholder="Your email address"
            icon={<IconMail size={21} stroke={'#666666'} />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<IconInbox size={21} />}
            loading={loading}
            placeholder="Send reset password instructions"
          >
            Send reset password instructions
          </Button>
        </Space>
        <Typography.Link
          href="#auth-sign-in"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setAuthView(VIEWS.SIGN_IN as ViewType);
          }}
        >
          Go back to sign in
        </Typography.Link>
        {message && <Typography.Text>{message}</Typography.Text>}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Space>
    </form>
  );
}

function UpdatePassword() {
  const { account } = useUserContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const Username = account?.Username;
    const Email = account?.PrivateInfo?.Email;
    if (Email && Username) {
      // TODO: there is no public API for password updates
      // const request = { Email, Username, Password: password };
      // PlayFabClient.AddUsernamePassword(
      //   request,
      //   function (error, result) {
      //     if (error) {
      //       setError(error.errorMessage);
      //     } else {
      //       setMessage('Your password has been updated');
      //     }
      //   }
      // );
    }
    setLoading(false);
  };

  return (
    <form id="auth-update-password" onSubmit={handlePasswordReset}>
      <Space size={4} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="New password"
            placeholder="Enter your new password"
            type="password"
            icon={<IconKey size={21} stroke={'#666666'} />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<IconKey size={21} />}
            loading={loading}
            placeholder="Update password"
          >
            Update password
          </Button>
        </Space>
        {message && <Typography.Text>{message}</Typography.Text>}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Space>
    </form>
  );
}

Auth.ForgottenPassword = ForgottenPassword;
Auth.UpdatePassword = UpdatePassword;
Auth.UserContextProvider = UserContextProvider;
Auth.useUserContext = useUserContext;
Auth.useUserSession = useUserSession;

export default Auth;
