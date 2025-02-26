'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from './ui/mode-toggle';
import { LogOut } from 'lucide-react';

function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="z-50 fixed w-full bg-white dark:bg-black shadow-md dark:shadow-[#222] transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="h-10 w-10">
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
          </div>
          {session ? (
            <>
              <div className='flex items-center gap-4'>
                <ModeToggle />
              
              <Button onClick={() => signOut()}  variant='outline'>
                <LogOut/>
                Logout
              </Button>
              </div>
            </>
          ) : (
            <div className='flex gap-2'>
              <div className='mr-2'>
                <ModeToggle />
              </div>
              <Link href="/sign-in">
                <Button variant="default">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;