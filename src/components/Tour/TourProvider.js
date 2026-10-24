import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import {
  TourGuideProvider,
  useTourGuide,
  TourGuideOverlay,
} from '@wrack/react-native-tour-guide';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TourContext } from '../../context/TourContext';
import TourTooltip from './TourTooltip';
import WelcomeTourModal from './WelcomeTourModal';
import FinishTourModal from './FinishTourModal';
import { USER_TOUR_STEPS } from '../../config/tourConfig';
import { ADMIN_TOUR_STEPS } from '../../config/adminTourConfig';
import { SUPER_ADMIN_TOUR_STEPS } from '../../config/superAdminTourConfig';
import { hasTourCompleted, setTourCompleted, resetTour } from '../../utils/tourStorage';
import { useLanguage } from '../../context/LanguageContext';

function TourProviderInternal({ children }) {
  const { isHindi } = useLanguage();
  const insets = useSafeAreaInsets();
  const tourGuide = useTourGuide();

  const [tourType, setTourType] = useState('user');
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isFinishVisible, setIsFinishVisible] = useState(false);

  // Navigation handlers registry
  const navigatorsRef = useRef({});

  // Register Navigation Handlers (App tabs & Admin screens)
  const registerNavigator = useCallback((handlers) => {
    navigatorsRef.current = { ...navigatorsRef.current, ...handlers };
  }, []);

  // Hardware Back Button handler while tour is active
  useEffect(() => {
    if (!tourGuide.isActive) return;
    const onBackPress = () => {
      tourGuide.skipTour();
      setTourCompleted(tourType, true);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [tourGuide, tourType]);

  // Get steps for the specified tour type
  const getStepsForType = useCallback((type) => {
    if (type === 'superadmin') return SUPER_ADMIN_TOUR_STEPS;
    if (type === 'admin') return ADMIN_TOUR_STEPS;
    return USER_TOUR_STEPS;
  }, []);

  const steps = getStepsForType(tourType);

  // Start Tour action (strictly user-only)
  const startTour = useCallback(
    async (type = 'user') => {
      if (type !== 'user') return;

      setTourType('user');
      setIsWelcomeVisible(false);
      setIsFinishVisible(false);

      // Reset to starting screen & scroll if needed
      if (type === 'user') {
        if (navigatorsRef.current.navigateToTab) {
          navigatorsRef.current.navigateToTab('home');
        }
        if (navigatorsRef.current.resetHomeScroll) {
          navigatorsRef.current.resetHomeScroll();
        }
        await new Promise((r) => setTimeout(r, 220));
      } else if (type !== 'user' && navigatorsRef.current.navigateAdminScreen) {
        navigatorsRef.current.navigateAdminScreen('dashboard');
        await new Promise((r) => setTimeout(r, 220));
      }

      const rawSteps = getStepsForType(type);
      const formattedSteps = rawSteps.map((s) => ({
        ...s,
        targetId: s.id,
        title: isHindi && s.hindiTitle ? s.hindiTitle : s.title,
        description: isHindi && s.hindiDesc ? s.hindiDesc : s.description,
        spotlightPadding: s.spotlightPadding ?? 4,
        spotlightBorderRadius:
          s.spotlightBorderRadius ||
          (s.id === 'home-logo' ? 16 : s.id === 'header-profile' ? 22 : 16),
        before: async () => {
          if (s.screen) {
            if (type === 'user') {
              if (navigatorsRef.current.navigateToTab) {
                navigatorsRef.current.navigateToTab(s.screen);
              }
              if (s.screen === 'home' && navigatorsRef.current.resetHomeScroll) {
                navigatorsRef.current.resetHomeScroll();
              }
            } else if (type !== 'user' && navigatorsRef.current.navigateAdminScreen) {
              navigatorsRef.current.navigateAdminScreen(s.screen);
            }
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        },
      }));

      const config = {
        tourId: `rps_${type}_tour`,
        // 'modal' mode with statusBarTranslucent={true} renders a full-screen native window.
        // On Android with StatusBar.translucent=true, measureInWindow is already in absolute screen dp (from y=0).
        // By setting insets.top to 0, resolveSafeAreaInsets().top returns 0, ensuring measureTopOffset = 0!
        // This guarantees pixel-perfect spotlight cutout alignment across ALL mobile screen ratios (16:9, 18:9, 19.5:9, 20:9).
        overlayMode: 'modal',
        autoPositionTooltip: true,
        enableBackButton: true,
        allowFontScaling: false,
        animationDuration: 260,
        insets: {
          top: 0,
          bottom: insets.bottom,
          left: insets.left,
          right: insets.right,
        },
        extraInsets: {
          top: insets.top,
        },
        spotlightStyles: {
          overlayColor: 'rgba(15, 7, 24, 0.74)',
          enablePulse: true,
          pulseColor: '#FCD7FF',
          pulseWidth: 2.5,
          pulseDuration: 1400,
        },
        renderTooltip: (props) => (
          <TourTooltip
            {...props}
            insets={{
              top: insets.top,
              bottom: insets.bottom,
              left: insets.left,
              right: insets.right,
            }}
            onSkip={() => {
              tourGuide.skipTour();
              setTourCompleted(type, true);
            }}
          />
        ),
        onTourEnd: (completed) => {
          setTourCompleted(type, true);
          if (completed) {
            setIsFinishVisible(true);
          }
        },
      };

      tourGuide.startTour(formattedSteps, config);
      setTourCompleted(type, true);
    },
    [getStepsForType, insets, isHindi, tourGuide]
  );

  const handleSkipTour = useCallback(() => {
    tourGuide.skipTour();
    setTourCompleted(tourType, true);
  }, [tourGuide, tourType]);

  const finishTour = useCallback(() => {
    setIsFinishVisible(false);
    setTourCompleted(tourType, true);
    if (tourType === 'user' && navigatorsRef.current.navigateToTab) {
      navigatorsRef.current.navigateToTab('home');
    }
  }, [tourType]);

  const restartTour = useCallback(
    async (type = 'user') => {
      await resetTour(type);
      startTour(type);
    },
    [startTour]
  );

  const hasShownUserTourSessionRef = useRef(false);
  const checkAndShowUserTour = useCallback(async () => {
    if (hasShownUserTourSessionRef.current) return;
    try {
      const completed = await hasTourCompleted('user');
      if (!completed) {
        hasShownUserTourSessionRef.current = true;
        setTourType('user');
        setIsWelcomeVisible(true);
      }
    } catch (e) {
      console.warn('[TourProvider] checkAndShowUserTour error:', e);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      isTourActive: tourGuide.isActive,
      tourType,
      steps,
      currentStepIndex: tourGuide.currentStep,
      currentStep: steps[tourGuide.currentStep] || null,
      totalSteps: steps.length,
      isWelcomeVisible,
      isFinishVisible,
      isSkipConfirmVisible: false,
      targetLayouts: {},
      activeTargetRect: null,
      startTour,
      nextStep: tourGuide.nextStep,
      previousStep: tourGuide.prevStep,
      skipTour: handleSkipTour,
      confirmSkipTour: handleSkipTour,
      cancelSkipTour: () => {},
      finishTour,
      restartTour,
      checkAndShowUserTour,
      registerTarget: () => {},
      unregisterTarget: () => {},
      registerNavigator,
    }),
    [
      tourGuide.isActive,
      tourGuide.currentStep,
      tourGuide.nextStep,
      tourGuide.prevStep,
      tourType,
      steps,
      isWelcomeVisible,
      isFinishVisible,
      startTour,
      handleSkipTour,
      finishTour,
      restartTour,
      checkAndShowUserTour,
      registerNavigator,
    ]
  );

  return (
    <TourContext.Provider value={contextValue}>
      <View style={styles.container}>
        {children}

        {/* 1. Welcome First-Time Modal */}
        <WelcomeTourModal
          visible={isWelcomeVisible}
          tourType={tourType}
          onStart={() => {
            setIsWelcomeVisible(false);
            startTour(tourType);
          }}
          onSkip={() => {
            setIsWelcomeVisible(false);
            setTourCompleted(tourType, true);
          }}
        />

        {/* 2. Interactive Spotlight & Coachmark Overlay from @wrack/react-native-tour-guide */}
        <TourGuideOverlay />

        {/* 3. Celebration Finish Modal */}
        <FinishTourModal
          visible={isFinishVisible}
          tourType={tourType}
          onFinish={finishTour}
        />
      </View>
    </TourContext.Provider>
  );
}

export default function TourProvider({ children }) {
  return (
    <TourGuideProvider>
      <TourProviderInternal>{children}</TourProviderInternal>
    </TourGuideProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
