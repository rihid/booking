'use client';

import React from 'react';
import Modal from "@/components/ui/modal";
import { useUiLayoutStore } from '@/store/ui-layout';

function ManagedModal() {
  const { showModal, closeModal, modalView } = useUiLayoutStore(state => state);

  if (modalView === 'review-view') {
    return (
      <Modal
        open={showModal}
        onClose={() => closeModal()}
        variant='center'
      >
        <div>test</div>
      </Modal>
    )
  } else {
    return (
      <Modal
        open={showModal}
        onClose={() => closeModal()}
        variant='bottom'
      >
        {modalView === 'testing' && <div>testing testing</div>}
      </Modal>
    )

  }
}

export default ManagedModal;