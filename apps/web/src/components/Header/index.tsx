'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ExternalIcon from '@/components/ExternalIcon';

import './header.css';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav id="nav" className="navbar row min-vw-100 p-0 zindex-fixed position-absolute navbar-expand-md m-0 desktop">
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
                      <Link href="/games" className="dropdown-item">
                        Games
                      </Link>
                    </li>
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('degens'),
                      })}
                    >
                      <Link href="/degens" className="dropdown-item">
                        DEGENs
                      </Link>
                    </li>
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('niftyverse'),
                      })}
                    >
                      <Link href="/niftyverse" className="dropdown-item">
                        NiftyVerse
                      </Link>
                    </li>
                    {/* <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('compete-and-earn'),
                      })}
                    >
                      <Link href="/compete-and-earn" className="dropdown-item">
                        Compete & Earn
                      </Link>
                    </li> */}
                  </ul>
                </li>
                <li
                  className={cn('nav-item', {
                    ['active']: pathname.includes('roadmap'),
                  })}
                >
                  <Link href="/roadmap" className="nav-link mx-2">
                    Roadmap
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
                      <Link href="/overview" className="dropdown-item">
                        Overview / FAQ
                      </Link>
                    </li>
                    {/* <li
                      className={cn('nav-item', { ['active']: pathname.includes('team') })}
                    >
                      <Link href="/team" className="dropdown-item">
                        Team
                      </Link>
                    </li> */}
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('community'),
                      })}
                    >
                      <Link href="/community" className="dropdown-item">
                        Community
                      </Link>
                    </li>
                    <li
                      className={cn('nav-item', {
                        ['active']: pathname.includes('lore'),
                      })}
                    >
                      <Link href="/lore" className="dropdown-item">
                        Nifty Lore
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/docs" className="dropdown-item">
                        Docs <ExternalIcon />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/blog" className="dropdown-item" target="_blank" rel="noreferrer">
                        Blog <ExternalIcon />
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      <Link
                        href="https://maddies.co/official/nifty-league/"
                        className="dropdown-item"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Merch <ExternalIcon />
                      </Link>
                    </li> */}
                    {/* <li className="nav-item">
                      <Link href="/shop" className="dropdown-item" target="_blank" rel="noreferrer">
                        Merch <ExternalIcon />
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link href="/contact" className="dropdown-item" target="_blank" rel="noreferrer">
                        Contact <ExternalIcon />
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
                      <Link
                        href="/docs/overview/nifty-dao/about"
                        className="dropdown-item"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Docs <ExternalIcon />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/snapshot" className="dropdown-item" target="_blank" rel="noreferrer">
                        Snapshot <ExternalIcon />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/tally" className="dropdown-item" target="_blank" rel="noreferrer">
                        Tally <ExternalIcon />
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <a href="https://app.niftyleague.com/" target="_blank" rel="noreferrer" className="launch_app_link">
                <button className="btn theme-btn-primary launch_app_btn">Launch App</button>
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
    <div id="nav" className="py-2 mobile_nav align-items-center d-flex position-absolute">
      <>
        <input type="checkbox" id="toggle" style={{ display: 'none' }} />
        <label className="toggle_btn toggle_btn__cross" htmlFor="toggle" onClick={toggleMenuOpen}>
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
      <a className="ms-auto launch_app_link" href="https://app.niftyleague.com/" target="_blank" rel="noreferrer">
        <button className="btn theme-btn-primary launch_app_btn my-2 ms-auto">Launch App</button>
      </a>

      <nav style={{ overflow: 'scroll', height: '104%' }}>
        <ul>
          {linkList.map(item => {
            return (
              <li key={item.href} onClick={toggleMenuOpen} className="mb-3">
                <Link href={item.href}>
                  {item.name}
                  {item.external ? <ExternalIcon /> : ''}
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
        nav?.classList.add('fixed-top', 'dark_nav');
        nav?.classList.remove('position-absolute');
      } else {
        nav?.classList.remove('fixed-top', 'dark_nav');
        nav?.classList.add('position-absolute');
      }
    };
    window.addEventListener('scroll', fixOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', fixOnScroll);
    };
  }, [desktop]);

  return <header className="header">{desktop ? <Navbar /> : <MobileNav />}</header>;
}
