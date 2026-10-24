// Admin Login Screen matching RPS Design System
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows, Radius } from '../../theme/colors';

export default function AdminLoginScreen({ onClose, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(cleanEmail, password);
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        {onClose && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.primary} />
            <Text style={styles.backBtnText}>Back to School App</Text>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          {/* Header & Logo */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../../../assets/rps_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.titleGroup}>
              <Text style={styles.schoolName}>RUDRAPUR PUBLIC SCHOOL</Text>
              <Text style={styles.portalTitle}>Admin Portal</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark" size={12} color="#B8860B" />
                  <Text style={styles.badgeText}>AUTHORIZED ACCESS ONLY</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Subtitle description */}
          <Text style={styles.desc}>
            Sign in with your administrator email and password to access student records, fees, and staff management.
          </Text>

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Admin Email Address</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="admin@rudrapurpublicschool.com"
                placeholderTextColor="#A199A3"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.outline} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your account password"
                placeholderTextColor="#A199A3"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.outline}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <View style={styles.btnInnerRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.loginBtnText, { marginLeft: 10 }]}>Signing in...</Text>
              </View>
            ) : (
              <View style={styles.btnInnerRow}>
                <Text style={styles.loginBtnText}>Sign In to Admin Panel</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>

          {/* Footer Security Notice */}
          <View style={styles.securityNotice}>
            <Ionicons name="lock-closed" size={13} color={Colors.outline} />
            <Text style={styles.securityText}>
              256-bit SSL Encrypted • Role-Governed Access
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(38, 1, 49, 0.08)',
    ...Shadows.sm,
  },
  backBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.08)',
    ...Shadows.md,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(61, 23, 71, 0.1)',
    ...Shadows.sm,
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleGroup: {
    alignItems: 'center',
  },
  schoolName: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.4,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF7E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(184, 134, 11, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A6300',
    letterSpacing: 0.6,
    marginLeft: 5,
  },
  desc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.2)',
  },
  errorText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.onErrorContainer,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: 'rgba(61, 23, 71, 0.12)',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: Colors.onSurface,
    fontWeight: '500',
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    ...Shadows.sm,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  btnInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 6,
  },
  securityText: {
    fontSize: 11.5,
    color: Colors.outline,
    fontWeight: '600',
  },
});
