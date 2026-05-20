import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
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
  userCity: string;
  activeTab: 'scout' | 'guardian' | 'economic';
  setActiveTab: (tab: 'scout' | 'guardian' | 'economic') => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  voiceText: string;
  setVoiceText: (txt: string) => void;
  negotiatingJobId: number | null;
  startNegotiation: (jobId: number, baseRate: number) => void;
  negotiationStep: number;
  negotiatedRate: number;
  walletBalance: number;
  setWalletBalance: (val: number | ((prev: number) => number)) => void;
  escrowActive: boolean;
  setEscrowActive: (val: boolean) => void;
  verificationStatus: 'idle' | 'scanning' | 'safe' | 'scam';
  runEmployerCheck: (phone: string) => void;
  currentJobs: any[];
  setSelectedJob: (job: any) => void;
  t: any;
  glowAnim: Animated.Value;
  handleVoiceTap: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  language,
  setCurrentScreen,
  userName,
  userSkill,
  userCity,
  activeTab,
  setActiveTab,
  isListening,
  setIsListening,
  voiceText,
  setVoiceText,
  negotiatingJobId,
  startNegotiation,
  negotiationStep,
  negotiatedRate,
  walletBalance,
  setWalletBalance,
  escrowActive,
  setEscrowActive,
  verificationStatus,
  runEmployerCheck,
  currentJobs,
  setSelectedJob,
  t,
  glowAnim,
  handleVoiceTap,
}) => {
  const verifiedSkillLabel = t.skillsMap[userSkill];
  const [searchPhone, setSearchPhone] = useState('');

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
          <Text style={styles.weatherTitleText}>{t.weatherTitle}</Text>
        </View>
        <Text style={styles.weatherDetailText}>{t.weatherDetail}</Text>
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
                          <Text style={styles.negotiationStatusText}>تجزیہ ہو رہا...</Text>
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
                      setWalletBalance(
                        prev => prev + (negotiatingJobId === job.id ? negotiatedRate : job.rate)
                      );
                      alert(
                        language === 'ur'
                          ? 'مبارک ہو! کام قبول کر لیا گیا ہے۔ فنڈز اسکرو والٹ میں جمع ہو گئے ہیں۔'
                          : 'Job Accepted! Funds are secured in escrow wallet.'
                      );
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
                placeholder="03001234567"
                placeholderTextColor="#475569"
                keyboardType="phone-pad"
                value={searchPhone}
                onChangeText={setSearchPhone}
              />

              {verificationStatus === 'idle' && (
                <TouchableOpacity style={styles.verifyBtn} onPress={() => runEmployerCheck(searchPhone || '03001234567')}>
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
                <View style={[styles.statusNotification, styles.statusSuccess]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <VerifiedBadgeIcon color="#10B981" size={14} />
                    <Text style={styles.statusNotifTitle}>VERIFIED CONTRACTOR</Text>
                  </View>
                  <Text style={styles.statusNotifSub}>
                    Trust Score: 98% • 14 successfully cleared escrows
                  </Text>
                </View>
              )}

              {verificationStatus === 'scam' && (
                <View style={[styles.statusNotification, styles.statusDanger]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <ShieldIcon color="#EF4444" size={14} />
                    <Text style={styles.statusNotifTitle}>SCAM WARNING</Text>
                  </View>
                  <Text style={styles.statusNotifSub}>
                    Employer has 3 active claims of unpaid wages! Do not take verbal work.
                  </Text>
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

            {/* Micro Upskilling Classes */}
            <View style={styles.economicClassCard}>
              <Text style={styles.classTitle}>{t.tutorialsTitle}</Text>
              <View style={styles.classTutorialRow}>
                <View style={{ marginRight: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFB80015', justifyContent: 'center', alignItems: 'center' }}>
                  <ChartIcon color="#FFB800" size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.classSubTitle}>
                    {language === 'ur' ? 'ماربل فٹنگ کی بنیادی ٹپس' : 'Marble Installation Guide'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <ClockIcon color="#64748B" size={12} />
                    <Text style={styles.classDuration}>60 Seconds • 4.9 Rating</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.startClassBtn} onPress={() => alert('Launching Lesson Video...')}>
                <Text style={styles.startClassText}>{t.skillBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* Labor Squad Builder */}
            <View style={styles.economicClassCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <PeopleIcon color="#FFB800" size={16} />
                <Text style={[styles.classTitle, { marginBottom: 0 }]}>{t.squadTitle}</Text>
              </View>
              <Text style={styles.squadDescText}>{t.squadDetail}</Text>
              <TouchableOpacity style={styles.startClassBtn} onPress={() => alert('Searching squads nearby...')}>
                <Text style={styles.startClassText}>{t.squadBtn}</Text>
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
            ? language === 'ur'
              ? 'سن رہی ہوں...'
              : 'Listening...'
            : language === 'ur'
            ? 'مدد حاصل کرنے کے لیے مائیک دبائیں'
            : 'Tap to talk to your AI Manager'}
        </Text>
      </View>
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
