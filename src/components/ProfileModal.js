import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({
  visible,
  onClose,
  onNavigateToAdmission,
  onOpenAdminLogin,
}) {
  const { t, isHindi } = useLanguage();
  const { isAdmin, isSuperAdmin, adminProfile, logout } = useAuth();
  const p = t.profileModal;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Top Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.avatarWrap}>
                <Ionicons name="person" size={26} color="#FFFFFF" />
                <View style={styles.statusDot} />
              </View>
              <View style={styles.headerInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {p.guestTitle}
                  </Text>
                  <View style={styles.guestBadge}>
                    <Text style={styles.guestBadgeText}>{p.badge}</Text>
                  </View>
                </View>
                <Text style={styles.userRole} numberOfLines={1}>
                  {p.guestRole}
                </Text>
                <Text style={styles.schoolSub} numberOfLines={1}>
                  {p.schoolName}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Welcome Callout */}
            <View style={styles.welcomeBox}>
              <View style={styles.welcomeHeader}>
                <Ionicons name="sparkles" size={15} color="#B8860B" />
                <Text style={styles.welcomeTitle}>{p.welcomeTitle}</Text>
              </View>
              <Text style={styles.welcomeMsg}>{p.welcomeMsg}</Text>
            </View>

            {/* Info Highlights */}
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(61, 23, 71, 0.08)' }]}>
                  <MaterialCommunityIcons name="certificate" size={18} color="#3D1747" />
                </View>
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>{p.affiliationTitle}</Text>
                  <Text style={styles.infoVal} numberOfLines={2}>
                    {p.affiliationVal}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(33, 79, 55, 0.08)' }]}>
                  <Ionicons name="school-outline" size={18} color="#214F37" />
                </View>
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>{p.sessionTitle}</Text>
                  <Text style={styles.infoVal} numberOfLines={2}>
                    {p.sessionVal}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(184, 134, 11, 0.08)' }]}>
                  <Ionicons name="location-outline" size={18} color="#996515" />
                </View>
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>{p.campusTitle}</Text>
                  <Text style={styles.infoVal} numberOfLines={2}>
                    {p.campusVal}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {onNavigateToAdmission && (
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={onNavigateToAdmission}
                  activeOpacity={0.88}
                >
                  <View style={styles.actionIconWrap}>
                    <Ionicons name="school" size={20} color="#FCD7FF" />
                  </View>
                  <View style={styles.actionTextWrap}>
                    <Text style={styles.actionMainTitle} numberOfLines={1}>
                      {p.exploreAdmissionBtn || (isHindi ? 'प्रवेश हेतु आवेदन करें' : 'Apply for Admission')}
                    </Text>
                    <View style={styles.actionSubRow}>
                      <View style={styles.actionYearBadge}>
                        <Text style={styles.actionYearText}>
                          {p.exploreAdmissionSession || '2026–27'}
                        </Text>
                      </View>
                      <Text style={styles.actionSubText} numberOfLines={1}>
                        {p.exploreAdmissionClasses || (isHindi ? 'नर्सरी – 5वीं' : 'Nursery – Class V')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionArrowWrap}>
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              )}

              {/* Admin Portal Action */}
              {isAdmin ? (
                <View style={styles.adminLoggedInWrap}>
                  <TouchableOpacity
                    style={styles.adminPanelBtn}
                    onPress={() => {
                      onClose();
                      if (onOpenAdminLogin) onOpenAdminLogin();
                    }}
                    activeOpacity={0.88}
                  >
                    <View style={styles.adminIconWrap}>
                      <Ionicons name="shield-checkmark" size={18} color="#3A684D" />
                    </View>
                    <View style={styles.actionTextWrap}>
                      <View style={styles.adminRoleRow}>
                        <Text style={styles.adminPanelTitle} numberOfLines={1}>
                          {isHindi ? 'एडमिन पोर्टल पर जाएं' : 'Open Admin Panel'}
                        </Text>
                        <View style={styles.activeDot} />
                      </View>
                      <Text style={styles.adminRoleText}>
                        {isSuperAdmin ? 'Super Administrator' : 'School Administrator'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#3A684D" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.adminLogoutBtn}
                    onPress={async () => {
                      await logout();
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="log-out-outline" size={16} color={Colors.error} style={{ marginRight: 6 }} />
                    <Text style={styles.adminLogoutText}>
                      {isHindi ? 'एडमिन लॉगआउट' : 'Admin Logout'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.adminLoginBtn}
                  onPress={() => {
                    onClose();
                    if (onOpenAdminLogin) onOpenAdminLogin();
                  }}
                  activeOpacity={0.88}
                >
                  <View style={styles.adminLoginIconWrap}>
                    <Ionicons name="lock-closed" size={18} color="#3D1747" />
                  </View>
                  <View style={styles.actionTextWrap}>
                    <Text style={styles.adminLoginTitle} numberOfLines={1}>
                      {isHindi ? 'एडमिन लॉगिन' : 'Admin Login'}
                    </Text>
                    <Text style={styles.adminLoginSub} numberOfLines={1}>
                      {isHindi ? 'प्राधिकृत स्टाफ व प्रबंधन पोर्टल' : 'Authorized Faculty & Management Portal'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#3D1747" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeActionBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeActionText}>{p.closeBtn}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 7, 24, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1C4D6',
  },
  scrollContent: {
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3D1747',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
    ...Shadows.sm,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3D1747',
    letterSpacing: -0.3,
  },
  guestBadge: {
    backgroundColor: 'rgba(184, 134, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(184, 134, 11, 0.25)',
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#996515',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userRole: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#6B5A72',
    marginTop: 2,
  },
  schoolSub: {
    fontSize: 12,
    color: '#8A7B8E',
    marginTop: 1,
    fontWeight: '500',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3EEF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBox: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    marginBottom: 14,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  welcomeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D1747',
  },
  welcomeMsg: {
    fontSize: 13,
    color: '#4B434D',
    lineHeight: 19,
  },
  infoList: {
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11.5,
    color: '#8A7B8E',
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D1B36',
    marginTop: 1,
    lineHeight: 18,
  },
  actionButtons: {
    gap: 10,
    marginTop: 4,
  },
  primaryActionBtn: {
    backgroundColor: '#3D1747',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(252, 215, 255, 0.2)',
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(252, 215, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  actionTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  actionMainTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  actionSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  actionYearBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.45)',
  },
  actionYearText: {
    color: '#FFE27A',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  actionSubText: {
    color: '#E4D5EC',
    fontSize: 11.5,
    fontWeight: '600',
    flexShrink: 1,
  },
  actionArrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  adminLoggedInWrap: {
    gap: 8,
  },
  adminPanelBtn: {
    backgroundColor: '#E6F4EA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(58, 104, 77, 0.25)',
    ...Shadows.sm,
  },
  adminIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  adminRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminPanelTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#214F37',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  adminRoleText: {
    fontSize: 11.5,
    color: '#3A684D',
    fontWeight: '600',
    marginTop: 1,
  },
  adminLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F0',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.15)',
  },
  adminLogoutText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.error,
  },
  adminLoginBtn: {
    backgroundColor: '#FAF8F5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(61, 23, 71, 0.12)',
    ...Shadows.sm,
  },
  adminLoginIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FCD7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  adminLoginTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#260131',
  },
  adminLoginSub: {
    fontSize: 11.5,
    color: '#7E747D',
    fontWeight: '500',
    marginTop: 2,
  },
  tourOptionBtn: {
    backgroundColor: '#FBF8FD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(61, 23, 71, 0.12)',
    ...Shadows.sm,
  },
  tourIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FCD7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tourOptionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#260131',
  },
  tourOptionSub: {
    fontSize: 11,
    color: '#7E747D',
    fontWeight: '500',
    marginTop: 2,
  },
  closeActionBtn: {
    backgroundColor: '#F5F0F7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
  },
  closeActionText: {
    color: '#6B5A72',
    fontSize: 13.5,
    fontWeight: '700',
  },
});

