"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/input-password';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { authUrl } from '@/lib/data/endpoints';
import { toast } from 'sonner';

const RegisterFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required"
  }),
  email: z.string().min(1, {
    message: "Email is required"
  }),
  org_no: z.string().nullable(),
  branch_no: z.string().nullable(),
  username: z.string().nullable(),
  password: z.string()
    .min(8, { message: "At least 8 characters" })
    .regex(new RegExp(/(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*+-])/), { message: " At least contains number & special expression" }),
  avatar: z.string().nullable()
})

function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false); 

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      org_no: "C0003",
      branch_no: null,
      username: null,
      password: "",
      avatar: null
    }
  });

  const onSubmit = async(values: z.infer<typeof RegisterFormSchema>) => {
    console.log('submit: ', values);
    setIsLoading(true)
    await axios.post(authUrl + '/user', values)
      .then(response => {
        toast.success(response.data.message);
        setIsLoading(false)
        console.log('crete user', response.data.data);
        const data = response.data.data
        if(data) {
          router.push('/login')
        }
      })
      .catch(error => {
        setIsLoading(false)
        toast.error(error.response.data.message);
        console.log(error);
      })
  }
  return (
    <Form {...form}>
      <form
        action=""
        className="w-full mx-auto space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  placeholder="Name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  placeholder="Email"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isLoading}
                  placeholder="Password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col mt-2">
          <Button type='submit' disabled={isLoading} className="bg-brand font-bold hover:bg-brand/80">
            {isLoading &&
              <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />
            }
            Register
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm;