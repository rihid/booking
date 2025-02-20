'use client';

import React from 'react';
import { cn } from '@/assets/styles/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Container from '@/components/ui/container';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CloseButton from '@/components/ui/button/close-button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-time-picker';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { CustomerFieldSchema, CustomerSchema } from '@/lib/schema';
import axios from 'axios';
import { customerUrl, userUrl } from '@/lib/data/endpoints';
import { useBookStore } from '@/providers/store-providers/book-provider';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
const initialData = {
  id: "",
  customer_no: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  identity_number: "",
  vat: "",
  rating: "",
  birthday: "",
  age: "",
  org_no: "",
  type: "",
}
const FormSchema = z.object({
  id: z.optional(z.string().nullable()),
  customer_no: z.string().nullable(),
  name: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable().refine((val) => val !== null && val.length >= 4, {
    message: "Phone number is required"
  }),
  email: z.string().nullable(),
  identity_number: z.string().nullable().refine((val) => val !== null && val.length >= 1, {
    message: "ID Card is required"
  }),
  vat: z.string().nullable(),
  rating: z.string().nullable(),
  birthday: z.any().nullable(),
  age: z.string().nullable(),
  org_no: z.string().nullable(),
  type: z.string().nullable(),
  from: z.optional(z.string().nullable()),
})

function CustomerAddModal({
  user,
}: {
  user?: any;
}) {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  })

  const birthdayVal = useWatch({
    control: form.control,
    name: 'birthday',
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      await axios.post(customerUrl, values, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + user.token
        }
      })
        .then(response => {
          const data = CustomerSchema.parse(response.data.data);
          console.log(response.data)
          if (data) {
            toast.success(response.data.message)
          }
        })
        .catch(error => {
          console.log(error);
          toast.error(error.message)
        })
      closeModal();
    })
  }

  React.useEffect(() => {
    if (birthdayVal) {
      const birth = new Date(birthdayVal)
      const dayNow = new Date()
      const diff = new Date(dayNow.getTime() - birth.getTime())
      const age = diff.getFullYear() - 1970;

      form.setValue('age', age.toString(), { shouldValidate: true });
    } else {
      form.setValue('age', '', { shouldValidate: true });
    }
  }, [birthdayVal, form]);

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
          <SheetTitle className="text-center text-foreground/75">Add Rider</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow w-full">
          <div className="pb-10 px-4 mt-5">
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
                              isMask
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
                              required
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
                          <div>
                            <DatePicker
                              {...field}
                              yearRange={80}
                              granularity='day'
                              value={field.value}
                              onChange={field.onChange}
                              disabled={isPending}
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
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">Age</Label>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Age"
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xs text-muted-foreground">Phone Number</Label>
                          <FormControl>
                            <div className="relative">
                              <div className="h-10 w-10 absolute top-1/2 left-0 transform border-r border-input rounded-l-md -translate-y-1/2 flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">+62</p>
                              </div>
                              <Input
                                {...field}
                                isPhone
                                disabled={isPending}
                                placeholder="81..."
                                type="text"
                                className="pl-12"
                              />
                            </div>
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
                  <Button type='submit' disabled={isPending} className="bg-brand font-bold hover:bg-brand/80">
                    {isPending &&
                      <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />
                    }
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CustomerAddModal;
