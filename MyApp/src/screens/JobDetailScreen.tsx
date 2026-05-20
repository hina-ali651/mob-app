import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import {
  ArrowLeftIcon,
  ShieldIcon,
  StarIcon,
  VerifiedBadgeIcon,
  MapPinIcon,
  ClockIcon,
  BoxIcon,
  PeopleIcon,
  PhoneIcon,
  SearchIcon,
} from '../components/Icons';
import { ApiClient } from '../components/Api';
import { useAgent } from '../context/AgentContext';

const { width } = Dimensions.get('window');

interface JobDetailScreenProps {
  language: 'ur' | 'en';
  setCurrentScreen: (screen: any) => void;
  selectedJob: any;
  setSelectedJob: (job: any) => void;
  negotiatingJobId: number | null;
  negotiatedRate: number;
  walletBalance: number;
  setWalletBalance: (val: number | ((prev: number) => number)) => void;
  t: any;
}

export const JobDetailScreen: React.FC<JobDetailScreenProps> = ({
  language,
  setCurrentScreen,
  selectedJob,
  setSelectedJob,
  negotiatingJobId,
  negotiatedRate,
  walletBalance,
  setWalletBalance,
  t,
}) => {
  if (!selectedJob) return null;

  const [isAccepted, setIsAccepted] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [jobPhotoUploaded, setJobPhotoUploaded] = useState(false);
  const [statusModal, setStatusModal] = useState<{visible: boolean; title: string; message: string; color: string}>(
    { visible: false, title: '', message: '', color: '#10B981' }
  );

  const showStatus = (title: string, message: string, color = '#10B981') =>
    setStatusModal({ visible: true, title, message, color });
  const hideStatus = () => setStatusModal(s => ({ ...s, visible: false }));

  const {
    submitWorkCompletion,
    escrowLoading,
    escrowResult,
    clearEscrowResult
  } = useAgent();

  return (
    <View style={styles.authWrapper}>
      <View style={styles.ambientGreenRing} />

      <ScrollView contentContainerStyle={styles.jobDetailScroll} showsVerticalScrollIndicator={false}>
        {/* Back navigation */}
        <TouchableOpacity
          style={styles.backBtnInline}
          onPress={() => {
            setCurrentScreen('dashboard');
            setSelectedJob(null);
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ArrowLeftIcon color="#94A3B8" size={14} />
            <Text style={styles.backBtnText}>{t.backBtn}</Text>
          </View>
        </TouchableOpacity>

        {/* Header Badge */}
        <View style={styles.jobDetailHeaderRow}>
          <View style={styles.jobDetailBadge}>
            <ShieldIcon color="#10B981" size={12} />
            <Text style={styles.jobDetailBadgeText}>Verified Escrow Job</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <StarIcon color="#FFB800" size={12} />
            <Text style={styles.jobDetailMatch}>{selectedJob.confidence} Match</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.jobDetailMainTitle}>{selectedJob.title}</Text>

        {/* Employer & Trust Score */}
        <View style={styles.employerRow}>
          <View style={styles.employerAvatar}>
            <Text style={styles.employerAvatarText}>{selectedJob.employer[0].toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.employerNameText}>{selectedJob.employer}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <StarIcon color="#FFB800" size={12} />
              <Text style={styles.employerStatusText}>98% Rating • Verified Contractor</Text>
            </View>
          </View>
        </View>

        {/* Rate card */}
        <View style={styles.detailRateCard}>
          <View>
            <Text style={styles.detailRateLabel}>{language === 'ur' ? 'محفوظ کردہ اجرت' : 'Guaranteed Wage'}</Text>
            <Text style={styles.detailRateValue}>
              Rs. {negotiatingJobId === selectedJob.id ? negotiatedRate : selectedJob.rate}
            </Text>
          </View>
          <View style={styles.secEscrowBadge}>
            <VerifiedBadgeIcon color="#10B981" size={12} />
            <Text style={styles.secEscrowBadgeText}>ESCROW ACTIVE</Text>
          </View>
        </View>

        {/* Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specItem}>
            <MapPinIcon color="#EF4444" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.specLabel}>Distance</Text>
              <Text style={styles.specVal}>{selectedJob.distance}</Text>
            </View>
          </View>
          <View style={styles.specItem}>
            <ClockIcon color="#00D2FF" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.specLabel}>Duration</Text>
              <Text style={styles.specVal}>Estimated 1 Day</Text>
            </View>
          </View>
          <View style={styles.specItem}>
            <BoxIcon color="#FFB800" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.specLabel}>Materials</Text>
              <Text style={styles.specVal}>{language === 'ur' ? 'ٹھیکیدار کا ہوگا' : 'Provided'}</Text>
            </View>
          </View>
          <View style={styles.specItem}>
            <PeopleIcon color="#A855F7" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.specLabel}>Crew Size</Text>
              <Text style={styles.specVal}>Single Tradesman</Text>
            </View>
          </View>
        </View>

        {/* Customer Profile Section */}
        {(selectedJob.customer_name || selectedJob.customer_phone) && (
          <>
            <Text style={styles.detailSecTitle}>{language === 'ur' ? 'کسٹمر کی معلومات' : 'Customer Profile'}</Text>
            <View style={[styles.descBlock, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }]}>
              <View>
                <Text style={{ color: '#F8FAFC', fontSize: 16, fontWeight: '700' }}>{selectedJob.customer_name || 'Customer'}</Text>
                {selectedJob.customer_phone && <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>📞 {selectedJob.customer_phone}</Text>}
                {selectedJob.customer_email && <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 2 }}>✉️ {selectedJob.customer_email}</Text>}
              </View>
              <TouchableOpacity style={{ backgroundColor: '#10B981', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 }}>
                 <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 12 }}>Call</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Job Link Section */}
        <Text style={styles.detailSecTitle}>
          {language === 'ur' ? 'ملازمت کا لنک / ماخذ' : 'Job Listing Reference'}
        </Text>
        <View style={[styles.descBlock, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }]}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: '#F8FAFC', fontSize: 14, fontWeight: '700' }}>
              {selectedJob.badge || 'Verified Job Posting'}
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }} numberOfLines={1} ellipsizeMode="tail">
              {selectedJob.link || `https://www.google.com/search?q=${encodeURIComponent(selectedJob.title)}`}
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#00D2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
            onPress={() => {
              const url = selectedJob.link || `https://www.google.com/search?q=${encodeURIComponent(selectedJob.title + ' ' + selectedJob.employer)}`;
              Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
            }}
          >
            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 12 }}>
              {language === 'ur' ? 'لنک کھولیں' : 'Open Link'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Job description section */}
        <Text style={styles.detailSecTitle}>{language === 'ur' ? 'کام کی تفصیلات' : 'Task Description'}</Text>
        <View style={styles.descBlock}>
          <Text style={styles.descText}>{selectedJob.details}</Text>
          <Text style={[styles.descText, { marginTop: 8, color: '#94A3B8' }]}>
            {language === 'ur'
              ? 'کام ختم کرنے پر تصویری ثبوت کھینچیں تاکہ اسکرو فنڈز فوری ریلیز کیے جا سکیں۔'
              : 'Please make sure to snap a high-quality picture after completion to trigger instantaneous escrow payout.'}
          </Text>
        </View>

        {/* Interactive Site Progression Timelines */}
        <Text style={styles.detailSecTitle}>
          {language === 'ur' ? 'کام کے مراحل اور تصدیق' : 'Work Progress Timeline'}
        </Text>
        <View style={styles.timelineBlock}>
          {/* Step 1 */}
          <View style={styles.timelineStepRow}>
            <View style={[styles.stepBullet, isAccepted && styles.stepBulletActive]}>
              {isAccepted ? (
                <VerifiedBadgeIcon color="#FFFFFF" size={12} />
              ) : (
                <Text style={styles.stepBulletText}>1</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.stepTitle, isAccepted && { color: '#FFFFFF' }]}>
                {language === 'ur' ? 'کام قبول کریں' : 'Accept Assignment'}
              </Text>
              <Text style={styles.stepDesc}>Wages lock securely in Escrow Wallet</Text>
            </View>
            {!isAccepted && (
              <TouchableOpacity
                style={styles.stepActionButton}
                onPress={() => {
                  setIsAccepted(true);
                  showStatus(
                    language === 'ur' ? '✅ قبول کر لیا' : '✅ Accepted',
                    language === 'ur' ? 'کام کامیابی سے قبول ہو گیا۔ اجرت اسکرو والیٹ میں محفوظ ہے۔' : 'Assignment accepted! Wages are now locked securely in escrow.',
                    '#10B981'
                  );
                }}
              >
                <Text style={styles.stepActionBtnText}>Accept</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Step 2 */}
          <View style={styles.timelineStepRow}>
            <View style={[styles.stepBullet, isCheckedIn && styles.stepBulletActive]}>
              {isCheckedIn ? (
                <VerifiedBadgeIcon color="#FFFFFF" size={12} />
              ) : (
                <Text style={styles.stepBulletText}>2</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.stepTitle, isCheckedIn && { color: '#FFFFFF' }]}>
                {language === 'ur' ? 'سائٹ پر آمد' : 'Check-in at Location'}
              </Text>
              <Text style={styles.stepDesc}>Verifies GPS address and marks start time</Text>
            </View>
            {isAccepted && !isCheckedIn && (
              <TouchableOpacity
                style={styles.stepActionButton}
                onPress={() => {
                  setIsCheckedIn(true);
                  showStatus(
                    language === 'ur' ? '📍 چیک ان کامیاب' : '📍 Checked In',
                    language === 'ur' ? 'GPS مقام تصدیق ہو گئی۔ کام کا آغاز وقت درج ہو گیا ہے۔' : 'GPS location verified! Start time recorded. You may now begin work.',
                    '#00D2FF'
                  );
                }}
              >
                <Text style={styles.stepActionBtnText}>Check In</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Step 3 */}
          <View style={styles.timelineStepRow}>
            <View style={[styles.stepBullet, jobPhotoUploaded && styles.stepBulletActive]}>
              {jobPhotoUploaded ? (
                <VerifiedBadgeIcon color="#FFFFFF" size={12} />
              ) : (
                <Text style={styles.stepBulletText}>3</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.stepTitle, jobPhotoUploaded && { color: '#FFFFFF' }]}>
                {language === 'ur' ? 'کام کی تصویری تصدیق' : 'Upload Completion Photo'}
              </Text>
              <Text style={styles.stepDesc}>AI inspects work quality and releases payments</Text>
            </View>
            {isCheckedIn && !jobPhotoUploaded && (
              <TouchableOpacity
                style={[
                  styles.stepActionButton,
                  { backgroundColor: '#00D2FF20', borderColor: '#00D2FF' },
                  escrowLoading && { opacity: 0.6 }
                ]}
                disabled={escrowLoading}
                onPress={async () => {
                  const finalRate = negotiatingJobId === selectedJob.id ? negotiatedRate : selectedJob.rate;
                  await submitWorkCompletion(selectedJob.id, selectedJob.title, finalRate, (amount) => {
                    setWalletBalance(prev => prev + amount);
                    setJobPhotoUploaded(true);
                  });
                }}
              >
                <Text style={[styles.stepActionBtnText, { color: '#00D2FF' }]}>
                  {escrowLoading ? (language === 'ur' ? 'تجزیہ...' : 'Analyzing...') : 'Snap Work'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.detailActionRow}>
          <TouchableOpacity
            style={styles.detailCallBtn}
            onPress={() => {
              const phone = selectedJob.customer_phone || '03001234567';
              showStatus(
                language === 'ur' ? '📞 کال شروع ہو رہی ہے' : '📞 Calling Employer',
                language === 'ur'
                  ? `ٹھیکیدار ${selectedJob.customer_name || 'صاحب'} سے ${phone} پر رابطہ ہو رہا ہے۔`
                  : `Dialling ${selectedJob.customer_name || 'employer'} at ${phone}...`,
                '#10B981'
              );
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <PhoneIcon color="#FFFFFF" size={14} />
              <Text style={styles.detailCallBtnText}>
                {language === 'ur' ? 'ٹھیکیدار کو کال کریں' : 'Call Employer'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.detailSubmitBtn,
              (!isAccepted || !isCheckedIn || !jobPhotoUploaded) && styles.detailSubmitBtnDisabled,
            ]}
            disabled={!isAccepted || !isCheckedIn || !jobPhotoUploaded}
            onPress={() => {
              setCurrentScreen('dashboard');
              setSelectedJob(null);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <VerifiedBadgeIcon color="#FFFFFF" size={14} />
              <Text style={styles.detailSubmitBtnText}>
                {language === 'ur' ? 'پروجیکٹ مکمل کریں' : 'Finalize Task'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Guardian AI Work Verification Success Modal ── */}
      <Modal
        visible={!!escrowResult}
        transparent
        animationType="slide"
        onRequestClose={clearEscrowResult}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}
          activeOpacity={1}
          onPress={clearEscrowResult}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#10B98120', borderWidth: 1.5, borderColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}>
                  <VerifiedBadgeIcon color="#10B981" size={18} />
                </View>
                <View>
                  <Text style={{ color: '#10B981', fontSize: 13, fontWeight: 'bold' }}>Guardian AI Escrow</Text>
                  <Text style={{ color: '#64748B', fontSize: 10 }}>Computer Vision Analysis • Success</Text>
                </View>
              </View>
              <Text style={{ color: '#F1F5F9', fontSize: 15, lineHeight: 24, marginBottom: 20 }}>
                {escrowResult?.message}
              </Text>
              <View style={{ backgroundColor: '#10B98115', borderWidth: 1, borderColor: '#10B98130', borderRadius: 12, padding: 12, marginBottom: 20 }}>
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Payout Released</Text>
                <Text style={{ color: '#10B981', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Rs. {escrowResult?.payout_released}</Text>
              </View>
              <TouchableOpacity
                onPress={clearEscrowResult}
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

      {/* ── Generic Status Modal (replaces native alert) ── */}
      <Modal
        visible={statusModal.visible}
        transparent
        animationType="fade"
        onRequestClose={hideStatus}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)', padding: 28 }}
          activeOpacity={1}
          onPress={hideStatus}
        >
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#131926',
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: statusModal.color,
              padding: 24,
              width: '100%',
            }}>
              <Text style={{ color: statusModal.color, fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                {statusModal.title}
              </Text>
              <Text style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 22, marginBottom: 20 }}>
                {statusModal.message}
              </Text>
              <TouchableOpacity
                onPress={hideStatus}
                style={{ backgroundColor: statusModal.color, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#090D14', fontWeight: 'bold', fontSize: 14 }}>
                  {language === 'ur' ? 'ٹھیک ہے' : 'OK'}
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
  authWrapper: {
    flex: 1,
    backgroundColor: '#090D14',
    paddingHorizontal: 24,
  },
  ambientGreenRing: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#10B98110',
    borderWidth: 2,
    borderColor: '#10B98105',
  },
  backBtnInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jobDetailScroll: {
    paddingVertical: 24,
    paddingTop: 10,
    paddingBottom: 60,
  },
  jobDetailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobDetailBadge: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  jobDetailBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  jobDetailMatch: {
    color: '#FFB800',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobDetailMainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 20,
  },
  employerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  employerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00D2FF20',
    borderWidth: 1.5,
    borderColor: '#00D2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  employerAvatarText: {
    color: '#00D2FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  employerNameText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  employerStatusText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  detailRateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B98110',
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  detailRateLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailRateValue: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: '950',
  },
  secEscrowBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  secEscrowBadgeText: {
    color: '#090D14',
    fontSize: 10,
    fontWeight: 'bold',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  specItem: {
    width: (width - 60) / 2,
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  specEmoji: {
    fontSize: 18,
  },
  specLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  specVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 1,
  },
  detailSecTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descBlock: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  descText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
  timelineBlock: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBulletActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepBulletText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepDesc: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1,
  },
  stepActionButton: {
    backgroundColor: '#10B98120',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepActionBtnText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCallBtn: {
    flex: 1,
    backgroundColor: '#131926',
    borderWidth: 1.5,
    borderColor: '#475569',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  detailCallBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailSubmitBtn: {
    flex: 1.2,
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  detailSubmitBtnDisabled: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0,
    elevation: 0,
  },
  detailSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
