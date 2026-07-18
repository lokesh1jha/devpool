import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">
        <Navbar />
        <div className="flex flex-col w-full px-5 flex-1">{children}</div>
        <div className="w-full px-5">
          <Footer />
        </div>
      </div>
    </main>
  );
}
