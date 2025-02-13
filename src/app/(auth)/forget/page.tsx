import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button/button';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import HeaderImageStatic from '@/components/partial/header/header-image-static';
import EmailForm from './module/reset-form';

export const metadata: Metadata = {
  title: 'Reset',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang'
}

async function ForgotPassword() {
  const session = await getSession()
  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-screen">
      <HeaderImageStatic className="shrink-0" />
      <div className="flex-1 w-full">
        <div className="mx-12 mt-10">
          <h3 className="font-extrabold text-base text-foreground/75 mb-5 text-center tracking-tight leading-none">Enter your email</h3>
          <EmailForm />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;