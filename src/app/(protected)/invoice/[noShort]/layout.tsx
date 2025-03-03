import React from 'react'
import ToopTitle from './module/top-title';

function LayoutInvoiceDetail({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen mb-20">
      <ToopTitle label='Invoice' />
      {children}
    </div>
  )
}

export default LayoutInvoiceDetail;