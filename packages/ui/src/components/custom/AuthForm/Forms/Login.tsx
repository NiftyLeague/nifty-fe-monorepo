'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { cn } from '@nl/ui/utils';
import { Button } from '@nl/ui/base/button';
import { Checkbox } from '@nl/ui/base/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@nl/ui/base/form';
import { IconInput } from '@nl/ui/base/icon-input';
import { Icon } from '@nl/ui/base/icon';

import { SocialAuth, type SocialAuthProps } from '../SocialAuth';
import { VIEWS } from '../constants';

type ViewType = (typeof VIEWS)[keyof typeof VIEWS];

export interface LoginFormProps extends SocialAuthProps {
  enableAccountCreation?: boolean;
  enableProviderSignOn?: boolean;
  setAuthView: React.Dispatch<React.SetStateAction<ViewType>>;
  handleLogin: (values: { email: string; password: string; remember_me: boolean }) => Promise<void>;
  handleSignup: (values: { email: string; password: string; remember_me: boolean }) => Promise<void>;
  view: ViewType;
}

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(32, 'Password must be a maximum of 32 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export function LoginForm({
  enableAccountCreation = false,
  enableProviderSignOn = false,
  enableSocialColors = false,
  handleLogin,
  handleProviderLogin,
  handleSignup,
  setAuthView,
  view,
}: LoginFormProps) {
  const formSchema = z.object({
    email: z.email(),
    password: view === VIEWS.LOGIN ? z.string().min(1) : passwordSchema,
    remember_me: z.boolean(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '', remember_me: true },
  });
  const disabled = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (view === VIEWS.LOGIN) await handleLogin(values);
    else if (view === VIEWS.SIGN_UP) await handleSignup(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <IconInput
                  {...field}
                  type="email"
                  autoComplete="on"
                  disabled={disabled}
                  startIcon={<Icon name="mail" />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <IconInput
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  disabled={disabled}
                  startIcon={<Icon name="key-round" />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember_me"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    checked={form.getValues('remember_me')}
                    onCheckedChange={checked => field.onChange(checked)}
                    disabled={disabled}
                  />
                </FormControl>
                <FormLabel>Remember Me</FormLabel>
                {view === VIEWS.LOGIN && (
                  <a
                    onClick={() => !disabled && setAuthView(VIEWS.FORGOT_PASSWORD)}
                    className={cn(
                      'ml-auto mt-0.5 text-sm underline-offset-4',
                      !disabled && 'hover:underline cursor-pointer',
                    )}
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={disabled}>
          {disabled ? (
            <Icon name="loader" className="animate-spin" />
          ) : (
            <>
              <Icon name="lock" />
              {view === VIEWS.LOGIN ? 'Login' : 'Sign Up'}
            </>
          )}
        </Button>
        {enableProviderSignOn && (
          <SocialAuth
            disabled={disabled}
            enableSocialColors={enableSocialColors}
            handleProviderLogin={handleProviderLogin}
          />
        )}
        {enableAccountCreation && (
          <div className="text-center text-sm">
            {view === VIEWS.LOGIN ? "Don't have an account? " : 'Already have an account? '}
            <a
              onClick={() => !disabled && setAuthView(view === VIEWS.LOGIN ? VIEWS.SIGN_UP : VIEWS.LOGIN)}
              className={cn('underline underline-offset-4', !disabled && 'cursor-pointer')}
            >
              {view === VIEWS.LOGIN ? 'Sign up' : 'Login'}
            </a>
          </div>
        )}
      </form>
    </Form>
  );
}
