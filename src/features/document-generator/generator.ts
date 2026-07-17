import type { GeneratedDocumentType } from "@/generated/prisma/client";
import { format } from "date-fns";
import { getDocumentTypeMeta } from "@/features/document-generator/types";
import { getDocumentSchema, type DocumentFormData } from "@/features/document-generator/schemas";

/**
 * Deterministic, template-based legal document drafting — not an LLM call.
 * Given validated structured form data, assembles real document text via
 * string templates. This is what "AI Document Generator" means for a
 * structured-input flow: the "intelligence" is the field schema + clause
 * structure, not a language model. See docs/DOCUMENT_GENERATION.md for why
 * this is deliberately not routed through `AIProvider`.
 */

function fmtDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : format(parsed, "do MMMM yyyy");
}

function signatureBlock(...parties: string[]): string {
  return parties.map((p) => `\n\n_________________________\n${p}`).join("");
}

type Generator<T extends GeneratedDocumentType> = (fields: DocumentFormData<T>) => string;

const generators: { [K in GeneratedDocumentType]: Generator<K> } = {
  LEGAL_NOTICE: (f) => `LEGAL NOTICE

To,
${f.recipientName}
${f.recipientAddress}

From,
${f.senderName}
${f.senderAddress}

Subject: ${f.subject}

Dear ${f.recipientName},

Under instructions from and on behalf of my client, ${f.senderName}, I serve upon you the following notice:

${f.grievanceDetails}

You are hereby called upon to remedy the above within ${f.responseDeadlineDays} days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, entirely at your risk, cost, and consequences.

A copy of this notice is retained in our records.
${signatureBlock(`${f.senderName} (or Counsel on their behalf)`)}`,

  NDA: (f) => `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is made effective as of ${fmtDate(f.effectiveDate)}, by and between ${f.disclosingParty} ("Disclosing Party") and ${f.receivingParty} ("Receiving Party").

1. PURPOSE
The parties wish to explore ${f.purpose}, during which the Disclosing Party may share confidential information with the Receiving Party.

2. CONFIDENTIALITY OBLIGATIONS
The Receiving Party agrees to hold all confidential information in strict confidence and not to disclose it to any third party without the Disclosing Party's prior written consent.

3. TERM
This Agreement shall remain in effect for a period of ${f.termYears} year(s) from the Effective Date.

4. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.governingLaw}.
${signatureBlock(f.disclosingParty, f.receivingParty)}`,

  EMPLOYMENT_AGREEMENT: (f) => `EMPLOYMENT AGREEMENT

This Employment Agreement is entered into on ${fmtDate(f.startDate)} between ${f.employerName} ("Employer") and ${f.employeeName} ("Employee").

1. POSITION
The Employee is appointed as ${f.designation}, effective ${fmtDate(f.startDate)}.

2. PROBATION
The Employee shall serve a probation period of ${f.probationMonths} month(s) from the start date.

3. COMPENSATION
The Employee shall be paid an annual salary of ${f.annualSalary}, payable in accordance with the Employer's standard payroll practice.

4. TERMINATION
Either party may terminate this Agreement by providing ${f.noticePeriodDays} days' written notice.

5. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.governingLaw}.
${signatureBlock(`${f.employerName} (Employer)`, `${f.employeeName} (Employee)`)}`,

  SERVICE_AGREEMENT: (f) => `SERVICE AGREEMENT

This Service Agreement is entered into between ${f.serviceProvider} ("Service Provider") and ${f.client} ("Client").

1. SCOPE OF SERVICES
${f.servicesDescription}

2. FEES
The Client shall pay the Service Provider fees of ${f.fees}. ${f.paymentTerms}

3. TERM
This Agreement shall remain in effect for ${f.termMonths} month(s) from the date of execution, unless terminated earlier in accordance with its terms.

4. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.governingLaw}.
${signatureBlock(`${f.serviceProvider} (Service Provider)`, `${f.client} (Client)`)}`,

  VENDOR_AGREEMENT: (f) => `VENDOR AGREEMENT

This Vendor Agreement is entered into between ${f.vendorName} ("Vendor") and ${f.buyerName} ("Buyer").

1. GOODS/SERVICES
${f.goodsOrServices}

2. DELIVERY TERMS
${f.deliveryTerms}

3. PAYMENT TERMS
${f.paymentTerms}

4. TERM
This Agreement shall remain in effect for ${f.termMonths} month(s) from the date of execution.
${signatureBlock(`${f.vendorName} (Vendor)`, `${f.buyerName} (Buyer)`)}`,

  SHAREHOLDER_AGREEMENT: (f) => `SHAREHOLDER AGREEMENT

This Shareholder Agreement governs the relationship among the shareholders of ${f.companyName}.

1. PARTIES
${f.shareholders}

2. SHARE CAPITAL
The Company's total issued share capital is ${f.totalShares} shares.

3. TRANSFER RESTRICTIONS
${f.transferRestrictions}

4. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.governingLaw}.
${signatureBlock("For and on behalf of each Shareholder")}`,

  POWER_OF_ATTORNEY: (f) => `POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS that I, ${f.principalName} ("Principal"), do hereby appoint ${f.agentName} ("Agent") as my true and lawful attorney-in-fact.

1. POWERS GRANTED
${f.powersGranted}

2. EFFECTIVE DATE
This Power of Attorney is effective from ${fmtDate(f.effectiveDate)}${f.expiryDate ? ` and shall remain valid until ${fmtDate(f.expiryDate)}` : " and shall remain valid until revoked in writing"}.

IN WITNESS WHEREOF, the Principal has executed this Power of Attorney.
${signatureBlock(`${f.principalName} (Principal)`)}`,

  AFFIDAVIT: (f) => `AFFIDAVIT

I, ${f.deponentName}, residing at ${f.deponentAddress}, do hereby solemnly affirm and state as follows:

${f.statementBody}

I state that the above is true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

Verified at ${f.place} on this ${fmtDate(f.affidavitDate)}.
${signatureBlock(`${f.deponentName} (Deponent)`)}`,

  WILL: (f) => `LAST WILL AND TESTAMENT

I, ${f.testatorName}, residing at ${f.testatorAddress}, being of sound mind, do hereby declare this to be my Last Will and Testament, revoking all prior wills and codicils.

1. BENEFICIARIES
${f.beneficiaries}

2. EXECUTOR
I appoint ${f.executorName} as the Executor of this Will.

3. RESIDUARY ESTATE
${f.residuaryClause}

IN WITNESS WHEREOF, I have signed this Will in the presence of witnesses.
${signatureBlock(`${f.testatorName} (Testator)`, "Witness 1", "Witness 2")}`,

  LEASE_AGREEMENT: (f) => `LEASE AGREEMENT

This Lease Agreement is entered into between ${f.lessorName} ("Lessor") and ${f.lesseeName} ("Lessee") for the property located at ${f.propertyAddress}.

1. TERM
The lease shall commence on ${fmtDate(f.leaseStartDate)} and expire on ${fmtDate(f.leaseEndDate)}.

2. RENT
The Lessee shall pay a monthly rent of ${f.monthlyRent}, payable in advance.

3. SECURITY DEPOSIT
The Lessee shall pay a refundable security deposit of ${f.securityDeposit}.

4. GOVERNING LAW
This Agreement shall be governed by the laws of ${f.governingLaw}.
${signatureBlock(`${f.lessorName} (Lessor)`, `${f.lesseeName} (Lessee)`)}`,

  PARTNERSHIP_DEED: (f) => `PARTNERSHIP DEED

This Deed of Partnership establishes ${f.firmName} among the following partners:

${f.partners}

1. CAPITAL CONTRIBUTION
${f.capitalContribution}

2. PROFIT SHARING
Profits and losses shall be shared in the ratio of ${f.profitSharingRatio}.

3. NATURE OF BUSINESS
${f.businessNature}
${signatureBlock("For and on behalf of each Partner")}`,

  PRIVACY_POLICY: (f) => `PRIVACY POLICY

Effective ${fmtDate(f.effectiveDate)}, this Privacy Policy describes how ${f.companyName} ("we", "us") collects and uses information from visitors to ${f.websiteUrl}.

1. INFORMATION WE COLLECT
${f.dataCollected}

2. CONTACT US
For questions about this Privacy Policy, contact us at ${f.contactEmail}.`,

  TERMS_AND_CONDITIONS: (f) => `TERMS & CONDITIONS

Effective ${fmtDate(f.effectiveDate)}, these Terms & Conditions govern your use of ${f.websiteUrl}, operated by ${f.companyName}.

1. ACCEPTANCE OF TERMS
By accessing or using the site, you agree to be bound by these Terms.

2. GOVERNING LAW
These Terms shall be governed by the laws of ${f.governingLaw}.`,

  GENERAL_CONTRACT: (f) => `CONTRACT

This Contract is entered into between ${f.partyA} ("Party A") and ${f.partyB} ("Party B").

1. PURPOSE
${f.purpose}

2. CONSIDERATION
In consideration of the mutual promises herein, Party B shall pay Party A an amount of ${f.considerationAmount}.

3. TERM
This Contract shall remain in effect for ${f.termMonths} month(s) from the date of execution.

4. GOVERNING LAW
This Contract shall be governed by the laws of ${f.governingLaw}.
${signatureBlock(`${f.partyA} (Party A)`, `${f.partyB} (Party B)`)}`,

  CORPORATE_RESOLUTION: (f) => `CORPORATE RESOLUTION

Certified true copy of a resolution passed by the Board of Directors of ${f.companyName} at a meeting held on ${fmtDate(f.resolutionDate)}.

PRESENT:
${f.boardMembers}

RESOLVED THAT:
${f.resolutionText}
${signatureBlock("Company Secretary / Authorized Signatory")}`,
};

export function generateDocumentContent<T extends GeneratedDocumentType>(type: T, fields: unknown): string {
  const schema = getDocumentSchema(type);
  const parsed = schema.parse(fields) as DocumentFormData<T>;
  return (generators[type] as Generator<T>)(parsed);
}

export function suggestDocumentTitle(type: GeneratedDocumentType, fields: Record<string, unknown>): string {
  const meta = getDocumentTypeMeta(type);
  const primaryName =
    (fields.recipientName as string) ??
    (fields.employeeName as string) ??
    (fields.client as string) ??
    (fields.buyerName as string) ??
    (fields.companyName as string) ??
    (fields.lesseeName as string) ??
    (fields.testatorName as string) ??
    (fields.deponentName as string) ??
    (fields.principalName as string) ??
    (fields.partyB as string) ??
    (fields.firmName as string);
  return primaryName ? `${meta.label} — ${primaryName}` : meta.label;
}

/** Extracts an expiry date from field data where the document type has a natural end/expiry field — populates `GeneratedDocument.expiresAt` so the Risk Analysis Engine can flag it. Returns null for types with no such field. */
export function extractExpiryDate(type: GeneratedDocumentType, fields: Record<string, unknown>): Date | null {
  const raw = type === "LEASE_AGREEMENT" ? fields.leaseEndDate : type === "POWER_OF_ATTORNEY" ? fields.expiryDate : undefined;
  if (typeof raw !== "string" || raw.length === 0) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
