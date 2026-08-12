export { defaultFont as imbPlexSans } from './default'
export { headerFont as nexaRustSansBlack } from './header'
export { specialFont as pressStart } from './special'
export { subheaderFont as lilitaOne } from './subheader'

import { defaultFont } from './default'
import { headerFont } from './header'
import { specialFont } from './special'
import { subheaderFont } from './subheader'

export const customFontClassName = [
  defaultFont.variable,
  subheaderFont.variable,
  headerFont.variable,
  specialFont.variable,
].join(' ')
