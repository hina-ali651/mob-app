import React, { useState, useEffect } from 'react';
import { useAgent } from '../context/AgentContext';
import { VoiceAssistantManager } from '../services/VoiceAssistantService';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  ShieldIcon,
  ChartIcon,
  MicroIcon,
  BriefcaseIcon,
  MapPinIcon,
  AudioIcon,
  SearchIcon,
  PakistanFlagIcon,
  VerifiedBadgeIcon,
  StormCloudIcon,
  StarIcon,
  ClockIcon,
  PeopleIcon,
} from '../components/Icons';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  language: 'ur' | 'en';
  setCurrentScreen: (screen: any) => void;
  userName: string;
  userSkill: 'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason';
  setUserSkill: (skill: 'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason') => void;
  userCity: string;
  setUserCity: (city: string) => void;
  activeTab: 'scout' | 'guardian' | 'economic';
  setActiveTab: (tab: 'scout' | 'guardian' | 'economic') => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  walletBalance: number;
  setWalletBalance: (val: number | ((prev: number) => number)) => void;
  currentJobs: any[];
  setSelectedJob: (job: any) => void;
  t: any;
  glowAnim: Animated.Value;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  language,
  setCurrentScreen,
  userName,
  userSkill,
  setUserSkill,
  userCity,
  setUserCity,
  activeTab,
  setActiveTab,
  isListening,
  setIsListening,
  walletBalance,
  setWalletBalance,
  currentJobs,
  setSelectedJob,
  t,
  glowAnim,
}) => {
  const verifiedSkillLabel = t.skillsMap[userSkill];
  const [searchPhone, setSearchPhone] = useState('');
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [customVoicePrompt, setCustomVoicePrompt] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [voiceInputTranscript, setVoiceInputTranscript] = useState('');

  // ── Reporting State ──────────────────────────────────────────────────
  const [reportPhone, setReportPhone] = useState('');
  const [reportName, setReportName] = useState('');
  const [reportComplaint, setReportComplaint] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportStatusMessage, setReportStatusMessage] = useState('');

  // ── Agent Context ──────────────────────────────────────────────────────
  const {
    negotiationPhase,
    negotiatingJobId,
    negotiationResult,
    startNegotiation,
    clearNegotiation,
    verificationPhase,
    verificationResult,
    runEmployerVerification,
    submitEmployerReport,
    clearVerification,
    marketPulse,
    marketPulseLoading,
    fetchMarketPulse,
    voiceLoading,
    voiceResponse,
    clearVoiceResponse,
    sendVoiceMessage,
    weatherLoading,
    weatherData,
    fetchWeather,
  } = useAgent();

  // Map context phase → legacy status expected by guardian UI
  const verificationStatus = verificationPhase;

  // Map context phase → negotiation step number for existing job-card UI
  const negotiationStep =
    negotiationPhase === 'vetting' ? 1
    : negotiationPhase === 'analysing' ? 2
    : negotiationPhase === 'complete' ? 3
    : 0;
  const negotiatedRate = negotiationResult?.negotiated_rate ?? 0;

  // Fetch market pulse when economic tab opens
  useEffect(() => {
    if (activeTab === 'economic' && !marketPulse && !marketPulseLoading) {
      fetchMarketPulse(userSkill, userCity);
    }
  }, [activeTab, userSkill, userCity]);

  // Fetch weather on mount and when city or skill updates to power the dynamic banner
  useEffect(() => {
    fetchWeather(userCity, userSkill);
  }, [userCity, userSkill, fetchWeather]);

  // Match skill/search command in voice query
  const matchSkillCommand = (text: string) => {
    const normalized = text.toLowerCase();
    
    // English search keywords
    const skillsEn = {
      painter: ['paint', 'color', 'rang', 'decorator'],
      electrician: ['electric', 'wire', 'bijli', 'power', 'breaker', 'panel'],
      plumber: ['plumb', 'pipe', 'water', 'gutter', 'leak', 'fitting'],
      carpenter: ['carpenter', 'wood', 'door', 'furniture', 'lakri', 'timber'],
      mason: ['mason', 'brick', 'wall', 'build', 'mistri', 'cement', 'concrete']
    };

    // Urdu search keywords
    const skillsUr = {
      painter: ['رنگ', 'پینٹ', 'رنگ سازی', 'سفیدی'],
      electrician: ['بجلی', 'تار', 'بورڈ', 'بریکر', 'الیکٹریشن'],
      plumber: ['نل', 'پائپ', 'پلمبر', 'پانی', 'لیک'],
      carpenter: ['لکڑی', 'دروازہ', 'فرنیچر', 'بڑھئی'],
      mason: ['مستری', 'تعمیر', 'اینٹ', 'سیمنٹ']
    };

    for (const [skill, keywords] of Object.entries(skillsEn)) {
      if (keywords.some(keyword => normalized.includes(keyword))) {
        return skill as any;
      }
    }
    for (const [skill, keywords] of Object.entries(skillsUr)) {
      if (keywords.some(keyword => normalized.includes(keyword))) {
        return skill as any;
      }
    }
    return null;
  };

  // Speak out the reply when it arrives from backend
  useEffect(() => {
    if (voiceResponse?.reply) {
      VoiceAssistantManager.speak(voiceResponse.reply, language);
    }
  }, [voiceResponse, language]);

  // Set up native speech recognizer events
  useEffect(() => {
    if (!VoiceAssistantManager.isSupported()) return;

    VoiceAssistantManager.registerListeners({
      onSpeechStart: () => {
        setIsListening(true);
      },
      onSpeechEnd: () => {
        setIsListening(false);
      },
      onSpeechResults: (result) => {
        setIsListening(false);
        const transcript = result.transcript;
        if (!transcript) return;

        setVoiceInputTranscript(transcript);
        
        // Let user see the text for 1.2 seconds before doing action
        setTimeout(async () => {
          // Check for "find [skill]" command
          const matchedSkill = matchSkillCommand(transcript);
          if (matchedSkill) {
            setUserSkill(matchedSkill);
            setVoiceModalVisible(false);
            
            const speakText = language === 'ur'
              ? `${t.skillsMap[matchedSkill]} کے کام تلاش کیے جا رہے ہیں۔`
              : `Finding ${matchedSkill} jobs for you.`;
              
            VoiceAssistantManager.speak(speakText, language);
          } else {
            // Standard query to AI Manager
            await handleSendVoiceQuery(transcript);
          }
        }, 1200);
      },
      onSpeechError: (err) => {
        setIsListening(false);
        console.warn('Speech recognizer error:', err.error);
        setVoiceInputTranscript(
          language === 'ur' ? 'معذرت، صوتی شناخت ناکام رہی۔' : `Error: ${err.error}`
        );
      }
    });

    return () => {
      VoiceAssistantManager.unregisterListeners();
    };
  }, [language, userSkill, userCity]);

  // Voice tap handler — opens the Voice AI Center modal
  const handleVoiceTap = () => {
    VoiceAssistantManager.stopSpeaking();
    setVoiceModalVisible(true);
    setVoiceInputTranscript('');
    setCustomVoicePrompt('');
  };

  // Auto-send voice query — closes modal and fires AI call
  const handleSendVoiceQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;
    setVoiceModalVisible(false);
    setVoiceInputTranscript('');
    setCustomVoicePrompt('');
    setIsListening(false);
    await sendVoiceMessage(text, userSkill, userCity);
  };

  // STEP 1: User taps mic → records natively using Android Speech Engine
  const startVoiceRecording = async () => {
    VoiceAssistantManager.stopSpeaking();
    const hasPermission = await VoiceAssistantManager.requestMicrophonePermission();
    if (!hasPermission) {
      alert(language === 'ur' ? 'مائیکروفون کی اجازت نہیں ملی۔' : 'Microphone permission denied.');
      return;
    }
    setVoiceInputTranscript(language === 'ur' ? '🎙️ سن رہا ہے...' : '🎙️ Listening...');
    VoiceAssistantManager.startListening(language);
  };

  // Employer check — uses context
  const runEmployerCheck = (phone: string) => {
    clearVerification();
    runEmployerVerification(phone);
  };

  const handleReportSubmit = async () => {
    const phone = reportPhone.trim();
    const name = reportName.trim() || 'Employer';
    const complaint = reportComplaint.trim();

    if (!phone || !complaint) {
      setReportStatusMessage(
        language === 'ur'
          ? 'برائے مہربانی فون نمبر اور شکایت درج کریں۔'
          : 'Please enter both phone number and complaint description.'
      );
      return;
    }

    setIsReporting(true);
    setReportStatusMessage('');

    try {
      const res = await submitEmployerReport(phone, name, complaint);
      if (res) {
        setReportStatusMessage(
          language === 'ur'
            ? `شکایت درج ہو گئی! آجر کا نیا ٹرسٹ سکور: ${res.new_trust_score}%`
            : `Reported! Employer's updated Trust Score is ${res.new_trust_score}%.`
        );
        setReportPhone('');
        setReportName('');
        setReportComplaint('');
      } else {
        setReportStatusMessage(
          language === 'ur' ? 'شکایت جمع کرنے میں خرابی پیش آئی۔' : 'Failed to submit report. Please try again.'
        );
      }
    } catch (e) {
      setReportStatusMessage(
        language === 'ur' ? 'شکایت جمع کرنے میں خرابی پیش آئی۔' : 'Failed to submit report.'
      );
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        {/* User profile toggle button to ID card */}
        <TouchableOpacity
          style={styles.workerProfile}
          onPress={() => setCurrentScreen('id_card')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{(userName || 'S')[0].toUpperCase()}</Text>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.workerName}>{userName || 'Sajid Masih'}</Text>
            <View style={styles.verifiedBadgeRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.verifiedLabel}>{t.verifiedWorker}</Text>
                <PakistanFlagIcon size={12} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Financial Escrow Balance Monitor */}
        <View style={styles.escrowStatusHeader}>
          <Text style={styles.escrowLabel}>{t.walletLabel}</Text>
          <Text style={styles.escrowAmount}>Rs. {walletBalance}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
            <VerifiedBadgeIcon color="#10B981" size={12} />
            <Text style={styles.escrowSubText}>{t.walletSub}</Text>
          </View>
        </View>
      </View>

      {/* CLIMATE & DEMAND SHIFT WARNING BANNER */}
      <View style={styles.weatherTickerCard}>
        <View style={styles.weatherTickerHeader}>
          <StormCloudIcon color="#00D2FF" size={18} />
          <Text style={styles.weatherTitleText}>
            {weatherData 
              ? `${weatherData.condition_emoji} ${weatherData.city} ${language === 'ur' ? 'موسم اور کام کا مشورہ' : 'Weather & Work Advice'}`
              : t.weatherTitle}
          </Text>
        </View>
        <Text style={styles.weatherDetailText}>
          {weatherLoading
            ? (language === 'ur' ? 'تازہ ترین موسمی معلومات حاصل کی جا رہی ہیں...' : 'Fetching latest weather intelligence...')
            : weatherData
            ? weatherData.work_advice
            : t.weatherDetail}
        </Text>
      </View>

      {/* THREE INTERACTIVE TABS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'scout' && [styles.activeTabButton, { borderBottomColor: '#10B981', borderBottomWidth: 2 }],
          ]}
          onPress={() => setActiveTab('scout')}
        >
          <BriefcaseIcon color={activeTab === 'scout' ? '#10B981' : '#94A3B8'} size={18} />
          <Text style={[styles.tabButtonText, activeTab === 'scout' && styles.activeTabButtonText]}>
            {t.scoutTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'guardian' && [styles.activeTabButton, { borderBottomColor: '#00D2FF', borderBottomWidth: 2 }],
          ]}
          onPress={() => setActiveTab('guardian')}
        >
          <ShieldIcon color={activeTab === 'guardian' ? '#00D2FF' : '#94A3B8'} size={18} />
          <Text style={[styles.tabButtonText, activeTab === 'guardian' && styles.activeTabButtonText]}>
            {t.guardianTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'economic' && [styles.activeTabButton, { borderBottomColor: '#FFB800', borderBottomWidth: 2 }],
          ]}
          onPress={() => setActiveTab('economic')}
        >
          <ChartIcon color={activeTab === 'economic' ? '#FFB800' : '#94A3B8'} size={18} />
          <Text style={[styles.tabButtonText, activeTab === 'economic' && styles.activeTabButtonText]}>
            {t.economicTab}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE MAIN TABS */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* TAB CONTENT: JOB SCOUT */}
        {activeTab === 'scout' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <BriefcaseIcon color="#10B981" size={18} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                {language === 'ur' ? 'قریبی کام کے مواقع (لائیو فیڈ)' : 'Live Job Signals Near You'}
              </Text>
            </View>

            {currentJobs.map(job => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                onPress={() => {
                  setSelectedJob(job);
                  setCurrentScreen('job_detail');
                }}
                activeOpacity={0.9}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobBadge}>
                    <Text style={styles.jobBadgeText}>{job.badge}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <StarIcon color="#FFB800" size={12} />
                    <Text style={styles.matchScore}>{job.confidence} Match</Text>
                  </View>
                </View>

                <Text style={styles.jobTitle}>{job.title}</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <BriefcaseIcon color="#94A3B8" size={12} />
                  <Text style={[styles.jobEmployer, { marginBottom: 0 }]}>{job.employer}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <MapPinIcon color="#64748B" size={12} />
                  <Text style={[styles.jobDetails, { marginBottom: 0 }]}>{job.details} • {job.distance}</Text>
                </View>

                {/* Rates & Negotiation Area */}
                <View style={styles.rateContainer}>
                  <View>
                    <Text style={styles.rateLabel}>{language === 'ur' ? 'پہلی پیشکش' : 'Initial Rate'}</Text>
                    <Text style={[styles.rateValue, negotiatingJobId === job.id && styles.strikeRate]}>
                      Rs. {job.rate}
                    </Text>
                  </View>

                  {negotiatingJobId === job.id && (
                    <View style={styles.negotiationResult}>
                      <Text style={styles.rateLabel}>{language === 'ur' ? 'حتمی محفوظ ریٹ' : 'Final AI Rate'}</Text>
                      <Text style={styles.finalRateText}>Rs. {negotiatedRate}</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  {negotiatingJobId !== job.id ? (
                    <TouchableOpacity
                      style={styles.negotiateButton}
                      onPress={() => startNegotiation(job.id, job.rate)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <AudioIcon color="#FFFFFF" size={12} />
                        <Text style={styles.actionButtonText}>{t.negotiateBtn}</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.negotiationStatus}>
                      {negotiationStep === 1 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <AudioIcon color="#10B981" size={12} />
                          <Text style={styles.negotiationStatusText}>{t.negotiating}</Text>
                        </View>
                      )}
                      {negotiationStep === 2 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <SearchIcon color="#00D2FF" size={12} />
                          <Text style={styles.negotiationStatusText}>
                            {language === 'ur' ? 'AI تجزیہ کر رہی ہے...' : 'AI analysing...'}
                          </Text>
                        </View>
                      )}
                      {negotiationStep === 3 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <VerifiedBadgeIcon color="#10B981" size={12} />
                          <Text style={styles.negotiationStatusText}>{t.negotiationDone}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      negotiatingJobId === job.id && negotiationStep < 3 && styles.disabledButton,
                    ]}
                    disabled={negotiatingJobId === job.id && negotiationStep < 3}
                    onPress={() => {
                      const earned = negotiatingJobId === job.id ? negotiatedRate : job.rate;
                      setWalletBalance(prev => prev + earned);
                      setSelectedJob(job);
                      setCurrentScreen('job_detail');
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <BriefcaseIcon color="#FFFFFF" size={12} />
                      <Text style={styles.actionButtonText}>{t.acceptBtn}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB CONTENT: TRUST & SAFETY GUARDIAN */}
        {activeTab === 'guardian' && (
          <View style={styles.tabContentBlock}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <ShieldIcon color="#00D2FF" size={18} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                {language === 'ur' ? 'تحفظ اور تصدیقی مرکز' : 'Safety & Verification Center'}
              </Text>
            </View>

            {/* Smart Employer Verification */}
            <View style={styles.safetyCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <SearchIcon color="#00D2FF" size={16} />
                <Text style={[styles.safetyCardTitle, { marginBottom: 0 }]}>{t.verifyEmployerTitle}</Text>
              </View>
              <Text style={styles.safetyCardSub}>{t.verifyEmployerSub}</Text>

              <TextInput
                style={styles.safetyInput}
                placeholder={language === 'ur' ? 'نمبر یا ٹھیکیدار کا نام لکھیں' : 'Enter phone number or contractor name'}
                placeholderTextColor="#475569"
                value={searchPhone}
                onChangeText={(text) => {
                  setSearchPhone(text);
                  if (verificationStatus !== 'idle') clearVerification();
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {verificationStatus === 'idle' && (
                <TouchableOpacity
                  style={[styles.verifyBtn, !searchPhone.trim() && { opacity: 0.5 }]}
                  onPress={() => {
                    if (searchPhone.trim()) runEmployerCheck(searchPhone.trim());
                  }}
                  disabled={!searchPhone.trim()}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <ShieldIcon color="#00D2FF" size={14} />
                    <Text style={styles.verifyBtnText}>{t.verifyBtn}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {verificationStatus === 'scanning' && (
                <View style={styles.loaderBanner}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <SearchIcon color="#00D2FF" size={14} />
                    <Text style={styles.loaderText}>{t.scanAlert}</Text>
                  </View>
                </View>
              )}

              {verificationStatus === 'safe' && (
                <View>
                  <View style={[styles.statusNotification, styles.statusSuccess]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <VerifiedBadgeIcon color="#10B981" size={14} />
                      <Text style={styles.statusNotifTitle}>
                        {language === 'ur' ? '✅ تصدیق شدہ ٹھیکیدار' : '✅ VERIFIED CONTRACTOR'}
                      </Text>
                    </View>
                    <Text style={styles.statusNotifSub}>
                      {language === 'ur'
                        ? `ٹرسٹ سکور: ${verificationResult?.trust_score ?? 97.8}% • کوئی شکایت نہیں`
                        : `Trust Score: ${verificationResult?.trust_score ?? 97.8}% • Zero active complaints`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => { clearVerification(); setSearchPhone(''); }}
                    style={{ marginTop: 8, alignSelf: 'center' }}
                  >
                    <Text style={{ color: '#64748B', fontSize: 12 }}>
                      {language === 'ur' ? '← دوبارہ تلاش کریں' : '← Search another'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {verificationStatus === 'scam' && (
                <View>
                  <View style={[styles.statusNotification, styles.statusDanger]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <ShieldIcon color="#EF4444" size={14} />
                      <Text style={styles.statusNotifTitle}>⚠ SCAM WARNING</Text>
                    </View>
                    <Text style={[styles.statusNotifSub, { marginBottom: 4 }]}>
                      {verificationResult?.warnings ??
                        'Employer has active complaints of unpaid wages! Do not take verbal work.'}
                    </Text>
                    <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: 'bold' }}>
                      {language === 'ur'
                        ? `رپورٹس: ${verificationResult?.reports_count ?? 3} • ٹرسٹ سکور: ${verificationResult?.trust_score ?? 14.5}%`
                        : `Reports: ${verificationResult?.reports_count ?? 3} • Trust Score: ${verificationResult?.trust_score ?? 14.5}%`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => { clearVerification(); setSearchPhone(''); }}
                    style={{ marginTop: 8, alignSelf: 'center' }}
                  >
                    <Text style={{ color: '#64748B', fontSize: 12 }}>
                      {language === 'ur' ? '← دوبارہ تلاش کریں' : '← Search another'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Local Security Alerts Radar */}
            <View style={styles.safetyCardRadar}>
              <Text style={styles.radarTitle}>{t.scamTitle}</Text>
              <View style={styles.radarAlertRow}>
                <MapPinIcon color="#EF4444" size={20} />
                <Text style={styles.radarAlertText}>{t.scamNotice}</Text>
              </View>
            </View>

            {/* Report a Bad Employer Form */}
            <View style={[styles.safetyCard, { marginTop: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <ShieldIcon color="#EF4444" size={16} />
                <Text style={[styles.safetyCardTitle, { marginBottom: 0, color: '#EF4444' }]}>
                  {language === 'ur' ? 'غیر محفوظ ٹھیکیدار کی رپورٹ کریں' : 'Report Fraudulent Employer'}
                </Text>
              </View>
              <Text style={styles.safetyCardSub}>
                {language === 'ur'
                  ? 'دیگر مزدور بھائیوں کو فراڈ سے بچانے کے لیے کسی بھی ایسے ٹھیکیدار کی رپورٹ درج کریں جس نے مزدوری نہ دی ہو۔'
                  : 'Help other daily wage workers avoid scams by reporting contractors who delayed or refused wages.'}
              </Text>

              <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4, marginTop: 10 }}>
                {language === 'ur' ? 'ٹھیکیدار کا فون نمبر *' : 'Contractor Phone Number *'}
              </Text>
              <TextInput
                style={styles.safetyInput}
                placeholder="03xxxxxxxxx"
                placeholderTextColor="#475569"
                keyboardType="phone-pad"
                value={reportPhone}
                onChangeText={setReportPhone}
              />

              <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4, marginTop: 10 }}>
                {language === 'ur' ? 'ٹھیکیدار کا نام (اختیاری)' : 'Contractor Name (Optional)'}
              </Text>
              <TextInput
                style={styles.safetyInput}
                placeholder={language === 'ur' ? 'نام درج کریں' : 'Enter contractor name'}
                placeholderTextColor="#475569"
                value={reportName}
                onChangeText={setReportName}
              />

              <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4, marginTop: 10 }}>
                {language === 'ur' ? 'شکایت کی تفصیل *' : 'Complaint Details *'}
              </Text>
              <TextInput
                style={[styles.safetyInput, { height: 60, textAlignVertical: 'top' }]}
                placeholder={language === 'ur' ? 'جیسے: پیسے نہیں دیے، بدتمیزی کی' : 'e.g., Did not pay wages, delayed for 2 weeks'}
                placeholderTextColor="#475569"
                multiline
                numberOfLines={3}
                value={reportComplaint}
                onChangeText={setReportComplaint}
              />

              {reportStatusMessage ? (
                <Text style={{
                  color: reportStatusMessage.includes('شکایت درج') || reportStatusMessage.includes('Reported!') ? '#10B981' : '#EF4444',
                  fontSize: 12,
                  marginVertical: 10,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {reportStatusMessage}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.verifyBtn, { backgroundColor: '#EF444415', borderColor: '#EF4444', marginTop: 8 }]}
                onPress={handleReportSubmit}
                disabled={isReporting}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  <ShieldIcon color="#EF4444" size={14} />
                  <Text style={[styles.verifyBtnText, { color: '#EF4444' }]}>
                    {isReporting
                      ? (language === 'ur' ? 'رپورٹ جمع ہو رہی ہے...' : 'Submitting Report...')
                      : (language === 'ur' ? 'رپورٹ درج کریں' : 'Submit Scam Report')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB CONTENT: ECONOMIC ENGINE & WEATHER DYNAMICS */}
        {activeTab === 'economic' && (
          <View style={styles.tabContentBlock}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <ChartIcon color="#FFB800" size={18} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                {language === 'ur' ? 'ہنر مندی اور روزگار ترقی' : 'Skill Development & Growth'}
              </Text>
            </View>
            {/* ── Weather Card ── */}
            {weatherLoading && (
              <View style={styles.economicClassCard}>
                <Text style={styles.classTitle}>
                  {language === 'ur' ? 'موسم کا ڈیٹا لوڈ ہو رہا ہے...' : 'Loading weather...'}
                </Text>
              </View>
            )}
            {weatherData && !weatherLoading && (
              <View style={styles.economicClassCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 24 }}>{weatherData.condition_emoji}</Text>
                    <Text style={styles.classTitle}>{weatherData.city}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => fetchWeather(userCity, userSkill)}
                    style={{
                      backgroundColor: '#FFB80015',
                      borderWidth: 1,
                      borderColor: '#FFB800',
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: '#FFB800', fontSize: 10, fontWeight: 'bold' }}>
                      {language === 'ur' ? 'موسم تازہ کریں' : 'Refresh Weather'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.classDuration}>
                  {weatherData.temperature}°C ({language === 'ur' ? 'محسوس درجہ حرارت' : 'feels like'} {weatherData.apparent_temperature}°C)
                </Text>
                <Text style={[styles.squadDescText, { marginTop: 6, color: '#F1F5F9' }]}>
                  {weatherData.work_advice}
                </Text>
              </View>
            )}
            {marketPulseLoading && (
              <View style={[styles.economicClassCard, { alignItems: 'center', paddingVertical: 20 }]}>
                <SearchIcon color="#FFB800" size={20} />
                <Text style={[styles.classDuration, { marginTop: 8 }]}>
                  {language === 'ur' ? 'AI مارکیٹ ڈیٹا لوڈ ہو رہا ہے...' : 'Loading AI market data...'}
                </Text>
              </View>
            )}

            {marketPulse && !marketPulseLoading && (
              <View style={styles.economicClassCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={styles.classTitle}>
                    {language === 'ur' ? 'مارکیٹ ڈیمانڈ انڈیکس' : 'Live Market Pulse'}
                  </Text>
                  <View style={{
                    backgroundColor: marketPulse.demand_level === 'high' ? '#10B98120' : marketPulse.demand_level === 'medium' ? '#FFB80020' : '#EF444420',
                    borderWidth: 1,
                    borderColor: marketPulse.demand_level === 'high' ? '#10B981' : marketPulse.demand_level === 'medium' ? '#FFB800' : '#EF4444',
                    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
                  }}>
                    <Text style={{ color: marketPulse.demand_level === 'high' ? '#10B981' : marketPulse.demand_level === 'medium' ? '#FFB800' : '#EF4444', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {marketPulse.demand_level} demand
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View>
                    <Text style={styles.classDuration}>Demand Score</Text>
                    <Text style={[styles.classSubTitle, { color: '#10B981', fontSize: 22 }]}>{marketPulse.demand_score}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.classDuration}>Avg Daily Rate</Text>
                    <Text style={[styles.classSubTitle, { color: '#FFB800', fontSize: 18 }]}>Rs. {marketPulse.avg_daily_rate}</Text>
                  </View>
                </View>
                <Text style={[styles.squadDescText, { marginBottom: 8 }]}>{marketPulse.insight}</Text>
                <View style={{ backgroundColor: '#FFB80010', borderWidth: 1, borderColor: '#FFB80030', borderRadius: 10, padding: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <ChartIcon color="#FFB800" size={12} />
                    <Text style={{ color: '#FFB800', fontSize: 10, fontWeight: 'bold' }}>UPSKILL TIP</Text>
                  </View>
                  <Text style={[styles.squadDescText, { marginTop: 4 }]}>{marketPulse.upskill_tip}</Text>
                </View>
              </View>
            )}

            {/* Labor Squad Builder */}
            <View style={styles.economicClassCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <PeopleIcon color="#FFB800" size={16} />
                <Text style={[styles.classTitle, { marginBottom: 0 }]}>{t.squadTitle}</Text>
              </View>
              <Text style={styles.squadDescText}>{t.squadDetail}</Text>
              <TouchableOpacity style={styles.startClassBtn} onPress={() => fetchMarketPulse(userSkill, userCity)}>
                <Text style={styles.startClassText}>
                  {marketPulseLoading
                    ? (language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Refreshing...')
                    : (language === 'ur' ? 'مارکیٹ ڈیٹا ریفریش کریں' : 'Refresh Market Data')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* FLOAT VOICE ASSISTANT BOTTOM FOOTER */}
      <View style={styles.voiceAssistantFooter}>
        <View style={styles.pulseArea}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: glowAnim }],
                opacity: isListening ? 0.3 : 0.05,
              },
            ]}
          />
          <TouchableOpacity
            style={[styles.micBtn, isListening && styles.micBtnActive]}
            onPress={handleVoiceTap}
            activeOpacity={0.8}
          >
            <MicroIcon color="#FFFFFF" size={28} />
          </TouchableOpacity>
        </View>

        <Text style={styles.micPromptText}>
          {isListening
            ? (language === 'ur' ? 'سن رہی ہوں...' : 'Listening...')
            : voiceLoading
            ? (language === 'ur' ? 'AI جواب تیار کر رہی ہے...' : 'AI thinking...')
            : (language === 'ur' ? 'مدد کے لیے مائیک دبائیں' : 'Tap mic to talk to AI Manager')}
        </Text>
      </View>

      {/* ── Voice AI Center Input Modal ────────────────────────────── */}
      <Modal
        visible={voiceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => { setVoiceModalVisible(false); setIsListening(false); }}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}
          activeOpacity={1}
          onPress={() => { if (!isListening) { setVoiceModalVisible(false); } }}
        >
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#0E1520',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderWidth: 1.5,
              borderColor: '#10B981',
              padding: 24,
              paddingBottom: 40,
            }}>

              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#10B98120', borderWidth: 2, borderColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}>
                  <MicroIcon color="#10B981" size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>
                    {language === 'ur' ? 'AI صوتی مدد گار' : 'AI Voice Manager'}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>
                    {isListening
                      ? (language === 'ur' ? '⏺ سن رہا ہے — خاموش رہیں' : '⏺ Recording — stay still')
                      : voiceInputTranscript && !isListening
                      ? (language === 'ur' ? '✅ پیغام AI کو بھیجا جا رہا ہے...' : '✅ Sending to AI...')
                      : (language === 'ur' ? 'مائیک دبائیں یا سوال لکھیں' : 'Tap mic or type a question')}
                  </Text>
                </View>
              </View>

              {/* BIG Central Mic Button */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <TouchableOpacity
                  style={{
                    width: 90, height: 90, borderRadius: 45,
                    backgroundColor: isListening ? '#10B981' : '#10B98118',
                    borderWidth: 3,
                    borderColor: isListening ? '#10B981' : '#10B98160',
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: '#10B981',
                    shadowOpacity: isListening ? 0.6 : 0.1,
                    shadowRadius: isListening ? 20 : 6,
                    elevation: isListening ? 10 : 2,
                  }}
                  onPress={startVoiceRecording}
                  disabled={isListening}
                  activeOpacity={0.8}
                >
                  <MicroIcon color={isListening ? '#090D14' : '#10B981'} size={40} />
                </TouchableOpacity>

                <Text style={{
                  color: isListening ? '#10B981' : '#475569',
                  fontSize: 13,
                  marginTop: 12,
                  fontWeight: isListening ? 'bold' : 'normal',
                  letterSpacing: isListening ? 1 : 0,
                }}>
                  {isListening
                    ? (language === 'ur' ? '🔴 ریکارڈ ہو رہا ہے...' : '🔴 Recording 2.5s...')
                    : (language === 'ur' ? 'ٹیپ کریں اور بولیں' : 'Tap & Speak')}
                </Text>
              </View>

              {/* Transcript preview box */}
              {voiceInputTranscript !== '' && (
                <View style={{
                  backgroundColor: '#10B98110', borderWidth: 1, borderColor: '#10B98140',
                  borderRadius: 14, padding: 14, marginBottom: 16,
                }}>
                  <Text style={{ color: '#10B981', fontSize: 9, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {language === 'ur' ? 'آپ نے کہا:' : 'YOU SAID:'}
                  </Text>
                  <Text style={{ color: '#F1F5F9', fontSize: 14, lineHeight: 22 }}>
                    {voiceInputTranscript}
                  </Text>
                </View>
              )}

              {/* Divider */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#1E2D40' }} />
                <Text style={{ color: '#475569', fontSize: 11 }}>
                  {language === 'ur' ? 'یا خود لکھیں' : 'or type below'}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#1E2D40' }} />
              </View>

              {/* Manual Text Input */}
              <TextInput
                style={{
                  backgroundColor: '#131926', borderWidth: 1,
                  borderColor: customVoicePrompt ? '#10B98160' : '#232E42',
                  borderRadius: 14, padding: 14, color: '#F1F5F9',
                  fontSize: 14, marginBottom: 12, minHeight: 52,
                }}
                placeholder={language === 'ur' ? 'مثلاً: آج مجھے کیا کام ملے گا؟' : 'e.g. What jobs are available for me today?'}
                placeholderTextColor="#334155"
                value={customVoicePrompt}
                onChangeText={setCustomVoicePrompt}
                multiline
                editable={!isListening}
              />

              {/* Quick Chip Suggestions — tap = instant send */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {[
                  language === 'ur' ? `آج ${userCity} میں کام کیا ہے؟` : `Jobs for ${userSkill} in ${userCity}?`,
                  language === 'ur' ? 'محفوظ یومیہ ریٹ کیا ہے؟' : 'Safe daily rate for me?',
                  language === 'ur' ? 'کوئی سکام الرٹ ہے؟' : 'Any scam alerts today?',
                  language === 'ur' ? 'مہارت کیسے بڑھائیں؟' : 'How to upskill fast?',
                ].map((chip, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      backgroundColor: '#10B98112', borderWidth: 1,
                      borderColor: '#10B98135', borderRadius: 20,
                      paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
                    }}
                    onPress={() => handleSendVoiceQuery(chip)}
                    disabled={isListening}
                  >
                    <Text style={{ color: '#10B981', fontSize: 12 }}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Send Button */}
              <TouchableOpacity
                onPress={() => handleSendVoiceQuery(customVoicePrompt)}
                disabled={!customVoicePrompt.trim() || isListening}
                style={{
                  backgroundColor: customVoicePrompt.trim() && !isListening ? '#10B981' : '#10B98130',
                  borderRadius: 16, paddingVertical: 15, alignItems: 'center',
                }}
              >
                <Text style={{ color: '#090D14', fontWeight: 'bold', fontSize: 15 }}>
                  {language === 'ur' ? '🤖 AI سے پوچھیں' : '🤖 Ask AI Manager'}
                </Text>
              </TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* ── AI Voice Response Modal ────────────────────────────────── */}
      <Modal
        visible={!!voiceResponse}
        transparent
        animationType="slide"
        onRequestClose={() => {
          VoiceAssistantManager.stopSpeaking();
          clearVoiceResponse();
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}
          activeOpacity={1}
          onPress={() => {
            VoiceAssistantManager.stopSpeaking();
            clearVoiceResponse();
          }}
        >
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#131926',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 1,
              borderColor: '#232E42',
              padding: 24,
              paddingBottom: 36,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#10B98120', borderWidth: 1.5, borderColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}>
                  <MicroIcon color="#10B981" size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#10B981', fontSize: 13, fontWeight: 'bold' }}>
                    {voiceResponse?.agent ?? 'AI Manager'}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 10 }}>
                    Gemini 2.5 Flash • Agentic Orchestrator
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#F1F5F9', fontSize: 15, lineHeight: 24, marginBottom: 20 }}>
                {voiceResponse?.reply}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  VoiceAssistantManager.stopSpeaking();
                  clearVoiceResponse();
                }}
                style={{ backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#090D14', fontWeight: 'bold', fontSize: 14 }}>
                  {language === 'ur' ? 'ٹھیک ہے' : 'Got it'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* ── Negotiation Result Modal ───────────────────────────────── */}
      <Modal
        visible={negotiationPhase === 'complete' && !!negotiationResult}
        transparent
        animationType="slide"
        onRequestClose={clearNegotiation}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}
          activeOpacity={1}
          onPress={clearNegotiation}
        >
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#131926',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 1,
              borderColor: '#10B981',
              padding: 24,
              paddingBottom: 36,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <VerifiedBadgeIcon color="#10B981" size={20} />
                <Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>
                  {language === 'ur' ? 'مذاکرات کامیاب!' : 'Negotiation Successful!'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View>
                  <Text style={{ color: '#64748B', fontSize: 10, fontWeight: 'bold' }}>BASE RATE</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 18, fontWeight: 'bold', textDecorationLine: 'line-through' }}>Rs. {negotiationResult?.base_rate}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#64748B', fontSize: 10, fontWeight: 'bold' }}>AI RATE</Text>
                  <Text style={{ color: '#10B981', fontSize: 24, fontWeight: '900' }}>Rs. {negotiationResult?.negotiated_rate}</Text>
                </View>
              </View>
              <Text style={{ color: '#CBD5E1', fontSize: 13, lineHeight: 20, marginBottom: 20 }}>
                {negotiationResult?.message}
              </Text>
              <TouchableOpacity
                onPress={clearNegotiation}
                style={{ backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#090D14', fontWeight: 'bold', fontSize: 14 }}>
                  {language === 'ur' ? 'ریٹ قبول کریں' : 'Accept Rate'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D14',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#131926',
    backgroundColor: '#090D14',
    marginTop: 10,
  },
  workerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#10B98115',
    borderWidth: 1.5,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#090D14',
  },
  profileText: {
    marginLeft: 10,
  },
  workerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  verifiedLabel: {
    color: '#00D2FF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  escrowStatusHeader: {
    alignItems: 'flex-end',
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  escrowLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  escrowAmount: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 1,
  },
  escrowSubText: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 1,
  },
  weatherTickerCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
  },
  weatherTickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  weatherTitleText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  weatherDetailText: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#131926',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#090D14',
    borderWidth: 0.5,
    borderColor: '#232E42',
  },
  tabButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 14,
    marginTop: 4,
  },
  jobCard: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobBadge: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  jobBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchScore: {
    color: '#FFB800',
    fontSize: 11,
    fontWeight: 'bold',
  },
  jobTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobEmployer: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  jobDetails: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 12,
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#090D14',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  rateLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: 'bold',
  },
  rateValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  strikeRate: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  negotiationResult: {
    alignItems: 'flex-end',
  },
  finalRateText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  negotiateButton: {
    flex: 1,
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  negotiationStatus: {
    flex: 1,
    backgroundColor: '#10B98110',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  negotiationStatusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#1E293B',
  },
  tabContentBlock: {
    paddingTop: 4,
  },
  safetyCard: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  safetyCardTitle: {
    color: '#00D2FF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  safetyCardSub: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 14,
  },
  safetyInput: {
    backgroundColor: '#090D14',
    borderWidth: 1,
    borderColor: '#232E42',
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  verifyBtn: {
    backgroundColor: '#00D2FF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyBtnText: {
    color: '#090D14',
    fontSize: 13,
    fontWeight: 'bold',
  },
  loaderBanner: {
    backgroundColor: '#090D14',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  loaderText: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusNotification: {
    padding: 12,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusDanger: {
    backgroundColor: '#EF444415',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  statusNotifTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusNotifSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  safetyCardRadar: {
    backgroundColor: '#EF444405',
    borderWidth: 1.5,
    borderColor: '#EF444430',
    borderRadius: 16,
    padding: 16,
  },
  radarTitle: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  radarAlertRow: {
    flexDirection: 'row',
    gap: 10,
  },
  radarAlertText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  economicClassCard: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  classTitle: {
    color: '#FFB800',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  classTutorialRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  classEmoji: {
    fontSize: 24,
  },
  classSubTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  classDuration: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  startClassBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#232E42',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  startClassText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  squadDescText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  voiceAssistantFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#090D14F0',
    borderTopWidth: 1,
    borderColor: '#131926',
    alignItems: 'center',
    paddingVertical: 14,
  },
  pulseArea: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  pulseCircle: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00D2FF',
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D2FF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  micBtnActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  micPromptText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
