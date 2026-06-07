import Image from "next/image";

export function LogoMark({ size = 64 }: { size?: number }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Caffe Barrique Bar & Vineria"
      width={size}
      height={Math.round(size * 0.78)}
      className="rounded-sm object-contain"
      priority
    />
  );
}
