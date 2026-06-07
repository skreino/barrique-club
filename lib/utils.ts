import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value?: string | null) {
  if (!value) return "Non indicata";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function formatShortDate(value?: string | null) {
  if (!value) return "Mai";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

export function initials(firstName?: string | null, lastName?: string | null) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "BC";
}

export function whatsappUrl(phone?: string | null, name?: string) {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  const message = encodeURIComponent(
    `Ciao ${name ?? ""}, ti aspettiamo al Caffe Barrique. Abbiamo pensato a te per il prossimo aperitivo.`
  );
  return `https://wa.me/${cleaned}?text=${message}`;
}

export const favoriteLabels: Record<string, string> = {
  colazione: "Colazione",
  aperitivo: "Aperitivo",
  vino: "Vino",
  cocktail: "Cocktail"
};
