import { GlassWater } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card className="text-center">
      <GlassWater className="mx-auto h-8 w-8 text-champagne" />
      <h3 className="mt-4 font-display text-2xl text-vellum">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-pewter">{text}</p>
    </Card>
  );
}
