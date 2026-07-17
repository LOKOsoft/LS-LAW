import type { GeneratedDocumentType } from "@/generated/prisma/client";

export type DocumentTypeMeta = {
  type: GeneratedDocumentType;
  label: string;
  category: string;
  description: string;
};

/** One entry per `GeneratedDocumentType` enum value — the catalog driving the Document Generator's type picker. Keep in sync with the enum in prisma/schema.prisma. */
export const DOCUMENT_TYPE_CATALOG: DocumentTypeMeta[] = [
  { type: "LEGAL_NOTICE", label: "Legal Notice", category: "Litigation", description: "Formal notice of a grievance or demand before legal action." },
  { type: "NDA", label: "Non-Disclosure Agreement", category: "Contracts", description: "Mutual or one-way confidentiality agreement." },
  { type: "EMPLOYMENT_AGREEMENT", label: "Employment Agreement", category: "Employment", description: "Terms of engagement between employer and employee." },
  { type: "SERVICE_AGREEMENT", label: "Service Agreement", category: "Contracts", description: "Terms for a service provider engagement." },
  { type: "VENDOR_AGREEMENT", label: "Vendor Agreement", category: "Contracts", description: "Terms for a goods/services vendor relationship." },
  { type: "SHAREHOLDER_AGREEMENT", label: "Shareholder Agreement", category: "Corporate", description: "Rights and obligations among a company's shareholders." },
  { type: "POWER_OF_ATTORNEY", label: "Power of Attorney", category: "Property", description: "Authorizes an agent to act on the principal's behalf." },
  { type: "AFFIDAVIT", label: "Affidavit", category: "Litigation", description: "Sworn written statement of fact." },
  { type: "WILL", label: "Will", category: "Estate", description: "Testamentary disposition of a person's estate." },
  { type: "LEASE_AGREEMENT", label: "Lease Agreement", category: "Property", description: "Terms for leasing property between lessor and lessee." },
  { type: "PARTNERSHIP_DEED", label: "Partnership Deed", category: "Corporate", description: "Terms governing a business partnership." },
  { type: "PRIVACY_POLICY", label: "Privacy Policy", category: "Compliance", description: "Discloses how a website/app collects and uses personal data." },
  { type: "TERMS_AND_CONDITIONS", label: "Terms & Conditions", category: "Compliance", description: "Terms of use for a website, app, or service." },
  { type: "GENERAL_CONTRACT", label: "General Contract", category: "Contracts", description: "General-purpose bilateral contract." },
  { type: "CORPORATE_RESOLUTION", label: "Corporate Resolution", category: "Corporate", description: "Formal record of a board/shareholder decision." },
];

export function getDocumentTypeMeta(type: GeneratedDocumentType): DocumentTypeMeta {
  const meta = DOCUMENT_TYPE_CATALOG.find((m) => m.type === type);
  if (!meta) throw new Error(`Unknown document type "${type}".`);
  return meta;
}
