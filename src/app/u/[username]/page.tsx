'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { BackgroundBeams } from '@/components/ui/background-beams';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

const specialChar = '||';
const fallbackQuestions = [
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
];

const parseStringMessages = (messageString: string): string[] => {
  // Clean the string first
  const cleaned = messageString
    .replace(/[“”‘’]/g, '') // Remove fancy quotes
    .replace(/\s*\|\|\s*/g, '||') // Normalize separators
    .trim();

  const questions = cleaned.split('||')
    .map(q => {
      let question = q.trim();
      if (!question.endsWith('?')) question += '?';
      return question;
    })
    .filter(q => q.length > 5);

  return questions.length > 0 ? questions : fallbackQuestions;
};


export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [suggestions, setSuggestions] = useState<string[]>(fallbackQuestions);


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      const parsed = parseStringMessages(data.content);
      setIsSuggestLoading(false);
      setSuggestions(parsed);
      toast({
        title: 'New suggestions loaded',
        variant: 'default',
      });
      
    } catch (error) {
      setIsSuggestLoading(false);
      setSuggestions(fallbackQuestions);
      toast({
        title: 'Failed to load suggestions',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
    <div className='flex justify-between items-center px-4 py-2 z-50'>
    <Link href="/">
            {mounted && (
              <>
                <Image
                  src="/light-logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className={`block ${resolvedTheme === 'dark' ? 'hidden' : 'block'}`}
                />
                <Image
                  src="/dark-logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className={`block ${resolvedTheme === 'dark' ? 'block' : 'hidden'}`}
                />
              </>
            )}
            </Link>
            <ModeToggle />
    </div>

      <div className=" z-50 container mx-auto my-8 p-6 rounded max-w-4xl">
       
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none focus:outline-none focus:shadow-xl focus:shadow-[rgba(0,255,255)] dark:focus:bg-[#111] focus:bg-[#f0f0f0] duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  <Rocket/>Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-8">
          <div className="space-y-2">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4"
              disabled={isSuggestLoading}
            >
              {
                isSuggestLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )
              }
              Suggest Messages
            </Button>
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
  {suggestions.map((message, index) => (
    <Button
      key={index}
      variant="outline"
      className="mb-2 text-left h-auto whitespace-normal"
      onClick={() => handleMessageClick(message)}
    >
      {message}
    </Button>
  ))}
</CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>


      </div>
    </>

  );
}