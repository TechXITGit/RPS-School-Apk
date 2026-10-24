// Recent Payments Table matching RPS Admin reference screenshot
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Radius, Shadows } from '../../theme/colors';
import { formatINR } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/dateUtils';

const DEFAULT_PAYMENTS = [
  { studentName: 'Shaanvi Yadav', studentUid: 'RPS-NURA-034', type: 'Development', amount: 100, date: '11 Sept' },
  { studentName: 'Shaanvi Yadav', studentUid: 'RPS-NURA-034', type: 'Tuition', amount: 2500, date: '11 Sept' },
  { studentName: 'Shaanvi Yadav', studentUid: 'RPS-NURA-034', type: 'Transport', amount: 2400, date: '11 Sept' },
  { studentName: 'Swaransh Gupta', studentUid: 'RPS-2A-009', type: 'Tuition', amount: 1800, date: '11 Sept' },
  { studentName: 'Trisha Giri', studentUid: 'RPS-NURA-039', type: 'SchoolKit', amount: 3900, date: '10 Sept' },
  { studentName: 'Trisha Giri', studentUid: 'RPS-NURA-039', type: 'Tuition', amount: 1500, date: '10 Sept' },
];

export default function RecentPaymentsTable({ payments = [] }) {
  const displayPayments = payments && payments.length > 0 ? payments : DEFAULT_PAYMENTS;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recent Payments</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colStudent]}>STUDENT</Text>
            <Text style={[styles.th, styles.colUid]}>UID</Text>
            <Text style={[styles.th, styles.colType]}>TYPE</Text>
            <Text style={[styles.th, styles.colAmount]}>AMOUNT</Text>
            <Text style={[styles.th, styles.colDate]}>DATE</Text>
          </View>

          {/* Table Rows */}
          {displayPayments.map((row, idx) => {
            const formattedAmount = formatINR(row.amount);
            const dateStr = row.paymentDate ? formatDate(row.paymentDate) : row.date || 'Today';

            return (
              <View key={row.id || idx} style={styles.tableRow}>
                <Text style={[styles.tdStudent, styles.colStudent]} numberOfLines={1}>
                  {row.studentName}
                </Text>
                <Text style={[styles.tdText, styles.colUid]} numberOfLines={1}>
                  {row.studentUid}
                </Text>
                <Text style={[styles.tdText, styles.colType]} numberOfLines={1}>
                  {row.type}
                </Text>
                <Text style={[styles.tdAmount, styles.colAmount]} numberOfLines={1}>
                  {formattedAmount}
                </Text>
                <Text style={[styles.tdDate, styles.colDate]} numberOfLines={1}>
                  {dateStr}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
    width: '100%',
    marginTop: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1B1C1A',
    marginBottom: 16,
  },
  tableContainer: {
    minWidth: 640,
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8F0',
  },
  th: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A7B8E',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0F7',
  },
  colStudent: {
    width: 180,
  },
  colUid: {
    width: 140,
  },
  colType: {
    width: 140,
  },
  colAmount: {
    width: 100,
    textAlign: 'right',
  },
  colDate: {
    width: 80,
    textAlign: 'right',
  },
  tdStudent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B1C1A',
  },
  tdText: {
    fontSize: 12.5,
    color: '#4B3F50',
    fontWeight: '500',
  },
  tdAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B1C1A',
  },
  tdDate: {
    fontSize: 12,
    color: '#7E747D',
    fontWeight: '500',
  },
});
