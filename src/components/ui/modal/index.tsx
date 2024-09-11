import React from 'react';
import { Dialog, Transition } from "@headlessui/react"
import { cn } from '@/assets/styles/utils';

type ModalProps = {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  variant?: 'center' | 'bottom';
}
function Modal({
  open,
  children,
  onClose,
  variant = 'center',
}: ModalProps) {
  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
        as='div'
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        {variant === 'center' &&
          <Transition.Child
            as={React.Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[100%]"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 h-full w-full max-w-lg bg-background">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        }
        {variant === 'bottom' &&
          <Transition.Child
            as={React.Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-y-[100%]"
            enterTo="translate-y-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-[100%]"
          >
            <Dialog.Panel className="fixed bottom-0 h-auto w-full bg-background">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        }
      </Dialog>
    </Transition>
  )
}

export default Modal;