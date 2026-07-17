"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { loginRateLimiter } from "@/lib/platform/security/rate-limiter";
import { logger } from "@/lib/platform/logging/logger";

export async function login(input: LoginInput) {
  const data = loginSchema.parse(input);

  if (!loginRateLimiter.check(data.email.toLowerCase())) {
    logger.security("login_rate_limited", { email: data.email });
    throw new Error("Too many login attempts. Please wait a few minutes and try again.");
  }

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !verifyPassword(data.password, user.passwordHash)) {
    logger.security("login_failed", { email: data.email });
    throw new Error("Invalid email or password.");
  }
  if (user.status !== "ACTIVE") {
    throw new Error("This account is inactive. Contact your firm administrator.");
  }

  loginRateLimiter.reset(data.email.toLowerCase());
  await createSession(user.id);
  return { homePath: ROLE_HOME[user.role] };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
