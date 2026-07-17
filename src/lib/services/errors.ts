/** Thrown by business-rule assertions; server actions surface `.message` directly to the caller. Kept dependency-free so it's safe to import from client components. */
export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessRuleError";
  }
}
