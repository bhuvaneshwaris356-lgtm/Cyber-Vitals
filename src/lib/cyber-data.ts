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
    id: "national",
    label: "Organization",
    blurb: "all regulated entities, India",
    bpm: 121,
    riskIndex: 82,
    budgetCr: 940,
    exposureCr: 5400,
    assets: 318000,
  },
  {
    id: "enterprise",
    label: "Business Unit",
    blurb: "retail banking business unit",
    bpm: 92,
    riskIndex: 61,
    budgetCr: 148,
    exposureCr: 620,
    assets: 42600,
  },
  {
    id: "department",
    label: "Asset",
    blurb: "the Payments & Cards asset group",
    bpm: 68,
    riskIndex: 34,
    budgetCr: 12.5,
    exposureCr: 46,
    assets: 1840,
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
  {
    id: "dl",
    name: "Delhi NCR",
    zone: "North",
    x: 34,
    y: 24,
    exposureCr: 148,
    incidents: 62,
    severity: "critical",
  },
  {
    id: "mh",
    name: "Mumbai",
    zone: "West",
    x: 26,
    y: 58,
    exposureCr: 196,
    incidents: 74,
    severity: "critical",
  },
  {
    id: "ka",
    name: "Bengaluru",
    zone: "South",
    x: 38,
    y: 76,
    exposureCr: 121,
    incidents: 51,
    severity: "elevated",
  },
  {
    id: "tn",
    name: "Chennai",
    zone: "South",
    x: 48,
    y: 82,
    exposureCr: 68,
    incidents: 33,
    severity: "elevated",
  },
  {
    id: "tg",
    name: "Hyderabad",
    zone: "South",
    x: 40,
    y: 66,
    exposureCr: 84,
    incidents: 39,
    severity: "elevated",
  },
  {
    id: "wb",
    name: "Kolkata",
    zone: "East",
    x: 66,
    y: 47,
    exposureCr: 57,
    incidents: 28,
    severity: "guarded",
  },
  {
    id: "gj",
    name: "Ahmedabad",
    zone: "West",
    x: 22,
    y: 44,
    exposureCr: 44,
    incidents: 21,
    severity: "guarded",
  },
  {
    id: "up",
    name: "Lucknow",
    zone: "North",
    x: 46,
    y: 33,
    exposureCr: 36,
    incidents: 18,
    severity: "guarded",
  },
  {
    id: "as",
    name: "Guwahati",
    zone: "North East",
    x: 78,
    y: 36,
    exposureCr: 19,
    incidents: 9,
    severity: "guarded",
  },
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

export type RiskTier = "all" | "high" | "moderate" | "low";

/** Clinical severity maps onto the three exposure tiers. */
export const TIER_OF: Record<string, Exclude<RiskTier, "all">> = {
  critical: "high",
  elevated: "moderate",
  guarded: "low",
};

export const TIER_LABEL: Record<Exclude<RiskTier, "all">, string> = {
  high: "HIGH",
  moderate: "MODERATE",
  low: "LOW",
};

export const TIER_COLOR: Record<Exclude<RiskTier, "all">, string> = {
  high: "var(--rust)",
  moderate: "var(--amber)",
  low: "var(--sage)",
};

export const FAQ = [
  {
    id: "eal",
    q: "How is EAL formulated?",
    a: "Expected annual loss is EAL = LEF × LM — loss event frequency multiplied by loss magnitude. Both terms are calibrated against Indian enterprise incident benchmarks (CERT-In advisories, sector breach filings and sponsor-bank claim data), so a ₹ figure here reflects observed local recovery, penalty and downtime costs rather than a global average.",
  },
  {
    id: "tiers",
    q: "What defines the High, Moderate and Low tiers?",
    a: "High: above ₹1.5 Cr expected annual loss, typically core banking and settlement paths. Moderate: ₹50 Lakhs to ₹1.5 Cr, usually customer data and partner interfaces. Low: below ₹50 Lakhs, confined to internal or non-transactional systems.",
  },
  {
    id: "spend",
    q: "Why does optimal spend plateau at ₹45 Lakhs?",
    a: "The treatment curve follows diminishing returns: the first tranche of spend buys segmentation, MFA and restore assurance, which remove the largest loss events. Past roughly ₹45 Lakhs per control domain, each additional rupee reduces residual exposure by less than a rupee of avoided loss, so the marginal ROI crosses one and the curve flattens.",
  },
  {
    id: "regulatory",
    q: "How does this align with Indian regulation?",
    a: "Continuous telemetry, tier-0 detection timing and verified restore evidence map directly to the RBI Cyber Security Framework's baseline and SOC expectations, while the risk register, board reporting cadence and third-party attestations map to SEBI CSCRF governance, identification and response functions.",
  },
] as const;

/** Control effectiveness / immune telemetry readings (percent). */
export type Control = {
  id: string;
  label: string;
  value: number;
  /** month-on-month change in percentage points */
  delta: number;
  note: string;
};

export const CONTROLS: Control[] = [
  {
    id: "iam",
    label: "IAM Hygiene",
    value: 88,
    delta: 3.4,
    note: "Joiner-mover-leaver closure within SLA",
  },
  {
    id: "edr",
    label: "EDR Coverage",
    value: 81,
    delta: 1.9,
    note: "Agents healthy on tier-0 and tier-1 hosts",
  },
  {
    id: "siem",
    label: "SIEM / SOC Visibility",
    value: 67,
    delta: -2.1,
    note: "Log sources parsed against use-case catalogue",
  },
  {
    id: "cspm",
    label: "CSPM Posture",
    value: 54,
    delta: 4.6,
    note: "Cloud accounts free of critical misconfiguration",
  },
  {
    id: "drift",
    label: "Endpoint Drift",
    value: 42,
    delta: -5.2,
    note: "Builds still matching the golden image",
  },
];

/** Canned diagnostic answers for the Ask the Monitor terminal. */
export type MonitorQuery = {
  id: string;
  chip: string;
  keywords: string[];
  lines: string[];
};

export const MONITOR_QUERIES: MonitorQuery[] = [
  {
    id: "top-loss",
    chip: "Top financial exposure?",
    keywords: ["top", "expos", "loss", "eal", "financ", "biggest", "worst"],
    lines: [
      "top driver   Ransomware in core banking VLAN",
      "expected annual loss   ₹2.14 Cr",
      "affected subnets   10.42.0.0/16, 10.58.12.0/22",
      "containment window   4h 20m from first beacon",
    ],
  },
  {
    id: "ransomware",
    chip: "Ransomware containment window?",
    keywords: ["ransom", "contain", "window", "mttr", "recover", "encrypt"],
    lines: [
      "detection   18 min median on tier-0 telemetry",
      "containment window   4h 20m against a 2h 00m target",
      "affected subnets   10.42.0.0/16 (ledger), 10.44.8.0/24 (jump hosts)",
      "loss avoided if window halves   ₹1.12 Cr per year",
    ],
  },
  {
    id: "subnets",
    chip: "Which subnets are exposed?",
    keywords: ["subnet", "network", "vlan", "segment", "ip", "where"],
    lines: [
      "10.42.0.0/16   core ledger · ₹2.14 Cr · flat east-west routing",
      "10.58.12.0/22  UPI partner APIs · ₹1.32 Cr · unthrottled onboarding",
      "10.61.0.0/20   processor egress · ₹76 L · PII leaves contracted region",
      "10.70.4.0/24   ATM switch fleet · ₹31 L · unsigned firmware accepted",
    ],
  },
  {
    id: "budget",
    chip: "Where should the next ₹45 Lakhs go?",
    keywords: ["budget", "spend", "invest", "allocat", "next", "roi", "45"],
    lines: [
      "allocated budget   ₹45 L (optimal dose)",
      "₹18 L  micro-segmentation of 10.42.0.0/16 → ₹64 L loss avoided",
      "₹14 L  device-graph checks on UPI onboarding → ₹41 L loss avoided",
      "₹13 L  immutable snapshots + restore drills → ₹29 L loss avoided",
      "blended risk reduction   61% · containment window 4h 20m → 1h 45m",
    ],
  },
];

export type KbSection = {
  id: string;
  label: string;
  blurb: string;
  items: { id: string; q: string; a: string }[];
};

export const KB_SECTIONS: KbSection[] = [
  {
    id: "high",
    label: "High risk",
    blurb: "Findings above ₹1.5 Cr expected annual loss",
    items: [
      {
        id: "h1",
        q: "Why is ransomware in the core banking VLAN rated high?",
        a: "Loss event frequency of 0.34 per year against a loss magnitude of ₹6.3 Cr gives an EAL of ₹2.14 Cr. Flat east-west routing means one compromised jump host on 10.42.0.0/16 reaches 71% of production workloads, so a single event carries full settlement downtime, regulatory penalty and recovery cost.",
      },
      {
        id: "h2",
        q: "How is UPI merchant onboarding fraud quantified?",
        a: "Mule velocity clustering showed ₹18.4 Cr routed through 62 dormant VPAs in one quarter. Applying observed recovery rates and sponsor-bank chargeback share yields ₹1.32 Cr expected annual loss, with a 4 hour containment window from first velocity alarm to VPA freeze.",
      },
      {
        id: "h3",
        q: "What makes a containment window a high-risk driver?",
        a: "Loss magnitude scales almost linearly with dwell time on transactional subnets. At the current 4h 20m window, roughly ₹34 Lakhs of loss accrues per additional hour on the ledger path, which is why halving the window is worth more than adding new detection sources.",
      },
      {
        id: "h4",
        q: "Do high-risk findings drive the board report?",
        a: "Yes. Anything above ₹1.5 Cr EAL enters the quarterly board pack with named owner, treatment cost and residual EAL after treatment, matching RBI Cyber Security Framework board oversight expectations.",
      },
      {
        id: "h5",
        q: "How quickly must a high-risk finding be treated?",
        a: "Treatment must start within 30 days and reach the agreed residual EAL within two quarters. CERT-In six hour incident reporting applies independently if the finding materialises as an incident.",
      },
    ],
  },
  {
    id: "moderate",
    label: "Moderate risk",
    blurb: "Findings between ₹50 Lakhs and ₹1.5 Cr",
    items: [
      {
        id: "m1",
        q: "Why is third-party processor drift moderate rather than high?",
        a: "Nine of thirty-four processors have not re-attested since the DPDP Act rules, and two replicate PII outside the master agreement. EAL of ₹76 Lakhs reflects penalty exposure and notification cost, not settlement downtime, so it sits below the high threshold.",
      },
      {
        id: "m2",
        q: "How is privileged access sprawl scored?",
        a: "412 standing admin accounts with 38% of privileged sessions unrecorded produce a ₹58 Lakhs EAL, driven mainly by audit reconstruction failure and the cost of a forced credential reset across three ops shifts.",
      },
      {
        id: "m3",
        q: "Can a moderate finding escalate?",
        a: "It escalates automatically if the affected subnet gains a transactional path, if loss magnitude re-estimates above ₹1.5 Cr, or if the finding stays open past two review cycles without treatment progress.",
      },
      {
        id: "m4",
        q: "What treatment is expected at this tier?",
        a: "Compensating controls first — tokenisation, just-in-time elevation, session recording — with structural remediation scheduled into the next annual plan rather than an emergency tranche of spend.",
      },
      {
        id: "m5",
        q: "How does SEBI CSCRF read moderate findings?",
        a: "CSCRF governance and identification functions expect a maintained risk register with tier, owner and residual value. Moderate findings satisfy that through evidence-backed attestation gates at renewal instead of continuous assurance.",
      },
    ],
  },
  {
    id: "drivers",
    label: "Risk drivers",
    blurb: "How EAL, tiers and the spend curve are derived",
    items: [
      {
        id: "d1",
        q: "How is EAL formulated?",
        a: "EAL = LEF × LM — loss event frequency multiplied by loss magnitude. Both terms are calibrated against Indian enterprise benchmarks (CERT-In advisories, sector breach filings, sponsor-bank claim data), so every ₹ figure reflects local recovery, penalty and downtime cost rather than a global average.",
      },
      {
        id: "d2",
        q: "What defines the High, Moderate and Low tiers?",
        a: "High: above ₹1.5 Cr EAL, typically core banking and settlement paths. Moderate: ₹50 Lakhs to ₹1.5 Cr, usually customer data and partner interfaces. Low: below ₹50 Lakhs, confined to internal or non-transactional systems.",
      },
      {
        id: "d3",
        q: "Why does optimal spend plateau at ₹45 Lakhs?",
        a: "The first tranche buys segmentation, phishing-resistant MFA and restore assurance, which remove the largest loss events. Past roughly ₹45 Lakhs per control domain each additional rupee avoids less than a rupee of loss, so marginal return crosses one and the curve flattens.",
      },
      {
        id: "d4",
        q: "What does control effectiveness telemetry measure?",
        a: "Each trace is the share of in-scope estate where the control is verifiably working — agents healthy, log sources parsed, builds matching the golden image. Effectiveness is applied as a multiplier on loss event frequency, so a drop in SIEM visibility raises EAL without any new finding.",
      },
      {
        id: "d5",
        q: "How does scope selection change the figures?",
        a: "Organization, Business Unit and Asset each carry their own asset count, risk index and exposure base. Switching scope rescales the risk score, waveform amplitude and every ₹ figure on the page; the underlying tier logic and formulation stay identical.",
      },
    ],
  },
];
