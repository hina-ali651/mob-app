import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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
} from '../components/Icons';
import { ApiClient } from '../components/Api';

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
                  alert(language === 'ur' ? 'کام کامیابی سے قبول کر لیا گیا ہے!' : 'Assignment successfully accepted!');
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
                  alert(
                    language === 'ur'
                      ? 'چیک ان کامیاب! کام شروع کرنے کا وقت درج ہو گیا ہے۔'
                      : 'GPS location verified! Checked-in successfully.'
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
                style={[styles.stepActionButton, { backgroundColor: '#00D2FF20', borderColor: '#00D2FF' }]}
                onPress={async () => {
                  const finalRate = negotiatingJobId === selectedJob.id ? negotiatedRate : selectedJob.rate;
                  const result = await ApiClient.verifyWorkCompletion(selectedJob.id, selectedJob.title, finalRate, language);
                  
                  if (result.status === 'APPROVED') {
                    setJobPhotoUploaded(true);
                    setWalletBalance(prev => prev + result.payout_released);
                    alert(result.message);
                  } else {
                    alert(language === 'ur' ? 'تصدیق ناکام! براہ کرم واضح تصویر کھینچیں۔' : 'Verification failed! Please snap a clearer photo.');
                  }
                }}
              >
                <Text style={[styles.stepActionBtnText, { color: '#00D2FF' }]}>Snap Work</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.detailActionRow}>
          <TouchableOpacity
            style={styles.detailCallBtn}
            onPress={() =>
              alert(
                language === 'ur'
                  ? 'ٹھیکیدار کا نمبر: 03001234567 ڈائل کیا جا رہا ہے...'
                  : 'Calling employer: 03001234567...'
              )
            }
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
              alert(
                language === 'ur'
                  ? 'مبارک ہو! پروجیکٹ مکمل ہو گیا ہے۔'
                  : 'Congratulations! Assignment successfully finalized.'
              );
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
