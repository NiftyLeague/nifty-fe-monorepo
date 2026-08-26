import { useMemo } from 'react'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import { useUserContext } from '../../hooks/useUserContext'
import { Icon } from '@nl/ui/base/icon'
import { Separator } from '@nl/ui/base/separator'
import type { CharacterInstance, ItemInstance } from '@nl/playfab/types'
import DisplayField from '../DisplayField'

type Items = Record<'wearables' | 'weapons' | 'emotes' | 'items', ItemInstance[]>
type Characters = Record<'nft_degens' | 'f2p_degens' | 'other_chars', CharacterInstance[]>

export default function Inventory() {
  const { characters, currencies, inventory, isLoggedIn } = useUserContext()

  const { wearables, weapons, emotes } = useMemo(() => {
    const categorized: Items = { wearables: [], weapons: [], emotes: [], items: [] }
    inventory?.forEach((item) => {
      switch (item.ItemClass) {
        case 'WearablesData':
          categorized.wearables.push(item)
          break
        case 'WeaponTag':
          categorized.weapons.push(item)
          break
        case 'EffectData':
          categorized.emotes.push(item)
          break
        default:
          categorized.items.push(item)
          break
      }
    })
    return categorized
  }, [inventory])

  const { nft_degens, f2p_degens, other_chars } = useMemo(() => {
    const categorized: Characters = { nft_degens: [], f2p_degens: [], other_chars: [] }
    characters?.forEach((char) => {
      switch (char.CharacterType) {
        case 'degen_token':
          categorized.nft_degens.push(char)
          break
        case 'degen_f2p':
          categorized.f2p_degens.push(char)
          break
        default:
          categorized.other_chars.push(char)
          break
      }
    })
    return categorized
  }, [characters])

  return isLoggedIn ? (
    <div className="grid gap-4">
      <fieldset>
        <div className="grid gap-2">
          <legend>
            <h3 className="text-lg">Currencies</h3>
          </legend>
          <div className="grid grid-cols-3 gap-2">
            <DisplayField
              id="T1"
              value={formatNumberToDisplay(currencies?.T1, 0)}
              label="Brawl Bucks"
              className="w-full bg-purple/20"
              inputClassName="text-center !opacity-100 !text-purple-200"
              icon={<Icon name="receipt" className="text-purple-200" />}
            />
            <DisplayField
              id="T2"
              value={formatNumberToDisplay(currencies?.T2, 0)}
              label="Nifty Nuggets"
              className="w-full bg-warning/20"
              inputClassName="text-center !opacity-100 !text-yellow-200"
              icon={<Icon name="piggy-bank" className="text-yellow-200" />}
            />
            <DisplayField
              id="CE"
              value={formatNumberToDisplay(currencies?.CE, 0)}
              label="Combat Essence"
              className="w-full bg-success/20"
              inputClassName="text-center !opacity-100 !text-green-200"
              icon={<Icon name="flask-round" className="text-green-200" />}
            />
          </div>
        </div>
      </fieldset>

      <Separator orientation="horizontal" />

      <fieldset>
        <div className="grid gap-2">
          <legend>
            <h3 className="text-lg">Items</h3>
          </legend>
          <div className="grid grid-cols-3 gap-4">
            <DisplayField
              id="weapons"
              value={weapons.length}
              label="Weapons"
              className="w-full bg-blue/20"
              inputClassName="text-center !opacity-100 !text-blue-200"
              icon={<Icon name="axe" className="text-blue-200" />}
            />
            <DisplayField
              id="wearables"
              value={wearables.length}
              label="Wearables"
              className="w-full bg-blue/20"
              inputClassName="text-center !opacity-100 !text-blue-200"
              icon={<Icon name="medal" className="text-blue-200" />}
            />
            <DisplayField
              id="emotes"
              value={emotes.length}
              label="Emotes"
              className="w-full bg-blue/20"
              inputClassName="text-center !opacity-100 !text-blue-200"
              icon={<Icon name="laugh" className="text-blue-200" />}
            />
          </div>
        </div>
      </fieldset>

      <Separator orientation="horizontal" />

      <fieldset>
        <div className="grid gap-2">
          <legend>
            <h3 className="text-lg">Characters</h3>
          </legend>
          <div className="grid grid-cols-3 gap-4">
            <DisplayField
              id="nft-degens"
              value={nft_degens.length}
              label="NFT Degens"
              className="w-full bg-blue/20"
              inputClassName="text-center !opacity-100 !text-blue-200"
              icon={<Icon name="shield-check" className="text-blue-200" />}
            />
            <DisplayField
              id="f2p-degens"
              value={f2p_degens.length}
              label="F2P Degens"
              className="w-full bg-blue/20"
              inputClassName="text-center !opacity-100 !text-blue-200"
              icon={<Icon name="cat" className="text-blue-200" />}
            />
            <DisplayField
              id="other-degens"
              value={other_chars.length}
              label="Other"
              className="w-full bg-blue/20"
              inputClassName="text-center !opacity-100 !text-blue-200"
              icon={<Icon name="panda" className="text-blue-200" />}
            />
          </div>
        </div>
      </fieldset>
    </div>
  ) : null
}
