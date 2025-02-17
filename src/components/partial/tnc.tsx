'use client';

import React from 'react'
import { Check, ChevronDownIcon, Dot, DotIcon } from 'lucide-react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

const dataTnC = [
  {
    name: "General",
    list: [
      {
        value: "Rider: Umur minimal 17<sup>th</sup> (atau minimal 14<sup>th</sup> dengan tinggi badan min 130cm dan disertai persetujuan orang tua/wali yang tertulis di waiver)."
      },
      {
        value: "Passanger: Umur minimal 12<sup>th</sup> atau dibawah 12<sup>th</sup> dengan syarat vest yang tersedia sesuai dengan ukuran badan passanger."
      },
      {
        value: "Customer datang maks. 45 menit lebih awal, sebelum booking trip yang sudah dipesan."
      },
      {
        value: "Khusus BBQ Trip, Morning Ride, dan Advance Trip apabila reschedule harus dilakukan maks. H-1, apabila reschedule di hari H maka akan dikenakan charge"
      }
    ]
  },
  {
    name: "Reschedule by customer",
    list: [
      {
        value: "Maks 3 jam sebelum trip. Apabila kurang dari 3 jam maka semua pembayaran akan hangus atau tidak dapat dikembalikan."
      }
    ]
  },
  {
    name: "Payment",
    list: [
      {
        value: "Pembayaran tagihan “Lunas” ketika booking (by Aplikasi)"
      },
      {
        value: "Metode pembayaran Non Tunai/Transfer ke rekening BCA an PT Pesona Safari Jaya 898-5555-539, QRIS dan EDC (a.n Heru) yang disediakan."
      },
      {
        value: "Transaksi Booking dinyatakan Sah , ketika sudah dilakukan Full Payment"
      },
    ]
  },
]

function Tnc() {
  return (
    <div>
      <h3 className="font-bold text-base text-foreground/75 mb-3">Terms and Conditions</h3>
      <div className="text-foreground/50 text-xs font-normal ">
        <p className="mb-2">Customer Term and Conditions Seadoo Safari Semarang:</p>
        {dataTnC.map((data, index) => {
          const lists = data.list;
          return (
            <Disclosure as="div" className="w-full max-w-md" key={index}>
              {({ open }) => (
                <>
                  <DisclosureButton className="w-full flex items-center justify-between border-b pb-1">
                    <span className="text-start">{data.name}</span>
                    <ChevronDownIcon className={`w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </DisclosureButton>
                  <div className="overflow-hidden py-1">
                    <DisclosurePanel
                      transition
                      className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      <dl className="mt-1 space-y-1">
                        {lists.map((list, index) => (
                          <div className="flex items-start mb-0.5" key={index}>
                            <dd>
                              <Check className="w-3 h-3 mr-2 inline-block" />
                            </dd>
                            <dt dangerouslySetInnerHTML={{ __html: list.value }} />
                          </div>
                        ))}
                      </dl>
                    </DisclosurePanel>
                  </div>
                </>
              )}
            </Disclosure>
          )
        })}
      </div>
    </div>
  )
}

export default Tnc;