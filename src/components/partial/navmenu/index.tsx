import React from 'react';
import { Search, CircleUserRound, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function NavbarMenu() {
  return (
    <ul className="wrapper fixed z-40 bottom-0 flex items-center justify-center gap-x-16 border-t-2 border-t-slate-100 shadow-sm w-full text-foreground bg-background pt-3 pb-5">
      <li className="text-foreground/50 hover:text-brand">
        <Link 
          href="/explore"
          className="flex flex-col gap-0.5 items-center justify-center outline-none focus:outline-none"
        >
          <Search className="w-6 h-6"/>
          <span className="text-[9px]">Explore</span>
        </Link>
      </li>
      <li className="text-foreground/50 hover:text-brand">
        <Link
          href="/trips"
          className="flex flex-col gap-0.5 items-center justify-center outline-none focus:outline-none"
        >
          <Image 
            src="/images/trip-icon.svg" 
            width={28} 
            height={28} 
            alt="instagram"
            className="object-contain grayscale hover:grayscale-0" 
          />
          <span className="text-[9px]">Trips</span>
        </Link>
      </li>
      <li className="text-foreground/50 hover:text-brand">
        <Link
          href="/profile"
          className="flex flex-col gap-0.5 items-center justify-center outline-none focus:outline-none"
        >
          <CircleUserRound className="w-6 h-6"/>
          <span className="text-[9px]">Profile</span>
        </Link>
      </li>
    </ul>
  )
}

export default NavbarMenu;