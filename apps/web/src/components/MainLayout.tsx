import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout({ children, classes }: { children: React.ReactNode; classes?: { root?: string } }) {
  return (
    <>
      <Navbar />
      <main className={classes?.root}>{children}</main>
      <Footer />
    </>
  );
}
