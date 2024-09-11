import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteSetting } from '@/lib/constants';

type LogoProps = {
  className?: string;
  href?: string;
}
function Logo({
  className,
  href = siteSetting.logo.href,
  ...props
}: LogoProps) {
  return (
    <Link href={href} className="inline-flex focus:outline-none" {...props}>
      <Image
        src={siteSetting.logo.url}
        alt={siteSetting.logo.alt}
        width={220}
        height={50}
        priority
      />
    </Link>
  )
}

export default Logo;