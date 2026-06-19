'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/auth-helpers-nextjs';
import {
  Upload,
  Briefcase,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  userEmail?: string;
  userName?: string;
}

export function Sidebar({ userEmail = 'user@example.com', userName = 'User' }: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const navItems = [
    { icon: Upload, label: 'Upload CV', href: '/dashboard' },
    { icon: Briefcase, label: 'Matched Jobs', href: '/dashboard/jobs' },
    { icon: User, label: 'My Profile', href: '#profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col fixed left-0 top-0 h-screen bg-navy-900 border-r border-gray-800 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold shimmer-text">CareerAI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = false; // You can enhance this with routing
            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-100 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-all disabled:opacity-50"
          >
            <LogOut size={16} />
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-gray-800 flex items-center justify-around p-2 z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </nav>
    </>
  );
}
