import type { Metadata } from 'next';
import MainLayout from '@/components/MainLayout';
import { Error404 } from '@nl/ui/custom/Error404';

export const metadata: Metadata = { title: '404' };

const NotFoundPage = () => {
  return (
    <MainLayout>
      <Error404 />
    </MainLayout>
  );
};

export default NotFoundPage;
