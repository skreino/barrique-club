import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-champagne">Barrique Club</p>
        <h1 className="mt-3 font-display text-4xl text-vellum">Pagina non trovata</h1>
        <p className="mt-3 text-sm leading-6 text-pewter">Questo tavolo non e apparecchiato. Torna alla tua area.</p>
        <ButtonLink className="mt-6" href="/login">Torna all'accesso</ButtonLink>
      </Card>
    </main>
  );
}
