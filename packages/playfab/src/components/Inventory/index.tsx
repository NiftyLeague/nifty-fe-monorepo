import { useMemo } from 'react';
import { formatNumberToDisplay } from '@nl/ui/utils';
import { useUserContext } from '../../hooks/useUserContext';
import { Icon } from '@nl/ui/base/icon';
import { Input } from '@nl/ui/custom/input';
import { Separator } from '@nl/ui/base/separator';
import type { CharacterInstance, ItemInstance } from '@nl/playfab/types';

type Items = Record<'wearables' | 'weapons' | 'emotes' | 'items', ItemInstance[]>;
type Characters = Record<'nft_degens' | 'f2p_degens' | 'other_chars', CharacterInstance[]>;

export default function Inventory() {
  const { characters, currencies, inventory, isLoggedIn } = useUserContext();

  const { wearables, weapons, emotes } = useMemo(() => {
    const categorized: Items = { wearables: [], weapons: [], emotes: [], items: [] };
    inventory?.forEach(item => {
      switch (item.ItemClass) {
        case 'WearablesData':
          categorized.wearables.push(item);
          break;
        case 'WeaponTag':
          categorized.weapons.push(item);
          break;
        case 'EffectData':
          categorized.emotes.push(item);
          break;
        default:
          categorized.items.push(item);
          break;
      }
    });
    return categorized;
  }, [inventory]);

  const { nft_degens, f2p_degens, other_chars } = useMemo(() => {
    const categorized: Characters = { nft_degens: [], f2p_degens: [], other_chars: [] };
    characters?.forEach(char => {
      switch (char.CharacterType) {
        case 'degen_token':
          categorized.nft_degens.push(char);
          break;
        case 'degen_f2p':
          categorized.f2p_degens.push(char);
          break;
        default:
          categorized.other_chars.push(char);
          break;
      }
    });
    return categorized;
  }, [characters]);

  return isLoggedIn ? (
    <div className="grid gap-4">
      <fieldset>
        <div className="grid gap-2">
          <legend>Currencies</legend>
          <div className="grid grid-cols-3 gap-2">
            <Input
              id="T1"
              className="w-full text-center !opacity-100 !bg-purple/20 !text-purple-200"
              type="text"
              value={`Brawl Bucks: ${formatNumberToDisplay(currencies?.T1, 0)}`}
              disabled
              startIcon={<Icon name="receipt" className="text-purple-200" />}
            />
            <Input
              id="T2"
              className="w-full text-center !opacity-100 !bg-warning/20 !text-yellow-200"
              type="text"
              value={`Nifty Nuggets: ${formatNumberToDisplay(currencies?.T2, 0)}`}
              disabled
              startIcon={<Icon name="piggy-bank" className="text-yellow-200" />}
            />
            <Input
              id="CE"
              className="w-full text-center !opacity-100 !bg-success/20 !text-green-200"
              type="text"
              value={`Combat Essence: ${formatNumberToDisplay(currencies?.CE, 0)}`}
              disabled
              startIcon={<Icon name="flask-round" className="text-green-200" />}
            />
          </div>
        </div>
      </fieldset>

      <Separator orientation="horizontal" />

      <fieldset>
        <div className="grid gap-2">
          <legend>Items</legend>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="weapons"
              className="w-full text-center"
              type="text"
              value={`Weapons: ${weapons.length} `}
              disabled
              startIcon={<Icon name="axe" />}
            />
            <Input
              id="wearables"
              className="w-full text-center"
              type="text"
              value={`Wearables: ${wearables.length} `}
              disabled
              startIcon={<Icon name="medal" />}
            />
            <Input
              id="emotes"
              className="w-full text-center"
              type="text"
              value={`Emotes: ${emotes.length} `}
              disabled
              startIcon={<Icon name="laugh" />}
            />
          </div>
        </div>
      </fieldset>

      <Separator orientation="horizontal" />

      <fieldset>
        <div className="grid gap-2">
          <legend>Characters</legend>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="nft-degens"
              className="w-full text-center"
              type="text"
              value={`NFT Degens: ${nft_degens.length} `}
              disabled
              startIcon={<Icon name="shield-check" />}
            />
            <Input
              id="f2p-degens"
              className="w-full text-center"
              type="text"
              value={`F2P Degens: ${f2p_degens.length} `}
              disabled
              startIcon={<Icon name="cat" />}
            />
            <Input
              id="other-degens"
              className="w-full text-center"
              type="text"
              value={`Other: ${other_chars.length} `}
              disabled
              startIcon={<Icon name="panda" />}
            />
          </div>
        </div>
      </fieldset>
    </div>
  ) : null;
}
