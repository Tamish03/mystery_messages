'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Message = {
  _id: string;
  content: string;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [isTogglingAccept, setIsTogglingAccept] = useState(false);

  const username = session?.user?.username;
  const profileLink = useMemo(
    () => (username ? `/u/${username}` : null),
    [username]
  );

  const loadMessages = async (showToast = false) => {
    try {
      if (showToast) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const res = await fetch('/api/get-messages');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch messages');
      }
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      if (showToast) toast.success('Messages refreshed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch messages';
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadAcceptingStatus = async () => {
    try {
      const res = await fetch('/api/accept-messages');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch status');
      }
      setIsAcceptingMessages(Boolean(data.isAcceptingMessages));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch status';
      toast.error(message);
    }
  };

  const toggleAccepting = async () => {
    try {
      setIsTogglingAccept(true);
      const res = await fetch('/api/accept-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptMessages: !isAcceptingMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update setting');
      }
      setIsAcceptingMessages(Boolean(data.updatedUser?.isAcceptingMessages));
      toast.success('Message setting updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update setting';
      toast.error(message);
    } finally {
      setIsTogglingAccept(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/delete-message/${messageId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete message');
      }
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete message';
      toast.error(message);
    }
  };

  useEffect(() => {
    loadAcceptingStatus();
    loadMessages();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-zinc-500">Manage your anonymous inbox and profile link.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {profileLink ? (
              <Link href={profileLink}>
                <Button variant="outline">View Public Link</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Public Link Unavailable
              </Button>
            )}
            <Button onClick={() => loadMessages(true)} disabled={isRefreshing}>
              {isRefreshing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refreshing</>
              ) : (
                <><RefreshCw className="mr-2 h-4 w-4" /> Refresh</>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accepting New Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              {isAcceptingMessages
                ? 'You are currently accepting anonymous messages.'
                : 'You have paused new messages.'}
            </p>
            <Button onClick={toggleAccepting} disabled={isTogglingAccept}>
              {isTogglingAccept ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating</>
              ) : (
                isAcceptingMessages ? 'Pause Messages' : 'Accept Messages'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <p className="text-zinc-500">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-zinc-400">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                        <p className="mt-2 text-base text-zinc-800 dark:text-zinc-100">
                          {message.content}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMessage(message._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
