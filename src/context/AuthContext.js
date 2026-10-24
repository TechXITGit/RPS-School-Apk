// Centralized Authentication Context for RPS Admin & Super Admin Panel
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  subscribeToAuthState,
  loginAdmin as apiLoginAdmin,
  logoutAdmin as apiLogoutAdmin,
  getAdminProfile,
  getFriendlyAuthErrorMessage,
} from '../services/firebase/authService';

const AuthContext = createContext({
  currentUser: null,
  adminProfile: null,
  userRole: null,
  userStatus: null,
  isAdmin: false,
  isSuperAdmin: false,
  loading: true,
  authError: null,
  login: async () => {},
  logout: async () => {},
  clearAuthError: () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync state with Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getAdminProfile(firebaseUser.uid, firebaseUser);

          if (!profile) {
            await apiLogoutAdmin();
            setCurrentUser(null);
            setAdminProfile(null);
            setAuthError('Administrator record not found.');
          } else if (profile.status === 'revoked' || profile.status === 'inactive') {
            await apiLogoutAdmin();
            setCurrentUser(null);
            setAdminProfile(null);
            setAuthError('Your admin access has been revoked.');
          } else if (profile.role !== 'admin' && profile.role !== 'superadmin') {
            await apiLogoutAdmin();
            setCurrentUser(null);
            setAdminProfile(null);
            setAuthError('Access denied. Administrator privileges required.');
          } else {
            setCurrentUser(firebaseUser);
            setAdminProfile(profile);
            setAuthError(null);
          }
        } catch (err) {
          console.error('Error synchronizing admin profile:', err);
          setCurrentUser(null);
          setAdminProfile(null);
        }
      } else {
        setCurrentUser(null);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const { user, profile } = await apiLoginAdmin(email, password);
      setCurrentUser(user);
      setAdminProfile(profile);
      return { success: true, user, profile };
    } catch (err) {
      const friendlyMsg = getFriendlyAuthErrorMessage(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await apiLogoutAdmin();
    } catch (err) {
      console.warn('Error during logout:', err);
    } finally {
      setCurrentUser(null);
      setAdminProfile(null);
      setAuthError(null);
    }
  }, []);

  // Refresh profile from Firestore (e.g. to re-verify permissions)
  const refreshProfile = useCallback(async () => {
    if (!currentUser) return null;
    try {
      const profile = await getAdminProfile(currentUser.uid, currentUser);
      if (profile) {
        if (profile.status === 'revoked' || profile.status === 'inactive') {
          await logout();
          setAuthError('Your admin access has been revoked.');
          return null;
        }
        setAdminProfile(profile);
      }
      return profile;
    } catch (err) {
      console.error('Error refreshing profile:', err);
      return null;
    }
  }, [currentUser, logout]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const userRole = adminProfile?.role || null;
  const userStatus = adminProfile?.status || null;
  const isAdmin = (userRole === 'admin' || userRole === 'superadmin') && userStatus === 'active';
  const isSuperAdmin = userRole === 'superadmin' && userStatus === 'active';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminProfile,
        userRole,
        userStatus,
        isAdmin,
        isSuperAdmin,
        loading,
        authError,
        login,
        logout,
        clearAuthError,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
