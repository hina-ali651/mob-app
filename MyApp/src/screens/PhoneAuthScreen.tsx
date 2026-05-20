import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { ArrowLeftIcon, PakistanFlagIcon, VerifiedBadgeIcon, ShieldIcon } from '../components/Icons';
import { ApiClient } from '../components/Api';

const { width } = Dimensions.get('window');

interface PhoneAuthScreenProps {
  language: 'ur' | 'en';
  setCurrentScreen: (screen: any) => void;
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean;
  t: any;
}

export const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({
  language,
  setCurrentScreen,
  email,
  setEmail,
  isEmailValid,
  t,
}) => {
  return (
    <View style={styles.authWrapper}>
      <View style={styles.ambientGreenRing} />

      <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('welcome')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <ArrowLeftIcon color="#94A3B8" size={14} />
          <Text style={styles.backBtnText}>{t.backBtn}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.authMainTitle}>{t.phoneTitle}</Text>
      <Text style={styles.authDescription}>{t.phoneSub}</Text>

      {/* Input container */}
      <View
        style={[
          styles.inputOutlineCard,
          email.length > 0 && (isEmailValid ? styles.inputValid : styles.inputInvalid),
        ]}
      >
        <TextInput
          style={[styles.mobileInput, { paddingLeft: 16 }]}
          placeholder="user@example.com"
          placeholderTextColor="#475569"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Status Indicators */}
      {email.length > 0 && (
        <View style={{ marginBottom: 30, alignItems: 'center' }}>
          {isEmailValid ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <VerifiedBadgeIcon color="#10B981" size={14} />
              <Text style={styles.statusValid}>{language === 'ur' ? 'درست ای میل' : 'Valid Email Address'}</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ShieldIcon color="#EF4444" size={14} />
              <Text style={styles.statusInvalid}>{language === 'ur' ? 'غلط ای میل فارمیٹ' : 'Invalid Email Format'}</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryAuthBtn, !isEmailValid && styles.disabledBtn]}
        disabled={!isEmailValid}
        onPress={async () => {
          await ApiClient.sendOtp(email.trim());
          setCurrentScreen('otp_verify');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryAuthBtnText}>{t.nextBtn}</Text>
      </TouchableOpacity>
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
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  authMainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 40,
  },
  authDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 35,
  },
  inputOutlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131926',
    borderWidth: 1.5,
    borderColor: '#232E42',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 12,
  },
  inputValid: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  inputInvalid: {
    borderColor: '#EF4444',
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#232E42',
    marginHorizontal: 16,
  },
  mobileInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    padding: 0,
  },
  statusMsg: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusValid: {
    color: '#10B981',
  },
  statusInvalid: {
    color: '#EF4444',
  },
  primaryAuthBtn: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  disabledBtn: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryAuthBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
