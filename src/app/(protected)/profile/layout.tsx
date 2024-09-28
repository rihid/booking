import React from 'react';
import LayoutWithFixedMenu from '@/components/partial/layout/layout-with-fixed-menu';

function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithFixedMenu>{children}</LayoutWithFixedMenu>
}

export default ProfilePageLayout;