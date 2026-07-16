import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GameCard from './cards/GameCard';
import MainCard from './cards/MainCard';
import SubCard from './cards/SubCard';
import AnimateButton from './extended/AnimateButton';
import Breadcrumbs from './extended/Breadcrumbs';
import Transitions from './extended/Transitions';

const themeState = vi.hoisted(() => ({ mode: 'light' as 'dark' | 'light' }));

vi.mock('@nl/theme', () => ({
  gridSpacing: 3,
  useTheme: () => ({ palette: { mode: themeState.mode }, spacing: (value: number) => `${value * 8}px` }),
}));
vi.mock('@nl/ui/base/icon', () => ({ Icon: ({ name }: { name: string }) => <span data-icon={name}>{name}</span> }));
vi.mock('@nl/ui/custom/external-icon', () => ({ ExternalIcon: () => <span>external</span> }));

afterEach(() => {
  themeState.mode = 'light';
  window.history.replaceState({}, '', '/');
});

describe('Breadcrumbs', () => {
  const navigation = {
    items: [
      {
        type: 'group',
        children: [
          {
            type: 'collapse',
            title: 'Settings',
            icon: 'settings',
            children: [{ type: 'item', title: 'Profile', icon: 'user', url: '/profile' }],
          },
        ],
      },
    ],
  };

  it('resolves nested routes and renders the full title and icon variants', async () => {
    window.history.replaceState({}, '', '/profile');
    const { rerender } = render(
      <Breadcrumbs navigation={navigation as never} card={false} icons rightAlign title separator="chevron-right" />,
    );

    expect(await screen.findAllByText('Profile')).toHaveLength(2);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getAllByText('chevron-right')).toHaveLength(2);

    rerender(
      <Breadcrumbs navigation={navigation as never} card={false} divider={false} icon title titleBottom maxItems={3} />,
    );
    expect(screen.getByText('house')).toBeInTheDocument();
    expect(screen.getAllByText('Profile')).toHaveLength(2);
  });

  it('omits the card when an item disables breadcrumbs or no route matches', async () => {
    window.history.replaceState({}, '', '/hidden');
    const hiddenNavigation = {
      items: [
        {
          type: 'group',
          children: [
            { type: 'collapse', children: [{ type: 'item', title: 'Hidden', url: '/hidden', breadcrumbs: false }] },
          ],
        },
      ],
    };
    const { container, rerender } = render(<Breadcrumbs navigation={hiddenNavigation as never} />);
    await Promise.resolve();
    expect(container.querySelector('[aria-label="breadcrumb"]')).not.toBeInTheDocument();

    window.history.replaceState({}, '', '/missing');
    rerender(<Breadcrumbs navigation={navigation as never} />);
    expect(container.querySelector('[aria-label="breadcrumb"]')).not.toBeInTheDocument();
  });
});

describe('animated presentation helpers', () => {
  it.each([
    ['grow', 'top-left'],
    ['collapse', 'top-right'],
    ['fade', 'top'],
    ['slide', 'bottom-left'],
    ['zoom', 'bottom-right'],
    ['grow', 'bottom'],
  ])('renders the %s transition from %s', (type, position) => {
    render(
      <Transitions type={type} position={position} in direction="down">
        <div>{type}</div>
      </Transitions>,
    );
    expect(screen.getByText(type)).toBeInTheDocument();
  });

  it.each([
    ['rotate', 'right'],
    ['slide', 'up'],
    ['slide', 'left'],
    ['slide', 'right'],
    ['scale', 'down'],
  ] as const)('renders %s animation moving %s', (type, direction) => {
    const { container } = render(
      <AnimateButton type={type} direction={direction} scale={type === 'scale' ? { hover: 0.8, tap: 0.8 } : undefined}>
        <button>Animate</button>
      </AnimateButton>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    expect(screen.getByRole('button', { name: 'Animate' })).toBeInTheDocument();
  });
});

describe('card presentation', () => {
  it('renders all MainCard and SubCard content modes in light and dark themes', () => {
    const { rerender } = render(
      <MainCard title="Main" secondary="Action" boxShadow shadow="custom-shadow">
        Main body
      </MainCard>,
    );
    expect(screen.getByText('Main body')).toBeInTheDocument();

    themeState.mode = 'dark';
    rerender(
      <MainCard title="Dark main" darkTitle border={false} boxShadow content={false}>
        Raw body
      </MainCard>,
    );
    expect(screen.getByText('Raw body')).toBeInTheDocument();

    rerender(
      <SubCard title="Sub" secondary="Action">
        Sub body
      </SubCard>,
    );
    expect(screen.getByText('Sub body')).toBeInTheDocument();

    rerender(
      <SubCard title="Dark sub" darkTitle content={false}>
        Raw sub body
      </SubCard>,
    );
    expect(screen.getByText('Raw sub body')).toBeInTheDocument();
  });

  it('renders game calls to action, expands descriptions, and supports custom content', () => {
    const desktop = vi.fn();
    const web = vi.fn();
    const { rerender } = render(
      <GameCard
        title="Smashers"
        image="/smashers.png"
        description="A long description"
        externalLink={{ title: 'Guide', src: '/guide' }}
        isComingSoon
        required="Wallet required"
        showMore
        onPlayOnDesktopClick={desktop}
        onPlayOnWebClick={web}
      />,
    );
    fireEvent.click(screen.getByText('more..'));
    fireEvent.click(screen.getByRole('button', { name: 'Play on Desktop' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play on Web' }));
    expect(desktop).toHaveBeenCalledOnce();
    expect(web).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: /Guide/ })).toHaveAttribute('href', '/guide');

    rerender(<GameCard title="Custom" image="/custom.png" autoHeight contents={<div>Custom content</div>} />);
    expect(screen.getByText('Custom content')).toBeInTheDocument();

    rerender(<GameCard title="Actions" image="/actions.png" actions={<button>Custom action</button>} />);
    expect(screen.getByRole('button', { name: 'Custom action' })).toBeInTheDocument();
  });
});
