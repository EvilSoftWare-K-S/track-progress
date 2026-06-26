"use client";

import { JSX, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageTabsProps {
  fieldValues: {
    name: string;
    stateTag: string;
    urlImg: string;
  }[];
}

export default function ImageTabs({
  fieldValues,
}: ImageTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState(fieldValues[0].stateTag);
  return (
    <section className="border-t bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-2 justify-center mb-8">
            {fieldValues.map((field) => {
              return (
                <Button
                  key={field.name}
                  onClick={() => setActiveTab(field.stateTag)}
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors 
                  ${activeTab === field.stateTag ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {field.name}
                </Button>
              );
            })}
          </div>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
            {fieldValues.map((field) => {
              return (
                activeTab === field.stateTag && (
                  <Image
                    key={field.name}
                    src={field.urlImg}
                    alt={field.name}
                    width={1200}
                    height={800}
                  />
                )
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
