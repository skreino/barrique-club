import Image from "next/image";

export function LogoMark({ size = 64 }: { size?: number }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Caffe Barrique Bar & Vineria"
      width={size}
      height={Math.round(size * 0.78)}
      className="rounded-md object-contain shadow-[0_12px_34px_rgba(0,0,0,0.22)]"
      priority
    />
  );
}
