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

const ResetFormSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email('This is not a valid email.')
})

function EmailForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof ResetFormSchema>) => {
    setIsLoading(true)
    await axios.post(authUrl + '/user/forgot-sent', values, { headers: { Accept: 'application/json' } })
      .then(response => {
        const data = response.data
        if (data) {
          toast.success(data.message)
        }
        console.log(data)
      })
      .catch(error => {
        console.log(error)
        toast.error(error.response.data.message);
        throw error
      })
      .finally(() => {
        setIsLoading(false)
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  placeholder="Email"
                  type="text"
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

export default EmailForm;