'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
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
    <Modal
      open={showModal}
      onClose={() => closeModal()}
      variant='bottom'
    >
      <div className="w-full h-full">
        <Container className="relative flex flex-col w-full mx-auto mt-5">
          <div className="flex justify-end my-4">
            <CloseButton />
          </div>
          <Heading variant='lg' className="text-center text-foreground/75">About</Heading>
          <article className="mt-4 text-xs font-normal text-foreground/50">
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
        </Container>
        <Container className="bg-background mt-6">
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
        </Container>
      </div>
    </Modal>
  )
}

export default AboutDetailModal;