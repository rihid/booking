'use client';

import React from 'react';
import { cn } from '@/assets/styles/utils';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-time-picker';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import axios from 'axios';
import { customerUrl } from '@/lib/data/endpoints';
import { toast } from 'sonner';
import { CustomerSchema } from '@/lib/schema';
import moment from 'moment';

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

function EditInfoForm({
  user,
  customer,
}: {
  user: any;
  customer: any;
}) {

  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: customer,
  })

  const birthdayVal = useWatch({
    control: form.control,
    name: 'birthday',
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log('values: ', values)
    startTransition(async () => {
      await axios.put(customerUrl + '/' + customer.id, values, {
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
    <div>
      <Form {...form}>
        <form
          action="post"
          className="w-full mx-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-3">
            <div className="w-full flex items-center justify-center">
              <div className="w-auto h-auto relative">
                <Image
                  src="/images/avatar.png"
                  alt='image'
                  width={96}
                  height={96}
                  className="w-full h-fullobject-contain rounded-full"
                />
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" disabled />
              </div>
            </div>
          </div>
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
  )
}

export default EditInfoForm;