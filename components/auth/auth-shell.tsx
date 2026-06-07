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
        className="-z-20 object-cover opacity-24"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,13,11,0.62),rgba(18,13,11,0.94)_48%,rgba(18,13,11,1))]" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-7 flex justify-center">
          <LogoMark size={118} />
        </div>
        <div className="barrique-panel soft-rise rounded-lg p-5">
          <p className="text-xs font-bold uppercase text-champagne">
            Barrique Club
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-vellum">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-pewter">{text}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
