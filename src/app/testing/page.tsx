'use client'

import React from 'react';
import { useCountStore } from '@/store/testing'
import { useUiLayoutStore } from '@/store/ui-layout'

function Testing() {
  const { setModalView, openModal, modalView } = useUiLayoutStore((store) => store);

  const handleClick = () => {
    const view = 'testing';
    setModalView(view);
    return openModal(view);
  }

  return (
    <>
      <button onClick={handleClick}>Open dialog</button>
      <pre>debug{modalView}</pre>
    </>
  )
}

export default Testing
