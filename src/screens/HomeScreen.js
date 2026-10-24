import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Linking,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import CampusTourPlayer from '../components/CampusTourPlayer';
import SideChameleon from '../components/SideChameleon';
import TourTarget from '../components/Tour/TourTarget';

const { width } = Dimensions.get('window');

const CAROUSEL_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBpEBrAAxuMQoyVhf2K-fh13bHfJksWpGRDTYUEeRMyCrZjHypInLNYMyjcFap1dpD2z5Tmyd6FndFHujVjuLG6EvtQm9LBaDyKLtThtmVsJeAPfigrz1SWsnR2MsyRr13XCUPhSr9lUpWHNGRF5-Hisq8kx1UI4LaSuCRuoivoy9c4RKbBYz6NhN0cM-NGoVAcndPIvZgwH0hwrZf_F_l97sJcIHUNA_gHKd3EtNvCteibYDxQET50',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzt5vnjHksJR_8m5J87Ry7RnSV3VbybonjUZDHA5wXRNRP2KdXgT4ajYiudwohj-jLyr8J_OXNHgnFmaLxQxqgshBhgR_DQxvH5Vs96uSHfwTgmfu03j2WCE-ckCQqMKp-AcLMl9oeLEskUIC8Rf6oTqodqdXvU1orGqVrBmlPHeoST-4SVMacgJMp2qYuV-lXLMRcajWkbmXkskgXI7XlbxO4LDjWB-70wGpfdSUD4aG_oQeIYxZG',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgYGqVsXUL7WQ4Edn-2qrfs7QfAIgnydYHWfKSc7Jw7DBtv8ZB6CUkNnH2A820ThmqfJum1JiT9_qs_EYj-SzgByFbJJz_CtAgE5K8zuU7zNy_E6WiptZ7FxmYubM1FaD1qUJodNBiVqk-pzp9AqsrynomCO5847YQzOUrdKniCx9lSRYZCjweslCT4Q5h6pYB8Pny4fmBrbylZmW0kyZ27ra6wUNqpgy47ZG4yJALMH4WO6QPT_T5',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDf3rTcM5jmTixRuDFLPEUCe7izZvZGEZDFa8JsD01rTVrbm6vt7b477c8wjADdcPJqb1__Mc3QpUL5mMeG77_8gk3pgh5B-4rbExG34pDmC4N7Z5EZqJd_kYrpoDlnbTEO2uIT0y4voP5BBsz79-C9WjUMKlHJsZYV0DSYvtVgEQ-U2DkRKCqxXiMxYxsl8rB64upwWu0HHnbl0uuAAC69y980UetmIAnVaAR-NAASRKS2qrItIs9W',
];

import { useTour } from '../hooks/useTour';

export default function HomeScreen({
  onNavigateToAdmission,
  onNavigateToGallery,
  onNavigateToFaculty,
}) {
  const { t, isHindi } = useLanguage();
  const { registerNavigator } = useTour();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (registerNavigator) {
      registerNavigator({
        resetHomeScroll: () => {
          scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
        },
      });
    }
  }, [registerNavigator]);

  const [noticeIndex, setNoticeIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTourModalVisible, setIsTourModalVisible] = useState(false);
  const [parentModalVisible, setParentModalVisible] = useState(false);

  const noticesList = [
    t.home.tickerNotice,
    isHindi
      ? 'वार्षिक खेलकूद 2025: एथलीट ट्रायल गुरुवार से प्रारंभ'
      : 'Annual Sports Meet 2025: Student Registrations Now Open',
    isHindi
      ? 'अभिभावक-शिक्षक संवाद (नर्सरी–5वीं): इस शनिवार 9:00 बजे'
      : 'Parent-Teacher Meet for Nursery to Grade V this Saturday',
  ];

  // Carousel items merged with language translations
  const carouselItems = t.home.carousel.map((item, idx) => ({
    ...item,
    image: CAROUSEL_IMAGES[idx] || CAROUSEL_IMAGES[0],
    tagBg: idx % 2 === 0 ? 'rgba(38, 1, 49, 0.85)' : 'rgba(58, 104, 77, 0.85)',
  }));

  // Quick Action cards with translated strings
  const quickActions = [
    {
      id: 'admissions',
      title: t.home.gateways.admissions.title,
      desc: t.home.gateways.admissions.desc,
      icon: 'school',
      circleBg: '#fcd7ff',
      iconColor: '#30093a',
      linkColor: '#260131',
      linkLabel: t.home.gateways.admissions.cta,
    },
    {
      id: 'parent_desk',
      title: t.home.gateways.parentDesk.title,
      desc: t.home.gateways.parentDesk.desc,
      icon: 'people',
      circleBg: '#b9ebca',
      iconColor: '#214f37',
      linkColor: '#3a684d',
      linkLabel: t.home.gateways.parentDesk.cta,
    },
    {
      id: 'mentors',
      title: t.home.gateways.mentors.title,
      desc: t.home.gateways.mentors.desc,
      icon: 'id-card',
      circleBg: '#b9ebca',
      iconColor: '#214f37',
      linkColor: '#3a684d',
      linkLabel: t.home.gateways.mentors.cta,
    },
    {
      id: 'galleries',
      title: t.home.gateways.galleries.title,
      desc: t.home.gateways.galleries.desc,
      icon: 'images',
      circleBg: '#fcd7ff',
      iconColor: '#30093a',
      linkColor: '#260131',
      linkLabel: t.home.gateways.galleries.cta,
    },
  ];

  // Pillars with translated strings
  const pillarsList = t.home.pillars.map((p, idx) => ({
    ...p,
    circleBg: idx === 0 ? '#fcd7ff' : idx === 1 ? '#b9ebca' : '#efeeeb',
    tagBg: idx === 0 ? '#fcd7ff' : idx === 1 ? '#b9ebca' : '#eae8e5',
    tagText: idx === 0 ? '#30093a' : idx === 1 ? '#214f37' : '#4d444d',
    iconColor: idx === 0 ? '#3d1747' : idx === 1 ? '#3a684d' : '#260131',
    icon: idx === 0 ? 'people-outline' : idx === 1 ? 'football' : 'shield-checkmark',
  }));

  // Notice ticker rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setNoticeIndex((prev) => (prev + 1) % noticesList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [noticesList.length]);

  const handleCall = () => {
    Linking.openURL('tel:9919993377').catch(() => {});
  };

  const handleQuickAction = (id) => {
    if (id === 'admissions') {
      onNavigateToAdmission && onNavigateToAdmission();
    } else if (id === 'galleries') {
      onNavigateToGallery && onNavigateToGallery();
    } else if (id === 'mentors') {
      onNavigateToFaculty && onNavigateToFaculty();
    } else if (id === 'parent_desk') {
      setParentModalVisible(true);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Notice & Circulars Micro Ticker (Static Informational Pill, No Operation on Click) */}
        <View style={styles.tickerPill}>
          <View style={styles.tickerBadge}>
            <Ionicons name="megaphone" size={13} color="#214f37" />
            <Text style={styles.tickerBadgeText}>LATEST</Text>
          </View>
          <Text style={styles.tickerText} numberOfLines={1}>
            {noticesList[noticeIndex]}
          </Text>
        </View>

        {/* 2. Hero Banner Card (Exact match to Stitch design) */}
        <View style={styles.heroCard}>
          {/* Subtle Ambient Brand Glows */}
          <View style={styles.heroGlowTop} />
          <View style={styles.heroGlowBottom} />

          {/* Admissions Open Badge */}
          <View style={styles.sessionBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.sessionText}>{t.home.heroBadge}</Text>
          </View>

          {/* Editorial Typography */}
          <Text style={styles.heroHeadline}>
            {isHindi
              ? 'सशक्त विचार,\nउज्ज्वल कल के नेतृत्व\nका निर्माण'
              : 'Empowering minds,\nshaping futures of\ntomorrow'}
          </Text>
          <Text style={styles.heroBody}>
            {isHindi
              ? 'रुद्रपुर में स्थित समग्र अकादमिक उत्कृष्टता, आधुनिक स्टेम प्रयोगशालाओं और संस्कारयुक्त मार्गदर्शन का प्रतिष्ठित केंद्र।'
              : 'Building bright futures since 2024 with an unyielding commitment to academic mastery, ethical grounding, and nurturing the next generation of global citizens.'}
          </Text>

          {/* Action Buttons */}
          <View style={styles.heroBtnCol}>
            <TourTarget id="home-admission-cta">
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={onNavigateToAdmission}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryBtnText}>{t.home.heroBtnAdmission}</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </TourTarget>

            <TourTarget id="home-campus-tour">
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setIsTourModalVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="flag" size={17} color="#3d1747" style={{ marginRight: 6 }} />
                <Text style={styles.secondaryBtnText}>
                  {isHindi ? 'वर्चुअल परिसर भ्रमण' : 'Virtual Campus Tour'}
                </Text>
              </TouchableOpacity>
            </TourTarget>
          </View>

          {/* Campus Micro-Stats Bar (3 Elevated Boxes) */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, styles.statBox1]}>
              <Text style={[styles.statNumber, { color: '#260131' }]}>
                {t.home.stats.passRate}
              </Text>
              <Text style={styles.statLabel}>{t.home.stats.passRateLabel}</Text>
            </View>
            <View style={[styles.statBox, styles.statBox2]}>
              <Text style={[styles.statNumber, { color: '#3a684d' }]}>
                {t.home.stats.studentRatio}
              </Text>
              <Text style={styles.statLabel}>{t.home.stats.studentRatioLabel}</Text>
            </View>
            <View style={[styles.statBox, styles.statBox3]}>
              <Text style={[styles.statNumber, { color: '#3d1747' }]}>
                {t.home.stats.labsCount}
              </Text>
              <Text style={styles.statLabel}>{t.home.stats.labsCountLabel}</Text>
            </View>
          </View>
        </View>

        {/* 3. QUICK GATEWAY Section (2x2 Grid) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.gatewayLabel}>
            {isHindi ? 'त्वरित सेवाएं' : 'QUICK GATEWAY'}
          </Text>
          <Text style={styles.gatewayCount}>
            {isHindi ? '4 प्रमुख पोर्टल' : '4 Essential Portals'}
          </Text>
        </View>

        <View style={styles.gatewayGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gatewayCard}
              onPress={() => handleQuickAction(item.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.gatewayIconCircle, { backgroundColor: item.circleBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={styles.gatewayCardBody}>
                <Text style={styles.gatewayTitle}>{item.title}</Text>
                <Text style={styles.gatewayDesc} numberOfLines={2}>
                  {item.desc}
                </Text>
              </View>
              <View style={styles.gatewayLinkRow}>
                <Text style={[styles.gatewayLink, { color: item.linkColor }]}>
                  {item.linkLabel}
                </Text>
                <Ionicons name="arrow-forward" size={13} color={item.linkColor} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. CAMPUS LIFE: Experience RPS Section */}
        <View style={styles.campusLifeHeader}>
          <View>
            <Text style={styles.subCategoryText}>
              {isHindi ? 'परिसर जीवन' : 'CAMPUS LIFE'}
            </Text>
            <Text style={styles.sectionHeadline}>{t.home.experienceTitle}</Text>
          </View>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, carouselIndex === 0 && styles.dotActive]} />
            <View style={[styles.dot, carouselIndex === 1 && styles.dotActive]} />
            <View style={[styles.dot, carouselIndex >= 2 && styles.dotActive]} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScroll}
          decelerationRate="fast"
          snapToInterval={272}
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const idx = Math.min(Math.round(x / 260), 2);
            setCarouselIndex(idx);
          }}
          scrollEventThrottle={16}
        >
          {carouselItems.map((slide) => (
            <TouchableOpacity
              key={slide.id}
              style={styles.carouselCard}
              activeOpacity={0.9}
              onPress={onNavigateToGallery}
            >
              <View style={styles.carouselImgBox}>
                <Image
                  source={{ uri: slide.image }}
                  style={styles.carouselImg}
                  resizeMode="cover"
                />
                <View style={[styles.carouselPill, { backgroundColor: slide.tagBg }]}>
                  <Text style={styles.carouselPillText}>{slide.tag}</Text>
                </View>
              </View>
              <View style={styles.carouselContent}>
                <Text style={styles.carouselCardTitle}>{slide.title}</Text>
                <Text style={styles.carouselCardDesc} numberOfLines={2}>
                  {slide.desc}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 5. INSTITUTIONAL PILLARS: Why Choose RPS? */}
        <View style={styles.pillarsHeader}>
          <Text style={styles.subCategoryText}>
            {isHindi ? 'संस्थागत स्तंभ' : 'INSTITUTIONAL PILLARS'}
          </Text>
          <Text style={styles.sectionHeadline}>{t.home.whyChooseTitle}</Text>
        </View>

        <View style={styles.pillarsStack}>
          {pillarsList.map((p) => (
            <View key={p.id} style={styles.pillarCard}>
              <View style={styles.pillarTopRow}>
                <View style={[styles.pillarIconCircle, { backgroundColor: p.circleBg }]}>
                  <Ionicons name={p.icon} size={20} color={p.iconColor} />
                </View>
                <View style={[styles.pillarBadge, { backgroundColor: p.tagBg }]}>
                  <Text style={[styles.pillarBadgeText, { color: p.tagText }]}>
                    {p.tag}
                  </Text>
                </View>
              </View>

              <Text style={styles.pillarTitle}>{p.title}</Text>
              <Text style={styles.pillarDesc}>{p.desc}</Text>
            </View>
          ))}
        </View>

        {/* 6. Interactive Direct Connect Footer Pill */}
        <View style={styles.connectPill}>
          <View style={styles.connectLeft}>
            <View style={styles.connectIconCircle}>
              <Ionicons name="headset" size={20} color="#fcd7ff" />
            </View>
            <View style={styles.connectTextCol}>
              <Text style={styles.connectTitle}>{t.home.needGuidanceTitle}</Text>
              <Text style={styles.connectSub}>{t.home.needGuidanceSub}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callNowBtn}
            onPress={handleCall}
            activeOpacity={0.88}
          >
            <Text style={styles.callNowText}>{t.home.callNow}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for fixed floating navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Virtual Campus Tour Modal */}
      <Modal
        visible={isTourModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsTourModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsTourModalVisible(false)}
        >
          <Pressable style={styles.tourModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.tourModalHeader}>
              <View style={styles.tourIconCircle}>
                <Ionicons name="navigate-circle" size={22} color="#3d1747" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tourModalTitle}>
                  {isHindi ? 'वर्चुअल परिसर भ्रमण' : 'Virtual Campus Tour'}
                </Text>
                <Text style={styles.tourModalSub}>
                  {isHindi ? 'रुद्रपुर पब्लिक स्कूल, उत्तराखंड' : 'Rudrapur Public School, Uttarakhand'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsTourModalVisible(false)}
                style={styles.modalCloseIcon}
              >
                <Ionicons name="close" size={20} color="#4d444d" />
              </TouchableOpacity>
            </View>

            {/* Video Player Area */}
            <View style={styles.tourVideoContainer}>
              <CampusTourPlayer isVisible={isTourModalVisible} />
            </View>

            {/* Video Meta Info Row */}
            <View style={styles.videoMetaRow}>
              <View style={styles.videoTagPill}>
                <Ionicons name="videocam" size={12} color="#214F37" />
                <Text style={styles.videoTagText}>
                  {isHindi ? 'लाइव परिसर वीडियो टूर' : 'Live Campus Video Tour'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('https://rudrapurpublicschool.com/RPS%20photos/main_vid.webm').catch(() => {})
                }
                style={styles.videoFullscreenBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="open-outline" size={13} color="#3D1747" />
                <Text style={styles.videoFullscreenText}>
                  {isHindi ? 'फुलस्क्रीन' : 'Fullscreen'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.tourDesc}>
              {isHindi
                ? 'हमारे 12 एकड़ में फैले भव्य परिसर, स्मार्ट 4K कक्षाओं, अटल टिंकरing स्टेम लैब, फीफा-मानक खेल मैदान और ओपन-एयर एम्फीथिएटर का अनुभव करें।'
                : 'Experience our expansive 12-acre neoclassical stone campus, smart 4K classrooms, Atal Tinkering STEM laboratory, FIFA-standard sports turf, and open-air amphitheatre.'}
            </Text>

            <View style={styles.tourPointsList}>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? '360° इंटरएक्टिव स्मार्ट लैब्स' : '360° Interactive Smart Labs'}
                </Text>
              </View>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? 'फ्लडलाइट मल्टी-स्पोर्ट टर्फ व कोर्ट्स' : 'Floodlit Multi-Sport Turf & Courts'}
                </Text>
              </View>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? '15,000+ पुस्तकों युक्त डिजिटल लाइब्रेरी' : 'Central 15,000+ Volume Digital Library'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.tourActionBtn}
              onPress={() => {
                setIsTourModalVisible(false);
                onNavigateToGallery && onNavigateToGallery();
              }}
            >
              <Text style={styles.tourActionBtnText}>
                {isHindi ? 'पूरी फोटो गैलरी देखें' : 'Open Full Photo Gallery'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Parent Desk Sign In Modal */}
      <Modal
        visible={parentModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setParentModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setParentModalVisible(false)}
        >
          <Pressable style={styles.tourModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.tourModalHeader}>
              <View style={[styles.tourIconCircle, { backgroundColor: '#b9ebca' }]}>
                <Ionicons name="people" size={22} color="#214f37" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tourModalTitle}>
                  {isHindi ? 'अभिभावक पोर्टल प्रवेश' : 'Parent Portal Access'}
                </Text>
                <Text style={styles.tourModalSub}>
                  {isHindi ? 'दैनिक छात्र प्रगति ट्रैकिंग' : 'Real-Time Scholar Tracking'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setParentModalVisible(false)}
                style={styles.modalCloseIcon}
              >
                <Ionicons name="close" size={20} color="#4d444d" />
              </TouchableOpacity>
            </View>

            <Text style={styles.tourDesc}>
              {isHindi
                ? 'अपने पंजीकृत मोबाइल नंबर या छात्र आईडी द्वारा लॉग इन करें:'
                : 'Log in with your registered mobile number or Parent Scholar ID to access:'}
            </Text>

            <View style={styles.tourPointsList}>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? 'दैनिक उपस्थिति एवं अवकाश आवेदन' : 'Daily Live Attendance & Leave Application'}
                </Text>
              </View>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? 'परीक्षा परिणाम व अंकतालिका' : 'Report Cards & Term Assessment Analytics'}
                </Text>
              </View>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? 'शुल्क रसीदें व ऑनलाइन भुगतान' : 'Fee Receipts & Online Payment Gateways'}
                </Text>
              </View>
              <View style={styles.tourPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#3a684d" />
                <Text style={styles.tourPointText}>
                  {isHindi ? 'अध्यापक परामर्श बुकिंग' : 'Direct Teacher Consultation Booking'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.tourActionBtn}
              onPress={() => setParentModalVisible(false)}
            >
              <Text style={styles.tourActionBtnText}>
                {isHindi ? 'पोर्टल में प्रवेश करें (डेमो)' : 'Enter Portal (Demo Access)'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Side Screen Chameleon Animated Mascot */}
      <SideChameleon />
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
    paddingTop: 12,
    paddingBottom: 90,
  },
  /* 1. Micro Ticker */
  tickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingVertical: 7,
    paddingLeft: 8,
    paddingRight: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.sm,
  },
  tickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b9ebca',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 9999,
    gap: 5,
    marginRight: 10,
  },
  tickerBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#214f37',
    letterSpacing: 0.5,
  },
  tickerText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1b1c1a',
    lineHeight: 18,
  },
  /* 2. Hero Banner Card */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.md,
  },
  heroGlowTop: {
    position: 'absolute',
    top: -55,
    right: -55,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(61, 23, 71, 0.08)',
  },
  heroGlowBottom: {
    position: 'absolute',
    bottom: -55,
    left: -55,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(58, 104, 77, 0.08)',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#b9ebca',
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 9999,
    gap: 6,
    marginBottom: 14,
    ...Shadows.sm,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#214f37',
  },
  sessionText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#214f37',
    letterSpacing: 0.5,
  },
  heroHeadline: {
    fontSize: 27,
    fontWeight: '800',
    color: '#260131',
    lineHeight: 35,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroBody: {
    fontSize: 14.5,
    lineHeight: 23,
    color: '#3E3540',
    fontWeight: '500',
    marginBottom: 20,
  },
  heroBtnCol: {
    gap: 11,
    marginBottom: 20,
  },
  primaryBtn: {
    height: 52,
    backgroundColor: '#3d1747',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.sm,
  },
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height: 52,
    backgroundColor: '#efeeeb',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#3d1747',
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
    marginTop: 4,
    zIndex: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 82,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    borderTopWidth: 3.5,
    shadowColor: '#260131',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  statBox1: {
    borderTopColor: '#3d1747',
  },
  statBox2: {
    borderTopColor: '#3a684d',
  },
  statBox3: {
    borderTopColor: '#603769',
  },
  statNumber: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 23,
    letterSpacing: -0.3,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#3D3340',
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  /* 3. Quick Gateway */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  gatewayLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#3d1747',
    letterSpacing: 1,
  },
  gatewayCount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#3a684d',
  },
  gatewayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  gatewayCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 155,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    ...Shadows.sm,
  },
  gatewayIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gatewayCardBody: {
    flex: 1,
  },
  gatewayTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#260131',
    marginBottom: 4,
  },
  gatewayDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#4d444d',
  },
  gatewayLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  gatewayLink: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  /* 4. Campus Life */
  campusLifeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  subCategoryText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#3a684d',
    letterSpacing: 1,
  },
  sectionHeadline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#260131',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0c3cd',
  },
  dotActive: {
    backgroundColor: '#3d1747',
    width: 14,
  },
  carouselScroll: {
    gap: 12,
    paddingBottom: 4,
    marginBottom: 28,
  },
  carouselCard: {
    width: 275,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    ...Shadows.sm,
  },
  carouselImgBox: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f3f0',
  },
  carouselImg: {
    width: '100%',
    height: '100%',
  },
  carouselPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  carouselPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  carouselContent: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  carouselCardTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#260131',
    marginBottom: 3,
  },
  carouselCardDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#4d444d',
  },
  /* 5. Institutional Pillars */
  pillarsHeader: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  pillarsStack: {
    gap: 12,
    marginBottom: 26,
  },
  pillarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.06)',
    ...Shadows.sm,
  },
  pillarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pillarIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarBadge: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pillarBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  pillarTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#260131',
    marginBottom: 5,
  },
  pillarDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#4d444d',
  },
  /* 6. Direct Connect Pill */
  connectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3d1747',
    borderRadius: 24,
    padding: 18,
    marginTop: 4,
    ...Shadows.md,
  },
  connectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  connectIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectTextCol: {
    flex: 1,
  },
  connectTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  connectSub: {
    fontSize: 12.5,
    color: '#f3d2f8',
    marginTop: 2,
  },
  callNowBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9999,
    ...Shadows.sm,
  },
  callNowText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#3d1747',
  },
  /* Modals */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(38, 1, 49, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  tourModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    ...Shadows.lg,
  },
  tourModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  tourIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fcd7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#260131',
  },
  tourModalSub: {
    fontSize: 12.5,
    color: '#4d444d',
    marginTop: 2,
  },
  modalCloseIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f5f3f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourVideoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 10,
    ...Shadows.sm,
  },
  videoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  videoTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#B9EBCA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  videoTagText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#214F37',
    letterSpacing: 0.4,
  },
  videoFullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FCD7FF',
  },
  videoFullscreenText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#3D1747',
  },
  tourImage: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    marginBottom: 12,
  },
  tourDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#3E3540',
    marginBottom: 14,
  },
  tourPointsList: {
    gap: 9,
    marginBottom: 20,
  },
  tourPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  tourPointText: {
    fontSize: 13.5,
    color: '#1b1c1a',
    fontWeight: '600',
    lineHeight: 18,
  },
  tourActionBtn: {
    backgroundColor: '#3d1747',
    paddingVertical: 14,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.sm,
  },
  tourActionBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
