import { BreadcrumbClient } from "@/components/bread-crumb";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={
        "min-h-screen container mx-auto flex flex-col px-4 bg-background"
      }
    >
      <BreadcrumbClient />
      {children}
    </main>
  );
}
