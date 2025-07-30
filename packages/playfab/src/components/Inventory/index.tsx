import { formatNumberToDisplay } from '@nl/ui/utils';
import { useUserContext } from '../../hooks/useUserContext';
import { Input } from '@nl/ui/custom/Input';
import { Separator } from '@nl/ui/base/separator';

export default function Inventory() {
  const { currencies, isLoggedIn } = useUserContext();
  return isLoggedIn ? (
    <div className="grid gap-4">
      <fieldset>
        <div className="grid gap-2">
          <legend>Currencies</legend>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="T1"
              className="w-full text-center"
              type="text"
              value={`Brawl Bucks:  ${formatNumberToDisplay(currencies?.T1, 0)} `}
              disabled
            />
            <Input
              id="T2"
              className="w-full text-center"
              type="text"
              value={`Nifty Nuggets:  ${currencies?.T2 || 0} `}
              disabled
            />
          </div>
        </div>
      </fieldset>

      <Separator orientation="horizontal" />

      <fieldset>
        <div className="grid gap-2">
          <legend>Characters</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>coming soon...</div>
          </div>
        </div>
      </fieldset>

      <Separator orientation="horizontal" />

      <fieldset>
        <div className="grid gap-2">
          <legend>Items</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>coming soon...</div>
          </div>
        </div>
      </fieldset>
    </div>
  ) : null;
}
