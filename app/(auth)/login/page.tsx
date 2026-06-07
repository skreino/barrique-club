import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { signIn } from "@/lib/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Bentornato."
      text="Accedi al club per seguire visite, premio e preferenze. Se sei il titolare, da qui entri anche nell'area admin."
    >
      {params.error ? (
        <p className="mb-4 rounded-md border border-wine/40 bg-wine/15 p-3 text-sm text-crema">
          {params.error}
        </p>
      ) : null}
      {params.message ? (
        <p className="mb-4 rounded-md border border-champagne/30 bg-champagne/10 p-3 text-sm text-crema">
          {params.message}
        </p>
      ) : null}
      <form action={signIn} className="space-y-4">
        <Field label="Email">
          <input className={inputClass} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password">
          <input
            className={inputClass}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Button className="w-full" type="submit">Entra nel club</Button>
      </form>
      <p className="mt-5 text-center text-sm text-pewter">
        Non hai ancora la card?{" "}
        <Link className="font-semibold text-champagne" href="/register">
          Registrati
        </Link>
      </p>
    </AuthShell>
  );
}
