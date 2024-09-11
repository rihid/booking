import React from 'react';
import HeaderImageCarausel from '@/components/partial/header/header-image-carausel';
import Container from '@/components/ui/container';
import { MapPin, Clock, Star, Check, Camera, ShowerHead, GlassWater, CupSoda, Bath } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShowMoreButton from '@/components/partial/about-product-detail/show-more-button';

function Detail() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderImageCarausel className="shrink-0" />
      <div className="flex-1 w-full py-7 mb-20">
        <Container className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand truncate mr-4">
            Mangrove Morosari
          </h2>
          <div className="flex items-center text-xs font-normal text-foreground/50">
            <span className="mr-1">Marina</span>
            <MapPin className="inline-block text-brand w-4 h-4" />
          </div>
        </Container>
        <Container>
          <Card className="my-4">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center text-foreground/50 gap-x-2">
                <Clock className="inline-block w-5 h-5" />
                <span className="font-normal text-xs">Duration 2.5 Hours</span>
              </div>
              <div className="flex justify-center items-center text-foreground/50 gap-x-2">
                <Star className="w-4 h-4" fill="#F6891F" strokeWidth={0} />
                <p className="inline-block text-xs font-normal">4.9 (120 reviews)</p>
              </div>
            </CardContent>
          </Card>
        </Container>
        <Container className="mt-1">
          <dl className="space-y-4">
            <div className="flex items-start gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                <Check className="w-5 h-5" />
              </dt>
              <dd className="text-foreground/75 mt-0 pt-0">
                <h3 className="text-sm font-normal tracking-tight">Self Riding</h3>
                <p className="text-xs text-foreground/50">You can ride your own Jetsky</p>
              </dd>
            </div>
            <div className="flex items-start gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                <Check className="w-5 h-5" />
              </dt>
              <dd className="text-foreground/75 mt-0 pt-0">
                <h3 className="text-sm font-normal tracking-tight">Captain Companion</h3>
                <p className="text-xs text-foreground/50">You trip guided by our captain</p>
              </dd>
            </div>
          </dl>
        </Container>
        <Container className="flex flex-col w-full mx-auto mt-5">
          <h3 className="font-bold text-sm text-foreground/75 mb-3">Benefits</h3>
          <dl className="space-y-4">
            <div className="flex items-start gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                <Camera className="w-5 h-5" />
              </dt>
              <dd className="text-foreground/75 mt-0 pt-0">
                <h3 className="text-sm font-normal tracking-tight">Documentation Include</h3>
                <p className="text-xs text-foreground/50">Kita sudah menyediakan Handuk, Sampo, Sabun dan Sunblock
                  jika diperlukan </p>
              </dd>
            </div>
            <div className="flex items-start gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                <Bath className="w-5 h-5" />
              </dt>
              <dd className="text-foreground/75 mt-0 pt-0">
                <h3 className="text-sm font-normal tracking-tight">Bathroom Essential Provided</h3>
                <p className="text-xs text-foreground/50">Kita sudah menyediakan Handuk, Sampo, Sabun dan Sunblock
                  jika diperlukan </p>
              </dd>
            </div>
            <div className="flex items-start gap-x-6 gap-y-4">
              <dt className="text-sm font-medium text-foreground/50">
                <CupSoda className="w-5 h-5" />
              </dt>
              <dd className="text-foreground/75 mt-0 pt-0">
                <h3 className="text-sm font-normal tracking-tight">Snack & Mineral Water</h3>
                <p className="text-xs text-foreground/50">Tersedia snack dan mineral water untuk setiap 1 unit jetski</p>
              </dd>
            </div>
          </dl>
        </Container>
        <Container el="article" className="flex flex-col mx-auto mt-5">
          <h3 className="font-bold text-sm text-foreground/75 mb-3">About</h3>
          <div className="text-foreground/50 font-normal text-xs">
            <p className="">Suitable for beginners who want to ride with a view of the ships
              outside the harbor, you can also enjoy the beautiful sunset on the
              open sea in the afternoon. What an Experience.
              <ShowMoreButton />
              {/* <button type="button" className="inline-block ml-1 text-brand hover:underline hover:underline-offset-1">Show More</button> */}
            </p>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Detail;