import React from 'react';
import LayoutWithreserveButton from '@/components/partial/layout/layout-with-reserve-button';

function DetailPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWithreserveButton>{children}</LayoutWithreserveButton>
}

export default DetailPageLayout;