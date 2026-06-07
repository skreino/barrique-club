import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { favoriteLabels, formatShortDate, initials } from "@/lib/utils";

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  birthday: string | null;
  favorite_category: string | null;
  last_visit_at: string | null;
  customer_tags?: { tags: { id: string; name: string } | { id: string; name: string }[] | null }[];
};

export function CustomerCard({ customer }: { customer: Customer }) {
  const name = `${customer.first_name} ${customer.last_name}`.trim();

  return (
    <Link href={`/admin/customers/${customer.id}`}>
      <Card className="transition hover:border-champagne/45">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-champagne/30 bg-burgundy/35 font-display text-xl text-vellum">
            {initials(customer.first_name, customer.last_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-vellum">{name}</p>
            <p className="truncate text-sm text-pewter">{customer.email}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-champagne" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-champagne/20 px-3 py-1 text-champagne">
            {favoriteLabels[customer.favorite_category ?? ""] ?? "Preferenza libera"}
          </span>
          <span className="rounded-full border border-crema/10 px-3 py-1 text-pewter">
            Ultima visita: {formatShortDate(customer.last_visit_at)}
          </span>
          <span className="rounded-full border border-crema/10 px-3 py-1 text-pewter">
            Compleanno: {formatShortDate(customer.birthday)}
          </span>
          {customer.customer_tags?.map((item) => {
            const tag = Array.isArray(item.tags) ? item.tags[0] : item.tags;
            return tag ? (
              <span key={tag.id} className="rounded-full bg-crema/10 px-3 py-1 text-crema">
                {tag.name}
              </span>
            ) : null;
          })}
        </div>
      </Card>
    </Link>
  );
}
