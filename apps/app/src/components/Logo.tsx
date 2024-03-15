import RouterLink from 'next/link';
import Image from 'next/image';
import { Link } from '@mui/material';

import { useDispatch } from '@/store/hooks';
import { activeItem } from '@/store/slices/menu';

// ==============================|| LOGO PNG/SVG ||============================== //

const Logo = () => {
  const dispatch = useDispatch();

  const handleClickActive = () => {
    dispatch(activeItem(['']));
  };

  return (
    <Link component={RouterLink} href="/" onClick={handleClickActive}>
      <Image src="/images/logo.png" alt="NiftyLogo" width="32" height="31" />
    </Link>
  );
};

export default Logo;
