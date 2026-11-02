import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-stockflow_session" : "stockflow_session";

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    expires: expiresAt,
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser() {
  const token = await readSessionToken();
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: {
      id: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          organization: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  return session.user;
}
