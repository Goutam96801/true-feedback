'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from './ui/mode-toggle';
import { BookDashedIcon, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

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

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-4 py-4">
                  <ModeToggle />
                  {session ? (
                    <div className='flex flex-col gap-2'>
                      <Button variant="default" className=''>
                        <Link href="/dashboard" className='flex items-center'>
                        <LayoutDashboard className="mr-2 h-4 w-4"/> Dashboard
                        </Link>
                      </Button>
                    <Button onClick={() => signOut()} variant="outline" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                    </div>
                  ) : (
                    <>
                      <Link href="/sign-in" className="w-full">
                        <Button variant="default" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/sign-up" className="w-full">
                        <Button variant="outline" className="w-full">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          {session ? (
            <div className="hidden sm:flex items-center gap-4">
              <Button variant="link"><Link href="/dashboard">Dashboard</Link></Button>
              <ModeToggle />
              <Button onClick={() => signOut()} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <div className="mr-2">
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