'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Container from '@/components/ui/container';
import CloseButton from '@/components/ui/button/close-button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';

export type AboutDetailProps = {
  id: string | null;
  name: string;
  longitude: string | null;
  latitude: string | null;
  org_no: string | null;
  branch_no: string | null;
}

function AboutDetailModal({
  data,
}: { data: AboutDetailProps[] }) {

  const { showModal, closeModal } = useUiLayoutStore(state => state);

  return (
    <Sheet
      open={showModal}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal();
        }
      }}
    >
      <SheetContent side="bottom" className="wrapper flex flex-col justify-between w-full h-3/4 rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-center text-foreground/75">About</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow w-full">
          <div className="mt-5 px-4 mb-10">
            <article className="text-xs font-normal text-foreground/50">
              <p>Cocok untuk pemula yang ingin berkendara dengan
                pemandangan kapal-kapal di luar pelabuhan, kamu
                juga bisa menikmati indahnya matahari terbenam
                di laut lepas pada sore hari. Pengalaman yang
                luar biasa</p>
              <br />
              <p>Suitable for beginners who want to ride with a view
                of the ships outside the harbor, you can also enjoy
                the beautiful sunset on the open sea in the
                afternoon. What an Experience</p>
            </article>
            <div className="bg-background mt-6">
              <h3 className="font-semibold text-sm text-foreground/75">Riding Route</h3>
              <div className="mt-2">
                <ol className="relative text-gray-500 ms-2 border-s-2 border-dashed border-muted-foreground">
                  {data.map(route => (
                    <li key={route.id} className="mb-5 ms-6">
                      <span className="absolute flex items-center justify-center w-4 h-4 border-2 border-muted-foreground bg-background rounded-full -start-2 ring-2 ring-background" />
                      <p className="text-xs tracking-tight">{route.name}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AboutDetailModal;