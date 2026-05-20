import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { ShieldIcon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  language: 'ur' | 'en';
  splashProgress: Animated.Value;
  logoPulse: Animated.Value;
  loadingText: string;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  language,
  splashProgress,
  logoPulse,
  loadingText,
}) => {
  const progressWidth = splashProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.landingWrapper}>
      <View style={styles.ambientGreenRingLarge} />
      <View style={styles.ambientCyanRingLarge} />

      <Animated.View style={[styles.landingLogoContainer, { transform: [{ scale: logoPulse }] }]}>
        {/* Custom vector-like Crescent Moon & Star logo for Hunar & Hifazat */}
        <View style={styles.crescentOuter}>
          <View style={styles.crescentInner} />
        </View>
        <View style={styles.cyberStar}>
          <Text style={{ fontSize: 36, color: '#FFB800' }}>★</Text>
        </View>
        <View style={styles.cyberShieldBackdrop} />
      </Animated.View>

      <Text style={styles.landingTitle}>ہنر اور حفاظت</Text>
      <Text style={styles.landingSubTitle}>HUNAR & HIFAZAT</Text>
      <Text style={styles.landingTagline}>
        {language === 'ur'
          ? 'مزدوروں کا ڈیجیٹل سیکیورٹی شیلڈ اور روزگار پارٹنر'
          : "Pakistan's Pioneer AI-Driven Labor Safety Platform"}
      </Text>

      {/* Dynamic Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressStatusText}>{loadingText}</Text>
      </View>

      {/* Verification Seals */}
      <View style={styles.securitySealRow}>
        <ShieldIcon color="#10B981" size={16} />
        <Text style={styles.securitySealText}>
          {language === 'ur' ? 'ڈیجیٹل لیبر کونسل پاکستان سے مصدقہ' : 'DLC Pakistan Verified Application'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  landingWrapper: {
    flex: 1,
    backgroundColor: '#090D14',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  ambientGreenRingLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#10B98108',
    top: height * 0.16,
    left: -60,
  },
  ambientCyanRingLarge: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#00D2FF05',
    bottom: height * 0.12,
    right: -40,
  },
  landingLogoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    position: 'relative',
  },
  crescentOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crescentInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#090D14',
    marginLeft: 20,
  },
  cyberStar: {
    position: 'absolute',
    top: 25,
    right: 22,
    shadowColor: '#FFB800',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  cyberShieldBackdrop: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#10B98125',
    borderStyle: 'dashed',
  },
  landingTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: '#10B98180',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  landingSubTitle: {
    color: '#00D2FF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
  landingTagline: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#232E42',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
    shadowColor: '#10B981',
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  progressStatusText: {
    color: '#00D2FF',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 20,
  },
  securitySealRow: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  securitySealText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
  },
});
