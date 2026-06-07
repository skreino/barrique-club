import { Card } from "@/components/ui/card";

export function ProgressCard({ visits, required }: { visits: number; required: number }) {
  const progress = Math.min(100, Math.round((visits / required) * 100));
  const remaining = Math.max(required - visits, 0);

  return (
    <Card className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-pewter">Progresso premio</p>
          <h2 className="font-display text-4xl font-semibold text-vellum">{visits}/{required}</h2>
        </div>
        <p className="max-w-[9rem] text-right text-sm leading-5 text-champagne">
          {remaining === 0 ? "Premio pronto da ritirare" : `${remaining} visite al prossimo brindisi`}
        </p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-crema/10">
        <div className="h-full rounded-full bg-champagne transition-all" style={{ width: `${progress}%` }} />
      </div>
    </Card>
  );
}
