'use client';

import React from 'react';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormError from '@/components/ui/form-error';
import { postAuth } from '@/lib/data';
import axios from 'axios';
import { loginUrl, userTokenUrl, getHeader } from '@/lib/config/api';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/action/auth';

function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");

  const LoginSchema = z.object({
    username: z.string({
      message: "Email/Username is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const res = await postAuth(values);
    login(res.token)
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
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Password"
                    type="password"
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
          <Button type='submit' className="bg-brand font-bold hover:bg-brand/80">Login</Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm;