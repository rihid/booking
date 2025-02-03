'use client';

import React from 'react';
import Heading from '@/components/ui/heading';
import { Ratings } from '@/components/ui/ratings';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/assets/styles/utils';
import axios from 'axios';
import { bookingUrl } from '@/lib/data/endpoints';
import { getBooking } from '@/lib/data';
import { SingleBookingSchema } from '@/lib/schema';
import { toast } from 'sonner';

interface RatingValue {
  rating: string | null;
  rating_notes: string | null
}

const FormFieldSchema = z.object({
  id: z.string().nullable(),
  rating: z.string().min(1, {
    message: "Rating is required.",
  }),
  rating_notes: z.string().nullable()
});

function RatingForm({
  user,
  invoiceId,
  numberId,
  ratingVal
}: {
  user: any;
  invoiceId: string;
  numberId: string;
  ratingVal: RatingValue;
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [ratingValue, setRatingValue] = React.useState<RatingValue>(ratingVal);
  const { control, register, handleSubmit, setValue, reset, formState: { errors }, } = useForm<z.infer<typeof FormFieldSchema>>({
    resolver: zodResolver(FormFieldSchema),
    defaultValues: {
      id: null,
      rating: '',
      rating_notes: ''
    }
  });

  const getBookingData = async () => {
    const data = await getBooking(user.token, invoiceId)
    if (data) {
      const numberVal = data.numbers.find(dn => dn.id === numberId);
      setRatingValue({
        rating: numberVal.rating,
        rating_notes: numberVal.rating_notes
      });
    }
  }

  const onSubmit = async (values: z.infer<typeof FormFieldSchema>) => {
    setIsLoading(true);
    const body = {
      ...values,
      id: numberId,
    }
    axios.post(bookingUrl + '/book/number/set-rating-number', body, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } })
      .then(response => {
        console.log(response.data);
        toast.success(response.data.message);
        getBookingData();
      }).catch(error => {
        console.log(error);
        toast.error(error.response.data.message);
        throw error;
      }).finally(() => {
        reset();
        setIsLoading(false);
      })
  };

  return (
    <>
      {ratingValue.rating !== null ?
        (
          <div className="flex flex-col gap-4 justify-center items-center mb-8">
            <Heading variant='base' className="font-semibold">How&apos;s Your Experience</Heading>
            <div className="flex flex-col items-center">
              <Ratings
                rating={parseInt(ratingValue.rating)}
                variant='yellow'
                size={32}
                disabled
              />
            </div>
            <div className="flex items-center justify-center">
              <blockquote className="text-sm italic text-muted-foreground">
                <p>&quot;{ratingValue.rating_notes}&quot;.</p>
              </blockquote>
            </div>
          </div>
        )
        :
        (
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 justify-center items-center mb-8">
              <Heading variant='base' className="font-semibold">How&apos;s Your Experience</Heading>
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
        )

      }
    </>
  );
}

export default RatingForm;
