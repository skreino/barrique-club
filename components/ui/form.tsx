import { cn } from "@/lib/utils";

export function Field({
  label,
  className,
  children
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-sm font-semibold text-crema/90">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-champagne/20 bg-[#100b09]/82 px-3 py-3 text-sm text-vellum outline-none transition placeholder:text-pewter/65 focus:border-champagne/60 focus:bg-[#130e0b] focus:ring-2 focus:ring-champagne/20";
