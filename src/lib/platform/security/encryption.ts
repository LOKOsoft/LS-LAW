export interface EncryptionService {
  encrypt(plaintext: string): Promise<string>;
  decrypt(ciphertext: string): Promise<string>;
}

/**
 * Passthrough placeholder — does NOT encrypt anything. Exists so future code
 * that needs to encrypt a field at rest (e.g. a stored third-party API key)
 * can depend on `EncryptionService` from day one; swapping in a real
 * implementation (envelope encryption via a KMS, or `crypto.subtle` with a
 * managed key) later doesn't require touching call sites, only this file's
 * `getEncryptionService()` wiring.
 *
 * Password hashing is unaffected — that's `src/lib/auth/password.ts`
 * (`crypto.scrypt`), already real, and out of scope for this placeholder.
 */
export class NoopEncryptionService implements EncryptionService {
  async encrypt(plaintext: string): Promise<string> {
    return plaintext;
  }
  async decrypt(ciphertext: string): Promise<string> {
    return ciphertext;
  }
}

export function getEncryptionService(): EncryptionService {
  return new NoopEncryptionService();
}
