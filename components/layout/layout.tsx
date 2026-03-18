import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';

interface User {
  name: string;
  email: string;
}

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
  hideHeader?: boolean;
}

export const Layout = ({ children, user, hideHeader }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen gradient-soft flex-col">
      {!hideHeader && <Header user={user} />}
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};
