import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("container px-4 md:px-6 py-8 md:py-12 lg:py-16", className)}
      {...props}
    />
  );
}