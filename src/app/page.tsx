import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";

export default async function RootPage() {
  const user = await getSessionUser();
  redirect(user ? ROLE_HOME[user.role] : "/login");
}
