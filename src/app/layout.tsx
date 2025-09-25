import type {Metadata} from 'next';
import './globals.css';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/dashboard/app-sidebar';
import {Header} from '@/components/dashboard/header';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'HealPlus',
  description: 'AI-Powered Wound Care Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar variant="inset" side="left" collapsible="icon">
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            <Header />
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
