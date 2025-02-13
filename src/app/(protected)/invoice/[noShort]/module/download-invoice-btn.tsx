'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { masterUrl } from '@/lib/data/endpoints';
import { Loader2 } from 'lucide-react';
import { cn } from '@/assets/styles/utils';


function DownloadInvoiceBtn({
  user,
  invoice,
}: {
  user: any;
  invoice: any;
}) {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleClick = async () => {
    setIsLoading(true)
    const obj = {
      format: "pdf",
      begin: null,
      end: null,
      data: invoice,
    }
    await axios.post(masterUrl + '/export/invoice-pdf', obj, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token }, responseType: 'blob', })
      .then(response => {
        const data = new Blob([response.data], { type: 'application/pdf' })
        const downloadUrl = URL.createObjectURL(data);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'invoice_' + invoice.invoice_no.split('/').pop() + '.pdf';
        document.body.appendChild(link);
        link.click();

        // clean
        link.remove();
        URL.revokeObjectURL(downloadUrl);
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)
        throw error
      })
  }

  return (
    <div className="flex items-center justify-center mt-10">
      <Button
        type='button'
        onClick={handleClick}
        className="bg-brand hover:bg-brand/90"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />}
        Download Invoice
      </Button>
    </div>
  )
}

export default DownloadInvoiceBtn;