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
}: {
  user: any;
  invoiceId: string;
  numberId: string;
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [ratingValue, setRatingValue] = React.useState<RatingValue>({ rating: null, rating_notes: null });
  const { control, register, handleSubmit, setValue, reset, formState: { errors }, } = useForm<z.infer<typeof FormFieldSchema>>({
    resolver: zodResolver(FormFieldSchema),
    defaultValues: {
      id: null,
      rating: '',
      rating_notes: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof FormFieldSchema>) => {
    setIsLoading(true);
    const body = {
      ...values,
      id: numberId,
    }
    axios.post(bookingUrl + '/book/number/set-rating-number', body, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + user.token } }).then(response => {
      console.log(response.data);
      reset();
      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      throw error;
    })
  };

  React.useEffect(() => {
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
    getBookingData();
  }, []);
  return (
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
  );
}

export default RatingForm;
