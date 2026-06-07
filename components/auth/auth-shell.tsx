import Image from "next/image";
import { LogoMark } from "@/components/ui/logo-mark";

export function AuthShell({ children, title, text }: { children: React.ReactNode; title: string; text: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6">
      <Image
        src="/images/688423940_17891605284470185_5986886901103737639_n.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-20"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-espresso/70 via-espresso/92 to-espresso" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-7 flex justify-center">
          <LogoMark size={118} />
        </div>
        <div className="barrique-panel rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
            Barrique Club
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-none text-vellum">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-pewter">{text}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
