import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const FACULTY_META = {
  '1': {
    department: 'Senior Wing',
    statusColor: '#b9ebca',
    statusText: '#214f37',
    avatar: require('../../assets/dr_ananya.png'),
  },
  '2': {
    department: 'STEM & Labs',
    statusColor: '#fcd7ff',
    statusText: '#30093a',
    imageUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  '3': {
    department: 'Arts & Humanities',
    statusColor: '#b9ebca',
    statusText: '#214f37',
    imageUri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  '4': {
    department: 'Athletics',
    statusColor: '#b9ebca',
    statusText: '#214f37',
    imageUri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  },
  '5': {
    department: 'STEM & Labs',
    statusColor: '#b9ebca',
    statusText: '#214f37',
    imageUri: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
  },
  '6': {
    department: 'Senior Wing',
    statusColor: '#b9ebca',
    statusText: '#214f37',
    imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
};

export default function FacultyScreen({ onBack }) {
  const { t, isHindi } = useLanguage();
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    { id: 'All', label: t.faculty.deptAll || 'All' },
    { id: 'Senior Wing', label: t.faculty.deptSenior || 'Senior Wing' },
    { id: 'STEM & Labs', label: t.faculty.deptStem || 'STEM & Labs' },
    { id: 'Athletics', label: t.faculty.deptAthletics || 'Athletics' },
    { id: 'Arts & Humanities', label: t.faculty.deptArts || 'Arts & Humanities' },
  ];

  const facultyMembers = (t.faculty.members || []).map((m) => {
    const meta = FACULTY_META[m.id] || {};
    return {
      ...m,
      ...meta,
    };
  });

  const filteredFaculty = facultyMembers.filter((f) => {
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesDept;
    const matchesSearch =
      (f.name && f.name.toLowerCase().includes(query)) ||
      (f.role && f.role.toLowerCase().includes(query)) ||
      (f.qual && f.qual.toLowerCase().includes(query)) ||
      (f.reg && f.reg.toLowerCase().includes(query));
    return matchesDept && matchesSearch;
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header Badge */}
        <View style={styles.headerBadge}>
          <Ionicons name="checkmark-circle" size={13} color="#214f37" />
          <Text style={styles.headerBadgeText}>
            {isHindi
              ? '48 प्रतिष्ठित शिक्षक • सीबीएसई #3530491'
              : '48 DISTINGUISHED EDUCATORS • CBSE #3530491'}
          </Text>
        </View>

        <Text style={styles.screenTitle}>{t.faculty.title}</Text>
        <Text style={styles.screenSubtitle}>
          {t.faculty.subtitle}
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#7e747d" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              t.faculty.searchPlaceholder ||
              (isHindi
                ? 'नाम, विषय या पद द्वारा शिक्षक खोजें...'
                : 'Search faculty, subject, or degree...')
            }
            placeholderTextColor="#7e747d"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#7e747d" />
            </TouchableOpacity>
          )}
        </View>

        {/* Department Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deptScroll}
        >
          {departments.map((dept) => {
            const isActive = selectedDept === dept.id;
            return (
              <TouchableOpacity
                key={dept.id}
                style={[styles.deptPill, isActive && styles.deptPillActive]}
                onPress={() => setSelectedDept(dept.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.deptPillText,
                    isActive && styles.deptPillTextActive,
                  ]}
                >
                  {dept.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Count Bar */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {isHindi
              ? `${filteredFaculty.length} शिक्षक प्रदर्शित`
              : `${filteredFaculty.length} Educator${filteredFaculty.length === 1 ? '' : 's'} Displayed`}
          </Text>
          <Text style={styles.ratioText}>
            {isHindi ? '15:1 छात्र-मेंटर अनुपात' : '15:1 Student-Mentor Ratio'}
          </Text>
        </View>

        {/* Faculty Cards */}
        <View style={styles.cardsList}>
          {filteredFaculty.map((f) => (
            <View key={f.id} style={styles.facultyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  {f.avatar ? (
                    <Image source={f.avatar} style={styles.avatarImg} resizeMode="cover" />
                  ) : (
                    <Image source={{ uri: f.imageUri }} style={styles.avatarImg} resizeMode="cover" />
                  )}
                </View>
                <View style={styles.headerInfo}>
                  <View style={[styles.statusBadge, { backgroundColor: f.statusColor }]}>
                    <View style={[styles.statusDot, { backgroundColor: f.statusText }]} />
                    <Text style={[styles.statusBadgeText, { color: f.statusText }]}>
                      {f.status}
                    </Text>
                  </View>
                  <Text style={styles.facultyName}>{f.name}</Text>
                  <Text style={styles.facultyRole}>{f.role}</Text>
                  <Text style={styles.facultyQual}>{f.qual}</Text>
                </View>
              </View>

              <View style={styles.tagRow}>
                <View style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{f.exp}</Text>
                </View>
                <View style={styles.tagChipSecondary}>
                  <Ionicons name="ribbon" size={12} color="#3d1747" />
                  <Text style={styles.tagChipTextPurple}>{f.reg}</Text>
                </View>
              </View>

              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>"{f.quote}"</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#b9ebca',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6,
    marginBottom: 8,
  },
  headerBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#214f37',
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#260131',
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4d444d',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    marginBottom: 14,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#1b1c1a',
    marginLeft: 8,
  },
  deptScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 14,
  },
  deptPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
  },
  deptPillActive: {
    backgroundColor: '#3d1747',
    borderColor: '#3d1747',
    ...Shadows.sm,
  },
  deptPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#4d444d',
  },
  deptPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  countText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4d444d',
  },
  ratioText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#3a684d',
  },
  cardsList: {
    gap: 14,
  },
  facultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#f5f3f0',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 5,
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  facultyName: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#260131',
    marginBottom: 2,
  },
  facultyRole: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#3d1747',
    marginBottom: 2,
  },
  facultyQual: {
    fontSize: 12,
    color: '#6F636F',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: '#f5f3f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tagChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4d444d',
  },
  tagChipSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcd7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 4,
  },
  tagChipTextPurple: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#30093a',
  },
  quoteBox: {
    backgroundColor: '#f5f3f0',
    padding: 12,
    borderRadius: 12,
  },
  quoteText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontStyle: 'italic',
    color: '#4d444d',
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(38, 1, 49, 0.1)',
    ...Shadows.sm,
    gap: 6,
  },
  backBtnLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
  },
});
