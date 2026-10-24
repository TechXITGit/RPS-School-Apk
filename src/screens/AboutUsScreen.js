import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function AboutUsScreen({ onNavigateToAdmission, onBack }) {
  const { t, isHindi } = useLanguage();
  const [isPrincipalExpanded, setIsPrincipalExpanded] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState('vision'); // 'vision' | 'values' | 'infrastructure'

  const handleCall = () => {
    Linking.openURL('tel:9919993377').catch(() => {});
  };

  const handleEmail = () => {
    Linking.openURL('mailto:rudrapurpublicschool@gmail.com').catch(() => {});
  };

  const missionPillars = t.about.missionPillars.map((p, idx) => ({
    ...p,
    icon:
      idx === 0
        ? 'book-outline'
        : idx === 1
        ? 'fitness-outline'
        : idx === 2
        ? 'hardware-chip-outline'
        : 'shield-checkmark-outline',
    color:
      idx === 0
        ? Colors.primary
        : idx === 1
        ? Colors.secondary
        : idx === 2
        ? Colors.primaryContainer
        : Colors.primary,
    bg:
      idx === 0
        ? Colors.primaryFixed
        : idx === 1
        ? Colors.secondaryContainer
        : idx === 2
        ? Colors.primaryFixed
        : Colors.surfaceContainerHigh,
  }));

  const coreValues = t.about.values.map((v, idx) => ({
    ...v,
    icon:
      idx === 0
        ? 'scale-outline'
        : idx === 1
        ? 'people-outline'
        : idx === 2
        ? 'compass-outline'
        : idx === 3
        ? 'ribbon-outline'
        : idx === 4
        ? 'heart-outline'
        : 'bulb-outline',
  }));

  const facilities = t.about.facilities.map((f, idx) => ({
    ...f,
    tagColor:
      idx === 0
        ? Colors.primary
        : idx === 1
        ? Colors.secondary
        : idx === 2
        ? Colors.primaryContainer
        : idx === 3
        ? Colors.secondary
        : Colors.primary,
  }));

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* 1. HERO BANNER: Campus Building with Purple-Tinted Overlay */}
        <View style={styles.heroBanner}>
          <Image
            source={require('../../assets/campus_building.png')}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          {/* Purple-tinted overlay gradient */}
          <View style={styles.heroOverlay}>
            <View style={styles.heritagePill}>
              <View style={styles.greenDot} />
              <Text style={styles.heritageText}>{t.about.heritageTag}</Text>
            </View>

            <Text style={styles.heroTitle}>{t.about.heroTitle}</Text>
            <Text style={styles.heroSubTitle}>{t.about.heroSubtitle}</Text>

            <View style={styles.cbseTag}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.secondary} />
              <Text style={styles.cbseTagText}>{t.about.cbseBadge}</Text>
            </View>
          </View>
        </View>

        {/* 2. Institutional Promise Quote */}
        <View style={styles.promiseCard}>
          <View style={styles.promiseBar} />
          <Text style={styles.promiseQuote}>
            {isHindi
              ? '“रुद्रपुर पब्लिक स्कूल अकादमिक उत्कृष्टता, समग्र विकास और नैतिक वैश्विक नागरिकों के निर्माण हेतु समर्पित है।”'
              : '“Rudrapur Public School is committed to academic excellence, holistic development, and nurturing the next generation of ethical global citizens.”'}
          </Text>
          <Text style={styles.promiseSub}>
            {isHindi
              ? 'नैतिक संस्कारों और आधुनिक शिक्षण पद्धतियों की सुदृढ़ नींव पर आधारित, आरपीएस एक ऐसा बौद्धिक परिवेश प्रदान करता है जहाँ जिज्ञासा का सम्मान और सत्यनिष्ठा सर्वोपरि है।'
              : 'Founded upon the timeless values of ethical scholarship and futuristic pedagogy, RPS fosters an intellectual ecosystem where curiosity is celebrated and integrity is paramount.'}
          </Text>
          <View style={styles.ethosRow}>
            <View style={styles.ethosIconCircle}>
              <Ionicons name="school-outline" size={18} color={Colors.secondary} />
            </View>
            <View>
              <Text style={styles.ethosTitle}>
                {isHindi ? 'आधुनिक भारतीय संस्कार' : 'Modern Indian Ethos'}
              </Text>
              <Text style={styles.ethosDesc}>
                {isHindi ? 'सीबीएसई पाठ्यक्रम संग वैश्विक दृष्टिकोण' : 'CBSE Curriculum with Global Exposure'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. PRINCIPAL'S MESSAGE (Interactive Accordion) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCategory}>
              {isHindi ? 'नेतृत्व' : 'LEADERSHIP'}
            </Text>
            <Text style={styles.sectionTitle}>{t.about.principalTitle}</Text>
          </View>

          <View style={styles.principalCard}>
            {/* Header: Photo, Name & Designation */}
            <View style={styles.principalHeader}>
              <Image
                source={require('../../assets/dr_ananya.png')}
                style={styles.principalAvatar}
                resizeMode="cover"
              />
              <View style={styles.principalInfo}>
                <View style={styles.availabilityPill}>
                  <View style={styles.greenDot} />
                  <Text style={styles.availabilityText}>
                    {isHindi ? 'विद्यालय प्रधानाचार्य' : 'School Principal'}
                  </Text>
                </View>
                <Text style={styles.principalName}>{t.about.principalName}</Text>
                <Text style={styles.principalQual}>M.Sc., B.Ed., Ph.D.</Text>
                <Text style={styles.principalRole}>{t.about.principalRole}</Text>
              </View>
            </View>

            {/* Principal Quote Intro */}
            <View style={styles.quoteBox}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={16}
                color={Colors.primaryContainer}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.quoteText}>
                {t.about.principalExcerpt}
              </Text>
            </View>

            {/* Expandable Accordion Body */}
            <Text style={styles.principalMessageBody}>
              {isPrincipalExpanded ? t.about.principalFull : t.about.principalExcerpt}
            </Text>

            {/* Accordion Toggle Button */}
            <TouchableOpacity
              style={styles.accordionToggle}
              onPress={() => setIsPrincipalExpanded(!isPrincipalExpanded)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionToggleText}>
                {isPrincipalExpanded ? t.about.readLess : t.about.readFull}
              </Text>
              <Ionicons
                name={isPrincipalExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. TABBED SECTIONS: Vision & Mission / Core Values / Campus Facilities */}
        <View style={styles.sectionContainer}>
          {/* Section Navigation Tabs */}
          <View style={styles.tabNavRow}>
            <TouchableOpacity
              style={[
                styles.tabNavBtn,
                activeSectionTab === 'vision' && styles.tabNavBtnActive,
              ]}
              onPress={() => setActiveSectionTab('vision')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabNavText,
                  activeSectionTab === 'vision' && styles.tabNavTextActive,
                ]}
              >
                {t.about.tabs.vision}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabNavBtn,
                activeSectionTab === 'values' && styles.tabNavBtnActive,
              ]}
              onPress={() => setActiveSectionTab('values')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabNavText,
                  activeSectionTab === 'values' && styles.tabNavTextActive,
                ]}
              >
                {t.about.tabs.values}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabNavBtn,
                activeSectionTab === 'infrastructure' && styles.tabNavBtnActive,
              ]}
              onPress={() => setActiveSectionTab('infrastructure')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabNavText,
                  activeSectionTab === 'infrastructure' && styles.tabNavTextActive,
                ]}
              >
                {t.about.tabs.infrastructure}
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: Vision & Mission */}
          {activeSectionTab === 'vision' && (
            <View style={styles.tabContent}>
              {/* Vision Card */}
              <View style={styles.visionCard}>
                <View style={styles.visionHeader}>
                  <Ionicons name="eye" size={18} color={Colors.primaryFixed} />
                  <Text style={styles.visionCategory}>
                    {isHindi ? 'हमारा दृष्टिकोण' : 'OUR VISION'}
                  </Text>
                </View>
                <Text style={styles.visionQuote}>
                  {t.about.visionQuote}
                </Text>
                <View style={styles.visionFooter}>
                  <Text style={styles.visionAuthor}>
                    {isHindi ? 'प्रबंधन समिति' : 'The Board of Governors'}
                  </Text>
                  <View style={styles.visionYearBadge}>
                    <Text style={styles.visionYearText}>
                      {isHindi ? 'स्था. 2024' : 'Est. 2024'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mission Pillars (2x2 Grid) */}
              <Text style={styles.pillarSectionTitle}>{t.about.missionPillarsTitle}</Text>
              <View style={styles.pillarsGrid}>
                {missionPillars.map((p, index) => (
                  <View key={index} style={styles.pillarCard}>
                    <View style={[styles.pillarIconBox, { backgroundColor: p.bg }]}>
                      <Ionicons name={p.icon} size={20} color={p.color} />
                    </View>
                    <Text style={styles.pillarTitle}>{p.title}</Text>
                    <Text style={styles.pillarDesc}>{p.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 2: Core Values & Benchmarks */}
          {activeSectionTab === 'values' && (
            <View style={styles.tabContent}>
              <Text style={styles.pillarSectionTitle}>{t.about.valuesTitle}</Text>
              <Text style={styles.valuesSub}>
                {isHindi
                  ? 'प्रत्येक कक्षा, खेल मैदान और सामुदायिक संवाद को दिशा देने वाले मूलभूत सिद्धांत।'
                  : 'The principles guiding every classroom, playground, and community interaction.'}
              </Text>
              <View style={styles.valuesGrid}>
                {coreValues.map((val, index) => (
                  <View key={index} style={styles.valueCard}>
                    <Ionicons name={val.icon} size={22} color={Colors.secondary} />
                    <Text style={styles.valueTitle}>{val.title}</Text>
                    <Text style={styles.valueDesc}>{val.desc}</Text>
                  </View>
                ))}
              </View>

              {/* Institutional Benchmarks */}
              <View style={styles.benchmarksCard}>
                <Text style={styles.benchmarksHeader}>
                  {isHindi ? 'संस्थागत उपलब्धियां' : 'Institutional Benchmarks'}
                </Text>
                <View style={styles.benchmarksRow}>
                  <View style={styles.benchmarkItem}>
                    <Text style={[styles.benchmarkNum, { color: Colors.primary }]}>2024</Text>
                    <Text style={styles.benchmarkLabel}>
                      {isHindi ? 'स्थापना वर्ष' : 'Foundational Legacy'}
                    </Text>
                  </View>
                  <View style={styles.benchmarkItem}>
                    <Text style={[styles.benchmarkNum, { color: Colors.secondary }]}>15+</Text>
                    <Text style={styles.benchmarkLabel}>
                      {isHindi ? 'गतिविधि क्लब' : 'Holistic Clubs'}
                    </Text>
                  </View>
                </View>
                <View style={styles.benchmarksRow}>
                  <View style={styles.benchmarkItem}>
                    <Text style={[styles.benchmarkNum, { color: Colors.primaryContainer }]}>100%</Text>
                    <Text style={styles.benchmarkLabel}>
                      {isHindi ? 'स्मार्ट कक्षाएं' : 'Smart Classrooms'}
                    </Text>
                  </View>
                  <View style={styles.benchmarkItem}>
                    <Text style={[styles.benchmarkNum, { color: Colors.secondary }]}>1:15</Text>
                    <Text style={styles.benchmarkLabel}>
                      {isHindi ? 'शिक्षक अनुपात' : 'Faculty Ratio'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* TAB 3: Campus Infrastructure */}
          {activeSectionTab === 'infrastructure' && (
            <View style={styles.tabContent}>
              <Text style={styles.pillarSectionTitle}>{t.about.facilitiesTitle}</Text>
              <View style={styles.facilitiesList}>
                {facilities.map((f, index) => (
                  <View key={index} style={styles.facilityCard}>
                    <View style={styles.facilityTop}>
                      <View style={[styles.facilityBadge, { backgroundColor: f.tagColor + '18' }]}>
                        <Text style={[styles.facilityBadgeText, { color: f.tagColor }]}>
                          {f.tag}
                        </Text>
                      </View>
                      <Ionicons name="checkmark-done" size={16} color={Colors.secondary} />
                    </View>
                    <Text style={styles.facilityTitle}>{f.title}</Text>
                    <Text style={styles.facilityDesc}>{f.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 5. Direct Contact & Social Desk */}
        <View style={styles.contactDesk}>
          <View style={styles.contactIcon}>
            <Ionicons name="school" size={24} color={Colors.onPrimary} />
          </View>
          <Text style={styles.contactTitle}>{t.about.connectTitle}</Text>
          <Text style={styles.contactDesc}>
            {isHindi
              ? 'आगामी शैक्षणिक सत्र हेतु प्रवेश प्रक्रिया प्रारंभ हो चुकी है। जानें कि आपका बच्चा हमारे सुरक्षित व प्रेरणादायक वातावरण में कैसे प्रगति कर सकता है।'
              : 'Admissions are open for the upcoming academic session. Discover how your child can thrive in an atmosphere of warmth and intellectual rigor.'}
          </Text>

          <View style={styles.contactBtnGroup}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={onNavigateToAdmission}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>{t.about.admissionsBtn}</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.onPrimary} />
            </TouchableOpacity>

            <View style={styles.callEmailRow}>
              <TouchableOpacity
                style={styles.subActionBtn}
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={16} color={Colors.primary} />
                <Text style={styles.subActionText}>{t.about.callBtn}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subActionBtn}
                onPress={handleEmail}
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={16} color={Colors.secondary} />
                <Text style={styles.subActionText}>{t.about.emailBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.contactFineprint}>
            {t.about.connectSubtitle}
          </Text>
        </View>

        {/* Bottom space for navigation bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  heroBanner: {
    width: '100%',
    height: 240,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    ...Shadows.md,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(38, 1, 49, 0.72)',
    padding: 18,
    justifyContent: 'flex-end',
  },
  heritagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 6,
    marginBottom: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondaryContainer,
  },
  heritageText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubTitle: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  cbseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: Radius.full,
    gap: 6,
  },
  cbseTagText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  promiseCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    ...Shadows.sm,
  },
  promiseBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
    marginBottom: 12,
  },
  promiseQuote: {
    fontSize: 16.5,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  promiseSub: {
    fontSize: 13.5,
    lineHeight: 20,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
  },
  ethosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
  },
  ethosIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ethosTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  ethosDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionCategory: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  principalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    ...Shadows.md,
  },
  principalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  principalAvatar: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
  },
  principalInfo: {
    flex: 1,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.onSecondaryContainer,
    letterSpacing: 0.4,
  },
  principalName: {
    fontSize: 18.5,
    fontWeight: '800',
    color: Colors.primary,
  },
  principalQual: {
    fontSize: 13,
    color: Colors.primaryContainer,
    fontWeight: '600',
  },
  principalRole: {
    fontSize: 12,
    color: Colors.outline,
    marginTop: 1,
  },
  quoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 12,
    borderRadius: Radius.md,
    marginBottom: 12,
  },
  quoteText: {
    flex: 1,
    fontSize: 13.5,
    fontStyle: 'italic',
    lineHeight: 20,
    color: Colors.primary,
  },
  principalMessageBody: {
    fontSize: 13.5,
    lineHeight: 21,
    color: Colors.onSurfaceVariant,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
  },
  signOffBox: {
    marginTop: 14,
    paddingLeft: 4,
  },
  signOffTitle: {
    fontSize: 12,
    color: Colors.outline,
  },
  signOffName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  signOffRole: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  accordionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
  },
  accordionToggleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  tabNavRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: 14,
    gap: 4,
  },
  tabNavBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  tabNavBtnActive: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  tabNavText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  tabNavTextActive: {
    color: Colors.primaryContainer,
    fontWeight: '800',
  },
  tabContent: {
    gap: 12,
  },
  visionCard: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.xl,
    padding: 20,
    ...Shadows.md,
  },
  visionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  visionCategory: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.primaryFixed,
    letterSpacing: 0.8,
  },
  visionQuote: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 25,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  visionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visionAuthor: {
    fontSize: 13,
    color: Colors.primaryFixedDim,
    fontWeight: '500',
  },
  visionYearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: Radius.full,
  },
  visionYearText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pillarSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.2,
    marginTop: 4,
    marginBottom: 4,
  },
  pillarsGrid: {
    gap: 10,
  },
  pillarCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
  },
  pillarIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pillarTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 3,
  },
  pillarDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
  valuesSub: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  valueCard: {
    width: (width - 42) / 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
  },
  valueTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 6,
    marginBottom: 3,
  },
  valueDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.onSurfaceVariant,
  },
  benchmarksCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
  },
  benchmarksHeader: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  benchmarksRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  benchmarkItem: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
  },
  benchmarkNum: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  benchmarkLabel: {
    fontSize: 11.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  facilitiesList: {
    gap: 10,
  },
  facilityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
  },
  facilityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  facilityBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  facilityBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  facilityTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  facilityDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
  contactDesk: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    padding: 22,
    alignItems: 'center',
    textAlign: 'center',
    ...Shadows.sm,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  contactDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 18,
  },
  contactBtnGroup: {
    width: '100%',
    gap: 10,
    marginBottom: 14,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.sm,
  },
  applyBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  callEmailRow: {
    flexDirection: 'row',
    gap: 10,
  },
  subActionBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
  },
  subActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  contactFineprint: {
    fontSize: 11.5,
    color: Colors.outline,
    textAlign: 'center',
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
