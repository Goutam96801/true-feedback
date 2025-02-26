'use client';

import { BackgroundLines } from '@/components/ui/background-lines';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

const messages = [
    {
      "title": "Message from User123",
      "content": "Hey, how are you doing today?",
      "received": "10 minutes ago"
    },
    {
      "title": "Message from SecretAdmirer",
      "content": "I really liked your recent post!",
      "received": "2 hours ago"
    },
    {
      "title": "Message from MysteryGuest",
      "content": "Do you have any book recommendations?",
      "received": "1 day ago"
    }
  ]
  

export default function Home() {
    return (
        <>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                Dive into the World of Anonymous Feedback
                </h2>
                <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
                True Feedback - Where your identity remains a secret.
                </p>

                <InfiniteMovingCards
        items={messages}
        direction="right"
        speed="slow"
      />
            </BackgroundLines>
            
              

            {/* Footer */}
            {/* <footer className="text-center p-4 md:p-6 ">
                © 2023 True Feedback. All rights reserved.
            </footer> */}
        </>
    );
}