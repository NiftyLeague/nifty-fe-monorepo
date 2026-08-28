import NativeImage from '@nl/ui/custom/native-image'

export default function PublicLogo() {
  return (
    // This public-shell link intentionally stays native to keep Next's Link runtime out of public routes.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href="/">
      <NativeImage src="/img/logos/NL/purple-filled.webp" alt="NiftyLogo" width="32" height="31" />
    </a>
  )
}
