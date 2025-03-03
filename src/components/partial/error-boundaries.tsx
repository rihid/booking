'use client';
 
import React from "react";
import Heading from "../ui/heading";
import { Button } from "../ui/button/button";
 
export default function ErrorBoundaries({
  message,
}: {
  message: string;
}) {
 
  console.log("Error code:", message);
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <Heading className="text-center">Something went wrong!</Heading>
      <Button size="sm" className=" mt-3 bg-brand hover:bg-brand/90 text-sm rounded transition-colors" onClick={() => window.location.reload()}>Try Again</Button>
    </main>
  );
}