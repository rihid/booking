import React from 'react';
import LayoutWithFixedMenu from '@/components/partial/layout/layout-with-fixed-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';

function TripPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWithFixedMenu>
      <div className="flex flex-col min-h-screen">
        <Tabs defaultValue='on-progress'>
          <Container className="py-6 sticky top-0 z-30 bg-background w-full flex justify-between items-center shrink-0">
            <div></div>
            <Heading variant="sm" className="text-foreground ml-4">Trips</Heading>
            <div></div>
          </Container>
          <Container el="nav" className="sticky top-0 z-30 bg-background pb-3 pt-1 border-b shadow-sm rounded-3xl">
            <TabsList className="flex gap-6 justify-start bg-background text-foreground/50">
              <TabsTrigger value='on-progress' className="font-bold">On Progress</TabsTrigger>
              <TabsTrigger value='history' className="font-bold">History</TabsTrigger>
            </TabsList>
          </Container>
          {children}
        </Tabs>
      </div>
    </LayoutWithFixedMenu>
  )
}

export default TripPageLayout;