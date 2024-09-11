import React from 'react';
import Image from 'next/image';
import Logo from '@/components/ui/logo';

type Props = {
  className?: string;
}

function HeaderImageStatic({
  className,
  ...props
}: Props) {
  return (
    <div className="w-full h-full aspect-h-3 aspect-w-4" {...props}>
      <Image
        src="/images/auth-img-1.png"
        alt='auth-image'
        width={0}
        height={0}
        sizes='100vw'
        className="h-full w-full object-cover object-center rounded-b-[40px]"
      />
      <div className="mt-10 text-center">
        <Logo />
      </div>
    </div>
  )
}

export default HeaderImageStatic;