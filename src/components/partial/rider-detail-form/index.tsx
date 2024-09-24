import React from 'react';
import Container from '@/components/ui/container';
import CloseButton from '@/components/ui/button/close-button';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button/button';

function RiderDetailForm() {
  return (
    <div className="w-full h-full pb-10">
      <Container className="relative flex flex-col justify-center w-full mx-auto mt-5">
        <div className="flex justify-end mt-4 mb-2">
          <CloseButton />
        </div>
        <Heading variant='lg' className="text-center text-foreground/75">Rider Detail</Heading>
        <div className="mt-6 w-full space-y-6">
          <form
            action="post"
            className="w-full mx-auto"
          >
            <div className="space-y-3">
              <div className="flex flex-col space-y-2">
                <Label className="text-xs text-muted-foreground">ID Card</Label>
                <Input type='text' id="id-card" placeholder="ID Card" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input type='text' id="id-card" placeholder="Name" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="text-xs text-muted-foreground">City</Label>
                <Input type='text' id="id-card" placeholder="City" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="text-xs text-muted-foreground">Birthday</Label>
                <Input type='text' id="id-card" placeholder="Birthday" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <Input type='text' id="id-card" placeholder="Phone Number" />
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <Button className="bg-brand font-bold hover:bg-brand/80">Login</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}

export default RiderDetailForm;