import React from 'react';
import LayoutWithFixedMenu from '@/components/partial/layout/layout-with-fixed-menu';

function TripPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithFixedMenu>{children}</LayoutWithFixedMenu>
}

export default TripPageLayout;