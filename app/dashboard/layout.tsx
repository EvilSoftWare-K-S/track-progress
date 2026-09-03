import { Suspense } from "react";
import { BreadcrumbClient } from "@/components/bread-crumb";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-full bg-background">
      <Suspense fallback={null}>
        <BreadcrumbClient />
        {children}
      </Suspense>
    </main>
  );
}
