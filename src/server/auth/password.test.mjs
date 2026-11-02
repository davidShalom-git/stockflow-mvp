import assert from "node:assert/strict";
import { test } from "node:test";
import { hashPassword, verifyPassword } from "./password.ts";

test("passwords are stored as scrypt hashes and verify correctly", async () => {
  const encoded = await hashPassword("correct horse battery staple");

  assert.match(encoded, /^scrypt\$32768\$8\$3\$/);
  assert.notEqual(encoded, "correct horse battery staple");
  assert.equal(await verifyPassword("correct horse battery staple", encoded), true);
});

test("password verification rejects wrong passwords and malformed hashes", async () => {
  const encoded = await hashPassword("correct horse battery staple");

  assert.equal(await verifyPassword("wrong password", encoded), false);
  assert.equal(await verifyPassword("anything", "not-a-valid-hash"), false);
});
