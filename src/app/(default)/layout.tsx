import React from 'react';
import NavbarMenu from '@/components/partial/navmenu';

function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="relative flex-grow">
        {children}
      </div>
      <NavbarMenu />
    </>
  )
}

export default PagesLayout;