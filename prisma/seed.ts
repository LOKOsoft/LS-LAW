import path from "node:path";
import fs from "node:fs";
import { addDays, subDays, subMonths, startOfMonth } from "date-fns";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  PrismaClient,
  Role,
  ClientType,
  ClientStatus,
  MatterStatus,
  BillingType,
  Priority,
  MatterTeamRole,
  HearingStatus,
  TaskStatus,
  DocumentStatus,
  TemplateCategory,
  InvoiceStatus,
  LineItemType,
  PaymentMethod,
  RetainerStatus,
  MeetingStatus,
  CommunicationType,
  AnnouncementPriority,
  CourtType,
} from "../src/generated/prisma/client";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const STORAGE_ROOT = path.join(process.cwd(), "storage");

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number, decimals = 2): number {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}
function writePlaceholderFile(relPath: string, contents: string) {
  const fullPath = path.join(STORAGE_ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, contents, "utf8");
  return path.posix.join("storage", relPath.split(path.sep).join("/"));
}

async function main() {
  console.log("Seeding LEXORA database...");

  // ── Reset ────────────────────────────────────────────────────────────
  await prisma.activityLog.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.courtListEntry.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.communicationLog.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.note.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.retainer.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.clause.deleteMany();
  await prisma.template.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.documentFile.deleteMany();
  await prisma.documentFolder.deleteMany();
  await prisma.task.deleteMany();
  await prisma.hearing.deleteMany();
  await prisma.matterTeamMember.deleteMany();
  await prisma.matter.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.practiceArea.deleteMany();
  await prisma.office.deleteMany();
  await prisma.firm.deleteMany();
  if (fs.existsSync(STORAGE_ROOT)) {
    fs.rmSync(STORAGE_ROOT, { recursive: true, force: true });
  }

  // ── Firm & offices ───────────────────────────────────────────────────
  const firm = await prisma.firm.create({
    data: {
      name: "Lexora & Associates",
      legalName: "Lexora & Associates LLP",
      tagline: "Excellence in Every Argument",
      email: "contact@lexoralaw.com",
      phone: "+91 22 6612 4500",
      website: "www.lexoralaw.com",
      addressLine1: "14th Floor, Maker Chambers VI",
      addressLine2: "Nariman Point",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400021",
      taxId: "27AAFCL1234K1ZQ",
      foundedYear: 2009,
      timezone: "Asia/Kolkata",
      currency: "INR",
      invoicePrefix: "LEX-INV",
      invoiceNextNumber: 25,
      financialYearStart: 4,
    },
  });

  const [officeMumbai, officeDelhi, officeBengaluru] = await Promise.all([
    prisma.office.create({
      data: {
        firmId: firm.id,
        name: "Mumbai — Head Office",
        isPrimary: true,
        addressLine1: "14th Floor, Maker Chambers VI",
        addressLine2: "Nariman Point",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400021",
        phone: "+91 22 6612 4500",
        email: "mumbai@lexoralaw.com",
      },
    }),
    prisma.office.create({
      data: {
        firmId: firm.id,
        name: "Delhi",
        addressLine1: "5th Floor, DLF Capital Point",
        addressLine2: "Connaught Place",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110001",
        phone: "+91 11 4351 2200",
        email: "delhi@lexoralaw.com",
      },
    }),
    prisma.office.create({
      data: {
        firmId: firm.id,
        name: "Bengaluru",
        addressLine1: "3rd Floor, Prestige Meridian",
        addressLine2: "MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
        phone: "+91 80 2559 8800",
        email: "bengaluru@lexoralaw.com",
      },
    }),
  ]);

  // ── Practice areas ───────────────────────────────────────────────────
  // Categorical hues assigned in fixed slot order (validated via dataviz skill's
  // palette validator) — identity colors, not meaning-coded.
  const practiceAreaDefs = [
    { name: "Corporate & Commercial", color: "#2a78d6", icon: "building-2" },
    { name: "Litigation & Dispute Resolution", color: "#1baf7a", icon: "gavel" },
    { name: "Intellectual Property", color: "#eda100", icon: "lightbulb" },
    { name: "Real Estate", color: "#008300", icon: "home" },
    { name: "Employment & Labour", color: "#4a3aa7", icon: "users" },
    { name: "Tax & Regulatory", color: "#e34948", icon: "landmark" },
    { name: "Compliance & Governance", color: "#e87ba4", icon: "shield-check" },
  ];
  const practiceAreas = await Promise.all(
    practiceAreaDefs.map((p) =>
      prisma.practiceArea.create({
        data: { name: p.name, color: p.color, icon: p.icon, description: `${p.name} advisory and representation.` },
      }),
    ),
  );
  const [paCorporate, paLitigation, paIP, paRealEstate, paEmployment, paTax, paCompliance] = practiceAreas;

  // ── Users ────────────────────────────────────────────────────────────
  const userDefs = [
    { name: "Arjun Mehta", email: "arjun.mehta@lexoralaw.com", role: Role.MANAGING_PARTNER, title: "Managing Partner", office: officeMumbai, bar: "MAH/1998/4521", target: 60 },
    { name: "Kavita Rao", email: "kavita.rao@lexoralaw.com", role: Role.SENIOR_PARTNER, title: "Senior Partner, Corporate & Commercial", office: officeMumbai, bar: "MAH/2003/6210", target: 70 },
    { name: "Rohan Deshpande", email: "rohan.deshpande@lexoralaw.com", role: Role.SENIOR_PARTNER, title: "Senior Partner, Litigation", office: officeDelhi, bar: "DEL/2001/3387", target: 70 },
    { name: "Ananya Iyer", email: "ananya.iyer@lexoralaw.com", role: Role.ASSOCIATE, title: "Associate, Intellectual Property", office: officeMumbai, bar: "MAH/2018/9012", target: 80 },
    { name: "Vikram Nair", email: "vikram.nair@lexoralaw.com", role: Role.ASSOCIATE, title: "Associate, Real Estate", office: officeBengaluru, bar: "KAR/2019/5544", target: 80 },
    { name: "Priya Menon", email: "priya.menon@lexoralaw.com", role: Role.ASSOCIATE, title: "Associate, Employment & Labour", office: officeMumbai, bar: "MAH/2020/7789", target: 80 },
    { name: "Karan Malhotra", email: "karan.malhotra@lexoralaw.com", role: Role.ASSOCIATE, title: "Associate, Litigation", office: officeDelhi, bar: "DEL/2020/2245", target: 80 },
    { name: "Sameer Khan", email: "sameer.khan@lexoralaw.com", role: Role.PARALEGAL, title: "Senior Paralegal", office: officeMumbai, bar: null, target: 85 },
    { name: "Divya Krishnan", email: "divya.krishnan@lexoralaw.com", role: Role.PARALEGAL, title: "Paralegal", office: officeDelhi, bar: null, target: 85 },
    { name: "Neha Sharma", email: "neha.sharma@lexoralaw.com", role: Role.RECEPTION, title: "Front Office Executive", office: officeMumbai, bar: null, target: 0 },
    { name: "Rahul Verma", email: "rahul.verma@lexoralaw.com", role: Role.ACCOUNTS, title: "Finance Manager", office: officeMumbai, bar: null, target: 0 },
    { name: "Fatima Sheikh", email: "fatima.sheikh@lexoralaw.com", role: Role.HR, title: "HR Manager", office: officeMumbai, bar: null, target: 0 },
  ];
  const users = await Promise.all(
    userDefs.map((u) =>
      prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          phone: `+91 98${randInt(10000000, 99999999)}`,
          role: u.role,
          title: u.title,
          officeId: u.office.id,
          barNumber: u.bar,
          utilizationTarget: u.target,
          joinedAt: subMonths(new Date(), randInt(6, 180)),
        },
      }),
    ),
  );
  const [
    arjun, kavita, rohan, ananya, vikram, priya, karan, sameer, divya, neha, rahul, fatima,
  ] = users;
  const attorneys = [arjun, kavita, rohan, ananya, vikram, priya, karan];
  const fileHandlers = [ananya, vikram, priya, karan, sameer, divya];

  // ── Clients ──────────────────────────────────────────────────────────
  const clientDefs = [
    { name: "Meridian Textiles Pvt. Ltd.", type: ClientType.COMPANY, industry: "Manufacturing", city: "Surat", state: "Gujarat", source: "Referral", manager: kavita },
    { name: "Horizon Logistics Ltd.", type: ClientType.COMPANY, industry: "Logistics & Supply Chain", city: "Mumbai", state: "Maharashtra", source: "Website", manager: kavita },
    { name: "Zenith Pharmaceuticals Pvt. Ltd.", type: ClientType.COMPANY, industry: "Pharmaceuticals", city: "Ahmedabad", state: "Gujarat", source: "Referral", manager: arjun },
    { name: "Kunal Bhatia", type: ClientType.INDIVIDUAL, industry: "Real Estate Investment", city: "Mumbai", state: "Maharashtra", source: "Referral", manager: rohan },
    { name: "Novatech Solutions Pvt. Ltd.", type: ClientType.COMPANY, industry: "Information Technology", city: "Bengaluru", state: "Karnataka", source: "Conference", manager: kavita },
    { name: "Aria Hospitality Group", type: ClientType.COMPANY, industry: "Hospitality", city: "Goa", state: "Goa", source: "Referral", manager: arjun },
    { name: "Suresh & Meena Kapoor", type: ClientType.INDIVIDUAL, industry: "Private Individuals", city: "Pune", state: "Maharashtra", source: "Referral", manager: rohan },
    { name: "BlueWave Retail Pvt. Ltd.", type: ClientType.COMPANY, industry: "Retail", city: "Mumbai", state: "Maharashtra", source: "Website", manager: kavita },
    { name: "Orion Steel Industries Ltd.", type: ClientType.COMPANY, industry: "Manufacturing", city: "Jamshedpur", state: "Jharkhand", source: "Referral", manager: arjun },
    { name: "Priyanka Chandra", type: ClientType.INDIVIDUAL, industry: "Private Individuals", city: "New Delhi", state: "Delhi", source: "Referral", manager: rohan },
    { name: "Evergreen Foods Pvt. Ltd.", type: ClientType.COMPANY, industry: "FMCG", city: "Mumbai", state: "Maharashtra", source: "Website", manager: kavita },
    { name: "Skyline Developers Pvt. Ltd.", type: ClientType.COMPANY, industry: "Real Estate Development", city: "Bengaluru", state: "Karnataka", source: "Referral", manager: rohan },
    { name: "Amit Trivedi", type: ClientType.INDIVIDUAL, industry: "Technology Startups", city: "Pune", state: "Maharashtra", source: "Conference", manager: kavita },
    { name: "Continental Insurance Brokers Pvt. Ltd.", type: ClientType.COMPANY, industry: "Insurance", city: "Mumbai", state: "Maharashtra", source: "Referral", manager: arjun },
    { name: "Rina Fernandes", type: ClientType.INDIVIDUAL, industry: "Private Individuals", city: "Goa", state: "Goa", source: "Referral", manager: kavita },
  ];
  const clientStatuses = [ClientStatus.ACTIVE, ClientStatus.ACTIVE, ClientStatus.ACTIVE, ClientStatus.PROSPECT, ClientStatus.INACTIVE];
  const clients = await Promise.all(
    clientDefs.map((c, i) =>
      prisma.client.create({
        data: {
          clientNumber: `CLT-${String(i + 1).padStart(4, "0")}`,
          type: c.type,
          name: c.name,
          companyName: c.type === ClientType.COMPANY ? c.name : null,
          industry: c.industry,
          email: `contact@${c.name.toLowerCase().replace(/[^a-z]+/g, "").slice(0, 14)}.com`,
          phone: `+91 98${randInt(10000000, 99999999)}`,
          city: c.city,
          state: c.state,
          country: "India",
          postalCode: String(randInt(100000, 999999)),
          taxId: c.type === ClientType.COMPANY ? `${randInt(10, 36)}AAACL${randInt(1000, 9999)}A1Z${randInt(1, 9)}` : null,
          status: i < 12 ? ClientStatus.ACTIVE : rand(clientStatuses),
          source: c.source,
          tags: [c.industry, c.type === ClientType.COMPANY ? "Corporate" : "Individual"].join(","),
          relationshipManagerId: c.manager.id,
          createdAt: subMonths(new Date(), randInt(1, 48)),
        },
      }),
    ),
  );

  // ── Matters ──────────────────────────────────────────────────────────
  const matterDefs: {
    title: string; client: (typeof clients)[number]; pa: (typeof practiceAreas)[number];
    status: MatterStatus; priority: Priority; billing: BillingType; attorney: (typeof users)[number];
    opposing?: string; opposingCounsel?: string; estValue: number; openedDaysAgo: number;
  }[] = [
    { title: "Series C Investment Round — Definitive Agreements", client: clients[4], pa: paCorporate, status: MatterStatus.ACTIVE, priority: Priority.HIGH, billing: BillingType.FIXED_FEE, attorney: kavita, estValue: 4500000, openedDaysAgo: 40 },
    { title: "Share Purchase Agreement — Textile Unit Acquisition", client: clients[0], pa: paCorporate, status: MatterStatus.ACTIVE, priority: Priority.HIGH, billing: BillingType.FIXED_FEE, attorney: kavita, estValue: 3200000, openedDaysAgo: 75 },
    { title: "Commercial Arbitration — Freight Contract Dispute", client: clients[1], pa: paLitigation, status: MatterStatus.ACTIVE, priority: Priority.URGENT, billing: BillingType.HOURLY, attorney: rohan, opposing: "Continental Freightways Pvt. Ltd.", opposingCounsel: "Adv. S. Ramachandran", estValue: 8700000, openedDaysAgo: 110 },
    { title: "Trademark Infringement — 'ZenPure' Brand", client: clients[2], pa: paIP, status: MatterStatus.ACTIVE, priority: Priority.HIGH, billing: BillingType.HOURLY, attorney: ananya, opposing: "Purezen Labs LLP", opposingCounsel: "Adv. Meenal Joshi", estValue: 1500000, openedDaysAgo: 55 },
    { title: "Commercial Lease Negotiation — Andheri Warehouse", client: clients[3], pa: paRealEstate, status: MatterStatus.ACTIVE, priority: Priority.MEDIUM, billing: BillingType.FIXED_FEE, attorney: vikram, estValue: 600000, openedDaysAgo: 20 },
    { title: "Hospitality License Renewal & Compliance Audit", client: clients[5], pa: paCompliance, status: MatterStatus.ACTIVE, priority: Priority.MEDIUM, billing: BillingType.RETAINER, attorney: kavita, estValue: 900000, openedDaysAgo: 200 },
    { title: "Ancestral Property Partition Suit", client: clients[6], pa: paLitigation, status: MatterStatus.ACTIVE, priority: Priority.HIGH, billing: BillingType.HOURLY, attorney: rohan, opposing: "Rajesh Kapoor & Ors.", opposingCounsel: "Adv. Vinod Pillai", estValue: 12000000, openedDaysAgo: 320 },
    { title: "Employment Contract Standardisation — Pan-India Rollout", client: clients[7], pa: paEmployment, status: MatterStatus.ACTIVE, priority: Priority.MEDIUM, billing: BillingType.FIXED_FEE, attorney: priya, estValue: 450000, openedDaysAgo: 15 },
    { title: "Environmental Clearance Appeal — NGT Proceedings", client: clients[8], pa: paCompliance, status: MatterStatus.ACTIVE, priority: Priority.URGENT, billing: BillingType.HOURLY, attorney: rohan, opposing: "State Pollution Control Board", opposingCounsel: "Government Counsel", estValue: 5600000, openedDaysAgo: 90 },
    { title: "Wrongful Termination Claim", client: clients[9], pa: paEmployment, status: MatterStatus.ACTIVE, priority: Priority.HIGH, billing: BillingType.HOURLY, attorney: priya, opposing: "Priyanka Chandra (Complainant Represented)", estValue: 800000, openedDaysAgo: 35 },
    { title: "FSSAI Regulatory Compliance Review", client: clients[10], pa: paCompliance, status: MatterStatus.ACTIVE, priority: Priority.LOW, billing: BillingType.RETAINER, attorney: kavita, estValue: 300000, openedDaysAgo: 150 },
    { title: "RERA Registration — Whitefield Residential Project", client: clients[11], pa: paRealEstate, status: MatterStatus.ACTIVE, priority: Priority.HIGH, billing: BillingType.FIXED_FEE, attorney: vikram, estValue: 2100000, openedDaysAgo: 60 },
    { title: "Patent Filing — AI-Based Logistics Optimisation", client: clients[12], pa: paIP, status: MatterStatus.ACTIVE, priority: Priority.MEDIUM, billing: BillingType.FIXED_FEE, attorney: ananya, estValue: 750000, openedDaysAgo: 28 },
    { title: "Regulatory Advisory — IRDAI Broker Licensing", client: clients[13], pa: paTax, status: MatterStatus.ACTIVE, priority: Priority.MEDIUM, billing: BillingType.HOURLY, attorney: kavita, estValue: 1100000, openedDaysAgo: 45 },
    { title: "Estate & Succession Planning", client: clients[14], pa: paCompliance, status: MatterStatus.ACTIVE, priority: Priority.LOW, billing: BillingType.FIXED_FEE, attorney: arjun, estValue: 400000, openedDaysAgo: 12 },
    { title: "GST Input Credit Dispute — Appellate Tribunal", client: clients[0], pa: paTax, status: MatterStatus.ON_HOLD, priority: Priority.MEDIUM, billing: BillingType.HOURLY, attorney: karan, opposing: "GST Department", estValue: 2300000, openedDaysAgo: 180 },
    { title: "Data Privacy Compliance — DPDP Act Readiness", client: clients[4], pa: paCompliance, status: MatterStatus.ON_HOLD, priority: Priority.MEDIUM, billing: BillingType.FIXED_FEE, attorney: ananya, estValue: 550000, openedDaysAgo: 65 },
    { title: "Vendor Contract Dispute — Steel Supply Agreement", client: clients[8], pa: paLitigation, status: MatterStatus.INTAKE, priority: Priority.HIGH, billing: BillingType.HOURLY, attorney: rohan, opposing: "Falcon Steel Traders", estValue: 3400000, openedDaysAgo: 3 },
    { title: "Joint Venture Structuring — Hospitality Expansion", client: clients[5], pa: paCorporate, status: MatterStatus.INTAKE, priority: Priority.MEDIUM, billing: BillingType.FIXED_FEE, attorney: kavita, estValue: 6000000, openedDaysAgo: 5 },
    { title: "Trademark Portfolio Audit", client: clients[12], pa: paIP, status: MatterStatus.INTAKE, priority: Priority.LOW, billing: BillingType.FIXED_FEE, attorney: ananya, estValue: 250000, openedDaysAgo: 2 },
    { title: "Consumer Complaint — Defective Goods Delivery", client: clients[7], pa: paLitigation, status: MatterStatus.CLOSED, priority: Priority.LOW, billing: BillingType.FIXED_FEE, attorney: karan, opposing: "Consumer Forum Complainant", estValue: 180000, openedDaysAgo: 260 },
    { title: "Office Lease Renewal — Connaught Place", client: clients[13], pa: paRealEstate, status: MatterStatus.CLOSED, priority: Priority.LOW, billing: BillingType.FIXED_FEE, attorney: vikram, estValue: 320000, openedDaysAgo: 240 },
    { title: "NDA & Vendor Onboarding Pack", client: clients[10], pa: paCorporate, status: MatterStatus.CLOSED, priority: Priority.LOW, billing: BillingType.FIXED_FEE, attorney: kavita, estValue: 150000, openedDaysAgo: 200 },
    { title: "Labour Court Settlement — Factory Workers Union", client: clients[8], pa: paEmployment, status: MatterStatus.ARCHIVED, priority: Priority.MEDIUM, billing: BillingType.HOURLY, attorney: priya, opposing: "Factory Workers Union", estValue: 1900000, openedDaysAgo: 400 },
  ];

  const matters = await Promise.all(
    matterDefs.map((m, i) => {
      const opened = subDays(new Date(), m.openedDaysAgo);
      const isClosed = m.status === MatterStatus.CLOSED || m.status === MatterStatus.ARCHIVED;
      return prisma.matter.create({
        data: {
          matterNumber: `LEX-2026-${String(i + 1).padStart(4, "0")}`,
          title: m.title,
          description: `${m.title} for ${m.client.name}, handled under the ${m.pa.name} practice group.`,
          clientId: m.client.id,
          practiceAreaId: m.pa.id,
          status: m.status,
          priority: m.priority,
          billingType: m.billing,
          hourlyRate: m.billing === BillingType.HOURLY ? rand([9000, 12000, 15000, 18000, 22000]) : null,
          estimatedValue: m.estValue,
          openedDate: opened,
          targetCloseDate: isClosed ? null : addDays(new Date(), randInt(20, 200)),
          closedDate: isClosed ? subDays(new Date(), randInt(1, m.openedDaysAgo - 10)) : null,
          opposingParty: m.opposing ?? null,
          opposingCounsel: m.opposingCounsel ?? null,
          responsibleAttorneyId: m.attorney.id,
          createdAt: opened,
        },
      });
    }),
  );

  // Team members per matter
  for (const [i, matter] of matters.entries()) {
    const def = matterDefs[i];
    await prisma.matterTeamMember.create({
      data: { matterId: matter.id, userId: def.attorney.id, role: MatterTeamRole.LEAD },
    });
    const support = rand(fileHandlers.filter((u) => u.id !== def.attorney.id));
    await prisma.matterTeamMember.create({
      data: { matterId: matter.id, userId: support.id, role: rand([MatterTeamRole.ASSOCIATE, MatterTeamRole.PARALEGAL, MatterTeamRole.SUPPORT]) },
    });
  }

  // ── Hearings (litigation-heavy matters) ─────────────────────────────
  const courts = [
    "Bombay High Court", "Delhi High Court", "Karnataka High Court", "NCLT Mumbai",
    "City Civil Court, Mumbai", "District Court, Pune", "National Green Tribunal",
    "Labour Court, Mumbai", "Consumer Disputes Redressal Commission",
];
  const hearingTypes = ["First Hearing", "Case Management Conference", "Arguments", "Evidence Recording", "Final Hearing", "Interim Application", "Mediation Session"];
  let hearingCount = 0;
  for (const [i, matter] of matters.entries()) {
    const def = matterDefs[i];
    if (def.pa !== paLitigation && def.pa !== paCompliance) continue;
    if (def.status === MatterStatus.CLOSED || def.status === MatterStatus.ARCHIVED) continue;
    const hearingsForMatter = randInt(1, 3);
    for (let h = 0; h < hearingsForMatter; h++) {
      const offsetDays = randInt(-30, 25);
      const scheduledAt = addDays(new Date(), offsetDays);
      const isPast = offsetDays < 0;
      await prisma.hearing.create({
        data: {
          matterId: matter.id,
          courtName: rand(courts),
          courtroom: `Court No. ${randInt(1, 24)}`,
          judge: `Hon'ble Justice ${rand(["A. Kulkarni", "S. Bansal", "R. Nagarajan", "P. Choudhary", "M. Iyengar"])}`,
          hearingType: rand(hearingTypes),
          scheduledAt,
          status: isPast ? rand([HearingStatus.COMPLETED, HearingStatus.ADJOURNED]) : HearingStatus.SCHEDULED,
          outcome: isPast ? rand(["Matter adjourned to next date", "Arguments concluded, order reserved", "Interim relief granted", "Directions issued for filing counter"]) : null,
          nextHearingDate: isPast ? addDays(scheduledAt, randInt(14, 45)) : null,
        },
      });
      hearingCount++;
    }
  }
  // Guarantee a couple of hearings today / this week for the dashboard widgets
  const activeLitigation = matters.filter((_, i) => matterDefs[i].status === MatterStatus.ACTIVE);
  await prisma.hearing.create({
    data: {
      matterId: rand(activeLitigation).id,
      courtName: "Bombay High Court",
      courtroom: "Court No. 9",
      judge: "Hon'ble Justice A. Kulkarni",
      hearingType: "Arguments",
      scheduledAt: new Date(new Date().setHours(11, 30, 0, 0)),
      status: HearingStatus.SCHEDULED,
    },
  });
  await prisma.hearing.create({
    data: {
      matterId: rand(activeLitigation).id,
      courtName: "City Civil Court, Mumbai",
      courtroom: "Court No. 4",
      judge: "Hon'ble Judge S. Bansal",
      hearingType: "Case Management Conference",
      scheduledAt: new Date(new Date().setHours(15, 0, 0, 0)),
      status: HearingStatus.SCHEDULED,
    },
  });

  // ── Tasks ────────────────────────────────────────────────────────────
  const taskTitles = [
    "Draft first response to opposing counsel", "Review and finalise disclosure schedule",
    "Prepare client briefing note", "File vakalatnama and appearance", "Compile bundle of documents for hearing",
    "Draft board resolution", "Conduct due diligence on target entity", "Prepare draft agreement — v1",
    "Review comments from client legal team", "Research precedent case law", "Prepare hearing summary note",
    "Draft reply to show-cause notice", "Coordinate with local counsel", "Update matter timeline",
    "Prepare invoice backup for time entries", "Draft engagement letter", "Review compliance checklist",
    "Prepare witness statement", "File written submissions", "Schedule client status call",
  ];
  const now = new Date();
  let taskCount = 0;
  for (const [i, matter] of matters.entries()) {
    const def = matterDefs[i];
    if (def.status === MatterStatus.ARCHIVED) continue;
    const numTasks = def.status === MatterStatus.ACTIVE ? randInt(2, 4) : randInt(0, 2);
    for (let t = 0; t < numTasks; t++) {
      const dueOffset = randInt(-10, 30);
      const dueDate = addDays(now, dueOffset);
      const status = dueOffset < -1
        ? rand([TaskStatus.DONE, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
        : rand([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW]);
      const assignee = rand([def.attorney, ...fileHandlers]);
      await prisma.task.create({
        data: {
          title: rand(taskTitles),
          description: `Related to ${matter.title}.`,
          matterId: matter.id,
          assigneeId: assignee.id,
          createdById: def.attorney.id,
          status,
          priority: rand([Priority.LOW, Priority.MEDIUM, Priority.MEDIUM, Priority.HIGH, Priority.URGENT]),
          dueDate,
          completedAt: status === TaskStatus.DONE ? subDays(dueDate, randInt(0, 3)) : null,
          createdAt: subDays(now, randInt(1, 20)),
        },
      });
      taskCount++;
    }
  }
  // A handful of firm-wide (non-matter) tasks
  for (const title of ["Quarterly compliance training", "Update firm website bios", "Renew professional indemnity insurance"]) {
    await prisma.task.create({
      data: {
        title,
        assigneeId: rand(users).id,
        createdById: arjun.id,
        status: rand([TaskStatus.TODO, TaskStatus.IN_PROGRESS]),
        priority: Priority.MEDIUM,
        dueDate: addDays(now, randInt(3, 30)),
      },
    });
    taskCount++;
  }

  // ── Documents ────────────────────────────────────────────────────────
  const docKinds = [
    { name: "Engagement Letter", ext: "pdf" }, { name: "Draft Agreement v1", ext: "docx" },
    { name: "Client Correspondence", ext: "pdf" }, { name: "Board Resolution", ext: "docx" },
    { name: "Due Diligence Report", ext: "pdf" }, { name: "Court Filing", ext: "pdf" },
    { name: "Evidence Bundle", ext: "pdf" }, { name: "Compliance Checklist", ext: "xlsx" },
    { name: "Invoice Backup", ext: "xlsx" }, { name: "Hearing Notes", ext: "docx" },
  ];
  let docCount = 0;
  for (const [i, matter] of matters.entries()) {
    const def = matterDefs[i];
    const folder = await prisma.documentFolder.create({
      data: { name: "Correspondence", matterId: matter.id },
    });
    const numDocs = randInt(2, 4);
    for (let d = 0; d < numDocs; d++) {
      const kind = rand(docKinds);
      const uploader = rand(fileHandlers);
      const fileName = `${kind.name.replace(/\s+/g, "_")}_${matter.matterNumber}.${kind.ext}`;
      const relPath = path.join("matters", matter.id, fileName);
      const storagePath = writePlaceholderFile(
        relPath,
        `LEXORA — ${kind.name}\nMatter: ${matter.title}\nClient: ${def.client.name}\nGenerated as seed placeholder content.\n`,
      );
      await prisma.documentFile.create({
        data: {
          name: fileName,
          folderId: folder.id,
          matterId: matter.id,
          clientId: def.client.id,
          fileType: kind.ext.toUpperCase(),
          sizeBytes: randInt(20_000, 4_500_000),
          storagePath,
          version: 1,
          tags: [def.pa.name, kind.name].join(","),
          status: rand([DocumentStatus.DRAFT, DocumentStatus.FINAL, DocumentStatus.FINAL, DocumentStatus.SHARED]),
          uploadedById: uploader.id,
          createdAt: subDays(now, randInt(0, 60)),
        },
      });
      docCount++;
    }
  }

  // ── Templates ────────────────────────────────────────────────────────
  const templateDefs: { name: string; category: TemplateCategory; description: string }[] = [
    { name: "Offer Letter — Standard", category: TemplateCategory.EMPLOYMENT, description: "Standard offer letter for new hires." },
    { name: "Employment Agreement — Full-Time", category: TemplateCategory.EMPLOYMENT, description: "Comprehensive full-time employment contract." },
    { name: "Termination Notice", category: TemplateCategory.EMPLOYMENT, description: "Notice of termination with statutory clauses." },
    { name: "Board Resolution — General", category: TemplateCategory.CORPORATE, description: "General purpose board resolution template." },
    { name: "Share Purchase Agreement", category: TemplateCategory.CORPORATE, description: "SPA template for private M&A transactions." },
    { name: "Shareholders' Agreement", category: TemplateCategory.CORPORATE, description: "Standard SHA with drag-along/tag-along clauses." },
    { name: "Legal Notice — Recovery of Dues", category: TemplateCategory.LITIGATION, description: "Formal recovery notice prior to suit filing." },
    { name: "Plaint — Civil Suit", category: TemplateCategory.LITIGATION, description: "Standard plaint format for civil suits." },
    { name: "Written Statement", category: TemplateCategory.LITIGATION, description: "Defendant's written statement template." },
    { name: "Leave and License Agreement", category: TemplateCategory.PROPERTY, description: "Standard leave & license for commercial premises." },
    { name: "Sale Deed — Residential Property", category: TemplateCategory.PROPERTY, description: "Sale deed template for residential transactions." },
    { name: "GST Reply to Show-Cause Notice", category: TemplateCategory.TAX, description: "Draft reply format for GST SCNs." },
    { name: "Income Tax Appeal — Form 35", category: TemplateCategory.TAX, description: "First appeal template before CIT(A)." },
    { name: "POSH Policy Document", category: TemplateCategory.COMPLIANCE, description: "Prevention of sexual harassment workplace policy." },
    { name: "Data Protection Policy — DPDP Ready", category: TemplateCategory.COMPLIANCE, description: "Data protection policy aligned to the DPDP Act." },
    { name: "Master Services Agreement", category: TemplateCategory.CONTRACTS, description: "General MSA template for service engagements." },
    { name: "Vendor Agreement", category: TemplateCategory.CONTRACTS, description: "Standard vendor/supplier agreement." },
    { name: "Mutual Non-Disclosure Agreement", category: TemplateCategory.NDA, description: "Bilateral confidentiality agreement." },
    { name: "Unilateral Non-Disclosure Agreement", category: TemplateCategory.NDA, description: "One-way confidentiality agreement." },
    { name: "Joint Venture Agreement", category: TemplateCategory.AGREEMENT, description: "JV structuring agreement template." },
    { name: "Franchise Agreement", category: TemplateCategory.AGREEMENT, description: "Standard franchise agreement." },
    { name: "Legal Notice — Cease and Desist", category: TemplateCategory.NOTICE, description: "IP/contract cease and desist notice." },
    { name: "Public Notice — Property", category: TemplateCategory.NOTICE, description: "Newspaper public notice for property matters." },
    { name: "Affidavit of Identity", category: TemplateCategory.AFFIDAVIT, description: "Standard identity affidavit format." },
    { name: "Affidavit in Support of Application", category: TemplateCategory.AFFIDAVIT, description: "Supporting affidavit for interim applications." },
    { name: "General Power of Attorney", category: TemplateCategory.POWER_OF_ATTORNEY, description: "GPA for general representation." },
    { name: "Special Power of Attorney — Property Sale", category: TemplateCategory.POWER_OF_ATTORNEY, description: "SPA limited to a specific property transaction." },
    { name: "Last Will and Testament", category: TemplateCategory.WILL, description: "Standard will template with executor clauses." },
    { name: "Codicil to Will", category: TemplateCategory.WILL, description: "Amendment template for an existing will." },
  ];
  await Promise.all(
    templateDefs.map((t, i) =>
      prisma.template.create({
        data: {
          name: t.name,
          category: t.category,
          description: t.description,
          isFavorite: i % 5 === 0,
          usageCount: randInt(0, 65),
          lastUsedAt: i % 3 === 0 ? subDays(now, randInt(1, 40)) : null,
        },
      }),
    ),
  );

  // ── Clause library ───────────────────────────────────────────────────
  const clauseDefs = [
    { title: "Governing Law & Jurisdiction", category: "Boilerplate" },
    { title: "Confidentiality Obligations", category: "Boilerplate" },
    { title: "Limitation of Liability", category: "Risk Allocation" },
    { title: "Indemnification", category: "Risk Allocation" },
    { title: "Force Majeure", category: "Boilerplate" },
    { title: "Termination for Convenience", category: "Termination" },
    { title: "Termination for Cause", category: "Termination" },
    { title: "Non-Compete", category: "Restrictive Covenants" },
    { title: "Non-Solicitation", category: "Restrictive Covenants" },
    { title: "Assignment Restriction", category: "Boilerplate" },
    { title: "Dispute Resolution — Arbitration", category: "Dispute Resolution" },
    { title: "Dispute Resolution — Mediation First", category: "Dispute Resolution" },
    { title: "Intellectual Property Ownership", category: "IP" },
    { title: "Data Protection & Privacy", category: "Compliance" },
    { title: "Representations & Warranties", category: "Risk Allocation" },
    { title: "Severability", category: "Boilerplate" },
    { title: "Entire Agreement", category: "Boilerplate" },
    { title: "Change of Control", category: "M&A" },
  ];
  await Promise.all(
    clauseDefs.map((c, i) =>
      prisma.clause.create({
        data: {
          title: c.title,
          category: c.category,
          body: `Standard "${c.title}" clause language maintained by the Lexora precedent bank. Insert deal-specific variables before use.`,
          tags: c.category,
          isFavorite: i % 4 === 0,
          usageCount: randInt(0, 90),
        },
      }),
    ),
  );

  // ── Invoices, line items & payments (last 8 months, for revenue trend) ─
  let invoiceSeq = 1;
  const invoices: { id: string; total: number; status: InvoiceStatus; issueDate: Date }[] = [];
  for (let m = 7; m >= 0; m--) {
    const monthStart = startOfMonth(subMonths(now, m));
    const invoicesThisMonth = randInt(2, 4);
    for (let n = 0; n < invoicesThisMonth; n++) {
      const matter = rand(matters);
      const matterIdx = matters.indexOf(matter);
      const def = matterDefs[matterIdx];
      const hours = randInt(8, 60);
      const rate = def.billing === BillingType.HOURLY ? (def as { hourlyRate?: number }).hourlyRate ?? 15000 : 15000;
      const subtotal = def.billing === BillingType.HOURLY ? hours * rate : randInt(80000, 900000);
      const taxAmount = Math.round(subtotal * 0.18);
      const discount = Math.random() < 0.15 ? Math.round(subtotal * 0.05) : 0;
      const total = subtotal + taxAmount - discount;
      const maxIssueDay = m === 0 ? Math.max(1, now.getDate() - 1) : 26;
      const issueDate = addDays(monthStart, randInt(1, Math.min(26, maxIssueDay)));
      const dueDate = addDays(issueDate, 30);
      const isRecent = m <= 1;
      const status = isRecent
        ? n === 0
          ? InvoiceStatus.PARTIALLY_PAID
          : rand([InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE])
        : rand([InvoiceStatus.PAID, InvoiceStatus.PAID, InvoiceStatus.PAID, InvoiceStatus.OVERDUE]);
      const amountPaid = status === InvoiceStatus.PAID ? total : status === InvoiceStatus.PARTIALLY_PAID ? Math.round(total * randFloat(0.3, 0.7)) : 0;

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `LEX-INV-2026-${String(invoiceSeq++).padStart(4, "0")}`,
          clientId: def.client.id,
          matterId: matter.id,
          status,
          issueDate,
          dueDate,
          subtotal,
          taxAmount,
          discount,
          total,
          amountPaid,
          currency: "INR",
          notes: "Payment due within 30 days of invoice date via bank transfer.",
          createdAt: issueDate,
        },
      });
      await prisma.invoiceLineItem.create({
        data: {
          invoiceId: invoice.id,
          description: def.billing === BillingType.HOURLY ? `Professional fees — ${hours} hours @ ₹${rate}/hr` : "Professional fees — fixed fee engagement",
          quantity: def.billing === BillingType.HOURLY ? hours : 1,
          rate,
          amount: subtotal,
          type: LineItemType.FEE,
        },
      });
      if (Math.random() < 0.3) {
        const expenseAmount = randInt(2000, 25000);
        await prisma.invoiceLineItem.create({
          data: {
            invoiceId: invoice.id,
            description: rand(["Court filing fees", "Travel & conveyance", "Courier & documentation", "Stamp duty"]),
            quantity: 1,
            rate: expenseAmount,
            amount: expenseAmount,
            type: LineItemType.EXPENSE,
          },
        });
      }
      if (amountPaid > 0) {
        const rawPaidAt = addDays(issueDate, randInt(2, 28));
        const paidAt = rawPaidAt > now ? now : rawPaidAt;
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            clientId: def.client.id,
            amount: amountPaid,
            method: rand([PaymentMethod.BANK_TRANSFER, PaymentMethod.BANK_TRANSFER, PaymentMethod.CHEQUE, PaymentMethod.UPI]),
            reference: `TXN${randInt(100000, 999999)}`,
            paidAt,
          },
        });
      }
      invoices.push({ id: invoice.id, total, status, issueDate });
    }
  }

  // ── Expenses ─────────────────────────────────────────────────────────
  const expenseCategories = ["Court Filing Fees", "Travel & Conveyance", "Courier & Documentation", "Expert Witness Fees", "Stamp Duty", "Printing & Binding"];
  for (let i = 0; i < 18; i++) {
    const matter = rand(matters);
    const matterIdx = matters.indexOf(matter);
    await prisma.expense.create({
      data: {
        matterId: matter.id,
        clientId: matterDefs[matterIdx].client.id,
        category: rand(expenseCategories),
        description: `${rand(expenseCategories)} incurred for ${matter.title}`,
        amount: randInt(1500, 45000),
        incurredAt: subDays(now, randInt(1, 120)),
        billable: Math.random() < 0.85,
        reimbursed: Math.random() < 0.6,
        submittedById: rand(fileHandlers).id,
      },
    });
  }

  // ── Retainers ────────────────────────────────────────────────────────
  for (const matter of matters.filter((_, i) => matterDefs[i].billing === BillingType.RETAINER)) {
    const idx = matters.indexOf(matter);
    const amount = randInt(300000, 1200000);
    await prisma.retainer.create({
      data: {
        clientId: matterDefs[idx].client.id,
        matterId: matter.id,
        amount,
        balance: Math.round(amount * randFloat(0.2, 0.9)),
        status: RetainerStatus.ACTIVE,
        startDate: subMonths(now, randInt(1, 10)),
      },
    });
  }

  // ── Time entries ─────────────────────────────────────────────────────
  // Half the volume lands within the current (partial) month so team
  // utilization has enough signal to compute against; the rest gives history.
  const dayOfMonth = Math.max(1, now.getDate());
  for (const matter of matters) {
    const idx = matters.indexOf(matter);
    if (matterDefs[idx].status === MatterStatus.ARCHIVED) continue;
    const entries = randInt(6, 12);
    for (let e = 0; e < entries; e++) {
      const withinCurrentMonth = e % 2 === 0;
      await prisma.timeEntry.create({
        data: {
          matterId: matter.id,
          userId: rand([matterDefs[idx].attorney, ...fileHandlers]).id,
          date: withinCurrentMonth ? subDays(now, randInt(0, dayOfMonth - 1)) : subDays(now, randInt(dayOfMonth, 75)),
          minutes: randInt(30, 240),
          description: rand(taskTitles),
          billable: Math.random() < 0.8,
          rate: matterDefs[idx].billing === BillingType.HOURLY ? 15000 : null,
          invoiced: Math.random() < 0.5,
        },
      });
    }
  }

  // ── Notes, meetings, communication logs ─────────────────────────────
  const noteBodies = [
    "Client confirmed instructions over call; proceed with drafting.",
    "Internal review flagged a risk on the indemnity clause — discuss with senior partner.",
    "Awaiting client's signed KYC documents before filing.",
    "Opposing counsel requested a short adjournment; client agreeable.",
    "Strategy call held — client prefers settlement over prolonged litigation.",
  ];
  for (const matter of rand([matters, matters, matters]).slice(0, 20)) {
    const idx = matters.indexOf(matter);
    await prisma.note.create({
      data: {
        matterId: matter.id,
        authorId: matterDefs[idx].attorney.id,
        body: rand(noteBodies),
        pinned: Math.random() < 0.2,
        createdAt: subDays(now, randInt(0, 60)),
      },
    });
  }
  for (const client of clients.slice(0, 10)) {
    await prisma.meeting.create({
      data: {
        clientId: client.id,
        title: rand(["Quarterly Relationship Review", "Matter Status Update", "Engagement Kickoff", "Fee Discussion", "Strategy Session"]),
        scheduledAt: addDays(now, randInt(-15, 15)),
        durationMinutes: rand([30, 45, 60]),
        location: rand(["Mumbai Office — Conference Room A", "Video Call — Google Meet", "Client Office", "Delhi Office — Meeting Room 2"]),
        attendees: `${rand(attorneys).name}, ${client.name}`,
        status: rand([MeetingStatus.SCHEDULED, MeetingStatus.COMPLETED, MeetingStatus.COMPLETED]),
      },
    });
  }
  for (let i = 0; i < 16; i++) {
    const client = rand(clients);
    await prisma.communicationLog.create({
      data: {
        clientId: client.id,
        type: rand([CommunicationType.EMAIL, CommunicationType.CALL, CommunicationType.MEETING, CommunicationType.LETTER]),
        subject: rand(["Status update requested", "Invoice query", "Document sharing", "Hearing update", "Fee proposal discussion"]),
        summary: "Logged correspondence regarding ongoing engagement.",
        occurredAt: subDays(now, randInt(0, 90)),
        loggedById: rand(fileHandlers).id,
      },
    });
  }

  // ── Announcements ────────────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      { title: "Firm Offsite — Lonavala, August 2026", body: "Annual firm offsite scheduled for the second week of August. RSVP with HR by 31 July.", priority: AnnouncementPriority.NORMAL, createdById: fatima.id, publishedAt: subDays(now, 2) },
      { title: "New Practice Group: Data Protection & AI Governance", body: "We're launching a dedicated Data Protection & AI Governance desk led by Ananya Iyer, effective this month.", priority: AnnouncementPriority.IMPORTANT, createdById: arjun.id, publishedAt: subDays(now, 5) },
      { title: "Court Filing Deadline Reminder", body: "All filings for matters listed before 31 July must be submitted to the registry two working days in advance.", priority: AnnouncementPriority.URGENT, createdById: rohan.id, publishedAt: subDays(now, 1) },
      { title: "Updated Invoice Numbering Format", body: "Starting this quarter, invoice numbers follow the LEX-INV-YYYY-#### format across all offices.", priority: AnnouncementPriority.NORMAL, createdById: rahul.id, publishedAt: subDays(now, 10) },
    ],
  });

  // ── Court list (settings) ───────────────────────────────────────────
  await prisma.courtListEntry.createMany({
    data: [
      { name: "Supreme Court of India", type: CourtType.SUPREME_COURT, city: "New Delhi", state: "Delhi" },
      { name: "Bombay High Court", type: CourtType.HIGH_COURT, city: "Mumbai", state: "Maharashtra" },
      { name: "Delhi High Court", type: CourtType.HIGH_COURT, city: "New Delhi", state: "Delhi" },
      { name: "Karnataka High Court", type: CourtType.HIGH_COURT, city: "Bengaluru", state: "Karnataka" },
      { name: "City Civil Court, Mumbai", type: CourtType.DISTRICT_COURT, city: "Mumbai", state: "Maharashtra" },
      { name: "District Court, Pune", type: CourtType.DISTRICT_COURT, city: "Pune", state: "Maharashtra" },
      { name: "National Company Law Tribunal, Mumbai", type: CourtType.TRIBUNAL, city: "Mumbai", state: "Maharashtra" },
      { name: "National Green Tribunal", type: CourtType.TRIBUNAL, city: "New Delhi", state: "Delhi" },
      { name: "Labour Court, Mumbai", type: CourtType.TRIBUNAL, city: "Mumbai", state: "Maharashtra" },
      { name: "State Consumer Disputes Redressal Commission", type: CourtType.CONSUMER_FORUM, city: "Mumbai", state: "Maharashtra" },
    ],
  });

  // ── Knowledge base ──────────────────────────────────────────────────
  const knowledgeDefs = [
    { title: "DPDP Act, 2023 — Compliance Checklist for Employers", category: "Compliance", author: ananya },
    { title: "Guide to RERA Registration for Real Estate Projects", category: "Real Estate", author: vikram },
    { title: "Arbitration vs Litigation — Choosing the Right Forum", category: "Litigation", author: rohan },
    { title: "Trademark Registration Process in India: A Practical Guide", category: "Intellectual Property", author: ananya },
    { title: "Structuring Employee Stock Option Plans (ESOPs)", category: "Corporate", author: kavita },
    { title: "GST Notices: Common Grounds and Response Strategy", category: "Tax", author: karan },
  ];
  await Promise.all(
    knowledgeDefs.map((k) =>
      prisma.knowledgeArticle.create({
        data: {
          title: k.title,
          category: k.category,
          summary: `Practical guidance note on ${k.title.toLowerCase()}.`,
          body: `This internal knowledge base article covers key considerations, precedent references, and firm practice notes on "${k.title}".`,
          tags: k.category,
          authorId: k.author.id,
          publishedAt: subDays(now, randInt(5, 300)),
          viewCount: randInt(10, 480),
        },
      }),
    ),
  );

  // ── Activity log (recent activity feed) ─────────────────────────────
  const activityTemplates: { action: string; entityType: string }[] = [
    { action: "created a new matter", entityType: "MATTER" },
    { action: "uploaded a document to", entityType: "DOCUMENT" },
    { action: "logged a payment for", entityType: "INVOICE" },
    { action: "scheduled a hearing for", entityType: "HEARING" },
    { action: "completed a task on", entityType: "TASK" },
    { action: "added a note to", entityType: "NOTE" },
    { action: "generated an invoice for", entityType: "INVOICE" },
  ];
  for (let i = 0; i < 24; i++) {
    const matter = rand(matters);
    const idx = matters.indexOf(matter);
    const template = rand(activityTemplates);
    await prisma.activityLog.create({
      data: {
        action: template.action,
        entityType: template.entityType,
        entityId: matter.id,
        matterId: matter.id,
        clientId: matterDefs[idx].client.id,
        actorId: rand([matterDefs[idx].attorney, ...fileHandlers]).id,
        createdAt: subDays(now, randInt(0, 14)),
      },
    });
  }

  console.log("Seed complete:");
  console.log(`  Firm: ${firm.name}`);
  console.log(`  Offices: 3, Practice areas: ${practiceAreas.length}, Users: ${users.length}`);
  console.log(`  Clients: ${clients.length}, Matters: ${matters.length}`);
  console.log(`  Hearings: ${hearingCount}, Tasks: ${taskCount}, Documents: ${docCount}`);
  console.log(`  Invoices: ${invoices.length}, Templates: ${templateDefs.length}, Clauses: ${clauseDefs.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
