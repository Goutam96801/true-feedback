import Link from "next/link";
import { Cog } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        {/* <WrenchIcon className="mx-auto h-12 w-12 text-primary" /> */}
        <Cog className="mx-auto h-12 w-12 text-primary"/>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Application in Development</h1>
        <p className="mt-4 text-muted-foreground">
          We are currently working hard to bring you an amazing new application. Please check back soon for updates on its
          release.
        </p>
        <div className="mt-6">
          <Link
            href="#"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Check Back Later
          </Link>
        </div>
      </div>
      </div>
    </main>
  );
}
