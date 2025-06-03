import { RENTAL_RENAME_URL } from '@/constants/url';
import useAuth from './useAuth';

const useRentalRename = (
  degenId: string | undefined,
  rentalId: string | undefined,
  name: string | undefined,
): (() => Promise<void>) => {
  const { authToken } = useAuth();
  const rent = async () => {
    if (!authToken || !degenId || !rentalId || !name) {
      return;
    }

    const res = await fetch(RENTAL_RENAME_URL(rentalId), {
      method: 'POST',
      headers: { authorizationToken: authToken },
      body: JSON.stringify({ degen_id: degenId, name }),
    });
    if (res.status === 404) {
      throw Error('Not Found');
    }
  };

  return rent;
};

export default useRentalRename;
