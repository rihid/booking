import React from 'react';
import Container from '@/components/ui/container';
import CloseButton from '../../ui/button/close-button';

function AboutProductDetail() {
  return (
    <div className="w-full h-full">
      <Container className="relative flex flex-col w-full mx-auto mt-5">
        <div className="flex justify-end mt-4">
          <CloseButton />
        </div>
        <h2 className="font-bold text-xl text-foreground/75">About</h2>
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
        <div>testing</div>
      </Container>
    </div>
  )
}

export default AboutProductDetail