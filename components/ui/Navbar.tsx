'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { User } from 'next-auth';
import { Ghost, LogOut, LayoutDashboard } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-sm border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <Ghost className="text-white w-5 h-5" />
          </div>
          Mystery Message
        </Link>
        
        {session ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-zinc-600 dark:text-zinc-400">
              Welcome, <span className="font-semibold text-purple-600">{user.username || user.email}</span>
            </span>
            <Link href="/dashboard">
                <Button variant="outline" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;