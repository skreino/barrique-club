import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Plus, Tag, Wine } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/form";
import { addCheckin, addNote, addTagToCustomer, removeTagFromCustomer } from "@/lib/actions";
import { favoriteLabels, formatDate, whatsappUrl } from "@/lib/utils";

export default async function CustomerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: customer }, { data: checkins }, { data: notes }, { data: tags }, { count: visits }] =
    await Promise.all([
      supabase.from("customers").select("*").eq("id", id).single(),
      supabase.from("checkins").select("*").eq("customer_id", id).order("created_at", { ascending: false }).limit(12),
      supabase.from("notes").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
      supabase.from("customer_tags").select("tag_id, tags(id, name)").eq("customer_id", id),
      supabase.from("checkins").select("id", { count: "exact", head: true }).eq("customer_id", id)
    ]);

  if (!customer) notFound();

  const name = `${customer.first_name} ${customer.last_name}`.trim();
  const whatsApp = whatsappUrl(customer.phone, customer.first_name);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle eyebrow="Scheda cliente" title={name}>
          {favoriteLabels[customer.favorite_category] ?? "Preferenza da scoprire"} Â- {customer.email}
        </SectionTitle>
        {whatsApp ? (
          <ButtonLink href={whatsApp} target="_blank" rel="noreferrer" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </ButtonLink>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pewter">Visite registrate</p>
              <p className="font-display text-5xl text-vellum">{visits ?? 0}</p>
            </div>
            <Wine className="h-8 w-8 text-champagne" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-crema/5 p-3">
              <p className="text-pewter">Telefono</p>
              <p className="mt-1 break-words text-vellum">{customer.phone || "Non indicato"}</p>
            </div>
            <div className="rounded-md bg-crema/5 p-3">
              <p className="text-pewter">Compleanno</p>
              <p className="mt-1 text-vellum">{formatDate(customer.birthday)}</p>
            </div>
            <div className="rounded-md bg-crema/5 p-3">
              <p className="text-pewter">Ultima visita</p>
              <p className="mt-1 text-vellum">{formatDate(customer.last_visit_at)}</p>
            </div>
            <div className="rounded-md bg-crema/5 p-3">
              <p className="text-pewter">Marketing</p>
              <p className="mt-1 text-vellum">{customer.marketing_consent ? "Si" : "No"}</p>
            </div>
          </div>
          <form action={addCheckin}>
            <input type="hidden" name="customer_id" value={customer.id} />
            <Button className="w-full gap-2" type="submit">
              <Plus className="h-4 w-4" />
              Segna check-in
            </Button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-champagne" />
            <h2 className="font-display text-2xl text-vellum">Tag e note</h2>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {tags?.length ? (
              tags.map((item) => {
                const tag = Array.isArray(item.tags) ? item.tags[0] : item.tags;
                return tag ? (
                  <form key={item.tag_id} action={removeTagFromCustomer}>
                    <input type="hidden" name="customer_id" value={customer.id} />
                    <input type="hidden" name="tag_id" value={item.tag_id} />
                    <button className="rounded-full bg-crema/10 px-3 py-1 text-xs text-crema" type="submit">
                      {tag.name} Ã—
                    </button>
                  </form>
                ) : null;
              })
            ) : (
              <p className="text-sm text-pewter">Nessun tag ancora.</p>
            )}
          </div>
          <form action={addTagToCustomer} className="mb-6 flex gap-2">
            <input type="hidden" name="customer_id" value={customer.id} />
            <input className={inputClass} name="tag_name" placeholder="Aggiungi tag" />
            <Button type="submit" variant="ghost">Aggiungi</Button>
          </form>
          <form action={addNote} className="space-y-3">
            <input type="hidden" name="customer_id" value={customer.id} />
            <Field label="Nota interna">
              <textarea className={inputClass} name="content" rows={4} placeholder="Preferenze, richieste, dettagli utili..." />
            </Field>
            <Button type="submit" variant="wine">Salva nota</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl text-vellum">Note</h2>
          <div className="mt-4 space-y-3">
            {notes?.length ? notes.map((note) => (
              <div key={note.id} className="rounded-md border border-champagne/15 bg-crema/5 p-3">
                <p className="text-sm leading-6 text-crema">{note.content}</p>
                <p className="mt-2 text-xs text-pewter">{formatDate(note.created_at)}</p>
              </div>
            )) : <p className="text-sm text-pewter">Nessuna nota salvata.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl text-vellum">Ultime visite</h2>
          <div className="mt-4 space-y-3">
            {checkins?.length ? checkins.map((checkin) => (
              <div key={checkin.id} className="rounded-md border border-champagne/15 bg-crema/5 p-3">
                <p className="text-sm text-crema">{formatDate(checkin.created_at)}</p>
                <p className="text-xs text-pewter">Origine: {checkin.source}</p>
              </div>
            )) : <p className="text-sm text-pewter">Nessun check-in registrato.</p>}
          </div>
        </Card>
      </div>
      <Link className="text-sm font-semibold text-champagne" href="/admin/customers">Torna alla lista clienti</Link>
    </div>
  );
}

