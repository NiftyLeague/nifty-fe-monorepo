import { TERMINATE_RENTAL_API_URL } from '@/constants/url';
import useAuth from './useAuth';

const useTeminateRental = () => {
  const { authToken } = useAuth();
  const terminalRental = async (rentalId: string | undefined) => {
    if (!authToken || !rentalId) {
      return;
    }

    const res = await fetch(`${TERMINATE_RENTAL_API_URL}?${new URLSearchParams({ id: rentalId })}`, {
      method: 'POST',
      headers: { authorizationToken: authToken },
    });
    return res;
  };

  return terminalRental;
};

export default useTeminateRental;
