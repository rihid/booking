'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useUiLayoutStore } from '@/store/ui-layout';
import Link from 'next/link';

function ProfileCard({
  user,
}: {
  user: any;
}) {
  const { openModal, setModalView, modalView } = useUiLayoutStore(state => state);

  const handleClick = () => {
    openModal('profile-card-view')
  }

  return (
    <div
      className="flex items-center justify-between h-full w-full py-3 border-b border-b-foreground/50"
    >
      <div className="flex items-center justify-start gap-x-4">
        {user?.avatar ?
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
          <p className="capitalize">{user.name.toLowerCase()}</p>
          <button type="button" className="text-[11px]" onClick={handleClick}>Show Profile</button>
        </div>
      </div>
      <Link href="/profile/edit-information" className="block pl-8">
        <ChevronRight className="w-5 h-5 text-foreground" />
      </Link>
    </div>
  )
}

export default ProfileCard