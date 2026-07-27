import type { ImgHTMLAttributes } from 'react'

type ThemedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  sources: { dark: string; light: string }
}

export default function ThemedImage({ sources, ...props }: ThemedImageProps) {
  return <img src={sources.light} {...props} />
}
