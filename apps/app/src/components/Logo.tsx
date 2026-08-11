import RouterLink from 'next/link'
import Image from 'next/image'

// ==============================|| LOGO PNG/SVG ||============================== //

const Logo = () => {
  return (
    <RouterLink href="/">
      <Image src="/img/logos/NL/purple-filled.webp" alt="NiftyLogo" width="32" height="31" />
    </RouterLink>
  )
}

export default Logo
