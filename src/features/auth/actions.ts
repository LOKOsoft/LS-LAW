"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";
import { loginSchema, type LoginInput } from "@/features/auth/schema";

export async function login(input: LoginInput) {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !verifyPassword(data.password, user.passwordHash)) {
    throw new Error("Invalid email or password.");
  }
  if (user.status !== "ACTIVE") {
    throw new Error("This account is inactive. Contact your firm administrator.");
  }

  await createSession(user.id);
  return { homePath: ROLE_HOME[user.role] };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
