'use client';

import { Button } from '@/components/ui/button';
import { verifySchema } from '@/schemas/verifySchema'; //
import { ApiResponse } from '@/types/ApiResponse'; //
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.verifyToken,
      });

      alert(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? 'An error occurred during verification');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4">
            Verify Your Account
          </h1>
          <p className="mb-4 text-zinc-500">Enter the verification code sent to your email</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Verification Code</label>
            <input
              className="w-full p-4 text-center text-2xl tracking-[1em] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="000000"
              {...form.register('verifyToken')}
            />
            {form.formState.errors.verifyToken && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.verifyToken.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg">
            Verify Account
          </Button>
        </form>
      </div>
    </div>
  );
}