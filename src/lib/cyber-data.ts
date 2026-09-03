export type ScopeId = "department" | "enterprise" | "national";

export type Scope = {
  id: ScopeId;
  label: string;
  blurb: string;
  /** heartbeats per minute of the risk pulse */
  bpm: number;
  /** 0-100 composite risk index */
  riskIndex: number;
  /** annual cyber budget in INR crores */
  budgetCr: number;
  /** expected annualised loss in INR crores at zero treatment */
  exposureCr: number;
  assets: number;
};

export const SCOPES: Scope[] = [
  {
    id: "department",
    label: "Department",
    blurb: "Payments & Cards unit",
    bpm: 68,
    riskIndex: 34,
    budgetCr: 12.5,
    exposureCr: 46,
    assets: 1840,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    blurb: "All business lines, India",
    bpm: 92,
    riskIndex: 61,
    budgetCr: 148,
    exposureCr: 620,
    assets: 42600,
  },
  {
    id: "national",
    label: "National grid",
    blurb: "Regulated sector aggregate",
    bpm: 121,
    riskIndex: 82,
    budgetCr: 940,
    exposureCr: 5400,
    assets: 318000,
  },
];

export type RiskItem = {
  id: string;
  title: string;
  vector: string;
  severity: "critical" | "elevated" | "guarded";
  likelihood: number;
  /** annualised loss expectancy in INR crores at enterprise scope */
  aleCr: number;
  diagnosis: string;
  treatment: string[];
};

export const RISKS: RiskItem[] = [
  {
    id: "r1",
    title: "Ransomware in core banking VLAN",
    vector: "Initial access via unpatched VPN concentrator",
    severity: "critical",
    likelihood: 0.34,
    aleCr: 214,
    diagnosis:
      "Flat east-west routing between the branch VLAN and the core ledger cluster lets a single compromised jump host reach 71% of production workloads.",
    treatment: [
      "Micro-segment the ledger cluster behind identity-aware policy",
      "Immutable offsite snapshots every 15 minutes",
      "Quarterly restore drill with signed RTO evidence",
    ],
  },
  {
    id: "r2",
    title: "UPI merchant onboarding fraud",
    vector: "Synthetic KYC documents at partner APIs",
    severity: "critical",
    likelihood: 0.52,
    aleCr: 132,
    diagnosis:
      "Partner onboarding accepts 4 document types without liveness correlation. Mule velocity clusters show ₹18.4 Cr routed through 62 dormant VPAs last quarter.",
    treatment: [
      "Device-graph correlation before VPA activation",
      "Velocity ceiling of ₹2 Lakhs per new merchant for 30 days",
      "Shared negative list with sponsor bank",
    ],
  },
  {
    id: "r3",
    title: "Third-party data processor drift",
    vector: "Sub-processor storage outside contracted region",
    severity: "elevated",
    likelihood: 0.41,
    aleCr: 76,
    diagnosis:
      "9 of 34 processors have not re-attested since the DPDP Act rules. Two replicate customer PII to a region outside the master agreement.",
    treatment: [
      "Contract addendum with data-localisation clause",
      "Annual evidence-backed attestation gate before renewal",
      "Tokenise PII before egress to processors",
    ],
  },
  {
    id: "r4",
    title: "Privileged access sprawl",
    vector: "Standing admin rights on 412 accounts",
    severity: "elevated",
    likelihood: 0.47,
    aleCr: 58,
    diagnosis:
      "Break-glass credentials are shared across three ops shifts. 38% of privileged sessions are unrecorded, which breaks audit reconstruction.",
    treatment: [
      "Just-in-time elevation with 30 minute TTL",
      "Session recording on every tier-0 asset",
      "Automated quarterly entitlement recertification",
    ],
  },
  {
    id: "r5",
    title: "Legacy ATM switch firmware",
    vector: "End-of-support OS on 1,240 terminals",
    severity: "guarded",
    likelihood: 0.22,
    aleCr: 31,
    diagnosis:
      "Terminals accept unsigned firmware bundles. Physical jackpotting attempts have a demonstrated ₹9.6 Lakhs average loss per terminal.",
    treatment: [
      "Signed firmware enforcement with hardware root of trust",
      "Tamper telemetry streamed to the SOC",
      "Phased replacement across 6 quarters",
    ],
  },
  {
    id: "r6",
    title: "Phishing resilience gap",
    vector: "Credential harvest against branch staff",
    severity: "guarded",
    likelihood: 0.63,
    aleCr: 24,
    diagnosis:
      "Simulation click rate sits at 14.2% against a 6% target. Reporting time averages 41 minutes, above the 10 minute containment window.",
    treatment: [
      "Phishing-resistant passkeys for all staff",
      "One-click report button wired into the SOC queue",
      "Targeted coaching for repeat clickers",
    ],
  },
];

export type Defense = {
  id: string;
  label: string;
  unit: string;
  /** per-scope readings keyed by scope id */
  readings: Record<ScopeId, number>;
  target: number;
  invert?: boolean;
  note: string;
};

export const DEFENSES: Defense[] = [
  {
    id: "mttd",
    label: "Mean time to detect",
    unit: "min",
    readings: { department: 14, enterprise: 38, national: 96 },
    target: 20,
    invert: true,
    note: "Telemetry coverage on tier-0 assets",
  },
  {
    id: "patch",
    label: "Patch SLA adherence",
    unit: "%",
    readings: { department: 94, enterprise: 81, national: 63 },
    target: 95,
    note: "Critical CVEs closed within 7 days",
  },
  {
    id: "mfa",
    label: "Phishing-resistant MFA",
    unit: "%",
    readings: { department: 88, enterprise: 67, national: 44 },
    target: 100,
    note: "Passkey or FIDO2 enrolment",
  },
  {
    id: "backup",
    label: "Verified restore rate",
    unit: "%",
    readings: { department: 97, enterprise: 86, national: 71 },
    target: 99,
    note: "Successful drills in last 90 days",
  },
];

export type Region = {
  id: string;
  name: string;
  zone: string;
  /** percentage coords inside the map frame */
  x: number;
  y: number;
  exposureCr: number;
  incidents: number;
  severity: "critical" | "elevated" | "guarded";
};

export const REGIONS: Region[] = [
  { id: "dl", name: "Delhi NCR", zone: "North", x: 34, y: 24, exposureCr: 148, incidents: 62, severity: "critical" },
  { id: "mh", name: "Mumbai", zone: "West", x: 26, y: 58, exposureCr: 196, incidents: 74, severity: "critical" },
  { id: "ka", name: "Bengaluru", zone: "South", x: 38, y: 76, exposureCr: 121, incidents: 51, severity: "elevated" },
  { id: "tn", name: "Chennai", zone: "South", x: 48, y: 82, exposureCr: 68, incidents: 33, severity: "elevated" },
  { id: "tg", name: "Hyderabad", zone: "South", x: 40, y: 66, exposureCr: 84, incidents: 39, severity: "elevated" },
  { id: "wb", name: "Kolkata", zone: "East", x: 66, y: 47, exposureCr: 57, incidents: 28, severity: "guarded" },
  { id: "gj", name: "Ahmedabad", zone: "West", x: 22, y: 44, exposureCr: 44, incidents: 21, severity: "guarded" },
  { id: "up", name: "Lucknow", zone: "North", x: 46, y: 33, exposureCr: 36, incidents: 18, severity: "guarded" },
  { id: "as", name: "Guwahati", zone: "North East", x: 78, y: 36, exposureCr: 19, incidents: 9, severity: "guarded" },
];

export const COMPLIANCE = [
  { id: "rbi", label: "RBI Cyber Security Framework", status: "Aligned", score: 92 },
  { id: "dpdp", label: "DPDP Act 2023", status: "In remediation", score: 74 },
  { id: "iso", label: "ISO/IEC 27001:2022", status: "Certified", score: 96 },
  { id: "pci", label: "PCI DSS 4.0", status: "Aligned", score: 88 },
  { id: "cert", label: "CERT-In 6hr Reporting", status: "Aligned", score: 90 },
  { id: "sebi", label: "SEBI CSCRF", status: "Gap review", score: 68 },
] as const;

/** Formats an INR crore amount as Crores or Lakhs. */
export function formatInr(crores: number): string {
  if (Math.abs(crores) >= 1) {
    return `₹${crores.toFixed(crores >= 100 ? 0 : 1)} Cr`;
  }
  const lakhs = crores * 100;
  return `₹${lakhs.toFixed(lakhs >= 10 ? 0 : 1)} L`;
}

export const SEVERITY_LABEL: Record<string, string> = {
  critical: "Critical",
  elevated: "Elevated",
  guarded: "Guarded",
};
