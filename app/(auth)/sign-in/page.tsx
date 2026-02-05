'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, Ghost } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      alert(result.error === 'CredentialsSignin' ? 'Incorrect username or password' : result.error);
      setIsSubmitting(false);
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <div className="inline-flex p-3 bg-purple-600 rounded-xl mb-4">
            <Ghost className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">Welcome Back</h1>
          <p className="mb-4 text-zinc-500">Sign in to manage your mystery messages</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email or Username</label>
            <input
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="email@example.com"
              {...form.register('identifier')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="••••••••"
              {...form.register('password')}
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-zinc-500">
            Not a member? <Link href="/sign-up" className="text-purple-600 font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}