import type { Metadata } from 'next';
import BackButton from '@/components/Header/BackButton';
import { Error404 } from '@nl/ui/custom/error-404';

export const metadata: Metadata = { title: '404' };

const NotFoundPage = () => {
  return (
    <>
      <BackButton />
      <Error404 />
    </>
  );
};

export default NotFoundPage;
