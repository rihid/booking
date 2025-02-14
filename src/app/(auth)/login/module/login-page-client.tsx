'use client';

import React from 'react';
import HeaderImageStatic from '@/components/partial/header/header-image-static';
import LoginForm from './login-form';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/partial/loading-overlay';
import { domain } from '@/lib/data/endpoints';

function LoginPageClient({ token }: { token: string | string[] | null }) {
  const router = useRouter();
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (token) {
      setLoadingOverlay(true);

      const body = JSON.stringify({ token });
      axios.post('/api/auth/login', body, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          console.log(response.data.message)
          if (response.data.message === 'Login successful') {
            router.push('/explore')
          } else {
            console.error(response.data.message);
          }
        })
        .catch(error => {
          console.log(error)
          throw error
        })
    }
  }, [token]);
  return (
    <LoadingOverlay loading={loadingOverlay}>
      <div className="flex flex-col items-center justify-between w-full h-full min-h-screen">
        <HeaderImageStatic className="shrink-0" />
        <div className="flex-1 w-full">
          <div className="mx-12 mt-10">
            <h3 className="font-extrabold text-base text-foreground/75 mb-5 text-center tracking-tight leading-none">Login to your account</h3>
            <LoginForm />
          </div>
          <div className="mx-12 mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-foreground/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 font-xs bg-background text-foreground/50">or</span>
              </div>
            </div>
            <div className="mt-6 mb-12 flex flex-col items-center justify-center gap-5">
              <h3 className="font-extrabold text-xs text-foreground/75 text-center tracking-tight leading-none">Sign with</h3>
              <div className="flex items-center justify-center">
                <Link
                  href={`${domain}/login/social/redirect?provider=google`}
                  className="py-2 px-12 border border-slate-50 rounded shadow-md text-sm font-medium hover:bg-slate-50"
                >
                  <Image
                    src="/images/sso/google-2015-logo.svg"
                    alt="google-signin"
                    width={0}
                    height={0}
                    sizes='100vh'
                    className="h-14 w-14 -my-4"
                  />
                </Link>
              </div>
              {/* 
              <div className="flex items-center justify-center">
                <Link
                  href={`${domain}/login/social/facebook/redirect`}
                  className="py-2 px-12 border border-slate-50 rounded shadow-md text-sm font-medium hover:bg-slate-50"
                >
                  <Image
                    src="/images/sso/facebook-5-logo.svg"
                    alt="google-signin"
                    width={0}
                    height={0}
                    sizes='100vh'
                    className="h-14 w-14 -my-4"
                  />
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <Link
                  href={"#"}
                  className="py-2 px-12 border border-slate-50 rounded shadow-md text-sm font-medium hover:bg-slate-50"
                >
                  <Image
                    src="/images/sso/apple-11-logo.svg"
                    alt="google-signin"
                    width={0}
                    height={0}
                    sizes='100vh'
                    className="h-14 w-14 -my-4"
                  />
                </Link>
              </div>
              
              */}

            </div>
            <div className="-mt-4 mb-6 flex items-center justify-center text-xs font-normal text-muted-foreground">Don&#39;t have account?&nbsp;<Link href='/register' className="text-brand hover:underline underline-offset-2">Sign Up</Link></div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  )
}

export default LoginPageClient;