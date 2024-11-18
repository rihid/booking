'use client';

import React from 'react';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { LoginFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/input-password';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormError from '@/components/ui/form-error';
import { Loader2 } from 'lucide-react';
import { postAuth } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/action/auth';
import axios from 'axios';
import { loginUrl } from '@/lib/data/endpoints';
import { AuthSchema } from '@/lib/schema';
import { toast } from 'sonner';
import { cn } from '@/assets/styles/utils';

function LoginForm() {
  const router = useRouter()
  // const [isPending, startTransition] = React.useTransition();
  const [isPending, setIspending] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setIspending(true);
    axios.post(loginUrl, values)
      .then((response) => {
        console.log(response)
        const data = response.data;

        if (response.status === 200) {
          login(data.token);
          toast.success('Success!');
        }
      })
      .catch(error => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIspending(false)
      })

    // startTransition(() => {
    //   postAuth(values)
    //     .then(response => {
    //       console.log(response)
    //       if (response) {
    //         login(response.token);
    //       }
    //     })
    //     .catch(error => {
    //       setError(error.message);
    //       console.log(error)
    //     });
    // })
  }

  return (
    <Form {...form}>
      <form
        action=""
        className="w-full mx-auto space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormError message={error} />
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Email/Username"
                    type="text"
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
                    disabled={isPending}
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-foreground/50 text-right font-light mb-2">
            <Link href={"#"} className="hover:text-brand/80 hover:underline hover:underline-offset-2">Forgot your password?</Link>
          </div>
          <Button type='submit' disabled={isPending} className="bg-brand font-bold hover:bg-brand/80">
            {isPending &&
              <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />
            }
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm;