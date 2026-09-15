import { createSignal } from 'solid-js'
import { createForm, setValue } from '@modular-forms/solid'

import { zodForm } from './zod-form'
import { z } from 'zod'
import { KeyRound, Loader, Lock, Mail } from 'lucide-solid'

import { cn } from '@nl/ui/utils'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@nl/ui/base/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
} from '@nl/ui/base/input-group'

import { SocialAuth, type SocialAuthProps } from '../social-auth'
import { VIEWS } from '../constants'

type ViewType = (typeof VIEWS)[keyof typeof VIEWS]

export interface LoginFormProps extends SocialAuthProps {
  enableAccountCreation?: boolean
  enableProviderSignOn?: boolean
  setAuthView: (view: ViewType) => void
  handleLogin: (values: { email: string; password: string; remember_me: boolean }) => Promise<void>
  handleSignup: (values: { email: string; password: string; remember_me: boolean }) => Promise<void>
  view: ViewType
}

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(32, 'Password must be a maximum of 32 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  remember_me: z.boolean(),
})

const signupSchema = z.object({
  email: z.email(),
  password: passwordSchema,
  remember_me: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm(props: LoginFormProps) {
  const isLogin = () => props.view === VIEWS.LOGIN
  // The schema is resolved at validation time so switching between the login
  // and sign-up views tightens password rules without recreating the form.
  const [form] = createForm<LoginFormValues>({
    validate: (values) => zodForm(isLogin() ? loginSchema : signupSchema)(values),
    initialValues: { email: '', password: '', remember_me: true },
  })
  const disabled = () => form.submitting
  const [showPassword, setShowPassword] = createSignal(false)

  const onSubmit = async (values: LoginFormValues) => {
    if (isLogin()) await props.handleLogin(values)
    else if (props.view === VIEWS.SIGN_UP) await props.handleSignup(values)
  }

  // `method="post"` keeps a pre-hydration native submit (Enter before Solid attaches)
  // from falling back to GET, which would put typed fields into the URL.
  return (
    <Form of={form} onSubmit={onSubmit} method="post" class="grid gap-4">
      <FormField
        of={form}
        name="email"
        render={({ field, props: fieldProps }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <Mail absoluteStrokeWidth size={20} strokeWidth={1.5} aria-hidden="true" />
                </InputGroupText>
              </InputGroupAddon>
              <FormControl>
                <InputGroupInput
                  {...fieldProps}
                  type="email"
                  value={field.value ?? ''}
                  autocomplete={isLogin() ? 'on' : 'off'}
                  disabled={disabled()}
                />
              </FormControl>
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        of={form}
        name="password"
        render={({ field, props: fieldProps }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <KeyRound absoluteStrokeWidth size={20} strokeWidth={1.5} aria-hidden="true" />
                </InputGroupText>
              </InputGroupAddon>
              <FormControl>
                <InputGroupInput
                  {...fieldProps}
                  type={showPassword() ? 'text' : 'password'}
                  value={field.value ?? ''}
                  autocomplete={isLogin() ? 'current-password' : 'new-password'}
                  disabled={disabled()}
                />
              </FormControl>
              {field.value ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupPasswordToggle
                    visible={showPassword()}
                    onVisibleChange={setShowPassword}
                    disabled={disabled()}
                  />
                </InputGroupAddon>
              ) : null}
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        of={form}
        name="remember_me"
        render={({ field }) => (
          <FormItem>
            <div class="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => setValue(form, 'remember_me', checked)}
                  disabled={disabled()}
                />
              </FormControl>
              <FormLabel>Remember Me</FormLabel>
              {isLogin() && (
                // A button, not an anchor: it switches the form view in
                // place, so it needs `type="button"` to stay out of the
                // submit path and keyboard focusability. The muted
                // foreground matches the adjacent label, which holds AA on
                // the auth backdrop where the accent blue did not.
                <button
                  type="button"
                  onClick={() => !disabled() && props.setAuthView(VIEWS.FORGOT_PASSWORD)}
                  disabled={disabled()}
                  class={cn(
                    'ml-auto mt-0.5 text-sm text-muted-foreground underline underline-offset-4',
                    !disabled() && 'cursor-pointer hover:text-foreground'
                  )}
                >
                  Forgot your password?
                </button>
              )}
            </div>
          </FormItem>
        )}
      />
      <Button type="submit" class="w-full" disabled={disabled()}>
        {disabled() ? (
          <Loader
            absoluteStrokeWidth
            class="animate-spin motion-reduce:animate-none"
            size={20}
            strokeWidth={1.5}
          />
        ) : (
          <>
            <Lock absoluteStrokeWidth size={20} strokeWidth={1.5} />
            {isLogin() ? 'Login' : 'Sign Up'}
          </>
        )}
      </Button>
      {props.enableProviderSignOn && (
        <SocialAuth
          disabled={disabled()}
          enableSocialColors={props.enableSocialColors ?? false}
          handleProviderLogin={props.handleProviderLogin}
        />
      )}
      {props.enableAccountCreation && (
        <div class="text-center text-sm">
          {isLogin() ? "Don't have an account? " : 'Already have an account? '}
          {/* A view switch, not navigation: a type="button" is keyboard focusable. */}
          <button
            type="button"
            onClick={() =>
              !disabled() && props.setAuthView(isLogin() ? VIEWS.SIGN_UP : VIEWS.LOGIN)
            }
            disabled={disabled()}
            class={cn(
              'underline underline-offset-4',
              !disabled() && 'cursor-pointer hover:text-foreground'
            )}
          >
            {isLogin() ? 'Sign up' : 'Login'}
          </button>
        </div>
      )}
    </Form>
  )
}

export default LoginForm
