"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export function BreadcrumbClient() {
  const pathSegments = usePathname()
    .split("/")
    .filter((segment) => segment !== "");
  const accumulatedPaths = pathSegments.reduce((acc, segment, index) => {
    const prevPath = index > 0 ? acc[index - 1] : "";
    acc.push(prevPath + "/" + segment);
    return acc;
  }, [] as string[]);

  return (
    <Breadcrumb className={"flex h-8 items-center px-4"}>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const fullPath = accumulatedPaths[index];
          const editSegment = segment.replaceAll("-", " ");
          return (
            <Fragment key={fullPath}>
              {index === 0 ? <></> : <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{editSegment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={fullPath}>{editSegment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
