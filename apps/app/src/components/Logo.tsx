import RouterLink from 'next/link'
import NativeImage from '@nl/ui/custom/native-image'

// ==============================|| LOGO PNG/SVG ||============================== //

const Logo = () => {
  return (
    <RouterLink href="/">
      <NativeImage src="/img/logos/NL/purple-filled.webp" alt="NiftyLogo" width="32" height="31" />
    </RouterLink>
  )
}

export default Logo
