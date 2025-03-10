'use client';

import { LegacyRef, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ExternalIcon from '@/components/ExternalIcon';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav id="nav" className="row min-vw-100 p-0 navbar zindex-fixed position-absolute navbar-expand-md m-0 desktop">
      <div className="container-fluid z-100" style={{ borderStyle: 'none' }}>
        <div
          className="navbar-nav collapse navbar-collapse px-4 my-3 justify-content-between"
          id="navbarSupportedContent"
        >
          <Link href="/" className="navbar-brand">
            <Image
              src="/img/logos/NL/white.webp"
              height={50}
              width={52}
              alt="Nifty League Logo"
              loading="lazy"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Link>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle true mx-2"
                    id="navbarOverviewDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Products
                  </a>
                  <ul className="dropdown-menu py-2" aria-labelledby="navbarOverviewDropdown">
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('games'),
                      })}
                    >
                      <Link href="/games" legacyBehavior>
                        <a className="dropdown-item">Games</a>
                      </Link>
                    </li>
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('degens'),
                      })}
                    >
                      <Link href="/degens" legacyBehavior>
                        <a className="dropdown-item">DEGENs</a>
                      </Link>
                    </li>
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('niftyverse'),
                      })}
                    >
                      <Link href="/niftyverse" legacyBehavior>
                        <a className="dropdown-item">NiftyVerse</a>
                      </Link>
                    </li>
                    {/* <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('compete-and-earn'),
                      })}
                    >
                      <Link href="/compete-and-earn" legacyBehavior>
                        <a className="dropdown-item">Compete & Earn</a>
                      </Link>
                    </li> */}
                  </ul>
                </li>
                <li
                  className={cn('nav-item', {
                    ['active']: pathname.includes('roadmap'),
                  })}
                >
                  <Link href="/roadmap" legacyBehavior>
                    <a className="nav-link mx-2">Roadmap</a>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle true mx-2"
                    id="navbarAboutDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    About
                  </a>
                  <ul className="dropdown-menu py-2" aria-labelledby="navbarAboutDropdown">
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('overview'),
                      })}
                    >
                      <Link href="/overview" legacyBehavior>
                        <a className="dropdown-item">Overview / FAQ</a>
                      </Link>
                    </li>
                    {/* <li
                      className={cn('nav-item', { ['active']: pathname.includes('team') })}
                    >
                      <Link href="/team" legacyBehavior>
                        <a className="dropdown-item">Team</a>
                      </Link>
                    </li> */}
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('community'),
                      })}
                    >
                      <Link href="/community" legacyBehavior>
                        <a className="dropdown-item">Community</a>
                      </Link>
                    </li>
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('lore'),
                      })}
                    >
                      <Link href="/lore" legacyBehavior>
                        <a className="dropdown-item">Nifty Lore</a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/docs" legacyBehavior>
                        <a className="dropdown-item">
                          Docs <ExternalIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a href="/blog" className="dropdown-item" target="_blank" rel="noreferrer">
                        Blog <ExternalIcon />
                      </a>
                    </li>
                    {/* <li className="nav-item">
                      <a
                        href="https://maddies.co/official/nifty-league/"
                        className="dropdown-item"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Merch <ExternalIcon />
                      </a>
                    </li> */}
                    {/* <li className="nav-item">
                      <Link href="/shop" legacyBehavior>
                        <a className="dropdown-item">
                          Merch <ExternalIcon />
                        </a>
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link href="/contact" legacyBehavior>
                        <a className="dropdown-item" target="_blank" rel="noreferrer">
                          Contact <ExternalIcon />
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle true ms-2 me-3"
                    id="navbarDaoDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    DAO
                  </a>
                  <ul className="dropdown-menu py-2" aria-labelledby="navbarDaoDropdown">
                    <li className="nav-item">
                      <Link href="/docs/overview/nifty-dao/about" legacyBehavior>
                        <a className="dropdown-item">
                          Docs <ExternalIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/snapshot" legacyBehavior>
                        <a className="dropdown-item" target="_blank" rel="noreferrer">
                          Snapshot <ExternalIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/tally" legacyBehavior>
                        <a className="dropdown-item" target="_blank" rel="noreferrer">
                          Tally <ExternalIcon />
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <a href="https://app.niftyleague.com/" target="_blank" rel="noreferrer" className="launch-app-link">
                <button className="btn theme-btn-primary launch-app-btn">Launch App</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const linkList = [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/games',
      name: 'Games',
    },
    {
      href: '/degens',
      name: 'DEGENs',
    },
    {
      href: '/niftyverse',
      name: 'NiftyVerse',
    },
    {
      href: '/roadmap',
      name: 'Roadmap',
    },
    {
      href: '/overview',
      name: 'Overview / FAQ',
    },
    {
      href: '/community',
      name: 'Community',
    },
    // {
    //   href: '/team',
    //   name: 'Team',
    // },
    {
      href: '/lore',
      name: 'Nifty Lore',
    },
    {
      href: '/docs',
      name: 'Docs',
      external: true,
    },
    {
      href: '/tally',
      name: 'DAO - Tally',
      external: true,
    },
    {
      href: '/snapshot',
      name: 'DAO - Snapshot',
      external: true,
    },
    {
      href: '/blog',
      name: 'Blog',
      external: true,
    },
    // {
    //   href: 'https://maddies.co/official/nifty-league/',
    //   name: 'Merch',
    //   external: true,
    // },
    {
      href: '/shop',
      name: 'Merch',
      external: true,
    },
    {
      href: '/contact',
      name: 'Contact',
      external: true,
    },
  ];

  const toggleMenuOpen = () => {
    const newStateOpen = !menuOpen;
    setMenuOpen(newStateOpen);
    if (newStateOpen) {
      document.documentElement.classList.add('scrollDisabled');
    } else {
      document.documentElement.classList.remove('scrollDisabled');
    }
  };

  return (
    <div id="nav" className="py-2 mobile-nav align-items-center d-flex position-absolute">
      <>
        <input type="checkbox" id="toggle" style={{ display: 'none' }} />
        <label className="toggle-btn toggle-btn__cross" htmlFor="toggle" onClick={toggleMenuOpen}>
          {!menuOpen ? (
            <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
              <MenuIcon fontSize="small" />
              <p>MENU</p>
            </Stack>
          ) : (
            <CloseIcon sx={{ color: 'white' }} />
          )}
        </label>
      </>
      <a className="ms-auto launch-app-link" href="https://app.niftyleague.com/" target="_blank" rel="noreferrer">
        <button className="btn theme-btn-primary launch-app-btn my-2 ms-auto">Launch App</button>
      </a>

      <nav style={{ overflow: 'scroll', height: '104%' }}>
        <ul>
          {linkList.map(item => {
            return (
              <li key={item.href} onClick={toggleMenuOpen} className="mb-3">
                <Link href={item.href} legacyBehavior>
                  <a>
                    {item.name}
                    {item.external ? <ExternalIcon /> : ''}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default function Header() {
  const desktop = useMediaQuery('(min-width:768px)');

  useEffect(() => {
    const nav = document.getElementById('nav');
    const sticky = nav?.clientTop || 0;
    const fixOnScroll = () => {
      if (window.pageYOffset > sticky) {
        nav?.classList.add('fixed-top', 'dark-nav');
        nav?.classList.remove('position-absolute');
      } else {
        nav?.classList.remove('fixed-top', 'dark-nav');
        nav?.classList.add('position-absolute');
      }
    };
    window.addEventListener('scroll', fixOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', fixOnScroll);
    };
  }, [desktop]);

  return <header className="header fixed-top-header">{desktop ? <Navbar /> : <MobileNav />}</header>;
}
