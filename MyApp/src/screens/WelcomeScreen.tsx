import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ShieldIcon, PakistanFlagIcon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  language: 'ur' | 'en';
  setLanguage: (lang: 'ur' | 'en') => void;
  setCurrentScreen: (screen: any) => void;
  t: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  setLanguage,
  setCurrentScreen,
  t,
}) => {
  return (
    <View style={styles.authWrapper}>
      <View style={styles.ambientGreenRing} />

      <View style={styles.logoBadgeContainer}>
        <View style={{ marginRight: 8 }}>
          <PakistanFlagIcon size={14} />
        </View>
        <Text style={styles.logoTagline}>DLC VERIFIED</Text>
      </View>

      <View style={styles.introTextBox}>
        <Text style={styles.authMainTitle}>{t.appName}</Text>
        <Text style={styles.authSubTitle}>{t.welcomeSub}</Text>
        <Text style={styles.authDescription}>{t.welcomeDesc}</Text>
      </View>

      <Text style={styles.selectionLabel}>{t.selectLanguage}</Text>

      <View style={styles.languageSelectRow}>
        <TouchableOpacity
          style={[
            styles.langSelectCard,
            language === 'ur' && styles.langSelectCardActiveUr,
          ]}
          onPress={() => setLanguage('ur')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langCardText, language === 'ur' && styles.langCardTextActive]}>
            اردو (Urdu)
          </Text>
          <View style={styles.miniCrescent} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langSelectCard,
            language === 'en' && styles.langSelectCardActiveEn,
          ]}
          onPress={() => setLanguage('en')}
          activeOpacity={0.8}
        >
          <Text style={[styles.langCardText, language === 'en' && styles.langCardTextActive]}>
            English
          </Text>
          <View style={[styles.miniCrescent, { borderColor: '#00D2FF20' }]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primaryAuthBtn}
        onPress={() => setCurrentScreen('phone_auth')}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryAuthBtnText}>{t.startBtn}</Text>
        <View style={styles.glowOverlay} />
      </TouchableOpacity>

      <View style={styles.footerShieldRow}>
        <ShieldIcon color="#10B981" size={16} />
        <Text style={styles.footerShieldText}>
          {language === 'ur'
            ? 'ڈیجیٹل سیکیورٹی شیلڈ ایکٹو: محفوظ روزگار اور اجرت'
            : 'Payment Escrow Safeguard Activated'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authWrapper: {
    flex: 1,
    backgroundColor: '#090D14',
    paddingHorizontal: 24,
    justifyContent: 'center',
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
  logoBadgeContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 30,
  },
  logoEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  logoTagline: {
    color: '#00D2FF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  introTextBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authMainTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubTitle: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  authDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  selectionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  languageSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  langSelectCard: {
    flex: 1,
    backgroundColor: '#131926',
    borderWidth: 1.5,
    borderColor: '#232E42',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  langSelectCardActiveUr: {
    borderColor: '#10B981',
    backgroundColor: '#10B98110',
  },
  langSelectCardActiveEn: {
    borderColor: '#00D2FF',
    backgroundColor: '#00D2FF10',
  },
  langCardText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  langCardTextActive: {
    color: '#FFFFFF',
  },
  miniCrescent: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#10B98120',
  },
  primaryAuthBtn: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  primaryAuthBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF10',
  },
  footerShieldRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerShieldText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
});
