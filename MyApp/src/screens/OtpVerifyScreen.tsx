import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeftIcon, LockIcon } from '../components/Icons';
import { ApiClient } from '../components/Api';

const { width } = Dimensions.get('window');

interface OtpVerifyScreenProps {
  language: 'ur' | 'en';
  setCurrentScreen: (screen: any) => void;
  otpCode: string;
  setOtpCode: (code: string | ((prev: string) => string)) => void;
  isOtpValid: boolean;
  t: any;
  email: string;
  verifyOtpFlow: (codeValue?: string) => void;
}

export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = ({
  language,
  setCurrentScreen,
  otpCode,
  setOtpCode,
  isOtpValid,
  t,
  email,
  verifyOtpFlow,
}) => {
  // Handle keypad presses
  const handleKeypadPress = (val: string) => {
    if (val === '⌫') {
      setOtpCode(prev => (prev as string).slice(0, -1));
    } else if (val === '✓') {
      if (otpCode.length === 4) {
        verifyOtpFlow(otpCode);
      }
    } else {
      if (otpCode.length < 4) {
        const nextCode = otpCode + val;
        setOtpCode(nextCode);
        if (nextCode.length === 4 && nextCode === '1234') {
          verifyOtpFlow(nextCode);
        }
      }
    }
  };

  return (
    <View style={styles.authWrapper}>
      <View style={styles.ambientGreenRing} />

      <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('phone_auth')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <ArrowLeftIcon color="#94A3B8" size={14} />
          <Text style={styles.backBtnText}>{t.backBtn}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.authMainTitle}>{t.otpTitle}</Text>
      <Text style={styles.authDescription}>{t.otpSub}</Text>

      {/* Code Display Blocks */}
      <View style={styles.codeCellRow}>
        {[0, 1, 2, 3].map(idx => {
          const digit = otpCode[idx] || '';
          const isActive = otpCode.length === idx;
          return (
            <View
              key={idx}
              style={[
                styles.codeCell,
                digit !== '' && styles.codeCellFilled,
                isActive && styles.codeCellActive,
              ]}
            >
              {digit !== '' ? <Text style={styles.cellText}>{digit}</Text> : null}
              {isActive && <View style={styles.activeCursor} />}
            </View>
          );
        })}
      </View>

      {/* Success/Error Alerts */}
      {otpCode.length === 4 && (
        <Text style={[styles.statusMsg, isOtpValid ? styles.statusValid : styles.statusInvalid]}>
          {isOtpValid ? t.otpVerified : t.otpError}
        </Text>
      )}

      {/* Security notice and resend link */}
      <View style={styles.timerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <LockIcon color="#475569" size={12} />
          <Text style={styles.timerSubText}>SECURE TOKEN</Text>
        </View>
        <TouchableOpacity onPress={async () => {
          await ApiClient.sendOtp(email.trim());
          alert(language === 'ur' ? `ای میل ${email} پر دوبارہ کوڈ بھیج دیا گیا ہے` : `OTP Resent to ${email}`);
        }}>
          <Text style={styles.resendText}>{t.otpTimer}</Text>
        </TouchableOpacity>
      </View>

      {/* CUSTOM NUMERIC KEYPAD */}
      <View style={styles.keypadGrid}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['⌫', '0', '✓'],
        ].map((row, rIdx) => (
          <View key={rIdx} style={styles.keypadRow}>
            {row.map((btn, bIdx) => (
              <TouchableOpacity
                key={bIdx}
                style={[
                  styles.keypadBtn,
                  btn === '✓' && styles.keypadBtnAccept,
                  btn === '⌫' && styles.keypadBtnCancel,
                ]}
                onPress={() => handleKeypadPress(btn)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.keypadText,
                    btn === '✓' && styles.keypadTextAccept,
                    btn === '⌫' && styles.keypadTextCancel,
                  ]}
                >
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  codeCellRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  codeCell: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#131926',
    borderWidth: 1.5,
    borderColor: '#232E42',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  codeCellFilled: {
    borderColor: '#00D2FF',
  },
  codeCellActive: {
    borderColor: '#10B981',
    backgroundColor: '#10B98105',
  },
  cellText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  activeCursor: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#10B981',
  },
  statusMsg: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusValid: {
    color: '#10B981',
  },
  statusInvalid: {
    color: '#EF4444',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 40,
  },
  timerSubText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  keypadGrid: {
    gap: 12,
    paddingHorizontal: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  keypadBtn: {
    flex: 1,
    height: 60,
    backgroundColor: '#13192680',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#232E42',
  },
  keypadBtnAccept: {
    backgroundColor: '#10B98115',
    borderColor: '#10B981',
  },
  keypadBtnCancel: {
    backgroundColor: '#EF444410',
    borderColor: '#EF444430',
  },
  keypadText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  keypadTextAccept: {
    color: '#10B981',
  },
  keypadTextCancel: {
    color: '#EF4444',
  },
});
