import assert from "node:assert/strict";
import { test } from "node:test";
import { loginSchema, signupSchema } from "./schemas.ts";

test("signup normalizes email and organization name", () => {
  const result = signupSchema.safeParse({
    email: "  OWNER@EXAMPLE.COM ",
    password: "a long enough password",
    organizationName: "  My Store  ",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "owner@example.com");
    assert.equal(result.data.organizationName, "My Store");
  }
});

test("signup rejects invalid email, short password, and extra client fields", () => {
  assert.equal(
    signupSchema.safeParse({
      email: "bad-email",
      password: "short",
      organizationName: "Store",
      organizationId: "client-controlled",
    }).success,
    false,
  );
});

test("login normalizes email and preserves the password exactly", () => {
  const result = loginSchema.safeParse({ email: " OWNER@example.com ", password: " pass word " });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "owner@example.com");
    assert.equal(result.data.password, " pass word ");
  }
});
