'use client';

import React from 'react'
import { Check, ChevronDownIcon, Dot, DotIcon } from 'lucide-react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

const dataCancellation = [
  {
    name: "Force Major (Cancel by Admin)",
    list: [
      {
        value: "Reschedule : Maks. 2 kali dalam jangka waktu 60 hari (2 bulan) dengan ketentuan info reschedule maks. 2 jam sebelum waktu trip bila kurang dari 2 jam maka akan mengikuti ketentuan cancel."
      },
      {
        value: "Cancel: cancellation fee 20% dari total harga paket yang diambil."
      },
      {
        value: "Untuk reschedule yang melampaui batas waktu yang disepakati (60 hari) maka pembayaran akan hangus atau tidak dapat dikembalikan."
      }
    ]
  },
  {
    name: "Cancel by Customer",
    list: [
      {
        value: "Pembatalan H-1 sebelum waktu trip dengan cancellation fee 20% dari total tagihan paket yang diambil."
      },
      {
        value: "Pembatalan di hari H maks. 3 jam sebelum trip maka pembayaran akan hangus atau tidak dapat dikembalikan."
      }
    ]
  }
]

function Cancelation() {
  return (
    <div>
      <h3 className="font-bold text-base text-foreground/75 mb-3">Cancellation Policy</h3>
      <div className="text-foreground/50 text-xs font-normal mb-2">
        {dataCancellation.map((data, index) => {
          const lists = data.list;
          return (
            <Disclosure as="div" className="w-full max-w-md" key={index} defaultOpen={true}>
              {({ open }) => (
                <>
                  <DisclosureButton className="w-full flex items-center justify-between border-b pb-1">
                    <span className="text-start font-bold text-xs">{data.name}</span>
                    <ChevronDownIcon className={`w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </DisclosureButton>
                  <div className="overflow-hidden py-1">
                    <DisclosurePanel
                      transition
                      className="origin-top transition duration-200 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
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

export default Cancelation;