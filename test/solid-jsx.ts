/**
 * bun:test preload that transpiles TSX in Solid packages through
 * babel-preset-solid. Bun's built-in JSX transform emits React-style element
 * objects which `solid-js/web`'s `render` cannot mount, so packages that have
 * migrated to Solid need the real compiler. Scoped by path so React test files
 * in not-yet-migrated packages keep their default transform.
 */
import { plugin } from 'bun'
import { transformAsync } from '@babel/core'
import solidPreset from 'babel-preset-solid'
import tsPreset from '@babel/preset-typescript'

const SOLID_PACKAGES = /(packages\/ui\/|apps\/web\/|apps\/smashers\/|apps\/docs\/)/

plugin({
  name: 'solid-jsx',
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, async ({ path }) => {
      if (!SOLID_PACKAGES.test(path)) return undefined
      const source = await Bun.file(path).text()
      const result = await transformAsync(source, {
        filename: path,
        presets: [
          [tsPreset, {}],
          [solidPreset, { generate: 'dom', hydratable: false }],
        ],
        babelrc: false,
        configFile: false,
        sourceMaps: 'inline',
      })
      return { contents: result?.code ?? source, loader: 'js' }
    })
  },
})
