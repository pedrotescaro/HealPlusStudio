'use client';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {usePathname} from 'next/navigation';

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/patients/')) return 'Patient Details';
  if (pathname.startsWith('/patients')) return 'Patients';
  if (pathname.startsWith('/appointments')) return 'Appointments';
  return 'HealPlus';
};

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        {/* The page title is now rendered within the page component itself for better context */}
      </div>
    </header>
  );
}
