import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
}

export function Section({
  title,
  description,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-8 md:py-12 lg:py-16", className)} {...props}>
      {(title || description) && (
        <div className="space-y-2 mb-8 md:mb-12 text-center">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}