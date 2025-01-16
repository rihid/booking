import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import Image from 'next/image';
import { ChevronRight, CircleUserRound, Bell, CircleArrowOutUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import ProfileCard from './module/profile-card';
import { logout } from '@/lib/action/auth';
import { getSession } from '@/lib/session';
import CustomerDetailModal from '../customer-list/module/customer-detail-modal';
import axios from 'axios';
import { customerUrl } from '@/lib/data/endpoints';
import LoadingOverlay from '@/components/partial/loading-overlay';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function Profile() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;

  // async function getCustomer() {
  //   const res = await axios.get(customerUrl + "/" + user.id, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } })
  //     .then(response => {
  //       const data = response.data.data;
  //       return data
  //     })
  //     .catch(error => {
  //       return {
  //         error: error.response?.data,
  //       };
  //     })
  //   return res
  // }

  async function getCustomer() {
    try {
      const response = await axios.get(customerUrl + "/" + user.id, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } })
      const data = response.data.data
      return data;
    } catch (error: any) {
      // console.log(error)
      return {
        error: error.response?.data,
      };
    }
  }
  function setLoading(value: boolean) {
    if (!value) return false
    return value;
  }
  const customer = await getCustomer();

  return (
    <LoadingOverlay loading={setLoading(false)}>
      <div className="flex flex-col min-h-screen py-6 gap-6">
        <Container className="bg-background gap-x-6">
          <div className="flex itesm-center justify-between mb-4">
            <Heading variant='lg' className="text-foreground/75">Profile</Heading>
            <Bell className="w-6 h-6" />
          </div>
          <ProfileCard user={user} />
        </Container>
        <Container className="bg-background">
          <h3 className="font-semibold text-sm text-foreground/75">Menu</h3>
          <div className="flex flex-col px-0 text-foreground/50 h-full">
            <ul className="bg-background border-b border-b-foreground-muted">
              <li className="border-b border-foreground/50">
                <Link href="/profile/customer-list" className="flex items-center justify-between h-full w-full py-3">
                  <div className="flex items-center gap-2">
                    <CircleUserRound className="w-5 h-5" />
                    <span className="block tracking-tight font-normal text-xs">
                      Rider List
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </Link>
              </li>
              <li className="border-b border-foreground/50">
                <form action={async () => {
                  "use server"
                  await logout();
                }}>
                  <button type='submit' className="flex items-center justify-between h-full w-full py-3">
                    <div className="flex items-center gap-2">
                      <CircleArrowOutUpRightIcon className="w-5 h-5" />
                      <span className="forn-normal text-xs">Logout</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </Container>
        <CustomerDetailModal customerData={customer} />
      </div>
    </LoadingOverlay>
  )
}

export default Profile;