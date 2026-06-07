import { requireCustomer } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/form";
import { updateCustomerProfile } from "@/lib/actions";

export default async function ProfilePage() {
  const { supabase, user } = await requireCustomer();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Profilo" title="I tuoi dettagli.">
        Tienili aggiornati: bastano poche cose per accoglierti con piu cura.
      </SectionTitle>
      <Card>
        <form action={updateCustomerProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome">
              <input className={inputClass} name="first_name" defaultValue={customer?.first_name ?? ""} required />
            </Field>
            <Field label="Cognome">
              <input className={inputClass} name="last_name" defaultValue={customer?.last_name ?? ""} required />
            </Field>
          </div>
          <Field label="Telefono">
            <input className={inputClass} name="phone" type="tel" defaultValue={customer?.phone ?? ""} />
          </Field>
          <Field label="Data di nascita">
            <input className={inputClass} name="birthday" type="date" defaultValue={customer?.birthday ?? ""} />
          </Field>
          <Field label="Preferenza principale">
            <select className={inputClass} name="favorite_category" defaultValue={customer?.favorite_category ?? "aperitivo"}>
              <option value="colazione">Colazione</option>
              <option value="aperitivo">Aperitivo</option>
              <option value="vino">Vino</option>
              <option value="cocktail">Cocktail</option>
            </select>
          </Field>
          <label className="flex items-start gap-3 rounded-md border border-champagne/20 bg-crema/5 p-3 text-sm leading-5 text-pewter">
            <input
              name="marketing_consent"
              type="checkbox"
              className="mt-1 accent-champagne"
              defaultChecked={customer?.marketing_consent ?? false}
            />
            <span>Voglio ricevere inviti e comunicazioni dal Caffe Barrique.</span>
          </label>
          <Button className="w-full" type="submit">Salva profilo</Button>
        </form>
      </Card>
    </div>
  );
}
