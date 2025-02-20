import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCustomerByNo, getUserToken } from '@/lib/data';

async function UserAvatar({
  session,
  customer,
}: {
  session: any;
  customer: any;
}) {
  let avatar;
  let userToken;
  if (session !== null) {
    // @ts-ignore
    const { token, customer_no } = session?.user;
    // @ts-ignore
    const srcImage = session.user?.avatar
    avatar = srcImage !== null ? srcImage : '/images/avatar.png';
    
    userToken = await getUserToken(token)
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
        <p className="text-sm capitalize text-muted-foreground">{userToken?.greetings}, <strong>{customer.name.split(' ')[0]}</strong></p>
      }
    </div>
  )
}

export default UserAvatar;