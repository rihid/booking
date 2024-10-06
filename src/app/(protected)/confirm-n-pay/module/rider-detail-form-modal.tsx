'use client';

import React from 'react';
import { cn } from '@/assets/styles/utils';
import Modal from '@/components/ui/modal';
import Container from '@/components/ui/container';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CloseButton from '@/components/ui/button/close-button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-time-picker';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomerFieldSchema, CustomerSchema } from '@/lib/schema';
import axios from 'axios';
import { customerUrl } from '@/lib/data/endpoints';
import { useBookStore } from '@/providers/store-providers/book-provider';

type Props = {
  token: any;
  idx: number;
  customer: any;
}
function RiderDetailFormModal({
  token,
  idx,
  customer
}: Props) {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  const { editCustomer, customers } = useBookStore(state => state);

  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CustomerFieldSchema>>({
    resolver: zodResolver(CustomerFieldSchema),
    defaultValues: customer,
    // defaultValues: {
    //   customer_no: '',
    //   name: "",
    //   address: null,
    //   phone: null,
    //   email: "",
    //   identity_number: null,
    //   vat: null,
    //   rating: null,
    //   birthday: null,
    //   age: null,
    //   org_no: "",
    //   type: "individual",
    //   from: ""
    // }
  })
  const onSubmit = (values: z.infer<typeof CustomerFieldSchema>) => {
    startTransition(async () => {
      // console.log(values)
      await axios.post(customerUrl, values, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          const data = CustomerSchema.parse(response.data.data);
          console.log(data)
          editCustomer(idx, {
            ...customers[idx],
            ...data,
          })
        })
        .catch(error => {
          console.log(error);
          throw error
        })
    })
  }
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
          <Heading variant='lg' className="text-center text-foreground/75">Rider Detail</Heading>
          <div className="mt-6 w-full space-y-6">
            <Form {...form}>
              <form
                action="post"
                className="w-full mx-auto"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-3">
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="identity_number"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">ID Card</Label>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="ID Card"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Name"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="birthday"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">Birthday</Label>
                          {/* <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Birthday"
                              type="text"
                            />
                          </FormControl> */}
                          <div>
                            <DatePicker 
                              {...field} 
                              granularity='day' 
                              value={field.value} 
                              onChange={field.onChange}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">Phone Number</Label>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Phone Number"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">Address</Label>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Address"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-6">
                  <Button type='submit' className="bg-brand font-bold hover:bg-brand/80">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </Container>
      </div>
    </Modal>
  )
}

export default RiderDetailFormModal;
