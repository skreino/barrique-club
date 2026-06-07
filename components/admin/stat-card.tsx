import { Card } from "@/components/ui/card";

export function StatCard({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return (
    <Card className="min-h-32">
      <p className="text-sm text-pewter">{label}</p>
      <p className="mt-4 font-display text-4xl font-bold text-vellum">{value}</p>
      <p className="mt-2 text-xs leading-5 text-champagne">{hint}</p>
    </Card>
  );
}
