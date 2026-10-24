import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const resolveImageSource = (img) => {
  if (!img) return null;
  if (typeof img === 'string') return { uri: img };
  return img;
};

export default function GalleryScreen({ onNavigateToAdmission, onBack }) {
  const { t, isHindi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(1);

  const categories = [
    { id: 'all', label: t.gallery.categories.all },
    { id: 'campus', label: t.gallery.categories.campus },
    { id: 'sports', label: t.gallery.categories.sports },
    { id: 'cultural', label: t.gallery.categories.cultural },
    { id: 'stem', label: t.gallery.categories.stem },
    { id: 'arts', label: t.gallery.categories.arts },
  ];

  const featuredAlbum = {
    id: 'featured-1',
    category: 'cultural',
    categoryLabel: isHindi ? 'सांस्कृतिक उत्सव' : 'Cultural Fest',
    title: t.gallery.featuredTitle,
    subtitle: t.gallery.featuredSubtitle,
    location: t.gallery.featuredLocation,
    date: t.gallery.featuredDate,
    photoCount: 34,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlGSS1Dir16RWTl8qNcHqJqH-s-W97b-N4m2fLhaNdm-hMDzeJxhoYj2WqPoYm-K41QjK7wLj4-TKwkugyen1SGlxcsLXdPse56m_MrlR_Kpck_BpCYdNqBYT6CG7dliMPR7CEz-EmTFqp2_BHZAcQG9kTZWv8fsxRRnCm_IUqmWD_nUS8eQorhGnM2JNMG5aBNNhSzOdKM0LIMFTu9PxFSc1m5PEs7XnI5CYVRKY7axhxQvUz7PJb',
    description: isHindi
      ? 'रुद्रपुर पब्लिक स्कूल के वार्षिक उत्सव में पारंपरिक रेशमी पोशाकों में सजे विद्यार्थियों द्वारा सांस्कृतिक नृत्य, शास्त्रीय संगीत और नाट्य मंचन की भव्य प्रस्तुति।'
      : 'High school students dressed in rich silk traditional Indian dance costumes performing dynamically under theatrical stage lighting in a modern open-air school amphitheater during an evening cultural gala.',
  };

  const galleryItems = [
    {
      id: '1',
      category: 'stem',
      categories: ['all', 'stem', 'campus'],
      tagLabel: t.gallery.cards.card1.tag,
      tagIcon: 'hardware-chip-outline',
      tagBg: '#FFFFFF',
      tagColor: '#260131',
      title: t.gallery.cards.card1.title,
      subtitle: t.gallery.cards.card1.subtitle,
      location: t.gallery.cards.card1.location,
      date: t.gallery.cards.card1.date,
      photoCount: 18,
      likes: 142,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB1P-zp42Ed7idlmp_ixhU6pUlOurUoxqLL3Lek_8fcsQOTlhQSOynpcNGv8fRH-gLoOzley9M1Ar_8R5XYmOWkJ98rniknzRnZw_yvnhEUkdRp7XsvXl22dkMLzAtjLztxn28mS_72EidFFHzLrKPh9x6T6a7mL6TJVHpj1keefxoRCq1cUXnJunwAN3WjIbdMPXiSPkemQBbzcpd3GgVuNCSJv-uZK9FzAOM7ljpvcOe7srlYy_2i',
      description: t.gallery.cards.card1.desc,
    },
    {
      id: '2',
      category: 'sports',
      categories: ['all', 'sports'],
      tagLabel: t.gallery.cards.card2.tag,
      tagIcon: 'football-outline',
      tagBg: '#B9EBCA',
      tagColor: '#3E6C51',
      title: t.gallery.cards.card2.title,
      subtitle: t.gallery.cards.card2.subtitle,
      location: t.gallery.cards.card2.location,
      date: t.gallery.cards.card2.date,
      photoCount: 28,
      likes: 318,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAg6GsomPFK4DqP90xtsWSe0Dj6oJQl2Ind65h5fclEHWqmb5FsmKmjKQbb8__5Qc9SzVKR6Is8p51QnmAXdwPPXtzwFAWn_yfIQJ5cwb7lneMBnq-wBEgomS98wFqQ_Dnv-DUVwtvjewwCMT59g6Rx_eM8XBMZtJy5ZQ4LGNAxN2G-hCjGUceLiIzTni8ixmrOuf6zZrJbM0CU71Oe-Txh1aki8DFUWUAouxfM3O-PUnyZ7dFfWDDp',
      description: t.gallery.cards.card2.desc,
    },
    {
      id: '3',
      category: 'campus',
      categories: ['all', 'campus'],
      tagLabel: t.gallery.cards.card3.tag,
      tagIcon: 'flask-outline',
      tagBg: '#FCD7FF',
      tagColor: '#30093A',
      title: t.gallery.cards.card3.title,
      subtitle: t.gallery.cards.card3.subtitle,
      location: t.gallery.cards.card3.location,
      date: t.gallery.cards.card3.date,
      photoCount: 12,
      likes: 96,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBoWkvfNz5POrFPwcTb12eMPqyTKWZu57EXSpJ9Lv2Y53CUrc6WNT6F3Fms_6rqQFRD3PAqEyqmUMnPndFzf-yfUXvvellYV0oIvhiNam6fnJjs9YeO_mipO-4bnIyWKApAy7h-jIduN_ECfc_KLiZLbRFAnR2w-wwMjGyIq7fS6_LohjhSMmRMECv_qve_amyr_tJ4HhCJf1yvTjuKTG-HX5EGso9lc0jM1jSYbecYuLJeLIJoh1Wq',
      description: t.gallery.cards.card3.desc,
    },
    {
      id: '4',
      category: 'arts',
      categories: ['all', 'campus', 'arts'],
      tagLabel: t.gallery.cards.card4.tag,
      tagIcon: 'library-outline',
      tagBg: '#E4E2DF',
      tagColor: '#4D444D',
      title: t.gallery.cards.card4.title,
      subtitle: t.gallery.cards.card4.subtitle,
      location: t.gallery.cards.card4.location,
      date: t.gallery.cards.card4.date,
      photoCount: 22,
      likes: 184,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDdNL2epaLJAsZVw3PkUI-slB63gE3BUGbDigSSvM81Q9_R9_Tvw-mJHo-7tpW16EuDLynhYG_-dy-LbZzYWMlpMsxy9Hp04BRdbUpyPe1qGNAQofavRq7jDnDdgSK-SPUT1uq_MkzQMl0iGxvWAqSXjsALBbZaMS3VTc8pDmNcHnATaL_2M4n3hikvQZEpB3JcJNXpLriK2SSStdcI4cKptZzDBvEzsKHKEeCeQG_-iNq_b97qI2L6',
      description: t.gallery.cards.card4.desc,
    },
    {
      id: '5',
      category: 'cultural',
      categories: ['all', 'cultural', 'arts'],
      tagLabel: t.gallery.cards.card5.tag,
      tagIcon: 'musical-notes-outline',
      tagBg: '#E8B5F0',
      tagColor: '#603769',
      title: t.gallery.cards.card5.title,
      subtitle: t.gallery.cards.card5.subtitle,
      location: t.gallery.cards.card5.location,
      date: t.gallery.cards.card5.date,
      photoCount: 16,
      likes: 209,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDf6qSES3wBWUZIaVxUznmmOndVsuphfU5p17U_H9L7K3MEL7KvmVgDimwWkPLJxzDtzKTu_0e_wYSunpJpYA9ysrvkbaSbB8Qfr-lup26hjPtwDVjxv5o0HrfG7kPGVJfqiXbByXQNlGYRGm4T63kACT6uroHIVp-sXPCAlwGeX239m_7T-oAFZWRsTc-9nK_XvwrRAoVIO6DhYYz1nABCwHYA83WC_u0UOxpaUIdNkF4tJ1RaNeT8',
      description: t.gallery.cards.card5.desc,
    },
    {
      id: '6',
      category: 'campus',
      categories: ['all', 'campus'],
      tagLabel: t.gallery.cards.card6.tag,
      tagIcon: 'leaf-outline',
      tagBg: '#B9EBCA',
      tagColor: '#3E6C51',
      title: t.gallery.cards.card6.title,
      subtitle: t.gallery.cards.card6.subtitle,
      location: t.gallery.cards.card6.location,
      date: t.gallery.cards.card6.date,
      photoCount: 15,
      likes: 175,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBatleZGnU-X8_uPVK-XZFKPAvgopdlMPrfhkFyHVoQ9o6rQ7RHIOJgvT_xIu11yW21kql_XH935mQrFUEUAP00VRgRGYEMXtNI95U_ds5eK7GAHCuszK-hDhZofNf-fyBR7fRBCSY-Ppf2-c815HqGOhhpsf8xm3yngDIyx8kUBBFLC8Ui6VilB687f4ochDwmPot-DWKXzeGL7pt0ugkoigf3FwNWKxgLTAO_IdTs5oaKNp-04YFp',
      description: t.gallery.cards.card6.desc,
    },
    {
      id: '7',
      category: 'cultural',
      categories: ['all', 'cultural', 'campus'],
      tagLabel: t.gallery.cards.card7.tag,
      tagIcon: 'ribbon-outline',
      tagBg: '#FFE5B4',
      tagColor: '#6E3A00',
      title: t.gallery.cards.card7.title,
      subtitle: t.gallery.cards.card7.subtitle,
      location: t.gallery.cards.card7.location,
      date: t.gallery.cards.card7.date,
      photoCount: 24,
      likes: 245,
      image: require('../../assets/inauguration_event.webp'),
      remoteUri: 'https://rudrapurpublicschool.com/RPS%20photos/img5.webp',
      description: t.gallery.cards.card7.desc,
    },
  ];

  const [likesState, setLikesState] = useState(
    galleryItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: { count: item.likes, liked: false } }),
      {}
    )
  );

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.categories.includes(selectedCategory);
  });

  const showFeaturedAlbum =
    selectedCategory === 'all' || selectedCategory === 'cultural';

  const toggleLike = (id) => {
    setLikesState((prev) => {
      const current = prev[id] || { count: 0, liked: false };
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  const openLightbox = (item) => {
    setLightboxItem(item);
    setLightboxIndex(1);
  };

  const nextLightboxPhoto = () => {
    if (!lightboxItem) return;
    setLightboxIndex((prev) => (prev >= lightboxItem.photoCount ? 1 : prev + 1));
  };

  const prevLightboxPhoto = () => {
    if (!lightboxItem) return;
    setLightboxIndex((prev) => (prev <= 1 ? lightboxItem.photoCount : prev - 1));
  };

  const handleBookVisit = () => {
    if (onNavigateToAdmission) {
      onNavigateToAdmission();
    } else {
      Alert.alert(
        isHindi ? 'कैंपस भ्रमण डेस्क' : 'Campus Visit Desk',
        isHindi
          ? 'निर्देशित परिसर भ्रमण सोमवार से शनिवार सुबह 9:00 से दोपहर 2:30 बजे तक आयोजित किए जाते हैं।\n\nसंपर्क: admissions@rudrapurpublicschool.edu.in\nफोन: +91 98765 43210'
          : 'Guided campus tours are conducted Mon-Sat between 9:00 AM – 2:30 PM.\n\nContact: admissions@rudrapurpublicschool.edu.in\nPhone: +91 98765 43210'
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Page Title & Chronicles Badge */}
        <View style={styles.header}>
          <View style={styles.tagPill}>
            <Ionicons name="images" size={13} color="#3E6C51" />
            <Text style={styles.tagText}>{t.gallery.tag}</Text>
          </View>
          <Text style={styles.title}>{t.gallery.title}</Text>
          <Text style={styles.subtitle}>{t.gallery.subtitle}</Text>
        </View>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
                {isActive && (
                  <View style={styles.activePillDot} />
                )}
                {cat.id === 'all' && !isActive && (
                  <Ionicons name="chevron-down" size={12} color="#4D444D" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Album Hero Card */}
        {showFeaturedAlbum && (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => openLightbox(featuredAlbum)}
            activeOpacity={0.92}
          >
            <View style={styles.featuredImgWrapper}>
              <Image
                source={resolveImageSource(featuredAlbum.image)}
                style={styles.featuredImg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(38, 1, 49, 0.45)', 'rgba(38, 1, 49, 0.95)']}
                style={styles.featuredGradient}
              />

              {/* Top Badges */}
              <View style={styles.featuredTopRow}>
                <View style={styles.featuredTagPill}>
                  <Ionicons name="star" size={12} color="#FCD7FF" />
                  <Text style={styles.featuredTagText}>
                    {t.gallery.featuredBadge} ({featuredAlbum.photoCount} {t.gallery.featuredPhotosSuffix})
                  </Text>
                </View>
                <View style={styles.featuredAlbumIconBtn}>
                  <Ionicons name="albums-outline" size={16} color="#260131" />
                </View>
              </View>

              {/* Bottom Information */}
              <View style={styles.featuredBottomContent}>
                <View style={styles.featuredMetaRow}>
                  <View style={styles.featuredMetaItem}>
                    <Ionicons name="calendar-outline" size={12} color="#E8B5F0" />
                    <Text style={styles.featuredMetaText}>{featuredAlbum.date}</Text>
                  </View>
                  <Text style={styles.featuredMetaDot}>•</Text>
                  <View style={styles.featuredMetaItem}>
                    <Ionicons name="location-outline" size={12} color="#E8B5F0" />
                    <Text style={styles.featuredMetaText}>
                      {featuredAlbum.location}
                    </Text>
                  </View>
                </View>

                <Text style={styles.featuredTitle}>{featuredAlbum.title}</Text>

                <View style={styles.featuredFooterRow}>
                  <Text style={styles.featuredSubtitle} numberOfLines={2}>
                    {featuredAlbum.subtitle}
                  </Text>
                  <View style={styles.featuredArrowBtn}>
                    <Ionicons name="arrow-forward" size={16} color="#260131" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Section Header: Moments & Spaces */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderLeft}>
            <Text style={styles.sectionTitle}>{t.gallery.momentsHeader}</Text>
            <View style={styles.albumsBadge}>
              <Text style={styles.albumsBadgeText}>{t.gallery.albumsBadge}</Text>
            </View>
          </View>
          <View style={styles.sectionHeaderRight}>
            <Ionicons name="finger-print-outline" size={14} color="#3A684D" />
            <Text style={styles.tapInspectText}>{t.gallery.tapToInspect}</Text>
          </View>
        </View>

        {/* Photo Gallery Grid */}
        <View style={styles.galleryList}>
          {filteredItems.map((item) => {
            const likeInfo = likesState[item.id] || {
              count: item.likes,
              liked: false,
            };

            return (
              <View key={item.id} style={styles.card}>
                {/* Card Image Area */}
                <TouchableOpacity
                  style={styles.cardImgContainer}
                  onPress={() => openLightbox(item)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={resolveImageSource(item.image)}
                    style={styles.cardImg}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.cardImgGradient}
                  />

                  {/* Over-image Top Left Category Chip */}
                  <View
                    style={[
                      styles.cardCategoryChip,
                      { backgroundColor: item.tagBg },
                    ]}
                  >
                    <Ionicons
                      name={item.tagIcon}
                      size={12}
                      color={item.tagColor}
                    />
                    <Text
                      style={[
                        styles.cardCategoryText,
                        { color: item.tagColor },
                      ]}
                    >
                      {item.tagLabel}
                    </Text>
                  </View>

                  {/* Over-image Top Right Camera Photo Count */}
                  <View style={styles.cardPhotoCountPill}>
                    <Ionicons name="camera" size={11} color="#FFFFFF" />
                    <Text style={styles.cardPhotoCountText}>
                      {item.photoCount}
                    </Text>
                  </View>

                  {/* Over-image Bottom Right Zoom Icon */}
                  <View style={styles.zoomButton}>
                    <Ionicons name="search" size={14} color="#260131" />
                  </View>
                </TouchableOpacity>

                {/* Card Footer Information */}
                <View style={styles.cardInfoRow}>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardSub} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>

                  {/* Reaction / Like Pill */}
                  <TouchableOpacity
                    style={[
                      styles.reactionPill,
                      likeInfo.liked && styles.reactionPillActive,
                    ]}
                    onPress={() => toggleLike(item.id)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={likeInfo.liked ? 'heart' : 'heart-outline'}
                      size={16}
                      color={likeInfo.liked ? '#BA1A1A' : '#4D444D'}
                    />
                    <Text
                      style={[
                        styles.reactionCountText,
                        likeInfo.liked && styles.reactionCountActive,
                      ]}
                    >
                      {likeInfo.count}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Experience RPS in Person CTA Banner */}
        <View style={styles.ctaBannerContainer}>
          <LinearGradient
            colors={['#3D1747', '#3A684D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBannerGradient}
          >
            <View style={styles.ctaHeaderRow}>
              <View style={styles.ctaIconContainer}>
                <Ionicons name="location" size={22} color="#71FCB5" />
              </View>
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaTitle}>{t.gallery.ctaTitle}</Text>
                <Text style={styles.ctaSubtitle}>{t.gallery.ctaSubtitle}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleBookVisit}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaButtonText}>{t.gallery.ctaButton}</Text>
              <Ionicons name="calendar-outline" size={16} color="#260131" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Bottom space for fixed navigation bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Lightbox / Modal Inspector */}
      {lightboxItem && (
        <Modal
          visible={!!lightboxItem}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setLightboxItem(null)}
        >
          <View style={styles.lightboxOverlay}>
            {/* Top Toolbar */}
            <View style={styles.lightboxTopBar}>
              <View style={styles.lightboxCounterRow}>
                <Ionicons name="images" size={16} color="#BCEECD" />
                <Text style={styles.lightboxCounterText}>
                  {t.gallery.lightboxPhoto} {lightboxIndex} {t.gallery.lightboxOf} {lightboxItem.photoCount}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.lightboxCloseBtn}
                onPress={() => setLightboxItem(null)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Photo Viewport */}
            <View style={styles.lightboxViewport}>
              <View style={styles.lightboxImageCard}>
                <Image
                  source={resolveImageSource(lightboxItem.image)}
                  style={styles.lightboxImage}
                  resizeMode="contain"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(38, 1, 49, 0.9)']}
                  style={styles.lightboxImageGradient}
                />
                <View style={styles.lightboxDetailsBox}>
                  <Text style={styles.lightboxTitleText}>
                    {lightboxItem.title}
                  </Text>
                  <View style={styles.lightboxMetaRow}>
                    <Ionicons name="location" size={13} color="#E8B5F0" />
                    <Text style={styles.lightboxMetaSub}>
                      {lightboxItem.location} • {lightboxItem.date}
                    </Text>
                  </View>
                  {lightboxItem.description && (
                    <Text style={styles.lightboxDescText} numberOfLines={3}>
                      {lightboxItem.description}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.lightboxBottomBar}>
              <TouchableOpacity
                style={styles.lightboxNavBtn}
                onPress={prevLightboxPhoto}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
                <Text style={styles.lightboxNavText}>{t.gallery.lightboxPrev}</Text>
              </TouchableOpacity>

              <View style={styles.lightboxDotsRow}>
                <View style={[styles.lightboxDot, styles.lightboxDotActive]} />
                <View style={styles.lightboxDot} />
                <View style={styles.lightboxDot} />
              </View>

              <TouchableOpacity
                style={styles.lightboxNavBtn}
                onPress={nextLightboxPhoto}
                activeOpacity={0.8}
              >
                <Text style={styles.lightboxNavText}>{t.gallery.lightboxNext}</Text>
                <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  header: {
    marginBottom: 12,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#B9EBCA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 6,
    marginBottom: 8,
    shadowColor: 'rgba(61, 23, 71, 0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#3E6C51',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#260131',
    letterSpacing: -0.4,
    lineHeight: 33,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4D444D',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 6,
    marginBottom: 14,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEEEB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#3D1747',
    ...Shadows.sm,
  },
  filterPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#4D444D',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#71FCB5',
  },

  /* Featured Hero Card */
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    ...Shadows.md,
  },
  featuredImgWrapper: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  featuredImg: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  featuredTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  featuredTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(38, 1, 49, 0.85)',
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: Radius.full,
  },
  featuredTagText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  featuredAlbumIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  featuredBottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    zIndex: 2,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredMetaText: {
    fontSize: 12.5,
    color: '#E8B5F0',
    fontWeight: '600',
  },
  featuredMetaDot: {
    color: '#E8B5F0',
    fontSize: 13,
  },
  featuredTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 27,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  featuredFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  featuredSubtitle: {
    flex: 1,
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  featuredArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  /* Moments & Spaces Subheader */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#260131',
    letterSpacing: -0.2,
  },
  albumsBadge: {
    backgroundColor: '#EFEEEB',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  albumsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4D444D',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tapInspectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3A684D',
  },

  /* Gallery List & Cards */
  galleryList: {
    gap: 14,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardImgContainer: {
    width: '100%',
    height: 205,
    position: 'relative',
    backgroundColor: '#E4E2DF',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  cardImgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardCategoryChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  cardCategoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardPhotoCountPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(61, 23, 71, 0.85)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  cardPhotoCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  zoomButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B1C1A',
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 13.5,
    color: '#4D444D',
    marginTop: 3,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F3F0',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  reactionPillActive: {
    backgroundColor: '#FFDAD6',
  },
  reactionCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4D444D',
  },
  reactionCountActive: {
    color: '#BA1A1A',
  },

  /* CTA Banner: Experience RPS */
  ctaBannerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 10,
    ...Shadows.md,
  },
  ctaBannerGradient: {
    padding: 16,
    borderRadius: 20,
  },
  ctaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  ctaIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.sm,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#260131',
  },

  /* Lightbox Modal */
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(38, 1, 49, 0.96)',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  lightboxTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  lightboxCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lightboxCounterText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
  },
  lightboxCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxViewport: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lightboxImageCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1B1C1A',
    position: 'relative',
    ...Shadows.lg,
  },
  lightboxImage: {
    width: '100%',
    height: 300,
  },
  lightboxImageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  lightboxDetailsBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  lightboxTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lightboxMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  lightboxMetaSub: {
    fontSize: 12,
    color: '#E8B5F0',
    fontWeight: '600',
  },
  lightboxDescText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  lightboxBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  lightboxNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  lightboxNavText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  lightboxDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lightboxDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  lightboxDotActive: {
    backgroundColor: '#71FCB5',
    width: 16,
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
