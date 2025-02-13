import React from "react";
import { Metadata } from "next";
import HomePage from "./homepage-client";

export const metadata: Metadata = {
  title: 'Home | Booking Safari',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang',
};

function Home() {
  return <HomePage />
}

export default Home;
