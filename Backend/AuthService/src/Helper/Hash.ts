import argon2 from "argon2";

// Hash a plaintext password
export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    // You can optionally pass in options to tune memory, time cost, etc.
    const hash = await argon2.hash(plainPassword, {
      type: argon2.argon2id, // Argon2id is recommended for password hashing
      memoryCost: 2 ** 16, // Default memory cost (adjust as needed)
      timeCost: 3, // Number of iterations
      parallelism: 1, // Parallelism factor
    });
    // console.log("Hashed password:", hash);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

// Verify a plaintext password against a stored hash
export async function verifyPassword(
  plainPassword: string,
  hash: string
): Promise<boolean> {
  try {
    const isValid = await argon2.verify(hash, plainPassword);
    console.log("Password match:", isValid);
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
