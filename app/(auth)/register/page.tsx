import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { signUp } from "@/lib/actions";

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      title="La tua card Barrique."
      text="Pochi dati, quelli giusti: cosi possiamo accoglierti meglio quando torni al banco."
    >
      {params.error ? (
        <p className="mb-4 rounded-md border border-wine/40 bg-wine/15 p-3 text-sm text-crema">
          {params.error}
        </p>
      ) : null}
      <form action={signUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome">
            <input className={inputClass} name="first_name" required />
          </Field>
          <Field label="Cognome">
            <input className={inputClass} name="last_name" required />
          </Field>
        </div>
        <Field label="Email">
          <input className={inputClass} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Telefono">
          <input className={inputClass} name="phone" type="tel" autoComplete="tel" />
        </Field>
        <Field label="Data di nascita">
          <input className={inputClass} name="birthday" type="date" />
        </Field>
        <Field label="Cosa scegli piu spesso da Barrique?">
          <select className={inputClass} name="favorite_category" required defaultValue="aperitivo">
            <option value="colazione">Colazione</option>
            <option value="aperitivo">Aperitivo</option>
            <option value="vino">Vino</option>
            <option value="cocktail">Cocktail</option>
          </select>
        </Field>
        <Field label="Password">
          <input
            className={inputClass}
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            required
          />
        </Field>
        <label className="flex items-start gap-3 rounded-md border border-champagne/20 bg-crema/5 p-3 text-sm leading-5 text-pewter">
          <input name="marketing_consent" type="checkbox" className="mt-1 accent-champagne" />
          <span>Acconsento a ricevere inviti e comunicazioni dal Caffe Barrique.</span>
        </label>
        <Button className="w-full" type="submit">Crea la card</Button>
      </form>
      <p className="mt-5 text-center text-sm text-pewter">
        Hai gia un account?{" "}
        <Link className="font-semibold text-champagne" href="/login">
          Accedi
        </Link>
      </p>
    </AuthShell>
  );
}
