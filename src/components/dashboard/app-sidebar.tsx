'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  HeartPulse,
  LogOut,
} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Button} from '../ui/button';
import {PlaceHolderImages} from '@/lib/placeholder-images';

const navItems = [
  {href: '/', label: 'Dashboard', icon: LayoutDashboard},
  {href: '/patients', label: 'Patients', icon: Users},
  {href: '/appointments', label: 'Appointments', icon: CalendarDays},
];

const doctorAvatar = PlaceHolderImages.find(img => img.id === 'doctor_avatar');

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10 p-2 rounded-full text-sidebar-primary hover:bg-sidebar-accent"
            aria-label="HealPlus Home"
          >
            <HeartPulse className="h-6 w-6" />
          </Button>
          <span className="text-lg font-semibold text-sidebar-foreground">
            HealPlus
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href)
                  }
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50"
              role="button"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={doctorAvatar?.imageUrl}
                  alt="Dr. Smith"
                  data-ai-hint={doctorAvatar?.imageHint}
                />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium">Dr. Smith</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Practitioner
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
