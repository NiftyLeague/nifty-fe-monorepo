import { act, fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import NavbarScrollState from './NavbarScrollState'

describe('NavbarScrollState', () => {
  it('updates the server-rendered header when CSS scroll timelines are unavailable', () => {
    const originalCss = globalThis.CSS
    const scrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY')
    const requestAnimationFrame = window.requestAnimationFrame
    const cancelAnimationFrame = window.cancelAnimationFrame
    const callbacks: FrameRequestCallback[] = []

    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { supports: () => false },
    })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callbacks.push(callback)
        return callbacks.length
      },
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: () => undefined,
    })

    try {
      const { container, unmount } = render(
        <>
          <header id="navbar-target" data-scrolled="false" />
          <NavbarScrollState targetId="navbar-target" />
        </>
      )

      expect(container.querySelector('header')?.dataset.scrolled).toBe('false')

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })
      fireEvent.scroll(window)
      expect(container.querySelector('header')?.dataset.scrolled).toBe('false')

      act(() => callbacks.shift()?.(0))
      expect(container.querySelector('header')?.dataset.scrolled).toBe('true')

      unmount()
    } finally {
      Object.defineProperty(globalThis, 'CSS', { configurable: true, value: originalCss })
      if (scrollYDescriptor) Object.defineProperty(window, 'scrollY', scrollYDescriptor)
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        value: requestAnimationFrame,
      })
      Object.defineProperty(window, 'cancelAnimationFrame', {
        configurable: true,
        value: cancelAnimationFrame,
      })
    }
  })

  it('leaves scroll work to CSS when scroll timelines are supported', () => {
    const originalCss = globalThis.CSS
    const scrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY')
    const requestAnimationFrame = window.requestAnimationFrame
    const callbacks: FrameRequestCallback[] = []

    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { supports: () => true },
    })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callbacks.push(callback)
        return callbacks.length
      },
    })

    try {
      const { container, unmount } = render(
        <>
          <header id="navbar-target" data-scrolled="false" />
          <NavbarScrollState targetId="navbar-target" />
        </>
      )

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })
      fireEvent.scroll(window)

      expect(callbacks).toHaveLength(0)
      expect(container.querySelector('header')?.dataset.scrolled).toBe('false')

      unmount()
    } finally {
      Object.defineProperty(globalThis, 'CSS', { configurable: true, value: originalCss })
      if (scrollYDescriptor) Object.defineProperty(window, 'scrollY', scrollYDescriptor)
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        value: requestAnimationFrame,
      })
    }
  })

  it('does not schedule work while scrolling within the same visual state', () => {
    const originalCss = globalThis.CSS
    const scrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY')
    const requestAnimationFrame = window.requestAnimationFrame
    const callbacks: FrameRequestCallback[] = []

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callbacks.push(callback)
        return callbacks.length
      },
    })
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { supports: () => false },
    })

    try {
      const { container, unmount } = render(
        <>
          <header id="navbar-target" data-scrolled="false" />
          <NavbarScrollState targetId="navbar-target" />
        </>
      )

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 24 })
      fireEvent.scroll(window)
      expect(callbacks).toHaveLength(0)

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })
      fireEvent.scroll(window)
      expect(callbacks).toHaveLength(1)
      act(() => callbacks.shift()?.(0))
      expect(container.querySelector('header')?.dataset.scrolled).toBe('true')

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 })
      fireEvent.scroll(window)
      expect(callbacks).toHaveLength(0)

      unmount()
    } finally {
      Object.defineProperty(globalThis, 'CSS', { configurable: true, value: originalCss })
      if (scrollYDescriptor) Object.defineProperty(window, 'scrollY', scrollYDescriptor)
      Object.defineProperty(window, 'requestAnimationFrame', {
        configurable: true,
        value: requestAnimationFrame,
      })
    }
  })
})
