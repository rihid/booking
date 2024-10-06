"use client";

import React from 'react';
import Image from 'next/image';

type Props = {
  className?: string;
}
function HeaderImageCarausel({
  className,
  ...props
}: Props) {
  return (
    <div className="flex aspect-w-5 aspect-h-4 w-full h-0" {...props}>
      <Image
        src="/images/img-grid-3.png"
        alt='auth-image'
        width={0}
        height={0}
        priority
        sizes='100vw'
        className="h-full w-full object-cover object-center rounded-b-[40px]"
      />
    </div>
  )
}

export default HeaderImageCarausel;