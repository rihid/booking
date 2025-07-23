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
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { login } from '@/lib/action/auth';
import { toast } from 'sonner';
import { getCustomerByNo, getUserToken, userStoreCustomer, validateCustomer } from '@/lib/data';

function LoginPageClient({ token }: { token: string | string[] | null }) {
  // Initialize loading state immediately if token exists
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(!!token);
  const router = useRouter();

  // methods
  const handleCustomerData = async (user: any) => {
    if (user.customer_no === null) {
      return await handleNewCustomer(user);
    } else {
      return await handleExistingCustomer(user);
    }
  };
  
  const handleNewCustomer = async (user: any) => {
    try {
      const validateUser = await validateCustomer(user.token, user);
  
      user.customer_no = validateUser.data.customer_no;
      user.customer = validateUser.data;
  
      if (user.customer_no) {
        const userCustomer = await userStoreCustomer(user.token, user);
        user.customers = [userCustomer.data];
      }
  
      return user;
    } catch (error) {
      console.error('Error handling new customer:', error);
      throw new Error('Failed to process new customer data');
    }
  };
  
  const handleExistingCustomer = async (user: any) => {
    try {
      const customerData = await getCustomerByNo(user.token, user.customer_no);
  
      user.customer = customerData;
      return user;
    } catch (error) {
      console.error('Error retrieving existing customer:', error);
      throw new Error('Failed to retrieve customer data');
    }
  };
  // async function login(token: string) {
  //   try {
  //     const user = await getUserToken(token as string);
  //     if (!user) {
  //       throw new Error('Failed to retrieve user data');
  //     }
  
  //     user.token = token;
  //     const enrichedUser = await handleCustomerData(user);
  //     const { permission, customers, ...rest } = enrichedUser;
  //     const sessionResponse = await axios.post('/api/auth/session', {
  //       user: rest
  //     });
  //     toast.success(sessionResponse.data.message);
  //     router.push('/explore');
      
  //   } catch (error: any) {
  //     console.error('Login error:', error);
  //     throw error;
  //   }
  // }

  React.useEffect(() => {
    if (!token) return;

    const processLogin = async () => {
      try {
        await login(token as string);
      } catch (error: any) {
        console.error('Login error:', error);
        setLoadingOverlay(false)
        if (error.response?.data?.message) {
          console.error('Server error:', error.response.data.message);
          toast.error(error.response.data.message);
        } else if (error.message) {
          console.error('Error:', error.message);
          toast.error(error.message);
        } else {
          console.error('Unexpected error occurred');
          toast.error('An unexpected error occurred!');
        }
      } finally {
        setLoadingOverlay(false);
      }
    };

    processLogin();
  }, [token]);

  return (
    <LoadingOverlay loading={loadingOverlay}>
      <div className="flex flex-col items-center justify-between w-full h-full min-h-screen">
        <HeaderImageStatic className="shrink-0" />
        <div className="absolute z-30 top-6 left-0 right-0 px-[30px] flex items-center justify-between">
          <Button
            type='button'
            variant="outline"
            size="icon"
            className="bg-background/50 rounded-full h-7 w-7 p-1"
          >
            <Link href="/">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Button>
        </div>
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