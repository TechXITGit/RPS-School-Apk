import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { addEnquiry } from '../services/firebase/enquiryService';

const AVAILABLE_CLASSES = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

export default function AdmissionScreen({ onBack }) {
  const { t, isHindi } = useLanguage();

  const handleCall = () => {
    Linking.openURL('tel:+915944240000').catch(() => {});
  };

  const handleEmail = () => {
    Linking.openURL('mailto:admissions@rpsrudrapur.edu.in').catch(() => {});
  };

  // Admission Enquiry Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [parentName, setParentName] = useState('');
  const [grade, setGrade] = useState('Nursery');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const resetForm = () => {
    setCandidateName('');
    setParentName('');
    setGrade('Nursery');
    setContactNumber('');
    setEmail('');
    setMessage('');
    setFormSuccess(false);
  };

  const handleSubmitEnquiry = async () => {
    if (!candidateName.trim()) {
      Alert.alert('Required', isHindi ? 'कृपया विद्यार्थी का नाम लिखें।' : 'Please enter student name.');
      return;
    }
    if (!parentName.trim()) {
      Alert.alert('Required', isHindi ? 'कृपया अभिभावक का नाम लिखें।' : 'Please enter parent/guardian name.');
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 10) {
      Alert.alert('Required', isHindi ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर लिखें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      await addEnquiry({
        candidateName: candidateName.trim(),
        parentName: parentName.trim(),
        grade,
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        message: message.trim(),
        source: 'App Admission Form',
        date: new Date(),
      });
      setSubmitting(false);
      setFormSuccess(true);
    } catch (err) {
      setSubmitting(false);
      Alert.alert('Submission Failed', err.message || 'Could not submit enquiry.');
    }
  };

  const iconsByGrade = [
    'happy-outline',
    'shapes-outline',
    'book-outline',
    'calculator-outline',
    'school-outline',
  ];

  const statusColorsByIndex = [
    Colors.secondary,
    Colors.primaryContainer,
    Colors.outline,
    Colors.outline,
  ];

  const eligibilityRules = (t.admission.ageRules || []).map((rule, idx) => ({
    ...rule,
    icon: iconsByGrade[idx] || 'school-outline',
  }));

  const importantDates = (t.admission.dates || []).map((item, idx) => ({
    ...item,
    statusColor: statusColorsByIndex[idx] || Colors.outline,
  }));

  const admissionSteps = t.admission.steps || [];
  const requiredDocs = t.admission.docs || [];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* 1. Header & Live Session Pill */}
        <View style={styles.header}>
          <View style={styles.sessionPill}>
            <View style={styles.greenPulse} />
            <Text style={styles.sessionPillText}>
              {isHindi ? 'शैक्षणिक सत्र 2026–27' : 'ACADEMIC SESSION 2026–27'}
            </Text>
          </View>
          <Text style={styles.pageTitle}>{t.admission.title}</Text>
          <Text style={styles.pageSubTitle}>
            {t.admission.subtitle}
          </Text>
        </View>

        {/* 2. Hero Information Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroGlow} />
          <View style={styles.bannerTagRow}>
            <View style={styles.bannerTag}>
              <Ionicons name="sparkles" size={12} color={Colors.primaryFixed} />
              <Text style={styles.bannerTagText}>
                {isHindi ? 'प्रवेश परामर्श डेस्क' : 'ADMISSION DESK'}
              </Text>
            </View>
            <View style={styles.cbseChip}>
              <Text style={styles.cbseChipText}>CBSE #3530491</Text>
            </View>
          </View>

          <Text style={styles.bannerHeadline}>
            {isHindi
              ? 'रुद्रपुर पब्लिक स्कूल में अपनी यात्रा प्रारंभ करें'
              : 'Start Your Journey at Rudrapur Public School'}
          </Text>
          <Text style={styles.bannerNarrative}>
            {isHindi
              ? 'नर्सरी से 5वीं कक्षा तक के सभी नए विद्यार्थियों का संस्कारयुक्त एवं आधुनिक परिवेश में स्वागत है।'
              : 'We welcome young learners from Nursery to Class V in a warm, value-centric educational home.'}
          </Text>

          <View style={styles.quickMetricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal} numberOfLines={1}>
                {isHindi ? 'नर्सरी – 5वीं' : 'Nursery – V'}
              </Text>
              <Text style={styles.metricLbl} numberOfLines={1}>
                {isHindi ? 'उपलब्ध कक्षाएं' : 'Classes Offered'}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={styles.metricVal} numberOfLines={1}>15:1</Text>
              <Text style={styles.metricLbl} numberOfLines={1}>
                {isHindi ? 'छात्र : शिक्षक' : 'Student : Teacher'}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={styles.metricVal} numberOfLines={1}>
                {isHindi ? 'डे स्कॉलर' : 'Day Scholar'}
              </Text>
              <Text style={styles.metricLbl} numberOfLines={1}>
                {isHindi ? 'परिसर का प्रकार' : 'Campus Type'}
              </Text>
            </View>
          </View>

          {/* Apply Online Enquiry Form CTA */}
          <TouchableOpacity
            style={styles.heroApplyBtn}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
            activeOpacity={0.88}
          >
            <View style={styles.heroApplyIconCircle}>
              <Ionicons name="document-text" size={18} color="#1B4731" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroApplyBtnTitle}>
                {isHindi ? 'ऑनलाइन प्रवेश पूछताछ फॉर्म भरें' : 'Submit Admission Enquiry 2026–27'}
              </Text>
              <Text style={styles.heroApplyBtnSub}>
                {isHindi ? 'सीट आरक्षण व विद्यालय परामर्श हेतु आवेदन करें' : 'Apply online for seat reservation & counselling'}
              </Text>
            </View>
            <View style={styles.heroApplyArrowCircle}>
              <Ionicons name="arrow-forward" size={16} color="#BAEACA" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. Welcome Note from the Admissions Desk */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeIconBox}>
              <Ionicons name="mail-open-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeFrom}>
                {isHindi ? 'स्वागत संदेश' : 'A Welcome Note'}
              </Text>
              <Text style={styles.welcomeTitle}>{t.admission.welcomeTitle}</Text>
            </View>
          </View>
          <Text style={styles.welcomeBody}>
            {t.admission.welcomeLetter}
          </Text>
          <View style={styles.welcomeSignRow}>
            <Text style={styles.welcomeAuthor}>
              {isHindi ? 'कुलसचिव एवं प्रवेश समिति' : 'Registrar & Admission Committee'}
            </Text>
            <Text style={styles.welcomeSchool}>
              {isHindi ? 'रुद्रपुर पब्लिक स्कूल' : 'Rudrapur Public School'}
            </Text>
          </View>
        </View>

        {/* 4. Four-Step Admission Journey Roadmap */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCategory}>
              {isHindi ? 'प्रवेश प्रक्रिया' : 'ADMISSION PROCESS'}
            </Text>
            <Text style={styles.sectionTitle}>{t.admission.stepsTitle}</Text>
          </View>
          <View style={styles.stepsContainer}>
            {admissionSteps.map((s, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>{s.step}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. Eligibility Criteria & Age Norms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCategory}>
              {isHindi ? 'मानक एवं पात्रता' : 'NORMS & ELIGIBILITY'}
            </Text>
            <Text style={styles.sectionTitle}>{t.admission.ageTableTitle}</Text>
          </View>
          <View style={styles.eligibilityList}>
            {eligibilityRules.map((rule, index) => (
              <View key={index} style={styles.eligibilityCard}>
                <View style={styles.eligibilityTop}>
                  <View style={styles.eligibilityIcon}>
                    <Ionicons name={rule.icon} size={18} color={Colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ruleGrade}>{rule.grade}</Text>
                    <Text style={styles.ruleAge}>
                      {isHindi ? 'आयु मानक: ' : 'Age Norm: '}
                      {rule.age}
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>
                      {isHindi ? 'सीबीएसई मानक' : 'CBSE Norm'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.ruleCriteria}>{rule.criteria}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Important Dates & Calendar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCategory}>
              {isHindi ? 'महत्वपूर्ण पड़ाव' : 'KEY MILESTONES'}
            </Text>
            <Text style={styles.sectionTitle}>{t.admission.datesTitle}</Text>
          </View>
          <View style={styles.datesList}>
            {importantDates.map((item, index) => (
              <View key={index} style={styles.dateCard}>
                <View style={styles.dateTopRow}>
                  <Text style={styles.phaseName}>{item.phase}</Text>
                  <View style={[styles.statusPill, { backgroundColor: item.statusColor + '18' }]}>
                    <Text style={[styles.statusText, { color: item.statusColor }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.dateDetailRow}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
                  <Text style={styles.dateDetailText}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 7. Required Documents Checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCategory}>
              {isHindi ? 'दस्तावेज सूची' : 'CHECKLIST'}
            </Text>
            <Text style={styles.sectionTitle}>{t.admission.docsTitle}</Text>
          </View>
          <View style={styles.checklistCard}>
            <Text style={styles.checklistNote}>
              {isHindi
                ? 'भौतिक सत्यापन हेतु स्व-सत्यापित प्रतियों के साथ मूल दस्तावेज अवश्य साथ लाएं:'
                : 'Please have self-attested photocopies along with original documents ready for physical verification:'}
            </Text>
            {requiredDocs.map((doc, idx) => (
              <View key={idx} style={styles.checkItem}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.checkText}>{doc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 8. Helpdesk & Visiting Hours */}
        <View style={styles.helpdeskCard}>
          <View style={styles.helpdeskIcon}>
            <Ionicons name="headset" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.helpdeskTitle}>{t.admission.helplineTitle}</Text>
          <Text style={styles.helpdeskSub}>
            {t.admission.helplineSub}
          </Text>

          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.callActionBtn} onPress={handleCall} activeOpacity={0.85}>
              <View style={styles.contactIconCircle}>
                <Ionicons name="call" size={17} color="#FFFFFF" />
              </View>
              <View style={styles.contactTextCol}>
                <Text style={styles.contactMainTitle}>
                  {isHindi ? 'कॉल एडमिशन हेल्पलाइन' : 'Call Admission Helpline'}
                </Text>
                <Text style={styles.contactSubText}>+91 99199 93377</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255, 255, 255, 0.65)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.emailActionBtn} onPress={handleEmail} activeOpacity={0.85}>
              <View style={[styles.contactIconCircle, { backgroundColor: 'rgba(61, 23, 71, 0.08)' }]}>
                <Ionicons name="mail" size={17} color={Colors.primary} />
              </View>
              <View style={styles.contactTextCol}>
                <Text style={[styles.contactMainTitle, { color: Colors.primary }]}>
                  {t.admission.emailHelpline}
                </Text>
                <Text style={styles.contactEmailSub} numberOfLines={1}>
                  admissions@rudrapurpublicschool.com
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(61, 23, 71, 0.4)" />
            </TouchableOpacity>

            {/* Online Admission Enquiry Form Button */}
            <TouchableOpacity
              style={styles.formActionBtn}
              onPress={() => {
                resetForm();
                setModalVisible(true);
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.contactIconCircle, { backgroundColor: '#5E17EB' }]}>
                <Ionicons name="document-text" size={17} color="#FFFFFF" />
              </View>
              <View style={styles.contactTextCol}>
                <Text style={[styles.contactMainTitle, { color: '#5E17EB' }]}>
                  {isHindi ? 'ऑनलाइन प्रवेश पूछताछ फॉर्म' : 'Online Admission Enquiry Form'}
                </Text>
                <Text style={styles.contactEmailSub} numberOfLines={1}>
                  {isHindi ? 'सीट आरक्षण व प्रवेश परामर्श हेतु आवेदन करें' : 'Fill details for admission enquiry'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#5E17EB" />
            </TouchableOpacity>
          </View>

          <View style={styles.visitingHoursBox}>
            <Ionicons name="time-outline" size={14} color={Colors.outline} />
            <Text style={styles.visitingHoursText}>
              {t.admission.officeHours}
            </Text>
          </View>
        </View>

        {/* Bottom space for navigation bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Admission Enquiry Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {isHindi ? 'ऑनलाइन प्रवेश पूछताछ फॉर्म' : 'Admission Enquiry Form'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isHindi ? 'सत्र 2026–27 (नर्सरी से 5वीं कक्षा)' : 'Session 2026–27 (Nursery to Class V)'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#1B1C1A" />
              </TouchableOpacity>
            </View>

            {formSuccess ? (
              <View style={styles.successBox}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-circle" size={48} color="#2E7D32" />
                </View>
                <Text style={styles.successTitle}>
                  {isHindi ? 'आवेदन सफलतापूर्वक प्राप्त हुआ!' : 'Enquiry Submitted Successfully!'}
                </Text>
                <Text style={styles.successMsg}>
                  {isHindi
                    ? 'धन्यवाद! आपका प्रवेश पूछताछ फॉर्म विद्यालय प्रशासन को प्राप्त हो गया है। हमारी प्रवेश टीम आपसे शीघ्र संपर्क करेगी।'
                    : 'Thank you! Your enquiry has been received by Rudrapur Public School administration. Our admissions desk will contact you shortly.'}
                </Text>
                <TouchableOpacity
                  style={styles.closeSuccessBtn}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.closeSuccessText}>{isHindi ? 'बंद करें' : 'Done'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
                {/* Candidate Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isHindi ? 'विद्यार्थी का नाम' : 'Candidate / Student Name'} *
                  </Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder={isHindi ? 'विद्यार्थी का पूरा नाम' : 'Enter student full name'}
                    placeholderTextColor="#A199A3"
                    value={candidateName}
                    onChangeText={setCandidateName}
                  />
                </View>

                {/* Grade / Class Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isHindi ? 'प्रवेश कक्षा' : 'Applying for Grade / Class'} *
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classChipsRow}>
                    {AVAILABLE_CLASSES.map((cls) => (
                      <TouchableOpacity
                        key={cls}
                        style={[
                          styles.classChip,
                          grade === cls && styles.classChipActive,
                        ]}
                        onPress={() => setGrade(cls)}
                      >
                        <Text
                          style={[
                            styles.classChipText,
                            grade === cls && styles.classChipTextActive,
                          ]}
                        >
                          {cls}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Parent / Guardian Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isHindi ? 'माता/पिता अथवा अभिभावक का नाम' : 'Parent / Guardian Name'} *
                  </Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder={isHindi ? 'अभिभावक का नाम' : 'Enter parent or guardian name'}
                    placeholderTextColor="#A199A3"
                    value={parentName}
                    onChangeText={setParentName}
                  />
                </View>

                {/* Contact Mobile */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isHindi ? 'संपर्क मोबाइल नंबर' : 'Contact Mobile Number'} *
                  </Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g. 9919993377"
                    placeholderTextColor="#A199A3"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={contactNumber}
                    onChangeText={setContactNumber}
                  />
                </View>

                {/* Email Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isHindi ? 'ईमेल पता (वैकल्पिक)' : 'Email Address (Optional)'}
                  </Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g. parent@gmail.com"
                    placeholderTextColor="#A199A3"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Message / Remarks */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isHindi ? 'कोई संदेश या प्रश्न (वैकल्पिक)' : 'Any Query or Remarks (Optional)'}
                  </Text>
                  <TextInput
                    style={[styles.inputField, styles.textAreaField]}
                    placeholder={isHindi ? 'अपनी आवश्यकता लिखें...' : 'e.g. Need bus transport, sibling concession, etc.'}
                    placeholderTextColor="#A199A3"
                    multiline
                    numberOfLines={3}
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                  onPress={handleSubmitEnquiry}
                  disabled={submitting}
                  activeOpacity={0.85}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="paper-plane" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.submitBtnText}>
                        {isHindi ? 'आवेदन जमा करें' : 'Submit Application'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  header: {
    marginBottom: 16,
  },
  sessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 6,
    marginBottom: 8,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  sessionPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.onSecondaryContainer,
    letterSpacing: 0.6,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  pageSubTitle: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.onSurfaceVariant,
  },
  heroBanner: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.xl,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
    ...Shadows.md,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(252, 215, 255, 0.12)',
  },
  bannerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: Radius.full,
    gap: 6,
  },
  bannerTagText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.primaryFixed,
    letterSpacing: 0.6,
  },
  cbseChip: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  cbseChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.onSecondary,
  },
  bannerHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  bannerNarrative: {
    fontSize: 13.5,
    lineHeight: 20,
    color: Colors.primaryFixedDim,
    marginBottom: 18,
  },
  quickMetricsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  metricVal: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  metricLbl: {
    fontSize: 11,
    color: Colors.primaryFixedDim,
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  metricDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    marginBottom: 20,
    ...Shadows.sm,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  welcomeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeFrom: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  welcomeTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: Colors.primary,
  },
  welcomeBody: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#3E3540',
    fontStyle: 'italic',
    marginBottom: 14,
  },
  welcomeSignRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
    paddingTop: 10,
  },
  welcomeAuthor: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  welcomeSchool: {
    fontSize: 12,
    color: Colors.outline,
    marginTop: 1,
  },
  section: {
    marginBottom: 22,
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
  stepsContainer: {
    gap: 10,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    gap: 14,
    ...Shadows.sm,
  },
  stepNumBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: Colors.onSecondaryContainer,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
  eligibilityList: {
    gap: 10,
  },
  eligibilityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
  },
  eligibilityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  eligibilityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleGrade: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  ruleAge: {
    fontSize: 12.5,
    color: Colors.secondary,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.outline,
  },
  ruleCriteria: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
  datesList: {
    gap: 8,
  },
  dateCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
  },
  dateTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  phaseName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
    marginRight: 8,
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dateDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateDetailText: {
    fontSize: 12.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  checklistCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.05)',
    ...Shadows.sm,
    gap: 12,
  },
  checklistNote: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
    lineHeight: 19,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.onSurface,
  },
  helpdeskCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    padding: 22,
    alignItems: 'center',
    ...Shadows.sm,
  },
  helpdeskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  helpdeskTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  helpdeskSub: {
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  callActionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  emailActionBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.12)',
    ...Shadows.sm,
  },
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  contactMainTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  contactSubText: {
    fontSize: 12,
    color: '#E4D5EC',
    fontWeight: '600',
    marginTop: 2,
    includeFontPadding: false,
  },
  contactEmailSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
    marginTop: 2,
    includeFontPadding: false,
  },
  visitingHoursBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visitingHoursText: {
    fontSize: 12.5,
    color: Colors.outline,
    fontWeight: '500',
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
  },
  backIconCircle: {
    marginRight: 6,
  },
  backBtnLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  heroApplyBtn: {
    marginTop: 18,
    backgroundColor: '#BAEACA',
    borderRadius: Radius.lg,
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(21, 62, 42, 0.22)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  heroApplyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  heroApplyBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#123D26',
    letterSpacing: -0.2,
  },
  heroApplyBtnSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27573D',
    marginTop: 2,
  },
  heroApplyArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#123D26',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  formActionBtn: {
    backgroundColor: '#F7EEFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.2,
    borderColor: '#E1BEE7',
    marginTop: 10,
    gap: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 20,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAE8',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3D1747',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8F5F8',
    borderWidth: 1,
    borderColor: '#E6DEE8',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1B1C1A',
  },
  textAreaField: {
    height: 70,
    textAlignVertical: 'top',
  },
  classChipsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  classChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFF4',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2DAE4',
  },
  classChipActive: {
    backgroundColor: '#3D1747',
    borderColor: '#3D1747',
  },
  classChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#605862',
  },
  classChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#3D1747',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    ...Shadows.md,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  successBox: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B1C1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMsg: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#5B535D',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeSuccessBtn: {
    backgroundColor: '#3D1747',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: Radius.full,
  },
  closeSuccessText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
