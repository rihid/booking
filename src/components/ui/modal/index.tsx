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
        className="fixed inset-0 z-40 overflow-x-hidden"
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
          <div className="wrapper fixed inset-0 bg-black/25" />
        </Transition.Child>
        {variant === 'center' &&
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="wrapper w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
            <Dialog.Panel className="fixed bottom-0 h-auto w-full">
              <div className="wrapper bg-background h-auto min-h-[640px] rounded-t-3xl">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        }
      </Dialog>
    </Transition>
  )
}

export default Modal;