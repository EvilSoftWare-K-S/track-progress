import { JSX } from "react/jsx-runtime";

interface IAboutProps {
  aboutSite: {
    iconComponent: JSX.Element;
    title: string;
    text: string;
  }[];
}

export default function AboutBlock({ aboutSite }: IAboutProps) {
  return (
    <section className="border-t bg-white py-24">
      <div className=" container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-3">
          {aboutSite.map((about) => {
            return (
              <div key={about.title} className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  {about.iconComponent}
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  {about.title}
                </h3>
                <p className="text-muted-foreground">{about.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
