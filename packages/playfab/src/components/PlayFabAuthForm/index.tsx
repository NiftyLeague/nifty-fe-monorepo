'use client';

import React, { useState } from 'react';
import { AuthForm, type AuthFormProps } from '@nl/ui/custom/AuthForm';

import fetchJson from '../../utils/fetchJson';
import { errorMsgHandler } from '../../utils/errorHandlers';
import useUserSession from '../../hooks/useUserSession';
import useUserContext from '../../hooks/useUserContext';
import UserContextProvider from '../UserContextProvider';
import type { Provider, User, UserContextType, UseUserSessionFunction } from '../../types';

export interface PlayFabAuthFormProps
  extends Omit<
    AuthFormProps,
    'handleLogin' | 'handleProviderLogin' | 'handleSignup' | 'handleResetPassword' | 'handleUpdatePassword'
  > {
  redirectTo: string;
}

function PlayFabAuthForm({ redirectTo, ...props }: PlayFabAuthFormProps): React.ReactNode {
  const { account } = useUserContext();
  const { mutateUser } = useUserSession({ redirectTo, redirectIfFound: true });

  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  const clearState = () => {
    setError(undefined);
    setMessage(undefined);
  };

  const handleProviderLogin = async (provider: Provider) => {
    clearState();
    // TODO: handle provider login
    console.log(`Provider sign-in: ${provider}`);
    return new Promise<void>(resolve => setTimeout(resolve, 2000));
  };

  const handleLogin = async (values: { email: string; password: string; remember_me: boolean }) => {
    clearState();
    const body = JSON.stringify({ email: values.email, password: values.password, rememberMe: values.remember_me });
    try {
      const res = await fetchJson<User>('/api/playfab/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      mutateUser(res, { revalidate: false });
    } catch (error) {
      const msg = errorMsgHandler(error);
      setError(msg === 'Invalid input parameters' ? 'Invalid email or password' : msg);
    }
  };

  const handleSignup = async (values: { email: string; password: string; remember_me: boolean }) => {
    clearState();
    const body = JSON.stringify({ email: values.email, password: values.password, rememberMe: values.remember_me });
    try {
      const res = await fetchJson<User>('/api/playfab/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      mutateUser(res, { revalidate: false });
    } catch (error) {
      const msg = errorMsgHandler(error);
      setError(msg);
    }
  };

  const handleResetPassword = async (values: { email: string }) => {
    clearState();
    try {
      await fetchJson<User>('/api/playfab/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });
      setMessage('Check your email for the password reset link');
    } catch (error) {
      const msg = errorMsgHandler(error);
      setError(msg);
    }
  };

  const handleUpdatePassword = async (values: { old_password: string; new_password: string }) => {
    clearState();
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
  };

  return (
    <AuthForm
      handleLogin={handleLogin}
      handleProviderLogin={handleProviderLogin}
      handleResetPassword={handleResetPassword}
      handleSignup={handleSignup}
      handleUpdatePassword={handleUpdatePassword}
      error={error}
      message={message}
      {...props}
    />
  );
}

PlayFabAuthForm.UserContextProvider = UserContextProvider as (props: React.PropsWithChildren) => React.ReactNode;
PlayFabAuthForm.useUserContext = useUserContext as () => UserContextType;
PlayFabAuthForm.useUserSession = useUserSession as UseUserSessionFunction;
export default PlayFabAuthForm;
