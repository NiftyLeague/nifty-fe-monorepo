import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

const appShellMock = mock(
  ({
    children,
    header,
    networkWarning,
    sidebar,
  }: React.PropsWithChildren<{
    header: React.ReactNode
    sidebar: React.ReactNode
    networkWarning?: React.ReactNode
  }>) => (
    <div data-network-warning={networkWarning ? 'present' : 'absent'}>
      {header}
      {sidebar}
      {children}
    </div>
  )
)

beforeEach(async () => {
  mock.module('@/app/_layout/AppShell', () => ({ default: appShellMock }))
  mock.module('./_Header', () => ({ default: () => <div data-header /> }))
  mock.module('./_Sidebar', () => ({
    default: ({ walletReady = true }: { walletReady?: boolean }) => (
      <div data-sidebar-wallet-ready={String(walletReady)} />
    ),
  }))
  mock.module('next/dynamic', () => ({
    default: () => () => <div data-network-warning />,
  }))
})

afterEach(() => {
  appShellMock.mockClear()
  mock.restore()
})

describe('private main layout startup shell', () => {
  it('renders the navigation shell before wallet features are ready', async () => {
    const MainLayout = (await import('./index')).default
    const { container } = render(
      <MainLayout walletReady={false}>
        <p>Loading content</p>
      </MainLayout>
    )

    expect(container.querySelector('[data-sidebar-wallet-ready="false"]')).not.toBeNull()
    expect(container.querySelector('[data-network-warning="absent"]')).not.toBeNull()
    expect(container.querySelector('[data-network-warning] [data-network-warning]')).toBeNull()
  })

  it('restores wallet-dependent chrome once the provider is ready', async () => {
    const MainLayout = (await import('./index')).default
    const { container } = render(
      <MainLayout>
        <p>Dashboard</p>
      </MainLayout>
    )

    expect(container.querySelector('[data-sidebar-wallet-ready="true"]')).not.toBeNull()
    expect(container.querySelector('[data-network-warning="present"]')).not.toBeNull()
  })
})
