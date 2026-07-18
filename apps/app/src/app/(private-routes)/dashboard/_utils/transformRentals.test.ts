import { beforeEach, describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';

let transformRentals: typeof import('./transformRentals').transformRentals;

beforeEach(async () => {
  mock.module('uuid', () => ({ v4: mock(() => 'generated-id') }));
  mock.module('@/hooks/useLocalStorage', () => ({
    default: mock(() => [{ length: 1, '0xplayer': 'Known Player' }, mock()]),
  }));

  const transformModule = await import('./transformRentals');
  transformRentals = transformModule.transformRentals;
});

const viewer = 'viewer';

function rental(overrides: Record<string, unknown>) {
  return {
    id: 'rental-1',
    renter_id: viewer,
    user_id: viewer,
    degen_id: '42',
    name_cased: 'Hydra #42',
    degen: { multiplier: 2, tribe: 'hydra', background: 'jungle' },
    earning_cap: 1_000,
    earning_cap_daily: 100,
    stats: {
      total: {
        wins: 2,
        matches: 4,
        earnings: 80,
        charges: 30,
        time_played: 0,
        earnings_owner: 0,
        earnings_player: 0,
        earnings_renter: 0,
      },
    },
    next_charge_at: '',
    is_active: true,
    is_terminated: false,
    accounts: {
      owner: { id: 'owner', address: '0xowner', name: '' },
      player: { id: 'player', address: '0xplayer', name: '' },
    },
    entry_price: 10,
    daily_price: 3,
    is_daily: true,
    shares: { owner: 0.4, player: 0.4, renter: 0.2 },
    item_used: undefined,
    ...overrides,
  };
}

describe('transformRentals', () => {
  it('classifies all viewer relationships and calculates rental economics', () => {
    const rows = [
      rental({
        accounts: { owner: { id: 'owner' }, player: { id: viewer, address: '0xplayer' } },
        item_used: 'rental-pass-base',
      }),
      rental({ accounts: { owner: { id: viewer }, player: { id: 'player', address: '0xplayer' } } }),
      rental({ accounts: { owner: { id: 'owner' }, player: { id: 'player', address: '0xplayer' } } }),
      rental({ renter_id: 'other', accounts: { owner: { id: 'owner' }, player: { id: viewer, address: '0xplayer' } } }),
      rental({
        renter_id: 'other',
        accounts: { owner: { id: viewer }, player: { id: 'player', address: '0xplayer', name: 'Renter' } },
      }),
    ];

    const result = transformRentals(rows as never, viewer);
    expect(result.map(row => row.category)).toEqual([
      'direct-rental',
      'owned-sponsorship',
      'non-owned-sponsorship',
      'recruited',
      'direct-renter',
    ]);
    expect(result[0]).toMatchObject({
      id: 'generated-id',
      weeklyFee: 0,
      dailyFee: 3,
      costs: 30,
      winRate: 50,
      timePlayed: '00:00:00',
      action: false,
    });
    expect((result[1] as unknown as { isEditable?: boolean }).isEditable).toBe(true);
    expect(result[3]?.playerNickname).toBe('Known Player');
    expect(result[4]).toMatchObject({ renter: 'Renter', rentalRenewsIn: 'N/A', dailyFeesToDate: 0 });
  });

  it('uses safe fallbacks for optional rental data and inactive records', () => {
    const row = rental({
      renter_id: 'other',
      is_active: false,
      is_daily: false,
      shares: { owner: 0, player: 0 },
      stats: { total: { wins: 0, matches: 0, earnings: 0, charges: 0, time_played: 0 } },
      accounts: { owner: { id: 'owner' }, player: { id: 'player', address: '', name: '' } },
      degen: { multiplier: 1, tribe: '', background: '' },
    });

    expect(transformRentals([row] as never, viewer)[0]).toMatchObject({
      renter: 'No address',
      playerNickname: 'No nickname',
      dailyFee: 0,
      matches: 0,
      wins: 0,
      winRate: 0,
      action: true,
    });
  });
});
