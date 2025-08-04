export const VIEWS = {
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  FORGOT_PASSWORD: 'forgot_password',
  UPDATE_PASSWORD: 'update_password',
} as const;

export const FORM_TITLE = {
  [VIEWS.LOGIN]: 'Welcome Back',
  [VIEWS.SIGN_UP]: 'Welcome to Nifty League',
  [VIEWS.FORGOT_PASSWORD]: 'Forgot Password',
  [VIEWS.UPDATE_PASSWORD]: 'Update Password',
} as const;

export const FORM_DESC = {
  [VIEWS.LOGIN]: 'Login to your Nifty League account',
  [VIEWS.SIGN_UP]: 'Sign up for a Nifty League account',
  [VIEWS.FORGOT_PASSWORD]: 'Send reset password instructions',
  [VIEWS.UPDATE_PASSWORD]: 'Update your Nifty League password',
} as const;
