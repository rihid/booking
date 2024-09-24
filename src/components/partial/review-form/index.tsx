import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button/button';
import Heading from '@/components/ui/heading';
import { Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

function ReviewForm() {
  return (
    <div className="w-full h-full">
      <form>
        <Card className="w-[350px] px-6 py-5">
          <CardHeader className="text-center border-b border-slate-200">
            <Heading variant='xl' className="text-brand">Thank you!</Heading>
            <CardDescription className="text-xs text-muted-foreground">Your Feedback is very helpfull to us</CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-center gap-1 text-brand">
                  <Star className="w-8 h-8" />
                  <Star className="w-8 h-8" />
                  <Star className="w-8 h-8" />
                  <Star className="w-8 h-8" />
                  <Star className="w-8 h-8" />
                </div>
              </div>
              <div className="flex flex-col">
                {/* <Input type='text' placeholder='add your feedback' className="outline-none border-none focus-visible:bg-none border-b border-slate-200 ring-transparent" /> */}
                <Input type='text' placeholder='add your feedback' />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="bg-brand hover:bg-brand/90">Send</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default ReviewForm;