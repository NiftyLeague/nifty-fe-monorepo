import { RENT_URL } from '@/constants/url';
import type { MyRental } from '@/types/rental';
import useAuth from './useAuth';

const useRent = (
  degenId: string | undefined,
  position: number,
  price: number | undefined,
  address: string,
  isUseRentalPass: boolean,
): (() => Promise<MyRental | undefined>) => {
  const { authToken } = useAuth();
  const rent = async (): Promise<MyRental | undefined> => {
    if (!authToken || !degenId || !price) {
      return undefined;
    }

    const res = await fetch(RENT_URL, {
      method: 'POST',
      headers: { authorizationToken: authToken },
      body: JSON.stringify({
        degen_id: degenId,
        position,
        price,
        address,
        use_item: isUseRentalPass ? 'rental-pass-base' : undefined,
      }),
    });
    if (res.status === 404) {
      throw Error('Not Found');
    }
    if (res.status === 200) {
      const json = await res.json();
      if (json.statusCode === 400) {
        throw Error(json.body);
      }
      return json as MyRental;
    }
    throw Error('Something wrong!');
  };

  return rent;
};

export default useRent;
