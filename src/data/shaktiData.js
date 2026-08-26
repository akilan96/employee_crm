// ShaktiDB™ — Indigenous PostgreSQL-Forked Database Ecosystem Data

export const INSTITUTIONAL_PARTNERS = [
  {
    id: "meity",
    name: "MeitY",
    subtitle: "Government of India",
    tagline: "Ministry of Electronics & Information Technology",
    color: "#FF9933",
    type: "government"
  },
  {
    id: "iitm-pravartak",
    name: "IITM PRAVARTAK",
    subtitle: "Catalysing Innovation",
    tagline: "Technology Innovation Hub of IIT Madras",
    color: "#10B981",
    type: "research"
  },
  {
    id: "iitm",
    name: "IIT Madras",
    subtitle: "Institute of National Importance",
    tagline: "Department of Computer Science & Engineering",
    color: "#991B1B",
    type: "academic"
  },
  {
    id: "cdac",
    name: "C-DAC",
    subtitle: "सी डैक",
    tagline: "Centre for Development of Advanced Computing",
    color: "#0284C7",
    type: "national_rd"
  }
];

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "product", label: "Product" },
  { id: "architecture", label: "Architecture" },
  { id: "benchmarks", label: "Benchmarks" },
  { id: "documentation", label: "Documentation" },
  { id: "downloads", label: "Downloads" },
  { id: "resources", label: "Resources" },
  { id: "support", label: "Support" },
  { id: "careers", label: "Careers" },
  { id: "contact", label: "Contact Us" },
  { id: "blog", label: "Blog" }
];

export const SQL_PLAYGROUND_PRESETS = [
  {
    id: "banking",
    title: "1. Core Banking ACID Transaction",
    category: "Financial Services",
    description: "Post-quantum encrypted ledger balance update with sub-millisecond ACID guarantees.",
    query: `-- ShaktiDB High-Concurrency Sovereign Banking Transaction
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

UPDATE sovereign_banking_accounts
SET 
  balance = balance - 25000.00,
  last_enclave_audit = pg_shakti_attest()
WHERE account_id = 'SBIN-IN-90812' AND balance >= 25000.00;

INSERT INTO ledger_audit_log (
  txn_id, sender_acc, receiver_acc, amount, currency, pqc_signature
) VALUES (
  'TXN_SHAKTI_98214', 'SBIN-IN-90812', 'HDFC-IN-44102', 25000.00, 'INR',
  shakti_dilithium_sign('TXN_SHAKTI_98214:25000.00:INR')
);

COMMIT;`,
    output: {
      status: "TRANSACTION COMMITTED",
      executionTime: "0.28 ms",
      throughput: "1,420,000 TPS on IBM LinuxONE",
      enclaveStatus: "Verified Hardware Attestation (Level 4)",
      rowsAffected: 2,
      resultTable: [
        { column: "txn_id", value: "TXN_SHAKTI_98214" },
        { column: "status", value: "COMPLETED" },
        { column: "isolation", value: "SERIALIZABLE (ACID Guaranteed)" },
        { column: "crypto_engine", value: "ML-KEM / Dilithium Post-Quantum Enclave" },
        { column: "latency", value: "284 microseconds" }
      ]
    }
  },
  {
    id: "ai_vector",
    title: "2. ShaktiVector Native AI Hybrid Search",
    category: "AI & Sovereign LLMs",
    description: "Multi-billion vector similarity search powered by hardware-accelerated AVX-512 & IBM SIMD.",
    query: `-- ShaktiDB Native Vector Similarity & Metadata Filter
SELECT 
  doc_id,
  title,
  ministry_code,
  1 - (embedding <=> shakti_embed('Digital India DPDP compliance guidelines 2026')) AS similarity_score
FROM sovereign_knowledge_base
WHERE 
  security_classification = 'CONFIDENTIAL_RESTRICTED'
  AND published_year >= 2024
ORDER BY embedding <=> shakti_embed('Digital India DPDP compliance guidelines 2026')
LIMIT 3;`,
    output: {
      status: "QUERY EXECUTED SUCCESSFULLY",
      executionTime: "0.41 ms",
      throughput: "920,000 QPS (Vector Index)",
      enclaveStatus: "Memory Encrypted (Zero-Trust)",
      rowsAffected: 3,
      resultTable: [
        { doc_id: "DOC-MEITY-8812", title: "National Data Governance & DPDP Enclave Framework", ministry_code: "MEITY", similarity_score: "0.9842" },
        { doc_id: "DOC-CDAC-4419", title: "PARAM Supercomputer PostgreSQL NUMA Accelerations", ministry_code: "CDAC", similarity_score: "0.9615" },
        { doc_id: "DOC-IITM-1092", title: "Hardware Root-of-Trust on RISC-V Shakti Processors", ministry_code: "IITM", similarity_score: "0.9380" }
      ]
    }
  },
  {
    id: "telecom",
    title: "3. Hyper-Scale 5G CDR Ingestion",
    category: "Telecom & IoT",
    description: "Partitioned time-series telemetry ingestion processing 10M+ events/sec.",
    query: `-- ShaktiDB High-Throughput Time-Series Ingestion & Aggregation
SELECT 
  tower_zone,
  COUNT(*) AS total_handshakes,
  AVG(latency_ms) AS avg_latency,
  shakti_hyperloglog_count(subscriber_guid) AS unique_subscribers
FROM telecom_cdr_stream
WHERE 
  timestamp >= NOW() - INTERVAL '5 minutes'
  AND circle_id IN ('TN', 'MH', 'DL', 'KA')
GROUP BY tower_zone
ORDER BY total_handshakes DESC
LIMIT 4;`,
    output: {
      status: "QUERY EXECUTED (TIME-SERIES CHUNK ENGINE)",
      executionTime: "0.62 ms",
      throughput: "2,150,000 Events/Sec",
      enclaveStatus: "Compressed Columnar Storage (8.4x ratio)",
      rowsAffected: 4,
      resultTable: [
        { tower_zone: "CHENNAI_METRO_5G_01", total_handshakes: "4,821,902", avg_latency: "1.82 ms", unique_subscribers: "849,210" },
        { tower_zone: "MUMBAI_BKC_5G_09", total_handshakes: "4,510,230", avg_latency: "1.94 ms", unique_subscribers: "792,104" },
        { tower_zone: "DELHI_NCR_NORTH_03", total_handshakes: "3,980,112", avg_latency: "2.10 ms", unique_subscribers: "681,450" },
        { tower_zone: "BENGALURU_ELECTRONIC_CITY", total_handshakes: "3,750,990", avg_latency: "1.75 ms", unique_subscribers: "645,820" }
      ]
    }
  }
];

export const BENCHMARK_COMPARISONS = [
  {
    metric: "Read/Write TPS (IBM LinuxONE)",
    shakti: "1,420,000 TPS",
    shaktiVal: 100,
    vanillaPg: "480,000 TPS",
    vanillaVal: 34,
    oracle: "620,000 TPS",
    oracleVal: 44,
    description: "ShaktiDB utilizes custom lock-free memory indexing and NUMA thread pinning."
  },
  {
    metric: "Vector Search Query Latency (10M Vectors)",
    shakti: "0.41 ms",
    shaktiVal: 95,
    vanillaPg: "4.80 ms",
    vanillaVal: 20,
    oracle: "3.20 ms",
    oracleVal: 30,
    description: "Custom C-DAC vector instructions embedded directly inside the storage kernel."
  },
  {
    metric: "Post-Quantum Enclave Encryption Overhead",
    shakti: "< 2.8% Impact",
    shaktiVal: 96,
    vanillaPg: "N/A (Unassisted)",
    vanillaVal: 15,
    oracle: "24.5% Impact",
    oracleVal: 45,
    description: "Hardware offloaded ML-KEM and Dilithium acceleration at zero trust."
  },
  {
    metric: "Crash Recovery Time (100GB WAL)",
    shakti: "1.4 Seconds",
    shaktiVal: 98,
    vanillaPg: "42.0 Seconds",
    vanillaVal: 25,
    oracle: "18.5 Seconds",
    oracleVal: 50,
    description: "Parallel multi-stream checkpoint replays built for 99.999% high availability."
  }
];

export const CORE_PILLARS = [
  {
    id: "sovereignty",
    title: "Indigenous Sovereign Architecture",
    subtitle: "Built for Digital India & Global Trust",
    icon: "ShieldCheck",
    color: "from-amber-500 to-orange-600",
    badge: "DPDP & Bharat Certified",
    points: [
      "100% data sovereignty with zero proprietary telemetry or external vendor lock-in.",
      "Engineered by IITM Pravartak & C-DAC under Ministry of Electronics & IT (MeitY).",
      "Native support for India Stack APIs, Digilocker tokenization, and Aadhaar-compliant data isolation."
    ]
  },
  {
    id: "linuxone",
    title: "IBM LinuxONE™ Validation",
    subtitle: "Carrier-Grade Reliability",
    icon: "Cpu",
    color: "from-cyan-500 to-blue-600",
    badge: "Hardware Validated",
    points: [
      "Validated and certified on IBM LinuxONE III & 4 platforms for massive enterprise scaling.",
      "Leverages IBM Telum & CPACF cryptographic co-processors for 100% line-rate data encryption.",
      "Supports 99.999% uptime for national banking switches, stock exchanges, and telecom cores."
    ]
  },
  {
    id: "postgres",
    title: "100% PostgreSQL Compatibility",
    subtitle: "Drop-in Replacement for PostgreSQL 16+",
    icon: "Database",
    color: "from-emerald-500 to-teal-600",
    badge: "Zero Migration Effort",
    points: [
      "Full drop-in wire compatibility with libpq, psql, standard JDBC/ODBC, and ORMs (Prisma, TypeORM, Hibernate).",
      "Zero rewrites required: effortlessly import existing PostgreSQL schemas, extensions, and PL/pgSQL routines.",
      "Enhanced with multi-master synchronous Raft replication and auto-failover clustering."
    ]
  },
  {
    id: "vector_ai",
    title: "pg_shaktivector & AI Acceleration",
    subtitle: "Native Multi-Modal Vector Engine",
    icon: "Sparkles",
    color: "from-purple-500 to-indigo-600",
    badge: "AI-Ready Database",
    points: [
      "Direct in-database semantic embeddings and hybrid search combining full-text BM25 and HNSW vector index.",
      "Hardware-accelerated quantization (FP16, INT8, Binary) cutting memory consumption by up to 75%.",
      "Integrated with sovereign Indic language LLMs for instant semantic document discovery."
    ]
  }
];

export const RELEASE_PACKAGES = [
  {
    os: "Ubuntu / Debian",
    arch: "x86_64 / amd64",
    packageType: ".deb Package",
    version: "v2.4.1-LTS",
    size: "84.2 MB",
    checksum: "sha256:7f92a18b9c8...",
    command: "sudo apt-get install -y shaktidb-server-16"
  },
  {
    os: "IBM LinuxONE",
    arch: "s390x (Enterprise)",
    packageType: "RPM / Native s390x Binary",
    version: "v2.4.1-LTS (IBM Validated)",
    size: "91.8 MB",
    checksum: "sha256:4d10f82c1b7...",
    command: "sudo dnf install -y shaktidb-linuxone-enterprise"
  },
  {
    os: "RHEL / Rocky / AlmaLinux",
    arch: "x86_64 / aarch64",
    packageType: ".rpm Package",
    version: "v2.4.1-LTS",
    size: "86.5 MB",
    checksum: "sha256:e3b0c44298f...",
    command: "sudo dnf install -y shaktidb-server"
  },
  {
    os: "Docker & Container Registries",
    arch: "Multi-Arch (x86_64, ARM64, s390x)",
    packageType: "OCI Container Image",
    version: "2.4.1-alpine",
    size: "62.4 MB",
    checksum: "docker.io/shaktidb/server:2.4",
    command: "docker run -d --name shaktidb -p 5432:5432 -e SHAKTI_PASSWORD=secret shaktidb/server:2.4"
  },
  {
    os: "Kubernetes / OpenShift",
    arch: "Cloud Native Operator",
    packageType: "Helm 3 Chart",
    version: "v1.2.0 (HA Cluster)",
    size: "4.1 MB",
    checksum: "helm.shaktidb.org/charts",
    command: "helm repo add shaktidb https://charts.shaktidb.org && helm install my-cluster shaktidb/shaktidb-ha"
  }
];
