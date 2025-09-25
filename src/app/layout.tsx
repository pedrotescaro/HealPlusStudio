import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { AppProvider } from '@/contexts/app-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({subsets: ['latin'], variable: '--font-body'});

export const metadata: Metadata = {
  title: 'Heal+',
  description: 'Cuidado aprimorado para feridas crônicas por telessaúde.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased', inter.variable)} suppressHydrationWarning>
        <AppProvider>
          <FirebaseClientProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </FirebaseClientProvider>
        </AppProvider>
      </body>
    </html>
  );
}
