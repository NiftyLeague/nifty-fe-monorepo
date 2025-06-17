import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout({ children, classes }: { children: React.ReactNode; classes?: { root?: string } }) {
  return (
    <>
      <Header />
      <main className={classes?.root}>{children}</main>
      <Footer />
    </>
  );
}
