import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("barrique-panel rounded-lg p-5", className)} {...props} />;
}

export function SectionTitle({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-4xl font-semibold leading-none text-vellum">{title}</h1>
      {children ? <p className="max-w-xl text-sm leading-6 text-pewter">{children}</p> : null}
    </div>
  );
}
