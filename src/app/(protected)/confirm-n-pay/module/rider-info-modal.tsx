'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import CloseButton from '@/components/ui/button/close-button';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { useUiLayoutStore } from '@/store/ui-layout';
import { getCustomerList } from '@/lib/data';
import axios from 'axios';
import { customerListUrl } from '@/lib/data/endpoints';

type Props = {
  idx: number;
  customer: any;
  user: any;
}

function RiderInfoModal({
  idx,
  customer,
  user,
}: Props) {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  const [rider, setRider]  = React.useState<string>("");
  console.log(customer)
  console.log(user.token)
  const body = {
    user_id: user.id as string,
  }

  // const getCustomerList = async() => {
  //   axios.post(customerListUrl, body, {
  //     headers: {
  //       Accept: 'application/json',
  //       Authorization: 'Bearer ' + user.token
  //     }
  //   })
  //     .then(response => {
  //       console.log(response.data.data);
  //       const data = response.data.data;
  //       // return data;
  //     })
  //     .catch(error => {
  //       console.log(error)
  //       throw error;
  //     })
  // }

  // React.useEffect(() => {
  //   getCustomerList();
  // }, [])
  return (
    <Modal
      open={showModal}
      onClose={() => closeModal()}
      variant='bottom'
    >
      <div className="w-full h-full pb-10">
        <Container className="relative flex flex-col justify-center w-full mx-auto mt-5">
          <div className="flex justify-end mt-4 mb-2">
            <CloseButton />
          </div>
          <Heading variant='lg' className="text-center text-foreground/75">Rider Information</Heading>
          <div className="mt-6 space-y-4">
            <ToggleGroup 
              type="single" 
              className="flex flex-col w-full gap-4"
              onValueChange={(value) => console.log(value)}
            >
              <ToggleGroupItem
                value="rider1"
                className="w-full justify-start border border-muted-foreground rounded px-4 py-3 text-xs text-start font-normal font-foreground/50"
              >
                Rider Pertama
              </ToggleGroupItem>
              <ToggleGroupItem
                value="rider2"
                className="w-full justify-start border border-muted-foreground rounded px-4 py-3 text-xs text-start font-normal font-foreground/50"
              >
                Rider Kedua
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex-shrink flex flex-col w-full mt-6 gap-4">
            <OpenModalButton
              view='rider-detail-view'
              variant='default'
              className='h-10 px-4 py-2 bg-brand font-bold hover:bg-brand/8'
            >
              Add Rider
            </OpenModalButton>
            <OpenModalButton
              view='rider-detail-view'
              variant='outline'
              className='h-10 px-4 py-2'
            >
              Add New
            </OpenModalButton>
          </div>
        </Container>
      </div>
    </Modal>
  )
}

export default RiderInfoModal;