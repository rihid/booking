import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSession } from '@/lib/session';
import { getCustomerByNo } from '@/lib/data';

async function UserAvatar({ }) {
  const session = await getSession();
  let avatar;
  let customer;
  if (session !== null) {
    // @ts-ignore
    const { token, customer_no } = session?.user;
    // @ts-ignore
    const srcImage = session.user?.avatar
    avatar = srcImage !== null ? srcImage : '/images/avatar.png';

    customer = await getCustomerByNo(token, customer_no)
  }
  return (
    <div className="flex items-center justify-start gap-x-2">
      <Avatar>
        <AvatarImage src={avatar} alt='avatar' />
        {session === null ?
          <AvatarFallback className="capitalize">G</AvatarFallback>
          :
          // @ts-ignore
          <AvatarFallback className="capitalize">{customer.name[0]}</AvatarFallback>
        }
      </Avatar>
      {session === null ?
        <p className="text-sm">Hi, Guest</p>
        :
        // @ts-ignore
        <p className="text-sm capitalize text-muted-foreground">{session.user?.greetings}, <strong>{customer.name.split(' ')[0]}</strong></p>
      }
    </div>
  )
}

export default UserAvatar;