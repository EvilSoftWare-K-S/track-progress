import ImageTabs from "@/components/image-tabs/image-tabs";
import { FIELDVALUES } from "@/components/image-tabs/const";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";
import { ABOUTSITE } from "@/components/about-block/const";
import AboutBlock from "@/components/about-block/about-block";

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className=" flex-1">
        <section className=" container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold">
              The best way to track the progress of something.
            </h1>
            <p className="text-muted-foreground mb-10 text-xl">
              Capture, organize, and manage your progress in one place.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href={"/sign-up"}>
                <Button size="lg" className="h-12 px-8 text-lg font-medium">
                  Start for free <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-mutted-foreground">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        </section>

        <ImageTabs fieldValues={FIELDVALUES} />

        <AboutBlock aboutSite={ABOUTSITE} />
      </main>
    </div>
  );
}
