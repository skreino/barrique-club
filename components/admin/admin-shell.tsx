import Link from "next/link";
import { Cake, LogOut, Settings, UsersRound, Wine } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";
import { signOut } from "@/lib/actions";

const nav = [
  { href: "/admin", label: "Vista", icon: Wine },
  { href: "/admin/customers", label: "Clienti", icon: UsersRound },
  { href: "/admin/birthdays", label: "Compleanni", icon: Cake },
  { href: "/admin/settings", label: "Setup", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-24 pt-4">
      <header className="sticky top-0 z-20 -mx-4 border-b border-champagne/10 bg-espresso/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoMark size={50} />
            <div>
              <p className="font-display text-xl leading-none text-vellum">Barrique Admin</p>
              <p className="text-xs text-pewter">Cura clienti e fidelity</p>
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
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-champagne/15 bg-[#120d0b]/95 px-3 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} className="flex flex-col items-center gap-1 rounded-md bg-crema/8 px-2 py-2 text-[11px] text-crema" href={item.href}>
                <Icon className="h-4 w-4 text-champagne" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
