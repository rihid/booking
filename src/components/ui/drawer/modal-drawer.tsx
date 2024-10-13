'use client';

import React from 'react';
import { Drawer } from "@/components/ui/drawer";
import { useUiLayoutStore } from '@/store/ui-layout';
import motionProps from './motion';
import { cn } from '@/assets/styles/utils';

function ModalDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
 
  return (
    <Drawer
      open={showModal}
      placement='bottom'
      // @ts-ignore
      level={null}
      mask={false}
      contentWrapperStyle={{bottom: 0}}
      {...motionProps}
    >
      <div className="fixed inset-0">
        {/* ini backdrop */}
        <button type="button" onClick={() => closeModal()} className="wrapper fixed inset-0 bg-black/25 cursor-default"></button>
        <div className={cn(
          "fixed bottom-0 h-auto w-full bg-transparent flex justify-center",
          "translate-y-0 transition-all ease-in-out duration-300"
        )}>
          <div className="wrapper bg-background">
            {children}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default ModalDrawer;