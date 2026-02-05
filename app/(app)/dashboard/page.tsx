'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Shield, Zap, Ghost, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession(); 

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-500">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Ghost className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter">MysteryMessages</span>
        </div>
        <div className="flex gap-4">
         
          {!session ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center lg:py-32">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
              Dive into the World of{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Anonymous Feedback
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Mystery Messages is the ultimate platform for honest, unfiltered conversations. 
              Share your link, receive anonymous messages, and manage your identity with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {/* Session-aware Hero Buttons */}
              {!session ? (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" className="h-14 px-10 text-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/20">
                      Create Your Link
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-zinc-200 dark:border-zinc-800">
                      View Your Messages
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-10 text-lg bg-purple-600 hover:bg-purple-700 text-white">
                    Proceed to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        
      </main>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Mystery Messages. Built with passion for honest conversations.</p>
      </footer>
    </div>
  );
}