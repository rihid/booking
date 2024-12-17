import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSession } from '@/lib/session';

async function UserAvatar({ }) {
  const session = await getSession();
  let avatar;
  if(session !== null) {
    // @ts-ignore
    const srcImage = session.user?.avatar
    avatar = srcImage !== null ? srcImage : '/images/avatar.png'
  }
  return (
    <div className="flex items-center justify-start gap-x-2">
      <Avatar>
        <AvatarImage src={avatar} alt='avatar' />
        {session === null ?
          <AvatarFallback className="capitalize">G</AvatarFallback>
          :
          // @ts-ignore
          <AvatarFallback className="capitalize">{session.user?.name[0]}</AvatarFallback>
        }
      </Avatar>
      {session === null ?
        <p className="text-sm">Hi, Guest</p>
        :
        // @ts-ignore
        <p className="text-sm capitalize text-muted-foreground">{session.user?.greetings}, <strong>{session.user?.name.split(' ')[0]}</strong></p>
      }
    </div>
  )
}

export default UserAvatar;