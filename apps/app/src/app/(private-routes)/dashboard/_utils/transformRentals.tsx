import type { Rentals, RentalType } from '@/types/rentals';
import { areEqualArrays } from '@/utils/array';
import { capitalize } from '@/utils/string';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '@/hooks/useLocalStorage';
import { RentalDataGrid } from '@/types/rentalDataGrid';
import { formatTime } from '@/utils/dateTime';

export const transformRentals = (rows: Rentals[], userId: string, filterCategory?: RentalType): RentalDataGrid[] =>
  rows.map(
    ({
      id,
      renter_id,
      user_id,
      degen_id,
      name_cased,
      degen: { multiplier, tribe, background },
      earning_cap,
      earning_cap_daily,
      stats: {
        total: { wins, matches, earnings, charges, time_played, earnings_owner, earnings_player, earnings_renter },
      },
      next_charge_at,
      is_active,
      is_terminated,
      accounts,
      entry_price,
      daily_price,
      is_daily,
      shares,
      item_used,
    }) => {
      const amIRenter = userId === renter_id;
      const amIOwner = userId === accounts.owner.id;
      const amIPlayer = userId === accounts.player.id;
      const whoAmI = [amIRenter, amIOwner, amIPlayer];

      const isOwnedSponsor = areEqualArrays(whoAmI, [true, true, false]);
      const isNonOwnedSponsor = areEqualArrays(whoAmI, [true, false, false]);
      const isDirectRenter = areEqualArrays(whoAmI, [true, false, true]); // Direct Renter
      const isRental = areEqualArrays(whoAmI, [false, true, false]); // Direct Rental
      const isRecruit = areEqualArrays(whoAmI, [false, false, true]); // Recruited

      const yourEarnings = 0;
      let category: string = 'direct-renter';
      let rentalCategory: string = 'Direct Renter';
      let player: string = 'Myself';
      let isEditable = false;
      let weeklyFee = entry_price;
      const dailyFee = is_daily ? daily_price : 0;

      const shareRenter = shares?.renter || 0;

      if (isDirectRenter) {
        category = 'direct-rental';
        rentalCategory = 'Direct Rental';
        player = 'Myself';
        isEditable = false;
      } else if (isOwnedSponsor) {
        category = 'owned-sponsorship';
        rentalCategory = 'Owned Sponsorship';
        player = 'Recruit';
        isEditable = true;
      } else if (isNonOwnedSponsor) {
        category = 'non-owned-sponsorship';
        rentalCategory = 'Non-Owned Sponsorship';
        player = 'Recruit';
        isEditable = true;
      } else if (isRecruit) {
        category = 'recruited';
        rentalCategory = 'Recruited';
        player = 'Myself';
        isEditable = false;
      } else if (isRental) {
        category = 'direct-renter';
        rentalCategory = 'Direct Renter';
        player = 'Renter';
        isEditable = true;
      }

      if (item_used && item_used === 'rental-pass-base') {
        weeklyFee = 0;
      }

      const [nicknames] = useLocalStorage<{
        [address: string]: string;
      }>('player-nicknames', {});

      const costs = amIRenter ? charges : 0;
      const rentalFeeEarning = amIOwner ? entry_price * 0.45 + (charges - entry_price) * 0.1 : 0;

      const netGameEarning =
        earnings *
        (shares.owner * Number(amIOwner) + shares.player * Number(amIPlayer) + shareRenter * Number(amIRenter));

      const netEarning = netGameEarning + rentalFeeEarning - costs;
      const roi = amIRenter ? (netEarning / costs) * 100 : 0;

      return {
        id: uuidv4(), // Change the id to uuid because it is not unique
        rentalId: id,
        renter: accounts?.player?.name || 'No address',
        playerAddress: accounts?.player?.address,
        playerNickname: isDirectRenter
          ? 'Myself'
          : (accounts?.player?.address && nicknames?.length && nicknames[accounts.player.address]) || 'No nickname',
        rentalName: name_cased,
        category,
        rentalCategory,
        player,
        degenId: degen_id,
        multiplier,
        background: capitalize(background) || '',
        tribe: capitalize(tribe) || '',
        matches: matches || 0,
        wins: wins || 0,
        winRate: Number(wins) > 0 && Number(matches) > 0 ? (Number(wins) / Number(matches)) * 100 : 0,
        timePlayed: formatTime(time_played),
        totalEarnings: earnings,
        yourEarnings: yourEarnings || 0,
        costs,
        profits: earnings,
        roi,
        rentalRenewsIn: next_charge_at || 'N/A',
        action: is_terminated || !is_active,
        weeklyFee,
        dailyFee,
        dailyFeesToDate: amIRenter ? charges - entry_price : 0,
        rentalFeeEarning,
        netEarning,
        netGameEarning,
        isEditable,
        earningCap: earning_cap,
        earningCapDaily: earning_cap_daily,
      } as RentalDataGrid;
    },
  );
