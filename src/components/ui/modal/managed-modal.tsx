'use client';

import React from 'react';
import Modal from "@/components/ui/modal";
import AboutProductDetail from '@/components/partial/about-product-detail';
import DateSelectForm from '@/components/partial/date-select-form';
import RiderForm from '@/components/partial/rider-form';
import RiderDetailForm from '@/components/partial/rider-detail-form';
import ReviewForm from '@/components/partial/review-form';
import { useUiLayoutStore } from '@/store/ui-layout';
// import { getScrollbarWidth } from '@/lib/helper';
// import useBodyScrollable from '@/lib/hooks/use-body-scrollable';

function ManagedModal() {
  const { showModal, closeModal, modalView } = useUiLayoutStore(state => state);

  // const scrollbarWidth = getScrollbarWidth();
  // const bodyScrollable = useBodyScrollable();
  // React.useLayoutEffect(() => {
	// 	if (bodyScrollable) {
	// 		document.body.style.paddingRight = '0px'
	// 	} else {
	// 		document.body.style.paddingRight = `${scrollbarWidth}px`
	// 	}
  //   console.log(scrollbarWidth)
	// }, [bodyScrollable])

  // console.log('Modal state:', { showModal, modalView });
  if (modalView === 'review-view') {
    return (
      <Modal
        open={showModal}
        onClose={() => closeModal()}
        variant='center'
      >
        <ReviewForm />
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
        {modalView === 'about-product-detail-view' && <AboutProductDetail/>}
        {modalView === 'dates-select-view' && <DateSelectForm />}
        {modalView === 'rider-select-view' && <RiderForm/>}
        {modalView === 'rider-detail-view' && <RiderDetailForm />}
      </Modal>
    )

  }
}

export default ManagedModal;