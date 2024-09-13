import React from 'react';
import LayoutWithFixedMenu from '@/components/partial/layout/layout-with-fixed-menu';

function ExplorePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithFixedMenu>{children}</LayoutWithFixedMenu>
}

export default ExplorePageLayout;