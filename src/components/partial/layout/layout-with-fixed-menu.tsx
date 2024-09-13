'use client';

import React from 'react';
import { Search, CircleUserRound, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteSetting } from '@/lib/constants';
import { cn } from '@/assets/styles/utils';

const MENUS = [
  {
    id: siteSetting.mainMenu[0].id,
    name: siteSetting.mainMenu[0].name,
    path: siteSetting.mainMenu[0].path,
    icon: <Search className="w-6 h-6" />
  },
  {
    id: siteSetting.mainMenu[1].id,
    name: siteSetting.mainMenu[1].name,
    path: siteSetting.mainMenu[1].path,
    icon: <Image
      src="/images/trip-icon.svg"
      width={28}
      height={28}
      alt="instagram"
      className="object-contain"
    />
  },
  {
    id: siteSetting.mainMenu[2].id,
    name: siteSetting.mainMenu[2].name,
    path: siteSetting.mainMenu[2].path,
    icon: <CircleUserRound className="w-6 h-6" />
  },
]

const NavbarMenu = () => {
  const pathname = usePathname()
  return (
    <ul className="wrapper fixed z-40 bottom-0 h-[76px] flex items-center justify-center gap-x-16 border-t-2 border-t-slate-100 shadow-sm w-full bg-background pb-2">
      {MENUS.map(menu => {
        const isActive = pathname === menu.path
        return (
          <li
            key={menu.id}
            className={cn(
              'hover:text-brand hover:grayscale-0',
              isActive ? 'text-brand' : 'text-foreground/50 grayscale'
            )}
          >
            <Link
              href={menu.path}
              className="flex flex-col gap-0.5 items-center justify-center outline-none focus:outline-none"
            >
              {menu.icon}
              <span className="text-[9px] capitalize">{menu.name}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function LayoutWithFixedMenu({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      {children}
      <NavbarMenu />
    </React.Fragment>
  )
}

export default LayoutWithFixedMenu;