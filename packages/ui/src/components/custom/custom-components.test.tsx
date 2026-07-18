const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
};
import type { PropsWithChildren } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test';

type ComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

const state = {
  intersecting: true,
  mobile: true,
  milliseconds: 1_500,
  onScreen: true,
  pathname: '/about',
  start: mock(),
  stop: mock(),
  parallax: mock(),
};

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({ children, href, ...props }: PropsWithChildren<{ href: string }>) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  }));
  mock.module('next/image', () => ({
    default: ({ alt, priority: _priority, ...props }: ComponentProps<'img'> & { priority?: boolean }) => (
      <img alt={alt} {...props} />
    ),
  }));
  mock.module('next/navigation', () => ({ usePathname: () => state.pathname }));
  mock.module('@nl/ui/hooks/useScrollDetection', () => ({
    useScrollDetection: () => ({ ref: mock(), isIntersecting: state.intersecting }),
  }));
  mock.module('@nl/ui/hooks/useOnScreen', () => ({ useOnScreen: () => state.onScreen }));
  mock.module('@nl/ui/hooks/useParallax', () => ({ useParallax: (...args: unknown[]) => state.parallax(...args) }));
  mock.module('@nl/ui/hooks/useStopwatch', () => ({
    useStopwatch: () => ({ milliseconds: state.milliseconds, start: state.start, stop: state.stop }),
  }));
  mock.module('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: () => ({ isMobile: () => state.mobile }) }));
  mock.module('@nl/ui/hooks/useProviders', () => ({ useProviders: () => ['google'] }));
  mock.module('lucide-react/dynamic', () => ({ DynamicIcon: ({ name }: { name: string }) => <svg aria-label={name} /> }));
});

afterEach(() => {
  jest.useRealTimers();
  undefined;
  state.intersecting = true;
  state.mobile = true;
  state.milliseconds = 1_500;
  state.onScreen = true;
  state.pathname = '/about';
});

describe('custom Input', () => {
  let Icon: typeof import('@nl/ui/base/icon').Icon;
  let Input: typeof import('./input').default;
  let LoginForm: typeof import('./auth-form/forms/login').default;
  let AuthForm: typeof import('./auth-form').AuthForm;
  let VIEWS: typeof import('./auth-form').VIEWS;

  beforeEach(async () => {
    const iconModule = await import('@nl/ui/base/icon');
    const inputModule = await import('./input');
    const loginModule = await import('./auth-form/forms/login');
    const authModule = await import('./auth-form');
    Icon = iconModule.Icon;
    Input = inputModule.default;
    LoginForm = loginModule.LoginForm;
    AuthForm = authModule.AuthForm;
    VIEWS = authModule.VIEWS;
  });

  it('labels, reveals, copies, decorates, and resets a password value', async () => {
    jest.useFakeTimers();
    const writeText = mock().mockResolvedValue(undefined);
    stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const { rerender } = render(
      <Input
        label="Password"
        type="password"
        value="secret"
        readOnly
        copy
        startIcon={<Icon name="key" />}
        endIcon={<Icon name="check" />}
        actions={<button>Custom action</button>}
      />,
    );

    const input = screen.getByLabelText('Password');
    expect(input?.getAttribute('type')).toBe('password');
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    expect(input?.getAttribute('type')).toBe('text');
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    fireEvent.click(screen.getByRole('button', { name: /Copy/ }));
    await act(async () => Promise.resolve());
    expect(writeText).toHaveBeenCalledWith('secret');
    expect(screen.getByRole('button', { name: /Copied/ })).not.toBeNull();
    act(() => jest.advanceTimersByTime(3_000));
    expect(screen.getByRole('button', { name: /Copy/ })).not.toBeNull();

    rerender(<Input hiddenLabel label="Hidden" error value="bad" readOnly />);
    expect(screen.getByLabelText('Hidden')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('handles copy rejection and bare unlabeled inputs', async () => {
    const writeText = mock().mockRejectedValue(new Error('denied'));
    stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const { rerender } = render(<Input id="copy" value="value" copy readOnly />);
    fireEvent.click(screen.getByRole('button', { name: /Copy/ }));
    expect(await screen.findByRole('button', { name: /Failed to copy/ })).not.toBeNull();

    rerender(<Input id="plain" />);
    expect(screen.getByRole('textbox')?.getAttribute('id')).toBe('plain');
  });
});

describe('Navbar', () => {
  let Navbar: typeof import('./navbar').default;

  beforeEach(async () => {
    const navbarModule = await import('./navbar');
    Navbar = navbarModule.default;
  });

  const navItems = [
    { type: 'single' as const, title: 'Home', href: '/' },
    { type: 'single' as const, title: 'About', href: '/about', description: 'About Nifty' },
    {
      type: 'group' as const,
      group: 'Products',
      pages: [
        { title: 'Smashers', href: '/smashers' },
        { title: 'Docs', href: 'https://docs.example.test', external: true, description: 'Developer docs' },
      ],
    },
  ];

  it('renders active desktop, grouped, external, action, and mobile links', () => {
    render(
      <Navbar
        navItems={navItems}
        actionButton={{ title: 'Game', href: 'https://game.example.test', external: true }}
      />,
    );

    expect(screen.getByRole('img', { name: 'Home' })).not.toBeNull();
    expect(screen.getAllByRole('link', { name: /About/ })[0]?.getAttribute('data-active')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(screen.getAllByRole('link', { name: /Docs/ })[0]?.getAttribute('target')).toBe('_blank');
    expect(screen.getByRole('link', { name: 'Game' })?.getAttribute('rel')).toBe('noreferrer');
    expect(screen.getByRole('button', { name: /Open Nav Menu/ })).not.toBeNull();
  });

  it('switches the navbar backdrop after the scroll sentinel leaves view', () => {
    state.intersecting = false;
    const { container } = render(<Navbar navItems={navItems} />);
    expect(container.querySelector('[data-slot="navigation-menu"]')?.className).toContain('bg-background/90');
  });
});

describe('AnimatedWrapper and Preloader', () => {
  let AnimatedWrapper: typeof import('./animated-wrapper').AnimatedWrapper;
  let Preloader: typeof import('./preloader').Preloader;
  let PreloaderBase: typeof import('./preloader/base').PreloaderBase;

  beforeEach(async () => {
    const animatedModule = await import('./animated-wrapper');
    const preloaderModule = await import('./preloader');
    const preloaderBaseModule = await import('./preloader/base');
    AnimatedWrapper = animatedModule.AnimatedWrapper;
    Preloader = preloaderModule.Preloader;
    PreloaderBase = preloaderBaseModule.PreloaderBase;
  });

  it('starts delayed and immediate nested animations and configures parallax', () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <AnimatedWrapper delay={20} parallax parallaxDirection="right" parallaxIntensity="strong" component="section">
        <div className="fade-start slide-start keep">Animated</div>
      </AnimatedWrapper>,
    );
    expect(screen.getByText('Animated')?.className).toContain('fade-start');
    act(() => jest.advanceTimersByTime(20));
    expect(screen.getByText('Animated')?.className).not.toContain('fade-start');
    expect(screen.getByText('Animated')?.className).toContain('keep');
    expect(state.parallax).toHaveBeenCalled();

    rerender(
      <AnimatedWrapper immediate>
        <div className="zoom-start">Immediate</div>
      </AnimatedWrapper>,
    );
    expect(screen.getByText('Immediate')?.className).not.toContain('zoom-start');

    state.onScreen = false;
    rerender(
      <AnimatedWrapper>
        <div className="hold-start">Held</div>
      </AnimatedWrapper>,
    );
    expect(screen.getByText('Held')?.className).toContain('hold-start');
  });

  it('normalizes progress, controls page scrolling, and displays slow-mobile guidance', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Preloader ready={false} progress={0.9} />);
    act(() => jest.runOnlyPendingTimers());
    expect(screen.getByText('For the best experience try us out on desktop!')).not.toBeNull();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(state.start).toHaveBeenCalled();

    rerender(<Preloader ready progress={125} />);
    act(() => jest.runOnlyPendingTimers());
    expect(state.stop).toHaveBeenCalled();
    expect(document.documentElement.style.overflow).toBe('');

    rerender(<PreloaderBase ready={false} percent={0} showWarning={false} />);
    expect(screen.queryByText('%')).toBeNull();
    rerender(<PreloaderBase ready percent={42.4} showWarning />);
    expect(screen.getByText('42%')).not.toBeNull();
  });
});

describe('authentication forms', () => {
  let LoginForm: typeof import('./auth-form/forms/login').default;
  let AuthForm: typeof import('./auth-form').AuthForm;
  let VIEWS: typeof import('./auth-form').VIEWS;

  beforeEach(async () => {
    const loginModule = await import('./auth-form/forms/login');
    const authModule = await import('./auth-form');
    LoginForm = loginModule.LoginForm;
    AuthForm = authModule.AuthForm;
    VIEWS = authModule.VIEWS;
  });

  const handlers = {
    handleLogin: mock().mockResolvedValue(undefined),
    handleProviderLogin: mock().mockResolvedValue(undefined),
    handleResetPassword: mock().mockResolvedValue(undefined),
    handleSignup: mock().mockResolvedValue(undefined),
    handleUpdatePassword: mock().mockResolvedValue(undefined),
  };

  it('submits login credentials and exposes account recovery and creation actions', async () => {
    const user = userEvent.setup();
    const setAuthView = mock();
    render(
      <LoginForm
        {...handlers}
        view={VIEWS.LOGIN}
        setAuthView={setAuthView}
        enableAccountCreation
        enableProviderSignOn
        enableSocialColors
      />,
    );
    await user.type(screen.getByLabelText('Email'), 'player@example.com');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: /Login/ }));
    await waitFor(() =>
      expect(handlers.handleLogin).toHaveBeenCalledWith(expect.objectContaining({ remember_me: true })),
    );
    await user.click(screen.getByText('Forgot your password?'));
    expect(setAuthView).toHaveBeenCalledWith(VIEWS.FORGOT_PASSWORD);
    await user.click(screen.getByText('Sign up'));
    expect(setAuthView).toHaveBeenCalledWith(VIEWS.SIGN_UP);
    await user.click(screen.getByRole('button', { name: 'google' }));
    await waitFor(() => expect(handlers.handleProviderLogin).toHaveBeenCalledWith('google'));
  });

  it('switches AuthForm views and renders status feedback', () => {
    const { rerender } = render(
      <AuthForm {...handlers} view={VIEWS.SIGN_UP} message="Ready" error="Try again" enableAccountCreation />,
    );
    expect(screen.getByText('Welcome to Nifty League')).not.toBeNull();
    expect(screen.getByText('Ready')).not.toBeNull();
    expect(screen.getByText('Try again')).not.toBeNull();

    rerender(<AuthForm {...handlers} view={VIEWS.FORGOT_PASSWORD} />);
    expect(screen.getByText('Forgot Password')).not.toBeNull();
    rerender(<AuthForm {...handlers} view={VIEWS.UPDATE_PASSWORD} />);
    expect(screen.getAllByText('Update Password')).toHaveLength(2);
  });
});
