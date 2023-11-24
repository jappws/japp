import AccountClientLayout from "@/components/ws/bankAndCredits/account/layout";


export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <AccountClientLayout>{children}</AccountClientLayout>
    </div>
  );
}
