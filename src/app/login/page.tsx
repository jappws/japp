import { LoginPageClientSide } from "@/components/login";
import { getCompanyExistance } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const company = await getCompanyExistance();

  if (typeof company === "undefined") {
    redirect("/register");
  }

  return (
    <div>
      <LoginPageClientSide />
    </div>
  );
}
