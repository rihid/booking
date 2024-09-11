'use client';

import React from 'react';
import Modal from "@/components/ui/modal";
import AboutProductDetail from '@/components/partial/about-product-detail';
import { useUiLayoutStore } from '@/store/ui-layout';

function ManagedModal() {
  const { showModal, closeModal, modalView } = useUiLayoutStore(state => state);

  console.log('Modal state:', { showModal, modalView });

  if (modalView === 'rivew-view') {
    return (
      <Modal
        open={showModal}
        onClose={() => closeModal()}
        variant='center'
      >
        testing
      </Modal>
    )
  }
  return (
    <Modal
      open={showModal}
      onClose={() => closeModal()}
      variant='bottom'
    >
      {modalView === 'testing' && <div>testing testing</div>}
      {modalView === 'about-product-detail-view' && <AboutProductDetail/>}
    </Modal>
  )
}

export default ManagedModal;