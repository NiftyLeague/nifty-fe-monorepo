'use client';

import { RENTAL_RENAME_URL } from '@/constants/url';
import { useEffect, useState } from 'react';
import useAuth from './useAuth';

const useRentalRenameFee = (degenId: string | undefined): [boolean, boolean, number | undefined] => {
  const [loading, setLoading] = useState(true);
  const [rentalRenameFee, setRentalRenameFee] = useState<number>();
  const [error, setError] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    async function resolveRental() {
      if (!degenId || !authToken) {
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(RENTAL_RENAME_URL(degenId as string), {
          method: 'GET',
          headers: {
            authorizationToken: authToken,
          },
        });
        if (res.status === 404 || res.status === 401) {
          throw Error('Not Found');
        }
        const json = (await res.json()) as { price: number };
        setRentalRenameFee(json.price);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    // eslint-disable-next-line no-void
    void resolveRental();
  }, [degenId, authToken]);

  return [loading, error, rentalRenameFee];
};

export default useRentalRenameFee;
