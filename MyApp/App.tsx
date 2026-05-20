import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StatusBar, Animated, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Local modular imports
import { localization, getJobsForSkill } from './src/components/Localization';
import { LandingScreen } from './src/screens/LandingScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { PhoneAuthScreen } from './src/screens/PhoneAuthScreen';
import { OtpVerifyScreen } from './src/screens/OtpVerifyScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { JobDetailScreen } from './src/screens/JobDetailScreen';
import { IdCardScreen } from './src/screens/IdCardScreen';
import { ApiClient } from './src/components/Api';

function AppContent() {
  // Navigation Screens State Machine
  const [currentScreen, setCurrentScreen] = useState<
    'landing' | 'welcome' | 'phone_auth' | 'otp_verify' | 'profile_setup' | 'dashboard' | 'id_card' | 'job_detail'
  >('landing');
  const [language, setLanguage] = useState<'ur' | 'en'>('ur');

  // Registration States
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userName, setUserName] = useState('');
  const [userSkill, setUserSkill] = useState<'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason'>('painter');
  const [userCity, setUserCity] = useState('Lahore');
  const [biography, setBiography] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [currentJobs, setCurrentJobs] = useState<any[]>([]);
  const [isBackendLive, setIsBackendLive] = useState(false);

  // Internal Simulator States
  const [activeTab, setActiveTab] = useState<'scout' | 'guardian' | 'economic'>('scout');
  const [walletBalance, setWalletBalance] = useState(0);
  const [negotiatingJobId, setNegotiatingJobId] = useState<number | null>(null);
  const [negotiatedRate, setNegotiatedRate] = useState(0);
  const [negotiationStep, setNegotiationStep] = useState(0);
  const [escrowActive, setEscrowActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'scanning' | 'safe' | 'scam'>('idle');

  // Ambient Voice Assistant Simulator States
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loadingText, setLoadingText] = useState('ہنر اور حفاظت لوڈ ہو رہا ہے...');

  // Active Animations Hooks
  const splashProgress = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  // Retrieve translation matrix
  const t = useMemo(() => localization[language], [language]);

  // 1. 6.7-SECOND SPLASH SCREEN LOGIC & BREATHING ANIMATION
  useEffect(() => {
    if (currentScreen === 'landing') {
      // Periodic Loading Text updates
      const statusesUr = [
        'محفوظ ادائیگی سرور جوڑا جا رہا ہے...',
        'ڈیجیٹل والٹ اسکرو چالو ہو رہا ہے...',
        'حفاظتی چوک الرٹس لوڈ کیے جا رہے ہیں...',
        'پاکستان ڈیجیٹل لیبر ڈیٹا ہم آہنگ ہو رہا ہے...',
      ];
      const statusesEn = [
        'Syncing secure escrow wallet...',
        'Initializing smart defense seals...',
        'Retrieving safety radar indices...',
        'DLC Pakistan credentials loading...',
      ];

      let textIdx = 0;
      const textTimer = setInterval(() => {
        textIdx = (textIdx + 1) % 4;
        setLoadingText(language === 'ur' ? statusesUr[textIdx] : statusesEn[textIdx]);
      }, 1500);

      // Breathing logo animation loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, {
            toValue: 1.12,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(logoPulse, {
            toValue: 0.95,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Horizontal progress bar charging over 6.5s
      Animated.timing(splashProgress, {
        toValue: 1,
        duration: 6500,
        useNativeDriver: false,
      }).start();

      let finishTimer: any;
      const bootApp = async () => {
        const token = await ApiClient.getToken();
        finishTimer = setTimeout(() => {
          clearInterval(textTimer);
          if (token) {
            setCurrentScreen('dashboard');
          } else {
            setCurrentScreen('welcome');
          }
        }, 6700);
      };
      
      bootApp();

      return () => {
        clearInterval(textTimer);
        if (finishTimer) clearTimeout(finishTimer);
      };
    }
  }, [currentScreen]);

  // 2. LIVE VOICE PULSE ANIMATION TRIGGER
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.5,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(1);
    }
  }, [isListening]);

  // 3. SECURE EMAIL REGEX PARSING
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, [email]);

  // 4. SECURE OTP DIGIT MATCH
  const isOtpValid = useMemo(() => {
    return otpCode.length === 4;
  }, [otpCode]);

  // 5. AUTOMATIC SYSTEM VERIFY FLOW ON COMPLETED OTP KEYS
  const verifyOtpFlow = async (codeVal?: string) => {
    const target = codeVal || otpCode;
    const result = await ApiClient.verifyOtp(email, target);
    if (result) {
      setWalletBalance(result.wallet_balance || 0);
      alert(language === 'ur' ? 'ای میل کامیابی سے تصدیق کر لی گئی ہے!' : 'Email verification successful!');
      setCurrentScreen('profile_setup');
    } else {
      alert(language === 'ur' ? 'غلط تصدیقی کوڈ!' : 'Incorrect verification code!');
    }
  };

  // 6. LIVE MULTI-STAGE WAGE RE-NEGOTIATION AGENT
  const startNegotiation = (jobId: number, baseRate: number) => {
    setNegotiatingJobId(jobId);
    setNegotiationStep(1);

    // Stage 1: Vetting employer credibility locally before calling server
    setTimeout(() => {
      setNegotiationStep(2);

      // Stage 2: Calling Python backend for dynamic rate intelligence
      setTimeout(async () => {
        const result = await ApiClient.negotiateRate(jobId, baseRate, userSkill, language);
        setNegotiatedRate(result.negotiated_rate);
        setNegotiationStep(3);
        alert(result.message);
      }, 1500);
    }, 1500);
  };

  // 7. CONTRACTOR SCAM HUNTER BLACKLIST VETTING
  const runEmployerCheck = async (phone: string) => {
    setVerificationStatus('scanning');
    
    const result = await ApiClient.verifyEmployer(phone, language);
    setVerificationStatus(result.status);
    
    if (result.warnings) {
      alert(result.warnings);
    } else {
      alert(language === 'ur' ? 'یہ ٹھیکیدار تصدیق شدہ اور محفوظ ہے۔' : 'This employer is verified and safe.');
    }
  };

  // 8. VOICE ASSISTANT MICRO TRANSLATOR
  const handleVoiceTap = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(async () => {
        setIsListening(false);
        const transcript = language === 'ur' ? 'آج میرے لیے کیا کام ہے؟' : 'What is the demand for me today?';
        const response = await ApiClient.askVoiceManager(transcript, userSkill, userCity);
        if (response) {
            alert(response);
        } else {
            alert('AI Manager is currently offline.');
        }
      }, 3500);
    } else {
      setIsListening(false);
    }
  };

  // Fetch live jobs actively via connected ApiClient
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
    
    return () => {
      active = false;
    };
  }, [userSkill, language, currentScreen]);

  // Main screen routing switch controller
  const renderCurrentScreen = () => {
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
            userCity={userCity}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isListening={isListening}
            setIsListening={setIsListening}
            voiceText={voiceText}
            setVoiceText={setVoiceText}
            negotiatingJobId={negotiatingJobId}
            startNegotiation={startNegotiation}
            negotiationStep={negotiationStep}
            negotiatedRate={negotiatedRate}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            escrowActive={escrowActive}
            setEscrowActive={setEscrowActive}
            verificationStatus={verificationStatus}
            runEmployerCheck={runEmployerCheck}
            currentJobs={currentJobs}
            setSelectedJob={setSelectedJob}
            t={t}
            glowAnim={glowAnim}
            handleVoiceTap={handleVoiceTap}
          />
        );
      case 'job_detail':
        return (
          <JobDetailScreen
            language={language}
            setCurrentScreen={setCurrentScreen}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            negotiatingJobId={negotiatingJobId}
            negotiatedRate={negotiatedRate}
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
      {renderCurrentScreen()}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: '#090D14',
  },
});
