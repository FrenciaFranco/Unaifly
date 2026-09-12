"use client";

import dynamic from "next/dynamic";

import HeroFuturistic from "@/components/ui/hero-futuristic";

const DigitalTransformation = dynamic(
  () => import("@/components/ui/digital-transformation"),
  { ssr: false }
);

export default function HomeClientSections() {
  return (
    <>
      <HeroFuturistic />
      <div id="soluciones" tabIndex={-1}>
        <DigitalTransformation />
      </div>
    </>
  );
}
