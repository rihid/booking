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

function CaptainRatingNewForm({
  user,
  crew,
}: {
  user: any;
  crew: any;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = React.useState(false);
  const [employee, setEmployee] = React.useState({ name: '', position: '' });
  const [submittedRating, setSubmittedRating] = React.useState({
    rating: crew.rating || null,
    rating_notes: crew.rating_notes || ''
  });

  const isMounted = React.useRef(true);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof FormFieldSchema>>({
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
    };

    try {
      const response = await axios.post(bookingUrl + '/book/unit/crew/rating', body,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const data = response.data.data;

      if (isMounted.current) {
        setSubmittedRating({
          rating: data.rating,
          rating_notes: data.rating_notes,
        });
        toast.success(response.data.message);
        reset();
      }
    } catch (error: any) {
      if (isMounted.current) {
        toast.error(error.response?.data?.message || 'Error');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const getEmployee = async () => {
    if (!crew.employee_no) return;

    setIsEmployeeLoading(true);
    try {
      const response = await axios.post(bookingUrl + '/employee/get-by-no', { employee_no: crew.employee_no },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      if (isMounted.current) {
        setEmployee(response.data.data);
      }
    } catch (error: any) {
      if (isMounted.current) {
        toast.error(error.response?.data?.message || 'Failed to load employee data');
      }
    } finally {
      if (isMounted.current) {
        setIsEmployeeLoading(false);
      }
    }
  };

  React.useEffect(() => {
    getEmployee();

    return () => {
      isMounted.current = false;
    };
  }, [crew.employee_no]);

  React.useEffect(() => {
    setSubmittedRating({
      rating: crew.rating || null,
      rating_notes: crew.rating_notes || ''
    });
    console.log('side effect jalan')
    setValue('rating', crew.rating || '');
    setValue('rating_notes', crew.rating_notes || '');
  }, [crew, setValue]);

  if (isEmployeeLoading) {
    return <RatingLoader />;
  }

  const employeeName = employee.name || '';
  const firstName = employeeName ? employeeName.split(' ')[0] : '';

  return (
    <>
      {submittedRating.rating !== null && submittedRating.rating_notes ? (
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
              <p className="text-sm font-medium">{employeeName}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {employee?.position}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center mb-8">
            <Heading variant="base" className="font-semibold">
              {firstName ? `How's ${firstName}'s Service` : "Service Rating"}
            </Heading>
          </div>
          <div className="flex flex-col items-center">
            <Ratings
              rating={parseInt(submittedRating.rating.toString() || "0")}
              variant="yellow"
              size={32}
              disabled
            />
          </div>
          <div className="flex items-center justify-center">
            <blockquote className="text-sm italic text-muted-foreground">
              <p>&quot;{submittedRating.rating_notes}&quot;</p>
            </blockquote>
          </div>
        </div>
      ) : (
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
                <p className="text-sm font-medium">{employeeName}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {employee.position}
                </p>
              </div>
            </div>
            <Heading variant="base" className="font-semibold">
              {firstName ? `How's ${firstName}'s Service` : "Service Rating"}
            </Heading>
            <div className="flex flex-col items-center">
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Ratings
                    {...field}
                    rating={parseInt(field.value) || 0}
                    onRatingChange={(value) => setValue('rating', value.toString())}
                    variant="yellow"
                    size={32}
                  />
                )}
              />
              {errors.rating && (
                <span role="alert" className="text-xs font-normal text-destructive">
                  {errors.rating.message}
                </span>
              )}
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Type your feedback here."
                {...register('rating_notes')}
              />
              {errors.rating_notes && (
                <span role="alert" className="text-xs font-normal text-destructive">
                  {errors.rating_notes.message}
                </span>
              )}
            </div>

            <div className="w-full flex items-center justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand/90"
              >
                {isLoading && <Loader2 className={cn('h-4 w-4 animate-spin', 'mr-2')} />}
                Submit
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default CaptainRatingNewForm;