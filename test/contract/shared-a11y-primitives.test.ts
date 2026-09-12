import { describe, expect, it } from 'bun:test'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Shared-primitive accessibility invariants (M4.1).
 *
 * The behavioural contracts live beside the components
 * (`base-accessibility.test.tsx`, `custom-accessibility.test.tsx`). This file
 * pins the mechanical properties those tests cannot see: animation classes that
 * need a reduced-motion counterpart, and the markup patterns the audit fixed.
 */

const UI_COMPONENTS = 'packages/ui/src/components'
const UI_STYLES = 'packages/ui/src/styles'

/** Animation utilities that must never appear without a reduced-motion escape. */
const MOTION_UTILITIES = ['animate-spin', 'animate-pulse', 'animate-bounce', 'animate-ping']

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

/** These assertions are about markup, and the prose explains the reasoning. */
const markup = (path: string) =>
  read(path)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')

const collect = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(join(process.cwd(), dir))) {
    const relative = join(dir, entry)
    if (statSync(join(process.cwd(), relative)).isDirectory()) collect(relative, out)
    else if (/\.(tsx|css)$/.test(entry) && !/\.test\./.test(entry)) out.push(relative)
  }
  return out
}

/** Class strings that contain a motion utility, split so each can be inspected. */
const classStrings = (source: string) =>
  [...source.matchAll(/['"`]([^'"`\n]*)['"`]/g)].map((match) => match[1] ?? '')

describe('shared primitives: reduced motion', () => {
  it('pairs every animated utility with a reduced-motion escape', () => {
    const offenders: string[] = []

    for (const file of collect(UI_COMPONENTS)) {
      if (!file.endsWith('.tsx')) continue
      for (const classes of classStrings(read(file))) {
        const used = MOTION_UTILITIES.filter((utility) => classes.includes(utility))
        if (used.length === 0) continue
        if (!classes.includes('motion-reduce:')) offenders.push(`${file}: ${used.join(', ')}`)
      }
    }

    expect(offenders).toEqual([])
  })

  it('guards the looping preloader animation in CSS', () => {
    const css = read(`${UI_COMPONENTS}/custom/preloader/index.module.css`)
    const guard = css.slice(css.indexOf('@media (prefers-reduced-motion'))

    expect(css).toContain('animation: w 0.75s ease-out infinite')
    expect(guard).toContain('animation: none')
    for (const selector of ['.preloader_inner', '.pong_loader_left', '.pong_loader_right']) {
      expect(guard).toContain(selector)
    }
  })

  it('keeps the shared utility layer aware of reduced motion', () => {
    // The Tailwind layers already ship a reduced-motion rule; a regression there
    // would silently remove the escape hatch for every `motion-reduce:` class.
    const utilities = read(`${UI_STYLES}/04_tailwind.utilities.css`)
    const animate = read(`${UI_STYLES}/05_tailwind.animate.css`)

    expect(`${utilities}${animate}`).toContain('prefers-reduced-motion')
  })
})

describe('shared primitives: markup patterns', () => {
  it('keeps the mobile disclosure on its native role so the state is exposed', () => {
    const source = markup(`${UI_COMPONENTS}/custom/mobile-navigation/index.tsx`)

    // An explicit role="button" on <summary> replaces the browser's disclosure
    // mapping and drops aria-expanded from the accessibility tree.
    expect(source).not.toContain('role="button"')
    expect(source).toContain('<summary')
    expect(source).toContain('aria-controls={id}')
    expect(source).toContain('motion-reduce:transition-none')
  })

  it('keeps every app-local disclosure on its native role too', () => {
    // The app's own sidebar toggle repeated the pattern the shared component had.
    // A `role="button"` inside a summary tag is the signal, wherever it lives.
    // Scoped to the directories that hold UI: the whole `apps` tree is ~900 files,
    // which is too slow to read inside a test.
    const uiRoots = [
      UI_COMPONENTS,
      'apps/app/src/components',
      'apps/app/src/layouts',
      'apps/web/src/components',
      'apps/smashers/src/components',
      'apps/docs/src/components',
    ]

    const offenders = uiRoots
      .flatMap((root) => collect(root))
      .filter((file) => file.endsWith('.tsx'))
      .filter((file) => /<summary[\s\S]{0,400}?role="button"/.test(markup(file)))

    expect(offenders).toEqual([])
  }, 15000)

  it('forwards the progress value to the primitive that exposes it', () => {
    const source = read(`${UI_COMPONENTS}/base/progress.tsx`)

    expect(source).toContain('value={value}')
    expect(source).toContain('aria-valuenow')
  })

  it('keeps spinners decorative by default', () => {
    for (const file of [
      `${UI_COMPONENTS}/custom/circular-progress/index.tsx`,
      `${UI_COMPONENTS}/base/skeleton.tsx`,
    ]) {
      expect(read(file), `${file} must hide itself from AT`).toContain('aria-hidden="true"')
    }
  })

  it('leaves the deferred placeholder announceable by its caller', () => {
    const source = read(`${UI_COMPONENTS}/custom/deferred-skeleton/index.tsx`)

    // Callers use it as the loading state itself (role="status" + aria-label),
    // so it must not hide itself the way the decorative base Skeleton does.
    expect(source).not.toContain('aria-hidden')
    expect(source).toContain('motion-reduce:animate-none')
  })

  it('does not give a button type to elements a caller supplies', () => {
    // `asChild` renders the caller's own element, which has no button type.
    for (const file of [`${UI_COMPONENTS}/base/button.tsx`, `${UI_COMPONENTS}/base/tooltip.tsx`]) {
      const source = read(file)
      expect(source, file).toContain('asChild ? {} : { type: type ?? ')
    }
  })

  it('announces external actions that open a new tab', () => {
    const source = read(`${UI_COMPONENTS}/custom/theme-button-group/index.tsx`)

    expect(source).toContain("target={external ? '_blank' : undefined}")
    expect(source).toContain('opens in a new tab')
  })
})
