import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function NotFound404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid gap-2 p-12 text-center">
        <Image
          src="/images/404.svg"
          width={320}
          height={320}
          alt="404 Illustration"
        />
        <Link href="https://storyset.com/web" className="text-xs">
          Web illustrations by Storyset
        </Link>
      </div>

      <div className="grid gap-6 text-center">
        <div className="grid gap-2">
          <h3>Page not Found</h3>
          <p>It&apos;s Okay!</p>
        </div>

        <div>
          <Link href="/" className="hover:underline">
            Let&apos;s Go Back
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound404;