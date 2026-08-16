const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}
import type { PropsWithChildren } from 'react'
import { Mail } from 'lucide-react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, jest, mock } from 'bun:test'

type ComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T]

const state = {
  mobile: true,
  milliseconds: 1_500,
  pathname: '/about',
  start: mock(),
  stop: mock(),
  parallax: mock(),
}
const nextLinkPrefetches: Array<boolean | undefined> = []

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({
      children,
      href,
      prefetch,
      ...props
    }: PropsWithChildren<{ href: string; prefetch?: boolean }>) => {
      nextLinkPrefetches.push(prefetch)
      return (
        <a href={href} {...props}>
          {children}
        </a>
      )
    },
  }))
  mock.module('next/image', () => ({
    default: ({
      alt,
      priority: _priority,
      ...props
    }: ComponentProps<'img'> & { priority?: boolean }) => <img alt={alt} {...props} />,
  }))
  mock.module('@nl/ui/custom/optimized-image', () => ({
    default: ({ alt, ...props }: ComponentProps<'img'>) => <img alt={alt} {...props} />,
  }))
  mock.module('next/navigation', () => ({ usePathname: () => state.pathname }))
  mock.module('@nl/ui/hooks/useParallax', () => ({
    useParallax: (...args: unknown[]) => state.parallax(...args),
  }))
  mock.module('@nl/ui/hooks/useStopwatch', () => ({
    useStopwatch: () => ({
      milliseconds: state.milliseconds,
      start: state.start,
      stop: state.stop,
    }),
  }))
  mock.module('@nl/ui/hooks/useUserAgent', () => ({
    useUserAgent: () => ({ isMobile: () => state.mobile }),
  }))
  mock.module('@nl/ui/hooks/useProviders', () => ({ useProviders: () => ['google'] }))
})

afterEach(() => {
  jest.useRealTimers()
  undefined
  nextLinkPrefetches.length = 0
  state.mobile = true
  state.milliseconds = 1_500
  state.pathname = '/about'
})

describe('custom Input', () => {
  let Icon: typeof import('@nl/ui/base/icon').Icon
  let Input: typeof import('./input').default
  let LoginForm: typeof import('./auth-form/forms/login').default
  let AuthForm: typeof import('./auth-form').AuthForm
  let VIEWS: typeof import('./auth-form').VIEWS

  beforeEach(async () => {
    const iconModule = await import('@nl/ui/base/icon')
    const inputModule = await import('./input')
    const loginModule = await import('./auth-form/forms/login')
    const authModule = await import('./auth-form')
    Icon = iconModule.Icon
    Input = inputModule.default
    LoginForm = loginModule.LoginForm
    AuthForm = authModule.AuthForm
    VIEWS = authModule.VIEWS
  })

  it('labels, reveals, copies, decorates, and resets a password value', async () => {
    jest.useFakeTimers()
    const writeText = mock().mockResolvedValue(undefined)
    stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
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
      />
    )

    const input = screen.getByLabelText('Password')
    expect(input?.getAttribute('type')).toBe('password')
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }))
    expect(input?.getAttribute('type')).toBe('text')
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }))
    fireEvent.click(screen.getByRole('button', { name: /Copy/ }))
    await act(async () => Promise.resolve())
    expect(writeText).toHaveBeenCalledWith('secret')
    expect(screen.getByRole('button', { name: /Copied/ })).not.toBeNull()
    act(() => jest.advanceTimersByTime(3_000))
    expect(screen.getByRole('button', { name: /Copy/ })).not.toBeNull()

    rerender(<Input hiddenLabel label="Hidden" error value="bad" readOnly />)
    expect(screen.getByLabelText('Hidden')?.getAttribute('aria-invalid')).toBe('true')
  })

  it('handles copy rejection and bare unlabeled inputs', async () => {
    const writeText = mock().mockRejectedValue(new Error('denied'))
    stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    const { rerender } = render(<Input id="copy" value="value" copy readOnly />)
    fireEvent.click(screen.getByRole('button', { name: /Copy/ }))
    expect(await screen.findByRole('button', { name: /Failed to copy/ })).not.toBeNull()

    rerender(<Input id="plain" />)
    expect(screen.getByRole('textbox')?.getAttribute('id')).toBe('plain')
  })

  it('accepts direct Lucide icons and normalizes their rendered size', () => {
    const { container } = render(<Input id="direct-icon" startIcon={<Mail />} />)
    const icon = container.querySelector('svg.lucide-mail')

    expect(icon?.getAttribute('width')).toBe('18')
    expect(icon?.getAttribute('height')).toBe('18')
  })
})

describe('Navbar', () => {
  let Navbar: typeof import('./navbar').default

  beforeEach(async () => {
    const navbarModule = await import('./navbar')
    Navbar = navbarModule.default
  })

  const navItems = [
    { type: 'single' as const, title: 'Home', href: '/' },
    { type: 'single' as const, title: 'About', href: '/about', description: 'About Nifty' },
    {
      type: 'group' as const,
      group: 'Products',
      pages: [
        { title: 'Smashers', href: '/smashers' },
        {
          title: 'Docs',
          href: 'https://docs.example.test',
          external: true,
          description: 'Developer docs',
        },
      ],
    },
  ]

  it('renders desktop, grouped, external, action, and mobile links', () => {
    render(
      <Navbar
        navItems={navItems}
        actionButton={{ title: 'Game', href: 'https://game.example.test', external: true }}
      />
    )

    expect(screen.getByRole('img', { name: 'Home' }).getAttribute('loading')).toBe('eager')
    expect(nextLinkPrefetches.length).toBeGreaterThan(0)
    expect(nextLinkPrefetches.every((prefetch) => prefetch === false)).toBe(true)
    expect(screen.getAllByRole('link', { name: /About/ })[0]?.getAttribute('href')).toBe('/about')
    fireEvent.click(screen.getByText('Products', { selector: 'summary' }))
    expect(screen.getAllByRole('link', { name: /Docs/ })[0]?.getAttribute('target')).toBe('_blank')
    expect(screen.getByRole('link', { name: 'Game' })?.getAttribute('rel')).toBe('noreferrer')
    const navigationToggle = screen.getByText('Toggle navigation')
    expect(navigationToggle.closest('summary')).not.toBeNull()
    fireEvent.click(navigationToggle)
    expect(navigationToggle.closest('details')?.hasAttribute('open')).toBe(true)
    expect(document.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
  })

  it('renders a fixed, transparent semantic header with scroll-driven state', () => {
    const { container } = render(<Navbar navItems={navItems} />)
    const header = container.querySelector('header')
    expect(header?.className).toContain('navbar-scroll-frame')
    expect(header?.className).toContain('bg-transparent')
    expect(header?.className.split(/\s+/)).toContain('data-[scrolled=true]:backdrop-blur-xs')
    expect(header?.className.split(/\s+/)).not.toContain('backdrop-blur-xs')
    expect(header?.dataset.scrolled).toBe('false')
    expect(header?.previousElementSibling).toBeNull()
  })
})

describe('ParallaxWrapper', () => {
  let ParallaxWrapper: typeof import('./parallax-wrapper').ParallaxWrapper

  beforeEach(async () => {
    ParallaxWrapper = (await import('./parallax-wrapper')).ParallaxWrapper
    state.parallax.mockClear()
  })

  it('keeps parallax behavior in a focused semantic wrapper', () => {
    render(
      <ParallaxWrapper component="section" parallaxDirection="up" parallaxIntensity="strong">
        <p>Parallax content</p>
      </ParallaxWrapper>
    )

    expect(screen.getByText('Parallax content').parentElement?.tagName).toBe('SECTION')
    expect(state.parallax).toHaveBeenCalledWith(expect.anything(), {
      enabled: true,
      direction: 'up',
      intensity: 'strong',
    })
  })
})

describe('authentication forms', () => {
  let LoginForm: typeof import('./auth-form/forms/login').default
  let AuthForm: typeof import('./auth-form').AuthForm
  let VIEWS: typeof import('./auth-form').VIEWS

  beforeEach(async () => {
    const loginModule = await import('./auth-form/forms/login')
    const authModule = await import('./auth-form')
    LoginForm = loginModule.LoginForm
    AuthForm = authModule.AuthForm
    VIEWS = authModule.VIEWS
  })

  const handlers = {
    handleLogin: mock().mockResolvedValue(undefined),
    handleProviderLogin: mock().mockResolvedValue(undefined),
    handleResetPassword: mock().mockResolvedValue(undefined),
    handleSignup: mock().mockResolvedValue(undefined),
    handleUpdatePassword: mock().mockResolvedValue(undefined),
  }

  it('submits login credentials and exposes account recovery and creation actions', async () => {
    const user = userEvent.setup()
    const setAuthView = mock()
    render(
      <LoginForm
        {...handlers}
        view={VIEWS.LOGIN}
        setAuthView={setAuthView}
        enableAccountCreation
        enableProviderSignOn
        enableSocialColors
      />
    )
    await user.type(screen.getByLabelText('Email'), 'player@example.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: /Login/ }))
    await waitFor(() =>
      expect(handlers.handleLogin).toHaveBeenCalledWith(
        expect.objectContaining({ remember_me: true })
      )
    )
    await user.click(screen.getByText('Forgot your password?'))
    expect(setAuthView).toHaveBeenCalledWith(VIEWS.FORGOT_PASSWORD)
    await user.click(screen.getByText('Sign up'))
    expect(setAuthView).toHaveBeenCalledWith(VIEWS.SIGN_UP)
    await user.click(screen.getByRole('button', { name: 'google' }))
    await waitFor(() => expect(handlers.handleProviderLogin).toHaveBeenCalledWith('google'))
  }, 15_000)

  it('switches AuthForm views and renders status feedback', () => {
    const { rerender } = render(
      <AuthForm
        {...handlers}
        view={VIEWS.SIGN_UP}
        message="Ready"
        error="Try again"
        enableAccountCreation
      />
    )
    expect(screen.getByText('Welcome to Nifty League')).not.toBeNull()
    expect(screen.getByText('Ready')).not.toBeNull()
    expect(screen.getByText('Try again')).not.toBeNull()

    rerender(<AuthForm {...handlers} view={VIEWS.FORGOT_PASSWORD} />)
    expect(screen.getByText('Forgot Password')).not.toBeNull()
    rerender(<AuthForm {...handlers} view={VIEWS.UPDATE_PASSWORD} />)
    expect(screen.getAllByText('Update Password')).toHaveLength(2)
  })
})
