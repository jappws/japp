
import { redirect } from "next/navigation";
import { getCompanyExistance } from "@/lib/utils";
import { RegisterPageClientSider } from "@/components/register";

export default async function RegisterPage() {
  const company = await getCompanyExistance();

  if (company) {
    redirect("/ws");
  }

  return (
    <div>
      <RegisterPageClientSider />
    </div>
  );
}
