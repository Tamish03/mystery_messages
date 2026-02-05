'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Loader2, Ghost } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { signUpSchema } from '@/schemas/signUpSchema'; 
import { ApiResponse } from '@/types/ApiResponse'; 

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message as string);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            (axiosError.response?.data.message as string) ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      alert(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <div className="inline-flex p-3 bg-purple-600 rounded-xl mb-4">
            <Ghost className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">
            Join Mystery Messages
          </h1>
          <p className="mb-4 text-zinc-500">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="unique_username"
              {...form.register('username')}
              onChange={(e) => {
                form.setValue('username', e.target.value);
                debounced(e.target.value);
              }}
            />
            {isCheckingUsername && <Loader2 className="animate-spin w-4 h-4 mt-1" />}
            {!isCheckingUsername && usernameMessage && (
              <p className={`text-sm mt-1 ${usernameMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'}`}>
                {usernameMessage}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="you@example.com"
              {...form.register('email')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="********"
              {...form.register('password')}
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-zinc-500">
            Already a member?{' '}
            <Link href="/sign-in" className="text-purple-600 hover:text-purple-500 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


