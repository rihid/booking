'use client';

import React from 'react';
import Modal from "@/components/ui/modal";
import AboutProductDetail from '@/components/partial/about-product-detail';
import { useUiLayoutStore } from '@/store/ui-layout';
import { getScrollbarWidth } from '@/lib/helper';
import useBodyScrollable from '@/lib/hooks/use-body-scrollable';

function ManagedModal() {
  const { showModal, closeModal, modalView } = useUiLayoutStore(state => state);

  const scrollbarWidth = getScrollbarWidth();
  const bodyScrollable = useBodyScrollable();
  // React.useLayoutEffect(() => {
	// 	if (bodyScrollable) {
	// 		document.body.style.paddingRight = '0px'
	// 	} else {
	// 		document.body.style.paddingRight = `${scrollbarWidth}px`
	// 	}
  //   console.log(scrollbarWidth)
	// }, [bodyScrollable])


  console.log('Modal state:', { showModal, modalView });
  console.log(scrollbarWidth)
  console.log(bodyScrollable)
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
      {modalView === 'dates-select-view' && <div>Dates</div>}
      {modalView === 'rider-select-view' && <div>Riders</div>}
      {modalView === 'rider-detail-view' && <div>Riders Detail</div>}
    </Modal>
  )
}

export default ManagedModal;