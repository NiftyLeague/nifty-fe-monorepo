import { createEffect, createSignal, splitProps, type ComponentProps, type JSX } from 'solid-js'
import { cn } from '@nl/ui/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@nl/ui/base/card'
import NativeImage from '@nl/ui/custom/native-image'

import { LoginForm, type LoginFormProps } from './forms/login'
import { ForgotPasswordForm, type ForgotPasswordFormProps } from './forms/forgot-password'
import { UpdatePasswordForm, type UpdatePasswordFormProps } from './forms/update-password'
import { FORM_DESC, FORM_TITLE, VIEWS } from './constants'

export { VIEWS } from './constants'
export type ViewType = (typeof VIEWS)[keyof typeof VIEWS]

interface AuthContainerProps extends ComponentProps<'div'> {
  view: ViewType
  message?: string
  error?: string
  className?: string
}

function AuthContainer(props: AuthContainerProps) {
  const [local, others] = splitProps(props, [
    'class',
    'className',
    'children',
    'view',
    'message',
    'error',
  ])
  return (
    <div
      class={cn('flex flex-col gap-6 w-full h-screen', local.class, local.className)}
      {...others}
    >
      <div class="flex flex-1 justify-center items-center">
        <Card class="relative w-full max-w-150 overflow-hidden">
          <CardHeader class="flex flex-col items-center text-center">
            <NativeImage
              src="/img/logos/NL/white.webp"
              alt="Company Logo"
              width={40}
              height={40}
              loading="eager"
              class="absolute inset-6 h-10 w-10"
            />
            <CardTitle class="text-2xl font-bold uppercase">{FORM_TITLE[local.view]}</CardTitle>
            <CardDescription>{FORM_DESC[local.view]}</CardDescription>
          </CardHeader>
          <CardContent>
            {local.children}
            {local.message && <div class="text-success text-center pt-6">{local.message}</div>}
            {local.error && <div class="text-error text-center pt-6">{local.error}</div>}
          </CardContent>
        </Card>
      </div>
      <div class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 my-8">
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
  )
}

export interface AuthFormProps
  extends
    AuthContainerProps,
    Omit<LoginFormProps & ForgotPasswordFormProps & UpdatePasswordFormProps, 'setAuthView'> {}

export function AuthForm(props: AuthFormProps) {
  const [authView, setAuthView] = createSignal<ViewType>(props.view ?? 'login')

  // handle view override
  createEffect(() => {
    setAuthView(props.view ?? 'login')
  })

  const renderForm = (): JSX.Element => {
    switch (authView()) {
      case VIEWS.LOGIN:
      case VIEWS.SIGN_UP:
        return (
          <LoginForm
            enableAccountCreation={props.enableAccountCreation ?? false}
            enableProviderSignOn={props.enableProviderSignOn ?? false}
            enableSocialColors={props.enableSocialColors ?? false}
            handleLogin={props.handleLogin}
            handleProviderLogin={props.handleProviderLogin}
            handleSignup={props.handleSignup}
            setAuthView={setAuthView}
            view={authView() as typeof VIEWS.LOGIN | typeof VIEWS.SIGN_UP}
          />
        )
      case VIEWS.FORGOT_PASSWORD:
        return (
          <ForgotPasswordForm
            handleResetPassword={props.handleResetPassword}
            setAuthView={setAuthView}
          />
        )
      case VIEWS.UPDATE_PASSWORD:
        return <UpdatePasswordForm handleUpdatePassword={props.handleUpdatePassword} />
      default:
        return null
    }
  }

  const [local, others] = splitProps(props, [
    'enableAccountCreation',
    'enableProviderSignOn',
    'enableSocialColors',
    'handleLogin',
    'handleProviderLogin',
    'handleResetPassword',
    'handleSignup',
    'handleUpdatePassword',
    'view',
  ])
  void local

  return (
    <AuthContainer view={authView()} {...others}>
      {renderForm()}
    </AuthContainer>
  )
}

export default AuthForm
