import { z } from "zod";
import type { GeneratedDocumentType } from "@/generated/prisma/client";

const dateStr = z.string().min(1, "Date is required");

export const legalNoticeSchema = z.object({
  senderName: z.string().min(1),
  senderAddress: z.string().min(1),
  recipientName: z.string().min(1),
  recipientAddress: z.string().min(1),
  subject: z.string().min(1),
  grievanceDetails: z.string().min(1),
  responseDeadlineDays: z.coerce.number().int().positive().default(15),
});

export const ndaSchema = z.object({
  disclosingParty: z.string().min(1),
  receivingParty: z.string().min(1),
  effectiveDate: dateStr,
  purpose: z.string().min(1),
  termYears: z.coerce.number().int().positive().default(3),
  governingLaw: z.string().min(1).default("India"),
});

export const employmentAgreementSchema = z.object({
  employerName: z.string().min(1),
  employeeName: z.string().min(1),
  designation: z.string().min(1),
  startDate: dateStr,
  annualSalary: z.coerce.number().positive(),
  probationMonths: z.coerce.number().int().nonnegative().default(3),
  noticePeriodDays: z.coerce.number().int().positive().default(30),
  governingLaw: z.string().min(1).default("India"),
});

export const serviceAgreementSchema = z.object({
  serviceProvider: z.string().min(1),
  client: z.string().min(1),
  servicesDescription: z.string().min(1),
  fees: z.coerce.number().positive(),
  paymentTerms: z.string().min(1),
  termMonths: z.coerce.number().int().positive().default(12),
  governingLaw: z.string().min(1).default("India"),
});

export const vendorAgreementSchema = z.object({
  vendorName: z.string().min(1),
  buyerName: z.string().min(1),
  goodsOrServices: z.string().min(1),
  deliveryTerms: z.string().min(1),
  paymentTerms: z.string().min(1),
  termMonths: z.coerce.number().int().positive().default(12),
});

export const shareholderAgreementSchema = z.object({
  companyName: z.string().min(1),
  shareholders: z.string().min(1),
  totalShares: z.coerce.number().int().positive(),
  transferRestrictions: z.string().min(1),
  governingLaw: z.string().min(1).default("India"),
});

export const powerOfAttorneySchema = z.object({
  principalName: z.string().min(1),
  agentName: z.string().min(1),
  powersGranted: z.string().min(1),
  effectiveDate: dateStr,
  expiryDate: z.string().optional(),
});

export const affidavitSchema = z.object({
  deponentName: z.string().min(1),
  deponentAddress: z.string().min(1),
  statementBody: z.string().min(1),
  place: z.string().min(1),
  affidavitDate: dateStr,
});

export const willSchema = z.object({
  testatorName: z.string().min(1),
  testatorAddress: z.string().min(1),
  beneficiaries: z.string().min(1),
  executorName: z.string().min(1),
  residuaryClause: z.string().min(1),
});

export const leaseAgreementSchema = z.object({
  lessorName: z.string().min(1),
  lesseeName: z.string().min(1),
  propertyAddress: z.string().min(1),
  monthlyRent: z.coerce.number().positive(),
  securityDeposit: z.coerce.number().nonnegative(),
  leaseStartDate: dateStr,
  leaseEndDate: dateStr,
  governingLaw: z.string().min(1).default("India"),
});

export const partnershipDeedSchema = z.object({
  firmName: z.string().min(1),
  partners: z.string().min(1),
  capitalContribution: z.string().min(1),
  profitSharingRatio: z.string().min(1),
  businessNature: z.string().min(1),
});

export const privacyPolicySchema = z.object({
  companyName: z.string().min(1),
  websiteUrl: z.string().min(1),
  dataCollected: z.string().min(1),
  contactEmail: z.string().email(),
  effectiveDate: dateStr,
});

export const termsAndConditionsSchema = z.object({
  companyName: z.string().min(1),
  websiteUrl: z.string().min(1),
  governingLaw: z.string().min(1).default("India"),
  effectiveDate: dateStr,
});

export const generalContractSchema = z.object({
  partyA: z.string().min(1),
  partyB: z.string().min(1),
  purpose: z.string().min(1),
  considerationAmount: z.coerce.number().nonnegative(),
  termMonths: z.coerce.number().int().positive().default(12),
  governingLaw: z.string().min(1).default("India"),
});

export const corporateResolutionSchema = z.object({
  companyName: z.string().min(1),
  resolutionDate: dateStr,
  boardMembers: z.string().min(1),
  resolutionText: z.string().min(1),
});

export const DOCUMENT_SCHEMAS = {
  LEGAL_NOTICE: legalNoticeSchema,
  NDA: ndaSchema,
  EMPLOYMENT_AGREEMENT: employmentAgreementSchema,
  SERVICE_AGREEMENT: serviceAgreementSchema,
  VENDOR_AGREEMENT: vendorAgreementSchema,
  SHAREHOLDER_AGREEMENT: shareholderAgreementSchema,
  POWER_OF_ATTORNEY: powerOfAttorneySchema,
  AFFIDAVIT: affidavitSchema,
  WILL: willSchema,
  LEASE_AGREEMENT: leaseAgreementSchema,
  PARTNERSHIP_DEED: partnershipDeedSchema,
  PRIVACY_POLICY: privacyPolicySchema,
  TERMS_AND_CONDITIONS: termsAndConditionsSchema,
  GENERAL_CONTRACT: generalContractSchema,
  CORPORATE_RESOLUTION: corporateResolutionSchema,
} satisfies Record<GeneratedDocumentType, z.ZodTypeAny>;

export type DocumentFormData<T extends GeneratedDocumentType> = z.infer<(typeof DOCUMENT_SCHEMAS)[T]>;

export function getDocumentSchema(type: GeneratedDocumentType) {
  return DOCUMENT_SCHEMAS[type];
}

/** Field metadata for the dynamic form renderer — kept separate from the Zod schema since Zod doesn't carry UI hints (labels, multiline, field order) on its own. */
export type FieldKind = "text" | "textarea" | "number" | "date" | "email";

export type FieldMeta = { name: string; label: string; kind: FieldKind };

export const DOCUMENT_FIELD_META: Record<GeneratedDocumentType, FieldMeta[]> = {
  LEGAL_NOTICE: [
    { name: "senderName", label: "Sender name", kind: "text" },
    { name: "senderAddress", label: "Sender address", kind: "textarea" },
    { name: "recipientName", label: "Recipient name", kind: "text" },
    { name: "recipientAddress", label: "Recipient address", kind: "textarea" },
    { name: "subject", label: "Subject", kind: "text" },
    { name: "grievanceDetails", label: "Grievance details", kind: "textarea" },
    { name: "responseDeadlineDays", label: "Response deadline (days)", kind: "number" },
  ],
  NDA: [
    { name: "disclosingParty", label: "Disclosing party", kind: "text" },
    { name: "receivingParty", label: "Receiving party", kind: "text" },
    { name: "effectiveDate", label: "Effective date", kind: "date" },
    { name: "purpose", label: "Purpose of disclosure", kind: "textarea" },
    { name: "termYears", label: "Term (years)", kind: "number" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
  ],
  EMPLOYMENT_AGREEMENT: [
    { name: "employerName", label: "Employer name", kind: "text" },
    { name: "employeeName", label: "Employee name", kind: "text" },
    { name: "designation", label: "Designation", kind: "text" },
    { name: "startDate", label: "Start date", kind: "date" },
    { name: "annualSalary", label: "Annual salary", kind: "number" },
    { name: "probationMonths", label: "Probation period (months)", kind: "number" },
    { name: "noticePeriodDays", label: "Notice period (days)", kind: "number" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
  ],
  SERVICE_AGREEMENT: [
    { name: "serviceProvider", label: "Service provider", kind: "text" },
    { name: "client", label: "Client", kind: "text" },
    { name: "servicesDescription", label: "Description of services", kind: "textarea" },
    { name: "fees", label: "Fees", kind: "number" },
    { name: "paymentTerms", label: "Payment terms", kind: "textarea" },
    { name: "termMonths", label: "Term (months)", kind: "number" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
  ],
  VENDOR_AGREEMENT: [
    { name: "vendorName", label: "Vendor name", kind: "text" },
    { name: "buyerName", label: "Buyer name", kind: "text" },
    { name: "goodsOrServices", label: "Goods/services", kind: "textarea" },
    { name: "deliveryTerms", label: "Delivery terms", kind: "textarea" },
    { name: "paymentTerms", label: "Payment terms", kind: "textarea" },
    { name: "termMonths", label: "Term (months)", kind: "number" },
  ],
  SHAREHOLDER_AGREEMENT: [
    { name: "companyName", label: "Company name", kind: "text" },
    { name: "shareholders", label: "Shareholders", kind: "textarea" },
    { name: "totalShares", label: "Total shares", kind: "number" },
    { name: "transferRestrictions", label: "Transfer restrictions", kind: "textarea" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
  ],
  POWER_OF_ATTORNEY: [
    { name: "principalName", label: "Principal name", kind: "text" },
    { name: "agentName", label: "Agent name", kind: "text" },
    { name: "powersGranted", label: "Powers granted", kind: "textarea" },
    { name: "effectiveDate", label: "Effective date", kind: "date" },
    { name: "expiryDate", label: "Expiry date (optional)", kind: "date" },
  ],
  AFFIDAVIT: [
    { name: "deponentName", label: "Deponent name", kind: "text" },
    { name: "deponentAddress", label: "Deponent address", kind: "textarea" },
    { name: "statementBody", label: "Statement", kind: "textarea" },
    { name: "place", label: "Place", kind: "text" },
    { name: "affidavitDate", label: "Date", kind: "date" },
  ],
  WILL: [
    { name: "testatorName", label: "Testator name", kind: "text" },
    { name: "testatorAddress", label: "Testator address", kind: "textarea" },
    { name: "beneficiaries", label: "Beneficiaries", kind: "textarea" },
    { name: "executorName", label: "Executor name", kind: "text" },
    { name: "residuaryClause", label: "Residuary clause", kind: "textarea" },
  ],
  LEASE_AGREEMENT: [
    { name: "lessorName", label: "Lessor name", kind: "text" },
    { name: "lesseeName", label: "Lessee name", kind: "text" },
    { name: "propertyAddress", label: "Property address", kind: "textarea" },
    { name: "monthlyRent", label: "Monthly rent", kind: "number" },
    { name: "securityDeposit", label: "Security deposit", kind: "number" },
    { name: "leaseStartDate", label: "Lease start date", kind: "date" },
    { name: "leaseEndDate", label: "Lease end date", kind: "date" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
  ],
  PARTNERSHIP_DEED: [
    { name: "firmName", label: "Firm name", kind: "text" },
    { name: "partners", label: "Partners", kind: "textarea" },
    { name: "capitalContribution", label: "Capital contribution", kind: "textarea" },
    { name: "profitSharingRatio", label: "Profit sharing ratio", kind: "text" },
    { name: "businessNature", label: "Nature of business", kind: "textarea" },
  ],
  PRIVACY_POLICY: [
    { name: "companyName", label: "Company name", kind: "text" },
    { name: "websiteUrl", label: "Website URL", kind: "text" },
    { name: "dataCollected", label: "Data collected", kind: "textarea" },
    { name: "contactEmail", label: "Contact email", kind: "email" },
    { name: "effectiveDate", label: "Effective date", kind: "date" },
  ],
  TERMS_AND_CONDITIONS: [
    { name: "companyName", label: "Company name", kind: "text" },
    { name: "websiteUrl", label: "Website URL", kind: "text" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
    { name: "effectiveDate", label: "Effective date", kind: "date" },
  ],
  GENERAL_CONTRACT: [
    { name: "partyA", label: "First party", kind: "text" },
    { name: "partyB", label: "Second party", kind: "text" },
    { name: "purpose", label: "Purpose", kind: "textarea" },
    { name: "considerationAmount", label: "Consideration amount", kind: "number" },
    { name: "termMonths", label: "Term (months)", kind: "number" },
    { name: "governingLaw", label: "Governing law", kind: "text" },
  ],
  CORPORATE_RESOLUTION: [
    { name: "companyName", label: "Company name", kind: "text" },
    { name: "resolutionDate", label: "Resolution date", kind: "date" },
    { name: "boardMembers", label: "Board members present", kind: "textarea" },
    { name: "resolutionText", label: "Resolution text", kind: "textarea" },
  ],
};
