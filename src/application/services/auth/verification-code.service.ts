import { env } from "@/infrastructure/config/env.config";
import AppException from "@/shared/utils/exception.util";
import crypto from "crypto";

export interface VerificationCode {
  code: string;
  expiresAt: Date;
}

class VerificationCodeService {
  generateCode(length: number, expirationMinutes: number): VerificationCode {
    // Generate a random number using crypto
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);

    // Use the secret code as part of the generation
    const secretCode = env.secretCode || "default-secret";
    const combined = `${randomNumber}${secretCode}`;

    // Create a hash of the combined value
    const hash = crypto.createHash("sha256").update(combined).digest("hex");

    // Take the first 'length' characters and pad if necessary
    const code = hash.slice(0, length).toUpperCase();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    return { code, expiresAt };
  }

  isExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  validateCode(
    inputCode: string,
    storedCode: string | null | undefined,
    expiresAt: Date | null | undefined
  ): boolean {
    if (!storedCode || !expiresAt) {
      throw new AppException("No verification code found", 400);
    }

    if (this.isExpired(expiresAt)) {
      throw new AppException("Verification code has expired", 400);
    }

    return inputCode.toUpperCase() === storedCode.toUpperCase();
  }
}

export default new VerificationCodeService();
