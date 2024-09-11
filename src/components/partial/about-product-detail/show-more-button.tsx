"use client";

import React from 'react';
import { useUiLayoutStore } from '@/store/ui-layout';

function ShowMoreButton() {
  const {openModal, setModalView} = useUiLayoutStore(state => state);

  const handleClick = () => {
    const view = 'about-product-detail-view';
    setModalView(view);
    return openModal(view);
  }

  return (
    <button 
      type="button"
      onClick={handleClick}
      className="inline-block ml-1 text-brand hover:underline hover:underline-offset-1"
    >
      Show More
    </button>
  )
}

export default ShowMoreButton;