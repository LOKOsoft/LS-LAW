/**
 * Security headers applied via `next.config.ts`'s `headers()` — no nonce-based
 * CSP here deliberately: nonces force every page into dynamic rendering
 * (see Next.js's CSP guide), which would be a real behavior change to an
 * app that currently has no reason to give that up. `'unsafe-inline'` on
 * style-src is required because Tailwind/Radix/next-themes inject inline
 * styles; tightening this to a nonce-based policy is real follow-up work,
 * not done here, if/when this ships as a public-facing hosted product.
 */
export function buildContentSecurityPolicy(isProduction: boolean): string {
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return policy.join("; ");
}

export const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
