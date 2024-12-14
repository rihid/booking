import React from 'react';
import { Metadata } from 'next';
import Container from '@/components/ui/container';
import Image from 'next/image';
import { ChevronRight, CircleUserRound, Bell } from 'lucide-react';
import Link from 'next/link';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/action/auth';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Sewa jetski, Rental Jetski, main jetski di semarang'
}

async function Profile() {
  const session = await getSession();
  // @ts-ignore
  const { user } = session;
  return (
    <div className="flex flex-col min-h-screen py-6 gap-6">
      <Container className="bg-background gap-x-6">
        <div className="flex itesm-center justify-between mb-4">
          <Heading variant='lg' className="text-foreground/75">Profile</Heading>
          <Bell className="w-6 h-6" />
        </div>
        <button
          type='button'
          className="flex items-center justify-between h-full w-full py-3 border-b border-b-foreground/50"
        >
          <div className="flex items-center justify-start gap-x-4">
            {user.avatar ?
              <Image
                src={user.avatar}
                alt="avatar"
                width={42}
                height={42}
                className="object-contain rounded-full"
              />
              :
              <Image
                src="/images/avatar.png"
                alt="avatar"
                width={42}
                height={42}
                className="object-contain rounded-full"
              />
            }
            <div className="text-muted-foreground font-normal text-start text-sm m-0 p-0">
              <p>{user.name}</p>
              <span className="text-[11px]">Show Profile</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
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
                    <CircleUserRound className="w-5 h-5" />
                    <span className="forn-normal text-xs">Logout</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </form>
            </li>
          </ul>
        </div>
      </Container>
    </div>
  )
}

export default Profile;