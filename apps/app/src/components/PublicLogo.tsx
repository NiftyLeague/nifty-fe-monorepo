import NativeImage from '@nl/ui/custom/native-image'

export default function PublicLogo() {
  return (
    // The public-shell link stays a native anchor so public routes avoid the
    // private shell's router runtime.
    <a href="/">
      <NativeImage src="/img/logos/NL/purple-filled.webp" alt="NiftyLogo" width="32" height="31" />
    </a>
  )
}
