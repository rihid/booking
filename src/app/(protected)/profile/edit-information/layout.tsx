import React from 'react'
import PageHeader from './module/page-header';

function LayoutEditInfo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mb-20">
      <PageHeader />
      {children}
    </div>
  )
}

export default LayoutEditInfo;