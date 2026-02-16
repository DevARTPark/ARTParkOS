import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
  Font,
} from "@react-pdf/renderer";

// --- STYLES (CSS-in-JS for PDF) ---
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  // Typography
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: { fontSize: 12, color: "#6B7280", marginBottom: 20 },
  header: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 20,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  label: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  value: { fontSize: 10, color: "#111827", marginBottom: 10, lineHeight: 1.4 },

  // Layout Helpers
  row: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  col: { flexDirection: "column", flex: 1 },
  grid2: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%" }, // 2 columns

  // Specific Components
  card: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
  },
  scoreBox: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    marginBottom: 20,
  },
  scoreValue: { fontSize: 36, fontWeight: "bold", color: "#312E81" },
  scoreLabel: {
    fontSize: 10,
    color: "#4338CA",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Tables
  table: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
    fontWeight: "bold",
    color: "#374151",
  },
  tableCell: { flex: 1, fontSize: 9 },

  // Links
  link: { color: "#2563EB", textDecoration: "none", fontSize: 10 },
  badge: { padding: "4 8", borderRadius: 4, fontSize: 8, fontWeight: "bold" },
});

// --- HELPER LOGIC (Replicating ApplicationFullView) ---
const DIMENSIONS = [
  { id: "lap1", label: "Strategy" },
  { id: "lap2", label: "Culture" },
  { id: "lap3", label: "Ops" },
  { id: "lap4", label: "Mindset" },
  { id: "lap5", label: "Tactics" },
];

const calculateScore = (assessments: any[]) => {
  if (!assessments || assessments.length === 0) return null;

  const teamDims: Record<string, number> = {
    lap1: 0,
    lap2: 0,
    lap3: 0,
    lap4: 0,
    lap5: 0,
  };

  assessments.forEach((a) => {
    const scores = a.dimensionScores || {};
    DIMENSIONS.forEach((dim) => {
      const score = scores[dim.id] || 0;
      if (score > teamDims[dim.id]) teamDims[dim.id] = score;
    });
  });

  const total = Object.values(teamDims).reduce((sum, val) => sum + val, 0);

  // Determine Tier
  const dimsBelow10 = Object.values(teamDims).filter((v) => v < 10).length;
  let tier = "RED TIER";
  let tierColor = "#FEE2E2"; // Red 100
  let tierText = "#991B1B"; // Red 800

  if (total >= 75 && dimsBelow10 === 0) {
    tier = "GREEN TIER";
    tierColor = "#D1FAE5"; // Green 100
    tierText = "#065F46"; // Green 800
  } else if (
    (total >= 60 && total <= 74) ||
    (total >= 75 && dimsBelow10 === 1)
  ) {
    tier = "YELLOW TIER";
    tierColor = "#FEF3C7"; // Yellow 100
    tierText = "#92400E"; // Yellow 800
  }

  return { total, dims: teamDims, tier, tierColor, tierText };
};

// --- PDF COMPONENT ---
export const ApplicationDocument = ({ data }: { data: any }) => {
  const { application, assessments } = data;
  const { founder, venture, innovator, uploads, coFounders } =
    application || {};
  const stats = calculateScore(assessments || []);

  const applicantName =
    founder?.fullName || innovator?.leadName || "Unknown Applicant";
  const ventureName =
    venture?.organizationName || innovator?.teamName || "Untitled Venture";
  const track =
    venture?.track === "startup" ? "Startup Track" : "Innovator Track";

  return (
    <Document>
      {/* PAGE 1: EXECUTIVE SCORECARD */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          Application ID: {application?.id || "N/A"} |{" "}
          {new Date().toLocaleDateString()}
        </Text>

        <View style={{ marginBottom: 30 }}>
          <Text style={styles.title}>{ventureName}</Text>
          <Text style={styles.subtitle}>
            {track} • Lead: {applicantName}
          </Text>
        </View>

        {/* INNOVATION INDEX SCORE */}
        <Text style={styles.sectionTitle}>Innovation Index Assessment</Text>
        {stats ? (
          <View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreValue}>{stats.total} / 100</Text>
              <Text style={styles.scoreLabel}>Total Team Score</Text>
              <View
                style={{
                  marginTop: 10,
                  padding: "4 12",
                  backgroundColor: stats.tierColor,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: stats.tierText,
                    fontWeight: "bold",
                    fontSize: 10,
                  }}
                >
                  {stats.tier}
                </Text>
              </View>
            </View>

            {/* Dimension Table */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                {DIMENSIONS.map((d) => (
                  <Text
                    key={d.id}
                    style={[styles.tableCell, { textAlign: "center" }]}
                  >
                    {d.label}
                  </Text>
                ))}
              </View>
              <View style={styles.tableRow}>
                {DIMENSIONS.map((d) => (
                  <Text
                    key={d.id}
                    style={[
                      styles.tableCell,
                      { textAlign: "center", fontWeight: "bold" },
                    ]}
                  >
                    {stats.dims[d.id]}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <Text style={{ color: "#6B7280", fontSize: 10, fontStyle: "italic" }}>
            No assessment data available.
          </Text>
        )}

        {/* PRIMARY CONTACT */}
        <Text style={styles.sectionTitle}>Primary Contact</Text>
        <View style={styles.grid2}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{applicantName}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>
              {founder?.email || innovator?.email}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>
              {founder?.phone || innovator?.phone}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>
              {founder?.city}, {founder?.country}
            </Text>
          </View>
        </View>
      </Page>

      {/* PAGE 2: VENTURE PROFILE */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{ventureName} - Profile</Text>

        <Text style={styles.sectionTitle}>Venture Identity</Text>
        <View style={styles.grid2}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Track</Text>
            <Text style={styles.value}>{track}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Vertical</Text>
            <Text style={styles.value}>{venture?.vertical || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>TRL Level</Text>
            <Text style={styles.value}>{venture?.trlLevel || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Website</Text>
            <Text style={styles.value}>{venture?.website || "N/A"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>The Pitch</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Problem Statement</Text>
          <Text style={styles.value}>
            {venture?.problemStatement || "Not provided"}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Proposed Solution</Text>
          <Text style={styles.value}>
            {venture?.solutionDescription || "Not provided"}
          </Text>
        </View>
      </Page>

      {/* PAGE 3: MARKET & FEASIBILITY */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{ventureName} - Feasibility</Text>

        <Text style={styles.sectionTitle}>Technology & Innovation</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Unique Value Proposition (USP)</Text>
          <Text style={styles.value}>{venture?.techInnovation || "N/A"}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Key Risks</Text>
          <Text style={styles.value}>{venture?.keyRisks || "N/A"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Market Strategy</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Target Audience</Text>
          <Text style={styles.value}>{venture?.targetUsers || "N/A"}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Market Validation</Text>
          <Text style={styles.value}>{venture?.marketValidation || "N/A"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Financials</Text>
        <View style={styles.grid2}>
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Funding Status</Text>
            <Text style={styles.value}>
              {venture?.fundingDetails || "No external funding reported."}
            </Text>
          </View>
        </View>
      </Page>

      {/* PAGE 4: TEAM & EVIDENCE */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{ventureName} - Team & Docs</Text>

        <Text style={styles.sectionTitle}>Team Structure</Text>
        {coFounders && coFounders.length > 0 ? (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
              <Text style={styles.tableCell}>Role</Text>
              <Text style={styles.tableCell}>Email</Text>
            </View>
            {coFounders.map((c: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}
                >
                  {c.name}
                </Text>
                <Text style={styles.tableCell}>{c.role}</Text>
                <Text style={styles.tableCell}>{c.email}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 10, color: "#6B7280" }}>
            Single Founder Application
          </Text>
        )}

        <Text style={styles.sectionTitle}>Document Vault</Text>
        <Text style={{ fontSize: 9, color: "#6B7280", marginBottom: 10 }}>
          Click the links below to access source files.
        </Text>

        {uploads && Object.keys(uploads).length > 0 ? (
          <View style={styles.table}>
            {Object.entries(uploads).map(([key, url]) => {
              if (!url) return null;
              const label = key.replace(/([A-Z])/g, " $1").trim(); // pitchDeck -> Pitch Deck
              return (
                <View key={key} style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, { textTransform: "capitalize" }]}
                  >
                    {label}
                  </Text>
                  <Link src={url as string} style={styles.link}>
                    Open File
                  </Link>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={{ fontSize: 10, color: "#9CA3AF" }}>
            No documents uploaded.
          </Text>
        )}
      </Page>
    </Document>
  );
};
