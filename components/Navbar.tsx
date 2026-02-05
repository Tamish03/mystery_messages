'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Ghost, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Ghost className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tighter">MysteryMessages</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="hidden md:inline-block text-sm font-medium text-zinc-500">
              Welcome, <span className="text-purple-600">{user?.username || user?.email}</span>
            </span>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
