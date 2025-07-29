'use client';

import { useEffect, useState } from 'react';
import { cn } from '@nl/ui/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@nl/ui/base/card';

import { LoginForm, type LoginFormProps } from './Forms/Login';
import { ForgotPasswordForm, type ForgotPasswordFormProps } from './Forms/ForgotPassword';
import { UpdatePasswordForm, type UpdatePasswordFormProps } from './Forms/UpdatePassword';
import { FORM_DESC, FORM_TITLE, VIEWS } from './constants';

export { VIEWS } from './constants';
export type ViewType = (typeof VIEWS)[keyof typeof VIEWS];

interface AuthContainerProps extends React.ComponentProps<'div'> {
  view: ViewType;
  message?: string;
  error?: string;
}

function AuthContainer({ className, children: form, view, message, error, ...props }: AuthContainerProps) {
  return (
    <div className={cn('flex flex-col gap-6 w-full h-screen', className)} {...props}>
      <div className="flex flex-1 justify-center items-center">
        <Card className="relative w-full max-w-[600px] overflow-hidden">
          <CardHeader className="flex flex-col items-center text-center">
            <img src="/img/logos/NL/white.webp" alt="Company Logo" className="absolute inset-6 h-10 w-10" />
            <CardTitle className="text-2xl font-bold uppercase">{FORM_TITLE[view]}</CardTitle>
            <CardDescription>{FORM_DESC[view]}</CardDescription>
          </CardHeader>
          <CardContent>
            {form}
            {message && <div className="text-success text-center pt-6">{message}</div>}
            {error && <div className="text-error text-center pt-6">{error}</div>}
          </CardContent>
        </Card>
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 my-8">
        By continuing, you agree to our{' '}
        <a href="https://niftyleague.com/terms-of-service" target="_blank" rel="noreferrer">
          Terms of Service
        </a>
        {' and '}
        <a href="https://niftyleague.com/privacy-policy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

export interface AuthFormProps
  extends AuthContainerProps,
    Omit<LoginFormProps & ForgotPasswordFormProps & UpdatePasswordFormProps, 'setAuthView'> {}

export function AuthForm({
  enableAccountCreation = false,
  enableProviderSignOn = false,
  enableSocialColors = false,
  handleLogin,
  handleProviderLogin,
  handleResetPassword,
  handleSignup,
  handleUpdatePassword,
  view = 'login',
  ...props
}: AuthFormProps) {
  const [authView, setAuthView] = useState<ViewType>(view);

  useEffect(() => {
    // handle view override
    setAuthView(view);
  }, [view]);

  const Container = ({ children: form }: React.PropsWithChildren) => (
    <AuthContainer view={authView} {...props}>
      {form}
    </AuthContainer>
  );

  switch (authView) {
    case VIEWS.LOGIN:
    case VIEWS.SIGN_UP:
      return (
        <Container>
          <LoginForm
            enableAccountCreation={enableAccountCreation}
            enableProviderSignOn={enableProviderSignOn}
            enableSocialColors={enableSocialColors}
            handleLogin={handleLogin}
            handleProviderLogin={handleProviderLogin}
            handleSignup={handleSignup}
            setAuthView={setAuthView}
            view={authView}
          />
        </Container>
      );
    case VIEWS.FORGOT_PASSWORD:
      return (
        <Container>
          <ForgotPasswordForm handleResetPassword={handleResetPassword} setAuthView={setAuthView} />
        </Container>
      );
    case VIEWS.UPDATE_PASSWORD:
      return (
        <Container>
          <UpdatePasswordForm handleUpdatePassword={handleUpdatePassword} />
        </Container>
      );
  }
}

export default AuthForm;
