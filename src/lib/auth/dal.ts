import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { getSessionUser } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";

export async function requireUser(expectedRole?: Role) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (expectedRole && user.role !== expectedRole) {
    redirect(ROLE_HOME[user.role]);
  }

  return user;
}

export async function requirePortalUser() {
  const user = await requireUser(Role.CLIENT);

  if (!user.clientId) {
    redirect("/login");
  }

  const client = await prisma.client.findUnique({ where: { id: user.clientId } });
  if (!client) {
    redirect("/login");
  }

  return { user, client };
}
