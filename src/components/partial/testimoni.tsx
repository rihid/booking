'use client';

import React from 'react'
import Heading from '../ui/heading'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Check, ChevronDownIcon } from 'lucide-react';

const dataCancellation = [
  {
    name: "Testimoni",
    list: [
      {
        value: "Ini sangat menarik!",
        name: "Saylor"
      },
      {
        value: "Cancellation fee 20% dari total harga paket yang diambil.",
         name: "Lary Fink"
      },
      {
        value: "Untuk reschedule yang melampaui batas waktu yang disepakati (60 hari) maka pembayaran akan hangus atau tidak dapat dikembalikan.",
         name: "Ben Zhou"
      }
    ]
  }
]

function Testimoni() {
  return (
    <>
      <div className="text-foreground/50 text-xs font-normal mb-2">
        {dataCancellation.map((data, index) => {
          const lists = data.list;
          return (
            <Disclosure as="div" className="w-full max-w-md" key={index}>
              {({ open }) => (
                <>
                  <DisclosureButton className="w-full flex items-center justify-between border-b pb-1">
                    <Heading variant='sm' className="text-foreground/75 mb-2">{data.name}</Heading>
                    <ChevronDownIcon className={`w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </DisclosureButton>
                  <div className="overflow-hidden py-1">
                    <DisclosurePanel
                      transition
                      className="origin-top transition duration-200 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
                    >
                      <div className="mt-4 space-y-3">
                        {lists.map((list, index) => (
                          <figure className="w-full max-w-sm" key={index}>
                            <blockquote>
                              <p className="text-xs font-normal italic text-muted-foreground tracking-tight">&quot;{list.value}&quot;</p>
                            </blockquote>
                            <figcaption className="flex items-center mt-1">
                              <cite className="pe-3 font-medium text-foreground/75">&mdash; {list.name}</cite>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </div>
                </>
              )}
            </Disclosure>
          )
        })}
      </div>
    </>
  )
}

export default Testimoni