import { requireCustomer } from "@/lib/auth";
import { CustomerShell } from "@/components/club/customer-shell";

export default async function ClubLayout({ children }: { children: React.ReactNode }) {
  await requireCustomer();
  return <CustomerShell>{children}</CustomerShell>;
}
