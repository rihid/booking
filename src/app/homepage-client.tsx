'use client';

import React from 'react';
import Logo from '@/components/ui/logo';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function HomePage() {
  const router = useRouter();

  const [redirect, setRedirect] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/explore');
    }, 5000);

    return () => clearTimeout(timer); // clear after unmount
  }, [router]);

  return (
    <div
      className="flex flex-col justify-between items-center min-h-screen bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.5)), url(/images/leading.png)',
        backgroundPosition: 'center center'
      }}
    >
      <div className="mt-10">
        <Logo />
      </div>
      <div className="mx-10 mb-20">
        <div className="flex items-center mt-4">
          <div className="w-4 my-2 self-stretch bg-brand"></div>
          <Heading variant="xl" className="uppercase py-0 text-background ml-4">The Ultimate Island Hoping Experience</Heading>
        </div>
        <div className="flex items-center mt-4">
          <div className="w-2.5 self-stretch bg-transparent"></div>
          <Link href="/login" className="block">
            <Button className="bg-brand hover:bg-brand/90 font-semibold text-[15px] ml-4 rounded">Get Started</Button>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default HomePage;