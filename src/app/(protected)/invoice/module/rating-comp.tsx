'use client';

import React from 'react';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Ratings } from '@/components/ui/ratings';

function RatingComp() {
  return (
    <Container className="flex flex-col gap-4 justify-center items-center mb-8">
      <Heading variant='lg' className="font-semibold">How&apos;s Your Experience</Heading>
      <Ratings rating={0} variant='yellow' size={32} />
    </Container>
  )
}

export default RatingComp;