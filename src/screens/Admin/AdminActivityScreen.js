import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { subscribeToAdminActivity, subscribeAdminActivity } from '../../services/firebase/activityService';
import { formatDateTime } from '../../utils/dateUtils';

const FILTER_TABS = [
  { key: 'ALL', label: 'All Activity' },
  { key: 'STUDENT', label: 'Students' },
  { key: 'FEE', label: 'Fees & Payments' },
  { key: 'ATTENDANCE', label: 'Attendance' },
  { key: 'ADMIN', label: 'Admins' },
];

const getActionMeta = (actionType) => {
  const type = String(actionType || '').toUpperCase();
  if (type.includes('STUDENT')) {
    return { icon: 'school', color: '#5E17EB', bg: '#EDE7F6' };
  }
  if (type.includes('FEE') || type.includes('PAYMENT')) {
    return { icon: 'cash', color: '#2E7D32', bg: '#E8F5E9' };
  }
  if (type.includes('ATTENDANCE')) {
    return { icon: 'calendar', color: '#1976D2', bg: '#E3F2FD' };
  }
  if (type.includes('ADMIN')) {
    return { icon: 'shield-checkmark', color: '#D81B60', bg: '#FCE4EC' };
  }
  if (type.includes('TEACHER') || type.includes('SALARY')) {
    return { icon: 'briefcase', color: '#F57C00', bg: '#FFF3E0' };
  }
  if (type.includes('LOGIN')) {
    return { icon: 'log-in', color: '#00897B', bg: '#E0F2F1' };
  }
  return { icon: 'information-circle', color: '#666666', bg: '#F5F5F5' };
};

const AdminActivityScreen = () => {
  const { isSuperAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const subscribeFn = subscribeToAdminActivity || subscribeAdminActivity;
    if (typeof subscribeFn !== 'function') {
      setLoading(false);
      return;
    }
    const unsub = subscribeFn((data) => {
      setLogs(data || []);
      setLoading(false);
    }, 100);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    // Tab filter
    if (activeTab !== 'ALL') {
      const act = (log.action || '').toUpperCase();
      if (!act.includes(activeTab)) return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const adminName = (log.adminName || '').toLowerCase();
      const adminEmail = (log.adminEmail || '').toLowerCase();
      const action = (log.action || '').toLowerCase();
      const details = (typeof log.details === 'string' ? log.details : JSON.stringify(log.details || '')).toLowerCase();
      return adminName.includes(q) || adminEmail.includes(q) || action.includes(q) || details.includes(q);
    }
    return true;
  });

  if (!isSuperAdmin) {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons name="shield-outline" size={56} color="#C62828" />
        <Text style={styles.restrictedTitle}>Access Restricted</Text>
        <Text style={styles.restrictedSub}>
          Only Super Admins can audit administrator system actions and historical event logs.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.screenTitle}>Admin Activity Audit</Text>
          <Text style={styles.screenSub}>
            Real-time chronological log of administrative operations and changes
          </Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live Sync</Text>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by admin name, action, or details..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Timeline Stream */}
      {loading ? (
        <ActivityIndicator size="large" color="#5E17EB" style={{ marginTop: 40 }} />
      ) : filteredLogs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="newspaper-outline" size={48} color="#999" />
          <Text style={styles.emptyText}>No activity records match your filter.</Text>
        </View>
      ) : (
        <View style={styles.timelineList}>
          {filteredLogs.map((item, index) => {
            const meta = getActionMeta(item.action);
            const detailStr =
              typeof item.details === 'object'
                ? JSON.stringify(item.details, null, 2)
                : item.description || item.details || '';

            return (
              <View key={item.id || index} style={styles.timelineCard}>
                {/* Left icon bubble */}
                <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={18} color={meta.color} />
                </View>

                {/* Main details */}
                <View style={styles.cardMain}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.actionTitle}>
                      {item.action ? item.action.replace(/_/g, ' ') : 'System Action'}
                    </Text>
                    <Text style={styles.timestamp}>
                      {formatDateTime(item.timestamp || item.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.performerRow}>
                    <Ionicons name="person-circle-outline" size={15} color="#555" />
                    <Text style={styles.performerText}>
                      {item.adminName || 'Admin'}
                    </Text>
                    {item.adminEmail ? (
                      <Text style={styles.performerEmail}>({item.adminEmail})</Text>
                    ) : null}
                  </View>

                  {detailStr ? (
                    <View style={styles.detailsBox}>
                      <Text style={styles.detailsText} numberOfLines={3}>
                        {detailStr}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, paddingBottom: 60 },
  restrictedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  restrictedTitle: { fontSize: 20, fontWeight: '700', color: '#C62828', marginTop: 16 },
  restrictedSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  screenTitle: { fontSize: 24, fontWeight: '800', color: '#180126' },
  screenSub: { fontSize: 13, color: '#666', marginTop: 3 },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32' },
  liveText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  tabsContainer: { gap: 8, marginBottom: 20 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterTabActive: { backgroundColor: '#180126', borderColor: '#180126' },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  filterTabTextActive: { color: '#FFFFFF', fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#999', marginTop: 12, fontSize: 14 },
  timelineList: { gap: 12 },
  timelineCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 14,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMain: { flex: 1 },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#180126' },
  timestamp: { fontSize: 12, color: '#999' },
  performerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  performerText: { fontSize: 13, fontWeight: '600', color: '#444' },
  performerEmail: { fontSize: 12, color: '#888' },
  detailsBox: {
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  detailsText: { fontSize: 12, color: '#555', fontFamily: 'monospace' },
});

export default AdminActivityScreen;
