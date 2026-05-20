import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import {
  ArrowLeftIcon,
  PakistanFlagIcon,
  VerifiedBadgeIcon,
  CardIcon,
  LogoutIcon,
  ShieldIcon,
} from '../components/Icons';
import { ApiClient } from '../components/Api';

const { width } = Dimensions.get('window');

interface IdCardScreenProps {
  language: 'ur' | 'en';
  setCurrentScreen: (screen: any) => void;
  userName: string;
  setUserName: (name: string) => void;
  userSkill: 'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason';
  setUserSkill: (skill: 'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason') => void;
  userCity: string;
  walletBalance: number;
  setEmail: (email: string) => void;
  t: any;
}

export const IdCardScreen: React.FC<IdCardScreenProps> = ({
  language,
  setCurrentScreen,
  userName,
  setUserName,
  userSkill,
  setUserSkill,
  userCity,
  walletBalance,
  setEmail,
  t,
}) => {
  const verifiedSkillLabel = t.skillsMap[userSkill];

  return (
    <View style={styles.authWrapper}>
      <View style={styles.ambientGreenRing} />

      <ScrollView contentContainerStyle={styles.idCardScroll} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtnInline} onPress={() => setCurrentScreen('dashboard')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ArrowLeftIcon color="#94A3B8" size={14} />
            <Text style={styles.backBtnText}>{t.backBtn}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.idScreenTitle}>{t.idCardTitle}</Text>

        {/* Holographic Security Credentials Card */}
        <View style={styles.hologramCard}>
          {/* Green Pakistani Crescent Watermark overlay */}
          <View style={styles.cardWatermarkCircle} />

          {/* Header government-seal layout */}
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.govtTitle}>GOVERNMENT OF PAKISTAN</Text>
              <Text style={styles.councilTitle}>DIGITAL LABOR COUNCIL</Text>
            </View>
            <View style={styles.flagMiniSeal}>
              <View style={{ width: 14, height: 20, backgroundColor: '#FFFFFF' }} />
              <View
                style={{
                  width: 22,
                  height: 20,
                  backgroundColor: '#0F5132',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 9, color: '#FFFFFF' }}>★</Text>
              </View>
            </View>
          </View>

          {/* Simulated Gold Chip */}
          <View style={styles.goldChip}>
            <View style={styles.chipLine} />
            <View style={styles.chipLineHorizontal} />
          </View>

          {/* Body */}
          <View style={styles.cardBody}>
            <View style={styles.cardAvatarLarge}>
              <Text style={styles.avatarLargeChar}>{(userName || 'S')[0].toUpperCase()}</Text>
              <View style={styles.avatarGoldSeal}>
                <VerifiedBadgeIcon color="#090D14" size={10} />
              </View>
            </View>

            <View style={styles.cardInfoCol}>
              <Text style={styles.infoTitle}>NAME</Text>
              <Text style={styles.infoValue}>{userName || 'Sajid Masih'}</Text>

              <Text style={[styles.infoTitle, { marginTop: 10 }]}>OCCUPATION</Text>
              <Text style={styles.infoValue}>{verifiedSkillLabel}</Text>

              <Text style={[styles.infoTitle, { marginTop: 10 }]}>LOCATION</Text>
              <Text style={styles.infoValue}>{userCity}, Pakistan</Text>
            </View>
          </View>

          {/* Card footer verification elements */}
          <View style={styles.cardFooter}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <ShieldIcon color="#10B981" size={12} />
                <Text style={styles.securitySealTag}>VERIFIED LABOR MEMBER</Text>
              </View>
              <Text style={styles.issueDateText}>ISSUED: 2026-05 • EXPIRY: 2030-05</Text>
            </View>
            {/* Mock QR Code grid */}
            <View style={styles.mockQrCode}>
              <View style={[styles.qrDot, { top: 2, left: 2 }]} />
              <View style={[styles.qrDot, { top: 2, right: 2 }]} />
              <View style={[styles.qrDot, { bottom: 2, left: 2 }]} />
              <View style={[styles.qrDot, { bottom: 2, right: 2, backgroundColor: '#10B981' }]} />
            </View>
          </View>
        </View>

        {/* Financial Action Wallet panel */}
        <View style={styles.walletDetailsBlock}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <CardIcon color="#00D2FF" size={16} />
            <Text style={[styles.walletHeaderTitle, { marginBottom: 0 }]}>{t.walletLabel}</Text>
          </View>
          <Text style={styles.walletBalanceText}>Rs. {walletBalance}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <VerifiedBadgeIcon color="#10B981" size={12} />
            <Text style={styles.walletSyncText}>{language === 'ur' ? 'ایزی پیسہ اکاؤنٹ سے منسلک ہے' : 'Connected to Easypaisa Account'}</Text>
          </View>

          <TouchableOpacity
            style={styles.withdrawBtn}
            onPress={() => {
              if (walletBalance <= 0) {
                alert(
                  language === 'ur' ? 'منتقلی کے لیے رقم ناکافی ہے۔' : 'Insufficient balance to transfer.'
                );
              } else {
                alert(
                  language === 'ur'
                    ? `کامیاب! Rs. ${walletBalance} آپ کے ایزی پیسہ اکاؤنٹ پر منتقل کر دیا گیا ہے۔`
                    : `Success! Rs. ${walletBalance} has been securely transferred to your Easypaisa/JazzCash mobile account.`
                );
              }
            }}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <CardIcon color="#FFFFFF" size={14} />
              <Text style={styles.withdrawBtnText}>Transfer Rs. {walletBalance} to Easypaisa / JazzCash</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* PROPER LOGOUT ACTION */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            // Wipe out states, hit backend logout API, and destroy local token
            await ApiClient.logout();
            setEmail('');
            setUserName('');
            setUserSkill('painter');
            setCurrentScreen('welcome');
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <LogoutIcon color="#EF4444" size={14} />
            <Text style={styles.logoutBtnText}>{t.logoutBtn}</Text>
          </View>
        </TouchableOpacity>
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
  idCardScroll: {
    paddingVertical: 24,
    paddingTop: 10,
    paddingBottom: 60,
  },
  idScreenTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 25,
  },
  hologramCard: {
    backgroundColor: '#091510',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 30,
  },
  cardWatermarkCircle: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#10B98106',
    borderStyle: 'dashed',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#10B98130',
    paddingBottom: 12,
    marginBottom: 16,
  },
  govtTitle: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  councilTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
  flagMiniSeal: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#FFFFFF20',
  },
  goldChip: {
    width: 40,
    height: 32,
    backgroundColor: '#FFB80080',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  chipLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 18,
    width: 1,
    backgroundColor: '#FFD700',
  },
  chipLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 14,
    height: 1,
    backgroundColor: '#FFD700',
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardAvatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: '#10B98115',
    borderWidth: 2,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarLargeChar: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarGoldSeal: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFB800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#091510',
  },
  cardInfoCol: {
    marginLeft: 20,
    flex: 1,
  },
  infoTitle: {
    color: '#475569',
    fontSize: 9,
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#10B98120',
    paddingTop: 12,
  },
  securitySealTag: {
    color: '#FFB800',
    fontSize: 11,
    fontWeight: 'bold',
  },
  issueDateText: {
    color: '#475569',
    fontSize: 9,
    marginTop: 2,
  },
  mockQrCode: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    position: 'relative',
  },
  qrDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#090D14',
    borderRadius: 1,
  },
  walletDetailsBlock: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  walletHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  walletBalanceText: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
  },
  walletSyncText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  withdrawBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#EF444410',
    borderWidth: 1.5,
    borderColor: '#EF444430',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
