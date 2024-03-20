import Image from 'next/image';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { SOCIAL_LINKS } from './constants';

export default function Footer({ classes }: { classes?: { footer?: string } }) {
  return (
    <footer className={`${classes?.footer || ''}`} style={{ padding: '40px 20px' }}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
          <a href="https://niftyleague.com/terms-of-service" target="_blank" rel="noreferrer">
            Terms
          </a>
          <a href="https://niftyleague.com/disclaimer" target="_blank" rel="noreferrer">
            Disclaimer
          </a>
          <a href="https://niftyleague.com/privacy-policy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
          {SOCIAL_LINKS.map(social => (
            <a href={social.link} target="_blank" rel="noreferrer" key={social.name}>
              <Image src={social.image} width={20} height={20} alt={social.description} />
            </a>
          ))}
        </Stack>
      </Stack>
    </footer>
  );
}
