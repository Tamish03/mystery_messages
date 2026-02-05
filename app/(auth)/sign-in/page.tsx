'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, Ghost, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    setAuthError(null); // Reset error state
    
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setIsSubmitting(false);
      if (result.error === 'CredentialsSignin') {
        setAuthError('Incorrect email or password');
      } else {
        setAuthError(result.error);
      }
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

        {/* Global Auth Error Display */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {authError}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Email Address</label>
            <input
              type="email"
              className={`w-full p-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                form.formState.errors.email ? 'border-red-500 ring-red-100' : 'border-zinc-200 dark:border-zinc-800'
              }`}
              placeholder="email@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Password</label>
            <input
              type="password"
              className={`w-full p-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                form.formState.errors.password ? 'border-red-500 ring-red-100' : 'border-zinc-200 dark:border-zinc-800'
              }`}
              placeholder="********"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg shadow-lg shadow-purple-500/20" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                Verifying...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-zinc-500 text-sm">
            Not a member? <Link href="/sign-up" className="text-purple-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
