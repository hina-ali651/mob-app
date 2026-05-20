import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StatusBar, Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Context
import { AgentProvider } from './src/context/AgentContext';

// Localization & screens
import { localization } from './src/components/Localization';
import { LandingScreen } from './src/screens/LandingScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { PhoneAuthScreen } from './src/screens/PhoneAuthScreen';
import { OtpVerifyScreen } from './src/screens/OtpVerifyScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { JobDetailScreen } from './src/screens/JobDetailScreen';
import { IdCardScreen } from './src/screens/IdCardScreen';
import { ApiClient } from './src/components/Api';

type Screen =
  | 'landing'
  | 'welcome'
  | 'phone_auth'
  | 'otp_verify'
  | 'profile_setup'
  | 'dashboard'
  | 'id_card'
  | 'job_detail';

// ─── Inner app (has access to AgentContext) ────────────────────────────────────
function AppContent() {
  // ── Navigation ──────────────────────────────────────────────────────────
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<'ur' | 'en'>('ur');

  // ── Auth / Profile ───────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userName, setUserName] = useState('');
  const [userSkill, setUserSkill] = useState<
    'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason'
  >('painter');
  const [userCity, setUserCity] = useState('Lahore');
  const [biography, setBiography] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  // ── Job state ────────────────────────────────────────────────────────────
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [currentJobs, setCurrentJobs] = useState<any[]>([]);
  const [isBackendLive, setIsBackendLive] = useState(false);

  // ── Dashboard UI ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'scout' | 'guardian' | 'economic'>('scout');

  // ── Animations ───────────────────────────────────────────────────────────
  const splashProgress = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  const [loadingText, setLoadingText] = useState('ہنر اور حفاظت لوڈ ہو رہا ہے...');

  const t = useMemo(() => localization[language], [language]);

  // ── Validation ───────────────────────────────────────────────────────────
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, [email]);

  const isOtpValid = useMemo(() => otpCode.length === 4, [otpCode]);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. SPLASH SCREEN BOOT SEQUENCE
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentScreen !== 'landing') return;

    const statusesUr = [
      'محفوظ ادائیگی سرور جوڑا جا رہا ہے...',
      'ڈیجیٹل والٹ اسکرو چالو ہو رہا ہے...',
      'حفاظتی چوک الرٹس لوڈ کیے جا رہے ہیں...',
      'پاکستان ڈیجیٹل لیبر ڈیٹا ہم آہنگ ہو رہا ہے...',
    ];
    const statusesEn = [
      'Syncing secure escrow wallet...',
      'Initializing AI Guardian seals...',
      'Loading safety radar indices...',
      'DLC Pakistan credentials syncing...',
    ];

    let textIdx = 0;
    const textTimer = setInterval(() => {
      textIdx = (textIdx + 1) % 4;
      setLoadingText(language === 'ur' ? statusesUr[textIdx] : statusesEn[textIdx]);
    }, 1500);

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1.12, duration: 1200, useNativeDriver: true }),
        Animated.timing(logoPulse, { toValue: 0.95, duration: 1200, useNativeDriver: true }),
      ]),
    ).start();

    Animated.timing(splashProgress, {
      toValue: 1,
      duration: 6500,
      useNativeDriver: false,
    }).start();

    let finishTimer: any;
    const boot = async () => {
      const token = await ApiClient.getToken();
      let hasProfile = false;
      if (token) {
        const user = await ApiClient.getProfile();
        if (user) {
          setUserName(user.full_name || '');
          setUserSkill(user.skill || 'painter');
          setUserCity(user.city || 'Lahore');
          setBiography(user.biography || '');
          setWalletBalance(user.wallet_balance || 0);
          if (user.full_name) {
            hasProfile = true;
          }
        }
      }
      finishTimer = setTimeout(() => {
        clearInterval(textTimer);
        setCurrentScreen(token ? (hasProfile ? 'dashboard' : 'profile_setup') : 'welcome');
      }, 6700);
    };
    boot();

    return () => {
      clearInterval(textTimer);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [currentScreen]);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. VOICE PULSE ANIMATION
  // ─────────────────────────────────────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1.5, duration: 900, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 1.0, duration: 900, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      glowAnim.setValue(1);
    }
  }, [isListening]);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. OTP VERIFICATION FLOW
  // ─────────────────────────────────────────────────────────────────────────
  const verifyOtpFlow = async (codeVal?: string) => {
    const target = codeVal || otpCode;
    const result = await ApiClient.verifyOtp(email, target);
    if (result) {
      setWalletBalance(result.wallet_balance || 0);
      setUserName(result.full_name || '');
      setUserSkill(result.skill || 'painter');
      setUserCity(result.city || 'Lahore');
      setBiography(result.biography || '');
      if (result.full_name) {
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('profile_setup');
      }
    } else {
      alert(language === 'ur' ? 'غلط تصدیقی کوڈ!' : 'Incorrect verification code!');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 4. FETCH LIVE JOBS ON DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    const fetchLiveJobs = async () => {
      const connected = await ApiClient.checkServerConnection();
      if (!active) return;
      setIsBackendLive(connected);

      const jobsList = await ApiClient.getJobs(userSkill, language);
      if (!active) return;
      setCurrentJobs(jobsList);
    };

    if (currentScreen === 'dashboard' || currentScreen === 'job_detail') {
      fetchLiveJobs();
    }
    return () => { active = false; };
  }, [userSkill, language, currentScreen]);

  // ─────────────────────────────────────────────────────────────────────────
  // 5. SCREEN ROUTER
  // ─────────────────────────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return (
          <LandingScreen
            language={language}
            splashProgress={splashProgress}
            logoPulse={logoPulse}
            loadingText={loadingText}
          />
        );
      case 'welcome':
        return (
          <WelcomeScreen
            language={language}
            setLanguage={setLanguage}
            setCurrentScreen={setCurrentScreen}
            t={t}
          />
        );
      case 'phone_auth':
        return (
          <PhoneAuthScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            email={email}
            setEmail={setEmail}
            isEmailValid={isEmailValid}
            t={t}
          />
        );
      case 'otp_verify':
        return (
          <OtpVerifyScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            isOtpValid={isOtpValid}
            email={email}
            t={t}
            verifyOtpFlow={verifyOtpFlow}
          />
        );
      case 'profile_setup':
        return (
          <ProfileSetupScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            email={email}
            userName={userName}
            setUserName={setUserName}
            userSkill={userSkill}
            setUserSkill={setUserSkill}
            userCity={userCity}
            setUserCity={setUserCity}
            biography={biography}
            setBiography={setBiography}
            t={t}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            userName={userName}
            userSkill={userSkill}
            setUserSkill={setUserSkill}
            userCity={userCity}
            setUserCity={setUserCity}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isListening={isListening}
            setIsListening={setIsListening}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            currentJobs={currentJobs}
            setSelectedJob={setSelectedJob}
            t={t}
            glowAnim={glowAnim}
          />
        );
      case 'job_detail':
        return (
          <JobDetailScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            t={t}
          />
        );
      case 'id_card':
        return (
          <IdCardScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            userName={userName}
            setUserName={setUserName}
            userSkill={userSkill}
            setUserSkill={setUserSkill}
            userCity={userCity}
            walletBalance={walletBalance}
            setEmail={setEmail}
            t={t}
          />
        );
      default:
        return (
          <WelcomeScreen
            language={language}
            setLanguage={setLanguage}
            setCurrentScreen={setCurrentScreen}
            t={t}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.rootWrapper} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#090D14" />
      {renderScreen()}
    </SafeAreaView>
  );
}

// ─── Root App wrapped with AgentProvider ──────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <AgentProvider>
        <AppContent />
      </AgentProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: '#090D14',
  },
});
