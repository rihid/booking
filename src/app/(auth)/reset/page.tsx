import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button/button';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import HeaderImageStatic from '@/components/partial/header/header-image-static';
import NewPasswordForm from './module/new-password-form';
import axios from 'axios';
import { authUrl } from '@/lib/data/endpoints';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function ResetPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSession()
  const id = searchParams['id'] || null;
  const forgotTokenCheck = async () => {
    if (!id) return;
    const res = await axios.post(authUrl + '/user/forgot-check', { token: id }, { headers: { Accept: 'application/json' } })
      .then(response => {
        const data = response.data
        return data;
      })
      .catch(error => {
        console.log(error)
        return null
      })
    return res;
  }
  const tokenCheck = await forgotTokenCheck()
  if (!tokenCheck) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="grid gap-2 px-12 text-center">
          <Image
            src="/images/404-2.svg"
            width={320}
            height={320}
            alt="404 Illustration"
          />
        </div>

        <div className="grid gap-6 text-center">
          <div className="grid gap-2">
            <h3>Page not Found</h3>
            <p>It&apos;s Okay!</p>
          </div>

          <div>
            <Link href="/" className="hover:underline underline-offset-2">
              Let&apos;s Go Back
            </Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-screen">
      <HeaderImageStatic className="shrink-0" />
      <div className="flex-1 w-full">
        <div className="mx-12 mt-10">
          <h3 className="font-extrabold text-base text-foreground/75 mb-5 text-center tracking-tight leading-none">Enter new password</h3>
          <NewPasswordForm token={id} />
        </div>
      </div>
    </div>
  )
}

export default ResetPage;