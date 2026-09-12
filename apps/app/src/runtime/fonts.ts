/**
 * Compatibility stand-in for the shared `@nl/ui/fonts/*` helpers.
 *
 * The shared helpers are tied to a build-time font pipeline that hands back a
 * generated class name and CSS variable. This app declares the same families
 * and variables in `src/styles/fonts.css` instead, so the exported shape is
 * preserved for any caller that still imports it while the actual font loading
 * is CSS-driven.
 */
export interface FontDefinition {
  className: string
  style: { fontFamily: string; fontStyle?: string; fontWeight?: string }
  variable: string
}

const font = (family: string, variable: string, fontWeight?: string): FontDefinition => ({
  className: `font-${family.toLowerCase().replaceAll(' ', '-')}`,
  style: { fontFamily: family, ...(fontWeight ? { fontWeight } : {}) },
  variable,
})

export const defaultFont = font('NL IBM Plex Sans', '--font-ibm-plex-sans', '400 700')
export const headerFont = font('NL Nexa Rust Sans Black', '--font-nexa-rust-sans-black', '700')
export const subheaderFont = font('NL Lilita One', '--font-lilita-one', '400')
export const specialFont = font('NL Press Start 2P', '--font-press-start-2p', '400')

export const customFontClassName = [defaultFont, headerFont, subheaderFont]
  .map((entry) => entry.className)
  .join(' ')

/** Class list applied to the document element so the variables resolve. */
export const fontClassName = [
  defaultFont.variable,
  headerFont.variable,
  subheaderFont.variable,
].join(' ')
