// Admin Header Component for RPS Admin Panel
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows, Radius } from '../../theme/colors';

export default function AdminHeader({
  onToggleSidebar,
  activeScreenTitle,
  onExitToSchoolApp,
  canGoBack,
  onBack,
}) {
  const { adminProfile, currentUser, isSuperAdmin } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  const email = adminProfile?.email || currentUser?.email || 'admin@rudrapurpublicschool.com';
  const name = adminProfile?.name || email.split('@')[0];
  const initial = (name[0] || 'A').toUpperCase();

  return (
    <View style={styles.header}>
      {/* Left: Back Button (if on subscreen) + Hamburger (Mobile) + School Brand */}
      <View style={styles.leftCol}>
        {isMobile && (
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={onToggleSidebar}
            activeOpacity={0.7}
            accessibilityLabel="Open Navigation Menu"
          >
            <Ionicons name="menu" size={22} color={Colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.brandRow}>
          <Image
            source={require('../../../assets/rps_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.brandTextCol}>
            <Text style={styles.schoolName} numberOfLines={1}>
              RPS
            </Text>
            {activeScreenTitle ? (
              <Text style={styles.screenTitleText} numberOfLines={1}>
                {activeScreenTitle}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Right: Exit to School App (if available) + Admin Profile Avatar */}
      <View style={styles.rightCol}>
        {onExitToSchoolApp && (
          <TouchableOpacity
            style={styles.switchAppBtn}
            onPress={onExitToSchoolApp}
            activeOpacity={0.75}
          >
            <Ionicons name="earth-outline" size={16} color="#5E17EB" />
            {!isMobile && <Text style={styles.switchAppText}>School App</Text>}
          </TouchableOpacity>
        )}

        

        <View style={[styles.avatarCircle, isSuperAdmin && styles.superAvatar]}>
          <Text style={styles.avatarLetter}>{initial}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(61, 23, 71, 0.08)',
    zIndex: 100,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3EFF4',
  },
  menuBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FAF8F5',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 38,
    height: 38,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  screenTitleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 1,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileMeta: {
    alignItems: 'flex-end',
  },
  profileEmail: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#260131',
    maxWidth: 180,
  },
  roleLabel: {
    fontSize: 10.5,
    color: '#7E747D',
    fontWeight: '600',
    marginTop: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4361EE',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  superAvatar: {
    backgroundColor: '#5B45FF',
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  switchAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 5,
    marginRight: 4,
  },
  switchAppText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5E17EB',
  },
});
