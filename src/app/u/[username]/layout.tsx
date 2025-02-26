import Navbar from '@/components/Navbar';
import { BackgroundBeams } from '@/components/ui/background-beams';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
        <BackgroundBeams/>
      {children}
    </div>
  );
}