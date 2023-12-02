import { AccountsClientLayout } from "@/components/ws/bankAndCredits/accounts/layout";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AccountsClientLayout>{children}</AccountsClientLayout>
    </div>
  );
}
