import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const COST = 2 ** 15;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 3;
const KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;

async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      KEY_LENGTH,
      {
        N: COST,
        r: BLOCK_SIZE,
        p: PARALLELIZATION,
        maxmem: MAX_MEMORY,
      },
      (error, key) => {
        if (error) reject(error);
        else resolve(key);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);

  return [
    "scrypt",
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString("hex"),
    key.toString("hex"),
  ].join("$");
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, cost, blockSize, parallelization, saltHex, keyHex, ...extra] = encodedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    cost !== String(COST) ||
    blockSize !== String(BLOCK_SIZE) ||
    parallelization !== String(PARALLELIZATION) ||
    !/^[a-f0-9]{32}$/i.test(saltHex ?? "") ||
    !/^[a-f0-9]{128}$/i.test(keyHex ?? "") ||
    extra.length > 0
  ) {
    return false;
  }

  const expectedKey = Buffer.from(keyHex, "hex");
  const actualKey = await deriveKey(password, Buffer.from(saltHex, "hex"));

  return timingSafeEqual(actualKey, expectedKey);
}
