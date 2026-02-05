'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2, Send } from 'lucide-react';

export default function SendMessage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const username = params.username;

  const handleMessageSubmit = async () => {
    if (!content) return;
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content,
      });
      alert(response.data.message);
      setContent('');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      alert(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white dark:bg-black rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send a Anonymous Message to @{username}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your anonymous message here..."
            className="w-full min-h-[120px] p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <div className="flex justify-center">
            <Button 
              onClick={handleMessageSubmit} 
              disabled={isLoading || !content}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Send It</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-zinc-500 text-sm">Want your own message board?</p>
        <Link href="/sign-up">
          <Button variant="link" className="mt-2">Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
