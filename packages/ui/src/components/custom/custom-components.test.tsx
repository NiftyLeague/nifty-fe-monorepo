import '@testing-library/jest-dom/vitest';
import type { ComponentProps, PropsWithChildren } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Icon } from '@nl/ui/base/icon';
import { AnimatedWrapper } from './animated-wrapper';
import { AuthForm, VIEWS } from './auth-form';
import { LoginForm } from './auth-form/forms/login';
import { Input } from './input';
import { Navbar } from './navbar';
import { Preloader } from './preloader';
import { PreloaderBase } from './preloader/base';

const state = vi.hoisted(() => ({
  intersecting: true,
  mobile: true,
  milliseconds: 1_500,
  onScreen: true,
  pathname: '/about',
  start: vi.fn(),
  stop: vi.fn(),
  parallax: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('next/image', () => ({
  default: ({ alt, priority: _priority, ...props }: ComponentProps<'img'> & { priority?: boolean }) => (
    <img alt={alt} {...props} />
  ),
}));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));
vi.mock('@nl/ui/hooks/useScrollDetection', () => ({
  useScrollDetection: () => ({ ref: vi.fn(), isIntersecting: state.intersecting }),
}));
vi.mock('@nl/ui/hooks/useOnScreen', () => ({ useOnScreen: () => state.onScreen }));
vi.mock('@nl/ui/hooks/useParallax', () => ({ useParallax: (...args: unknown[]) => state.parallax(...args) }));
vi.mock('@nl/ui/hooks/useStopwatch', () => ({
  useStopwatch: () => ({ milliseconds: state.milliseconds, start: state.start, stop: state.stop }),
}));
vi.mock('@nl/ui/hooks/useUserAgent', () => ({ useUserAgent: () => ({ isMobile: () => state.mobile }) }));
vi.mock('@nl/ui/hooks/useProviders', () => ({ useProviders: () => ['google'] }));
vi.mock('lucide-react/dynamic', () => ({ DynamicIcon: ({ name }: { name: string }) => <svg aria-label={name} /> }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  state.intersecting = true;
  state.mobile = true;
  state.milliseconds = 1_500;
  state.onScreen = true;
  state.pathname = '/about';
});

describe('custom Input', () => {
  it('labels, reveals, copies, decorates, and resets a password value', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
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
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    fireEvent.click(screen.getByRole('button', { name: /Copy/ }));
    await act(async () => Promise.resolve());
    expect(writeText).toHaveBeenCalledWith('secret');
    expect(screen.getByRole('button', { name: /Copied/ })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3_000));
    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument();

    rerender(<Input hiddenLabel label="Hidden" error value="bad" readOnly />);
    expect(screen.getByLabelText('Hidden')).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles copy rejection and bare unlabeled inputs', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const { rerender } = render(<Input id="copy" value="value" copy readOnly />);
    fireEvent.click(screen.getByRole('button', { name: /Copy/ }));
    expect(await screen.findByRole('button', { name: /Failed to copy/ })).toBeInTheDocument();

    rerender(<Input id="plain" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'plain');
  });
});

describe('Navbar', () => {
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

    expect(screen.getByRole('img', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /About/ })[0]).toHaveAttribute('data-active', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(screen.getAllByRole('link', { name: /Docs/ })[0]).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'Game' })).toHaveAttribute('rel', 'noreferrer');
    expect(screen.getByRole('button', { name: /Open Nav Menu/ })).toBeInTheDocument();
  });

  it('switches the navbar backdrop after the scroll sentinel leaves view', () => {
    state.intersecting = false;
    const { container } = render(<Navbar navItems={navItems} />);
    expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveClass('bg-background/90');
  });
});

describe('AnimatedWrapper and Preloader', () => {
  it('starts delayed and immediate nested animations and configures parallax', () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <AnimatedWrapper delay={20} parallax parallaxDirection="right" parallaxIntensity="strong" component="section">
        <div className="fade-start slide-start keep">Animated</div>
      </AnimatedWrapper>,
    );
    expect(screen.getByText('Animated')).toHaveClass('fade-start');
    act(() => vi.advanceTimersByTime(20));
    expect(screen.getByText('Animated')).not.toHaveClass('fade-start');
    expect(screen.getByText('Animated')).toHaveClass('keep');
    expect(state.parallax).toHaveBeenCalled();

    rerender(
      <AnimatedWrapper immediate>
        <div className="zoom-start">Immediate</div>
      </AnimatedWrapper>,
    );
    expect(screen.getByText('Immediate')).not.toHaveClass('zoom-start');

    state.onScreen = false;
    rerender(
      <AnimatedWrapper>
        <div className="hold-start">Held</div>
      </AnimatedWrapper>,
    );
    expect(screen.getByText('Held')).toHaveClass('hold-start');
  });

  it('normalizes progress, controls page scrolling, and displays slow-mobile guidance', () => {
    vi.useFakeTimers();
    const { rerender } = render(<Preloader ready={false} progress={0.9} />);
    act(() => vi.runOnlyPendingTimers());
    expect(screen.getByText('For the best experience try us out on desktop!')).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(state.start).toHaveBeenCalled();

    rerender(<Preloader ready progress={125} />);
    act(() => vi.runOnlyPendingTimers());
    expect(state.stop).toHaveBeenCalled();
    expect(document.documentElement.style.overflow).toBe('');

    rerender(<PreloaderBase ready={false} percent={0} showWarning={false} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
    rerender(<PreloaderBase ready percent={42.4} showWarning />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
});

describe('authentication forms', () => {
  const handlers = {
    handleLogin: vi.fn().mockResolvedValue(undefined),
    handleProviderLogin: vi.fn().mockResolvedValue(undefined),
    handleResetPassword: vi.fn().mockResolvedValue(undefined),
    handleSignup: vi.fn().mockResolvedValue(undefined),
    handleUpdatePassword: vi.fn().mockResolvedValue(undefined),
  };

  it('submits login credentials and exposes account recovery and creation actions', async () => {
    const user = userEvent.setup();
    const setAuthView = vi.fn();
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
    expect(screen.getByText('Welcome to Nifty League')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();

    rerender(<AuthForm {...handlers} view={VIEWS.FORGOT_PASSWORD} />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    rerender(<AuthForm {...handlers} view={VIEWS.UPDATE_PASSWORD} />);
    expect(screen.getAllByText('Update Password')).toHaveLength(2);
  });
});
