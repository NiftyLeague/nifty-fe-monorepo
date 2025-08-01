import type { Metadata } from 'next';
import { Error404 } from '@nl/ui/custom/Error404';

export const metadata: Metadata = { title: '404' };

const NotFoundPage = () => {
  return <Error404 className="min-h-[75vh] overflow-auto" />;
};

export default NotFoundPage;
