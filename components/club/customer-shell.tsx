import Link from "next/link";
import { CreditCard, LogOut, UserRound } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";
import { signOut } from "@/lib/actions";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto min-h-screen w-full max-w-3xl px-4 pb-24 pt-4">
      <header className="sticky top-0 z-20 -mx-4 border-b border-champagne/10 bg-[#120d0b]/88 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/club" className="flex items-center gap-3">
            <LogoMark size={50} />
            <div>
              <p className="font-display text-lg font-bold leading-none text-vellum">Barrique Club</p>
              <p className="mt-1 text-xs font-medium text-pewter">La tua card digitale</p>
            </div>
          </Link>
          <form action={signOut}>
            <button className="rounded-full border border-champagne/20 p-2 text-champagne" aria-label="Esci">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>
      <div className="py-6">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-champagne/15 bg-[#120d0b]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3">
          <Link className="flex items-center justify-center gap-2 rounded-md border border-champagne/15 bg-crema/8 px-3 py-3 text-sm font-semibold text-crema shadow-rim" href="/club">
            <CreditCard className="h-4 w-4 text-champagne" />
            Club
          </Link>
          <Link className="flex items-center justify-center gap-2 rounded-md border border-champagne/15 bg-crema/8 px-3 py-3 text-sm font-semibold text-crema shadow-rim" href="/club/profile">
            <UserRound className="h-4 w-4 text-champagne" />
            Profilo
          </Link>
        </div>
      </nav>
    </main>
  );
}
