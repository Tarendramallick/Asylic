'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Briefcase,
  Upload,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { href: '/creator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/creator/campaigns', label: 'Campaigns', icon: Briefcase },
  { href: '/creator/uploads', label: 'My Uploads', icon: Upload },
  { href: '/creator/notifications', label: 'Notifications', icon: Bell },
  { href: '/creator/settings', label: 'Settings', icon: Settings },
];

export function CreatorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg border border-border bg-background p-2"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-border bg-card transition-transform md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link href="/creator/dashboard" className="mb-8 flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
              IH
            </div>
            <span className="font-bold text-lg text-foreground">Hub</span>
          </Link>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start ${
                      isActive ? 'bg-primary text-white' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
