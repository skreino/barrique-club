"use client";

import { QRCodeSVG } from "qrcode.react";

export function CustomerQr({ value }: { value: string }) {
  return (
    <div className="rounded-lg bg-vellum p-3">
      <QRCodeSVG value={value} size={132} bgColor="#fff9ef" fgColor="#17110e" level="M" />
    </div>
  );
}
