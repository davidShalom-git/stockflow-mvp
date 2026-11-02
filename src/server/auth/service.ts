import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./password";
import { createSessionToken, hashSessionToken, SESSION_TTL_SECONDS } from "./session";
import type { LoginInput, SignupInput } from "./schemas";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function makeSession() {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  return { token, tokenHash: hashSessionToken(token), expiresAt };
}

export async function registerUser(input: SignupInput) {
  const passwordHash = await hashPassword(input.password);
  const session = makeSession();

  try {
    const user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          email: input.email,
          passwordHash,
          organization: { create: { name: input.organizationName } },
        },
        select: {
          id: true,
          email: true,
          organization: { select: { id: true, name: true } },
        },
      });

      await transaction.session.create({
        data: {
          tokenHash: session.tokenHash,
          userId: createdUser.id,
          expiresAt: session.expiresAt,
        },
      });

      return createdUser;
    });

    return { user, token: session.token, expiresAt: session.expiresAt };
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new EmailAlreadyRegisteredError();
    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      organization: { select: { id: true, name: true } },
    },
  });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new InvalidCredentialsError();
  }

  const session = makeSession();
  await prisma.session.create({
    data: {
      tokenHash: session.tokenHash,
      userId: user.id,
      expiresAt: session.expiresAt,
    },
  });

  return {
    user: { id: user.id, email: user.email, organization: user.organization },
    token: session.token,
    expiresAt: session.expiresAt,
  };
}

export async function revokeSession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
}
