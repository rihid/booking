import React from 'react';
import { Drawer } from "@/components/ui/drawer";
import { useUiLayoutStore } from '@/store/ui-layout';
import motionProps from './motion';
import { cn } from '@/assets/styles/utils';

function ModalDrawer() {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  const contentWrapperCSS = { bottom: 0 };

  return (
    <div>
      <Drawer
        open={showModal}
        placement='bottom'
        // @ts-ignore
        level={null}
        mask={false}
        contentWrapperStyle={contentWrapperCSS}
        {...motionProps}
      >
        <div className="fixed inset-0">
          <button type='button' onClick={() => closeModal()} className={cn(
            "wrapper fixed inset-0 bg-black/25 cursor-default",
            "transition-all ease-in-out duration-300"
          )}></button>
          <div className={cn(
            "fixed bottom-0 h-auto w-full bg-transparent flex justify-center",
            "transition-all ease-in-out duration-300"
          )}>
            <div className="wrapper bg-background">
              <button type="button" onClick={() => closeModal()}>close</button>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam amet atque deserunt minima magni similique?</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default ModalDrawer;