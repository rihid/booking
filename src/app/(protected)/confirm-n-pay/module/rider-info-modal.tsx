'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import CloseButton from '@/components/ui/button/close-button';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import OpenModalButton from '@/components/ui/button/open-modal-button';
import { useUiLayoutStore } from '@/store/ui-layout';
import { getCustomerByNoMulti, getUserCustomerList } from '@/lib/data';
import { useBookStore } from '@/providers/store-providers/book-provider';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  idx: number;
  customer: any;
  user: any;
  // userCustomer: any;
}

function RiderInfoModal({
  idx,
  customer,
  user,
  // userCustomer,
}: Props) {
  const { showModal, closeModal, openModal } = useUiLayoutStore(state => state);
  const { customers, setCustomer, editCustomer } = useBookStore(state => state);
  const [rider, setRider] = React.useState<string>("");
  const [customerList, setCustomerList] = React.useState<any>([]);
  const [selectedUserCustomer, setSelectedUserCustomer] = React.useState<any>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  console.log('customer User', selectedUserCustomer)

  const handleAddRider = (value: any) => {
    value.rider_type = customer.rider_type;
    console.log('customer value', value)
    openModal('rider-detail-view')
    setCustomer(value);
    setSelectedUserCustomer(value)
  }

  const handleAddRiderType = (type: string, user: any) => {
    const data = {
      id: user.id,
      customer_no: user.customer_no,
      name: user.name,
      address: user.address,
      phone: user.phone,
      email: user.email,
      identity_number: user.identity_number,
      vat: user.vat,
      rating: user.rating,
      birthday: user.birthday,
      age: user.age,
      org_no: user.org_no,
      type: user.type,
      from: user.from,
      rider_type: type
    }
    console.log(data)
    editCustomer(idx, {
      ...customers[idx],
      ...data
    })
    console.log('customers')
    console.log(customers)
  }
  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      const data = await getUserCustomerList(user.token, user)
      let customerNo = []
      for (let i = 0; i < data.length; i++) {
        customerNo.push(data[i].customer_no)

      }
      const customers = await getCustomerByNoMulti(user.token, customerNo);
      console.log(customers)
      const customerArr = [];
      for (let j = 0; j < data.length; j++) {
        const dataCustomers = customers.find((c: any) => c.customer_no === data[j].customer_no);
        customerArr.push({
          id: data[j].id,
          user_id: data[j].user_id,
          customer_no: data[j].customer_no,
          type: data[j].type,
          customer_id: dataCustomers.id,
          name: dataCustomers.name,
          address: dataCustomers.address,
          phone: dataCustomers.phone,
          email: dataCustomers.email,
          identity_number: dataCustomers.identity_number,
          vat: dataCustomers.vat,
          org_no: dataCustomers.org_no,
          rating: dataCustomers.rating,
          birthday: dataCustomers.birthday,
          age: dataCustomers.age,
          sosmeds: dataCustomers.sosmeds,
          prospects: dataCustomers.prospects,
          books: dataCustomers.books,
        })
      }
      setCustomerList(customerArr)
      setIsLoading(false)
    }
    getData();
  }, [])
  React.useEffect(() => {
    console.log(isLoading)
  }, [isLoading])
  return (
    <Sheet
      open={showModal}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal();
        }
      }}
    >
      <SheetContent side="bottom" className="wrapper flex flex-col justify-between w-full h-3/4 rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-center text-foreground/75">Rider Information</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow w-full">
          <div className="px-4 mt-5 pb-10">
            <div className="mt-6 space-y-4">
              <ToggleGroup type="single" className="flex flex-col w-full gap-4" onValueChange={(value) => handleAddRider(value)}>
                <>
                  {customerList.map((uc: any, idx: number) => {
                    return (
                      <>
                        {!isLoading &&
                          <ToggleGroupItem key={idx} value={uc} className="w-full justify-start border border-muted-foreground rounded px-4 py-3 text-xs text-start font-normal font-foreground/50">{uc.name}</ToggleGroupItem>
                        }
                        {isLoading &&
                          <div></div>
                        }
                      </>
                    )
                  })}
                </>
              </ToggleGroup>
            </div>
            <div className="flex-shrink flex flex-col w-full mt-6 gap-4">
              <OpenModalButton view='rider-detail-view' className='h-10 px-4 py-2 text-background bg-brand hover:bg-brand/90'>Add New</OpenModalButton>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default RiderInfoModal;