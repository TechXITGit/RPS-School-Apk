// Admission Enquiries Received via App Screen for RPS Admin Panel
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../../theme/colors';
import { subscribeToEnquiries } from '../../services/firebase/enquiryService';
import { formatDateTime } from '../../utils/dateUtils';

const CLASS_FILTERS = ['All', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

// Sample admission requests received via app if Firestore has no records yet
const SAMPLE_APP_ENQUIRIES = [
  {
    id: 'sample-enq-1',
    candidateName: 'Shaurya Pratap Singh',
    grade: 'Nursery',
    parentName: 'Vikram Pratap Singh',
    contactNumber: '9919993377',
    email: 'vikram.singh@gmail.com',
    message: 'Looking for Nursery admission for Session 2026-27 with school bus transport facility.',
    source: 'App Admission Form',
    date: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
  },
  {
    id: 'sample-enq-2',
    candidateName: 'Aarohi Mishra',
    grade: 'Class 1',
    parentName: 'Rajesh Mishra',
    contactNumber: '9838012345',
    email: 'rajesh.mishra@yahoo.com',
    message: 'Transfer admission from Delhi to Rudrapur. Need information about syllabus and admission test.',
    source: 'App Admission Form',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: 'sample-enq-3',
    candidateName: 'Vivaan Verma',
    grade: 'UKG',
    parentName: 'Sanjay Verma',
    contactNumber: '9450098765',
    email: 'sanjay.verma@gmail.com',
    message: 'Interested in UKG admission. Please provide fee details and document submission dates.',
    source: 'App Admission Form',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'sample-enq-4',
    candidateName: 'Trisha Keshari',
    grade: 'LKG',
    parentName: 'Anil Keshari',
    contactNumber: '9792054321',
    email: 'anil.keshari@gmail.com',
    message: 'Want to visit campus on Saturday for child admission counselling.',
    source: 'App Admission Form',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];

export default function EnquiriesScreen() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  useEffect(() => {
    const unsub = subscribeToEnquiries((list) => {
      if (list && list.length > 0) {
        setEnquiries(list);
      } else {
        setEnquiries(SAMPLE_APP_ENQUIRIES);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleCall = (phone) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleWhatsApp = (phone, candidateName) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const num = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(
      `Namaste! This is from Rudrapur Public School regarding the admission enquiry submitted for ${candidateName}.`
    );
    Linking.openURL(`https://wa.me/${num}?text=${msg}`).catch(() => {});
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const candidate = (item.candidateName || '').toLowerCase();
    const parent = (item.parentName || '').toLowerCase();
    const grade = (item.grade || '').toLowerCase();
    const phone = (item.contactNumber || '');

    const matchesSearch = !q || candidate.includes(q) || parent.includes(q) || grade.includes(q) || phone.includes(q);

    let matchesClass = true;
    if (selectedClass !== 'All') {
      matchesClass = grade.includes(selectedClass.toLowerCase());
    }

    return matchesSearch && matchesClass;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Admission Enquiries</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{enquiries.length} Requests</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            List of parent applications & enquiries submitted online via the mobile app
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#8A7B8E" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name, parent name, class or mobile..."
          placeholderTextColor="#A199A3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#8A7B8E" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Class Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterScrollContent}
      >
        {CLASS_FILTERS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.filterChip, selectedClass === c && styles.filterChipActive]}
            onPress={() => setSelectedClass(c)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, selectedClass === c && styles.filterChipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Requests List */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#4361EE" />
          <Text style={styles.loadingText}>Loading admission requests...</Text>
        </View>
      ) : filteredEnquiries.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="mail-open-outline" size={48} color="#D0C3CD" />
          <Text style={styles.emptyTitle}>No Admission Enquiries Found</Text>
          <Text style={styles.emptySub}>No requests match your current search or class filter.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEnquiries}
          keyExtractor={(item) => item.id || String(Math.random())}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const initial = (item.candidateName ? item.candidateName[0] : 'S').toUpperCase();
            return (
              <View style={styles.card}>
                {/* Header Row: Candidate Name, Class Badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.candidateName}>{item.candidateName}</Text>
                      <View style={styles.gradeRow}>
                        <View style={styles.gradeBadge}>
                          <Ionicons name="school" size={12} color="#5E17EB" />
                          <Text style={styles.gradeBadgeText}>Class: {item.grade || 'Nursery'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDateTime(item.date || item.createdAt)}
                  </Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Details Section */}
                <View style={styles.detailsGrid}>
                  {/* Parent Name */}
                  <View style={styles.detailItem}>
                    <Ionicons name="person-outline" size={15} color="#6B5A72" />
                    <Text style={styles.detailLabel}>Parent/Guardian:</Text>
                    <Text style={styles.detailValue}>{item.parentName || 'N/A'}</Text>
                  </View>

                  {/* Phone / Mobile */}
                  <View style={styles.detailItem}>
                    <Ionicons name="call-outline" size={15} color="#6B5A72" />
                    <Text style={styles.detailLabel}>Mobile:</Text>
                    <Text style={styles.detailValue}>{item.contactNumber || 'N/A'}</Text>
                  </View>

                  {/* Email */}
                  {item.email ? (
                    <View style={styles.detailItem}>
                      <Ionicons name="mail-outline" size={15} color="#6B5A72" />
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>{item.email}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Message / Remarks Box */}
                {item.message ? (
                  <View style={styles.messageBox}>
                    <Ionicons name="chatbubble-ellipses-outline" size={15} color="#5E17EB" style={{ marginTop: 2 }} />
                    <Text style={styles.messageText}>"{item.message}"</Text>
                  </View>
                ) : null}

                {/* Bottom Quick Contact Buttons */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => handleCall(item.contactNumber)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={14} color="#FFFFFF" />
                    <Text style={styles.callBtnText}>Call Parent</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.whatsappBtn}
                    onPress={() => handleWhatsApp(item.contactNumber, item.candidateName)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-whatsapp" size={15} color="#25D366" />
                    <Text style={styles.whatsappBtnText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 20,
  },
  topBar: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#180126',
  },
  countBadge: {
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5E17EB',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B5A72',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    marginBottom: 12,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#180126',
  },
  filterScroll: {
    marginBottom: 14,
    height: 70,
    flexGrow: 0,
  },
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E4DDE6',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  filterChipActive: {
    backgroundColor: '#5E17EB',
    borderColor: '#5E17EB',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B5A72',
    includeFontPadding: false,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13.5,
    color: '#8A7B8E',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B3F50',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#8A7B8E',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    minWidth: 220,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5E17EB',
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#180126',
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  gradeBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#5E17EB',
  },
  dateText: {
    fontSize: 12,
    color: '#8A7B8E',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EAF2',
    marginVertical: 12,
  },
  detailsGrid: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B5A72',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: '#180126',
    fontWeight: '700',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF8FB',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#EFE7F2',
  },
  messageText: {
    flex: 1,
    fontSize: 12.5,
    color: '#4B3F50',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5E17EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  callBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  whatsappBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1B5E20',
  },
});
