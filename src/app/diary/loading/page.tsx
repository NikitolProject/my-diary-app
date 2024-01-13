"use client"

import Image from "next/image"

import redBlurredLights from "@/../public/effects/red_blurred_lights.svg";

export default function LoadingPage() {
  return (
    <div className="container relative  h-[80vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[950px]">
          <div className="flex flex-col space-y-2 px-10">
            <h1 className="text-7xl font-semibold tracking-tight">
              Hi!
            </h1>
            <h1 className="text-7xl font-semibold tracking-tight">
              Time to write
            </h1>
            <h1 className="text-7xl font-semibold tracking-tight">
              your next record
            </h1>
            <p className="text-sm text-[29px] py-5 text-muted-foreground">
              Diary for keeping daily notes
            </p>
          </div>
        </div>
      </div>
      <div className="-z-100 ml-[15vh]">
        <Image alt="loading-background-image" src={redBlurredLights} />
      </div>
    </div>
  );
}
