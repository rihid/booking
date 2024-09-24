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
import { login } from '@/lib/action/login';

function LoginForm() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");

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

  // const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
  //   const body = values;
  //   let authUser: { [key: string]: any } = {};

  //   await axios.post(loginUrl, body)
  //     .then(response => {
  //       console.log(response.data)
  //       authUser.token = response.data.token
  //       window.localStorage.setItem('authUser', JSON.stringify(authUser))
  //     })
  //     .catch(error => {
  //       console.log(error)
  //       throw error
  //     })

  //   await axios.get(userTokenUrl, { headers: getHeader() })
  //     .then(response => {
  //       console.log(response.data.data)
  //       authUser.user = response.data.data
  //       window.localStorage.setItem('authUser', JSON.stringify(authUser))
  //       // store.commit('SET_AUTH_USER', response.data.data)
  //       router.push('/explore')
  //     })
  //     .catch(error => {
  //       console.log(error)
  //       throw error
  //     })
  // }

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const body = values;
    login(values)
  }

  return (
    <Form {...form}>
      <form
        action=""
        className="w-full mx-auto space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* <FormError message={error} /> */}
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