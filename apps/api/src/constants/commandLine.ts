import { color } from 'json-colorizer'
import type { ColorTheme } from 'json-colorizer'

const boldBlue = (text: string) => color.bold(color.blue(text))

export const COLORIZE_OPTIONS = {
  indent: 2,
  colors: {
    Whitespace: color.gray,
    Brace: color.gray,
    Bracket: color.gray,
    Colon: color.gray,
    Comma: color.gray,
    NumberLiteral: color.yellow,
    StringKey: boldBlue,
    StringLiteral: color.green,
    BooleanLiteral: color.cyan,
    NullLiteral: color.red,
  } as ColorTheme,
}
