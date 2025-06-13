import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@nl/ui/lib/utils';

export default function Layout({ children, classes }: { children: React.ReactNode; classes?: { root?: string } }) {
  return (
    <div className={cn('p-0', classes?.root)}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
