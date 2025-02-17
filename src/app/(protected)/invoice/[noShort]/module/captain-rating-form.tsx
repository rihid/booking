'use client';

import React from 'react';
import Heading from '@/components/ui/heading';
import { Ratings } from '@/components/ui/ratings';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/assets/styles/utils';
import axios from 'axios';
import { bookingUrl } from '@/lib/data/endpoints';
import { toast } from 'sonner';
import { RatingLoader } from '@/components/partial/loader';

const FormFieldSchema = z.object({
  id: z.string().nullable(),
  rating: z.string().min(1, {
    message: "Rating is required.",
  }),
  rating_notes: z.string().min(1, {
    message: "Rating notes is required"
  })
});

function CaptainRatingForm({
  user,
  crew,
}: {
  user: any;
  crew: any;
}) {
  console.log(crew)
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [employee, setEmployee] = React.useState<any>({});
  const [ratingVal, setRatingVal] = React.useState({ rating: crew.rating, rating_notes: crew.rating_notes });

  const { control, register, handleSubmit, setValue, reset, formState: { errors }, } = useForm<z.infer<typeof FormFieldSchema>>({
    resolver: zodResolver(FormFieldSchema),
    defaultValues: {
      id: '',
      rating: crew.rating || '',
      rating_notes: crew.rating_notes || ''
    }
  });
  const onSubmit = async (values: z.infer<typeof FormFieldSchema>) => {
    setIsLoading(true);
    const body = {
      ...values,
      id: crew.id,
    }
    console.log(body)
    axios.post(bookingUrl + '/book/unit/crew/rating', body, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } })
      .then(response => {
        const data = response.data.data;
        setRatingVal({
          rating: data.rating,
          rating_notes: data.rating_notes,
        })
        toast.success(response.data.message);
      }).catch(error => {
        console.log(error);
        toast.error(error.response.data.message);
        throw error;
      }).finally(() => {
        reset();
        setIsLoading(false);
      })
  };

  const getEmployee = () => {
    setLoader(true);
    axios.post(bookingUrl + "/employee/get-by-no", { employee_no: crew.employee_no }, { headers: { Accept: 'application/json', Authorization: `Bearer ${user.token}` } })
      .then(response => {
        const data = response.data.data;
        setEmployee(data);
      })
      .catch(error => {
        console.log(error.response.status)
        console.log(error.response.data.message)
        throw error;
      })
      .finally(() => {
        setLoader(false)
      })
  }

  React.useEffect(() => {
    getEmployee()
  }, [crew])

  if (loader) {
    return <RatingLoader />
  }

  return (
    <>
      {ratingVal.rating !== null && ratingVal.rating_notes ?
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 justify-center">
            <Image
              src="/images/avatar.png"
              alt="avatar"
              width={42}
              height={42}
              className="object-contain rounded-full"
            />
            <div className="">
              <p className="text-sm font-medium">{employee.name}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {employee.position}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center mb-8">
            <Heading variant="base" className="font-semibold">

              How&apos;s {employee.name ? employee.name.split(' ')[0] : ''}&apos;s Service
            </Heading>
          </div>
          <div className="flex flex-col items-center">
            <Ratings rating={parseInt(crew.rating || "0")} variant="yellow" size={32} disabled />
          </div>
          <div className="flex items-center justify-center">
            <blockquote className="text-sm italic text-muted-foreground">
              <p>&quot;{crew.rating_notes}&quot;</p>
            </blockquote>
          </div>
        </div>
        :
        <form className="space-y-6 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-4 justify-center">
              <Image
                src="/images/avatar.png"
                alt="avatar"
                width={42}
                height={42}
                className="object-contain rounded-full"
              />
              <div className="">
                <p className="text-sm font-medium">{employee.name}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {employee.position}
                </p>
              </div>
            </div>
            <Heading variant='base' className="font-semibold">
              How&apos;s {employee.name ? employee.name.split(' ')[0] : ''}&apos;s Service
            </Heading>
            <div className="flex flex-col items-center">
              <Controller
                name='rating'
                control={control}
                render={({ field }) => (
                  <Ratings
                    {...field}
                    rating={parseInt(field.value) || 0}
                    onRatingChange={(value) => setValue('rating', value.toString())}
                    variant='yellow'
                    size={32}
                  />
                )}
              />
              {errors.rating && (
                <span role="alert" className="text-xs font-normal text-destructive">Rating is required</span>
              )}
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Type your feedback here."
                {...register('rating_notes')}
              />

            </div>

            <div className="w-full flex items-center justify-center">
              <Button
                type='submit'
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand/90"
              >
                {isLoading && <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />}
                Submit
              </Button>
            </div>
          </div>
        </form>
      }
    </>
  )
}

export default CaptainRatingForm;