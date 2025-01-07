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
import Link from 'next/link';

const ResetFormSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(8, { message: "At least 8 characters" })
    .regex(new RegExp(/(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*+-])/), { message: " At least contains number & special expression" }),
  confirmpassword: z.string()
    .min(1, { message: "Confirm password is required" }),
})
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

function NewPasswordForm({
  token,
}: {
  token: any;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dataReset, setDataReset] = React.useState(null)

  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      token: token,
      password: "",
      confirmpassword: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof ResetFormSchema>) => {
    setIsLoading(true)
    console.log(values)
    const { token, password } = values;
    const body = { token, password };
    console.log(body)
    await axios.post(authUrl + '/user/forgot-reset', body, { headers: { Accept: 'application/json' } })
      .then(response => {
        const data = response.data
        if (data) {
          setDataReset(data)
          toast.success(data.message)
        }
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  if (dataReset) {
    return (
      <div className="w-full mx-auto space-y-4">
        <Link href="/login" className="flex flex-col w-full">
          <Button className="bg-brand font-bold hover:bg-brand/80">Back to Login Page</Button>
        </Link>
      </div>
    )
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="New Password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmpassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="Confirm Password"
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default NewPasswordForm;