import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  outerBorder: {
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'solid',
    padding: 3,
    height: '100%',
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 130,
    height: 40,
    objectFit: 'contain',
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSection: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    padding: 6,
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 6,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  tableCell: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  feedbackHeader: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  feedbackText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    marginTop: 4,
  },
});

export const ResumeReportPDF = ({ results, logoUrl }) => {
  const matched = results?.matched_skills || [];
  const missing = results?.missing_skills || [];
  const maxRows = Math.max(matched.length, missing.length, 1);
  const rows = [];

  for (let i = 0; i < maxRows; i++) {
    rows.push({
      match: matched[i] || '',
      miss: missing[i] || '',
    });
  }

  return (
    <Document title={`Resume_Analysis_${results?.candidate_name || 'Report'}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {/* HEADER LOGO */}
            <View style={styles.logoContainer}>
              {logoUrl ? (
                <Image style={styles.logo} src={logoUrl} />
              ) : (
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold' }}>CareerConnectAI</Text>
              )}
            </View>

            {/* REPORT TITLE */}
            <Text style={styles.title}>RAG BASED JD-RESUME ANALYZER GENERATED REPORT</Text>

            {/* CANDIDATE METADATA */}
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                NAME : {results?.candidate_name || 'Unknown'}
              </Text>
              <Text style={styles.infoText}>
                PERCENTAGE : {results?.skill_match_percentage ?? 0}%
              </Text>
            </View>

            {/* REQUIREMENTS TABLE */}
            <View style={styles.table}>
              {/* TABLE HEADER */}
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableHeaderCell}>MATCHING REQUIREMENT</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableHeaderCell}>MISSING REQUIREMENT</Text>
                </View>
              </View>

              {/* TABLE ROWS */}
              {rows.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{row.match}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{row.miss}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* OVERALL FEEDBACK SECTION */}
            <View>
              <Text style={styles.feedbackHeader}>
                OVERALL FEEDBACK FROM CareerConnectAI:
              </Text>
              <Text style={styles.feedbackText}>
                {results?.justification || 'No detailed evaluation justification provided.'}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumeReportPDF;
