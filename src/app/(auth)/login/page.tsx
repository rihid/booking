import React from 'react';
import { Metadata } from 'next';
import LoginPageClient from './module/login-page-client';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | null }
}) {
  const token = searchParams['token'];
  return <LoginPageClient token={token} />;
}

export default Login;