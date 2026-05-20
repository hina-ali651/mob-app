import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { DynamicSkillIllustration, MiniSkillIcon } from '../components/Icons';
import { ApiClient } from '../components/Api';

const { width } = Dimensions.get('window');

interface ProfileSetupScreenProps {
  language: 'ur' | 'en';
  setCurrentScreen: (screen: any) => void;
  email: string;
  userName: string;
  setUserName: (name: string) => void;
  userSkill: 'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason';
  setUserSkill: (skill: 'painter' | 'electrician' | 'plumber' | 'carpenter' | 'mason') => void;
  userCity: string;
  setUserCity: (city: string) => void;
  biography: string;
  setBiography: (bio: string) => void;
  t: any;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  language,
  setCurrentScreen,
  email,
  userName,
  setUserName,
  userSkill,
  setUserSkill,
  userCity,
  setUserCity,
  biography,
  setBiography,
  t,
}) => {
  return (
    <View style={styles.authWrapper}>
      <View style={styles.ambientGreenRing} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.authMainTitle}>{t.setupTitle}</Text>
        <Text style={styles.authDescription}>{t.setupSub}</Text>

        {/* Dynamic illustration showing currently selected skill */}
        <View style={styles.illustrationHolder}>
          <DynamicSkillIllustration skill={userSkill} size={130} />
        </View>

        {/* Name input */}
        <Text style={styles.inputLabel}>{t.nameLabel}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInputField}
            placeholder={t.namePlaceholder}
            placeholderTextColor="#475569"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        {/* Skill grid */}
        <Text style={styles.inputLabel}>{t.skillLabel}</Text>
        <View style={styles.skillsGrid}>
          {([
            { id: 'painter', label: language === 'ur' ? 'رنگساز' : 'Painter' },
            { id: 'electrician', label: language === 'ur' ? 'الیکٹریشن' : 'Electrician' },
            { id: 'plumber', label: language === 'ur' ? 'نل ساز' : 'Plumber' },
            { id: 'carpenter', label: language === 'ur' ? 'بڑھئی' : 'Carpenter' },
            { id: 'mason', label: language === 'ur' ? 'راج مزدور' : 'Mason' },
          ] as const).map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.skillSelectCard, userSkill === item.id && styles.skillSelectCardActive]}
              onPress={() => setUserSkill(item.id)}
              activeOpacity={0.8}
            >
              <MiniSkillIcon skill={item.id} color={userSkill === item.id ? '#10B981' : '#94A3B8'} size={20} />
              <Text style={[styles.skillText, userSkill === item.id && styles.skillTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* City selection */}
        <Text style={styles.inputLabel}>{t.cityLabel}</Text>
        <View style={styles.citiesRow}>
          {['Lahore', 'Karachi', 'Rawalpindi', 'Islamabad', 'Peshawar', 'Multan'].map(city => (
            <TouchableOpacity
              key={city}
              style={[styles.cityBadge, userCity === city && styles.cityBadgeActive]}
              onPress={() => setUserCity(city)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cityText, userCity === city && styles.cityTextActive]}>
                {city === 'Lahore' && language === 'ur' ? 'لاہور' : ''}
                {city === 'Karachi' && language === 'ur' ? 'کراچی' : ''}
                {city === 'Rawalpindi' && language === 'ur' ? 'راولپنڈی' : ''}
                {city === 'Islamabad' && language === 'ur' ? 'اسلام آباد' : ''}
                {city === 'Peshawar' && language === 'ur' ? 'پشاور' : ''}
                {city === 'Multan' && language === 'ur' ? 'ملتان' : ''}
                {language !== 'ur' ||
                !['Lahore', 'Karachi', 'Rawalpindi', 'Islamabad', 'Peshawar', 'Multan'].includes(city)
                  ? city
                  : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Biography Input Field */}
        <Text style={styles.inputLabel}>{language === 'ur' ? 'تجربہ / تفصیل (Biography)' : 'Experience / Biography'}</Text>
        <View style={[styles.inputCard, { height: 100, alignItems: 'flex-start', paddingTop: 12, marginBottom: 35 }]}>
          <TextInput
            style={[styles.textInputField, { height: 80, textAlignVertical: 'top' }]}
            placeholder={language === 'ur' ? 'اپنے تجربے کے بارے میں لکھیں...' : 'Write about your experience...'}
            placeholderTextColor="#475569"
            value={biography}
            onChangeText={setBiography}
            multiline
          />
        </View>

        {/* Create smart card CTA */}
        <TouchableOpacity
          style={[styles.primaryAuthBtn, userName.trim() === '' && styles.disabledBtn]}
          disabled={userName.trim() === ''}
          onPress={async () => {
            await ApiClient.setupProfile(email, userName, userSkill, userCity, biography);
            setCurrentScreen('dashboard');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryAuthBtnText}>{t.createCardBtn}</Text>
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
  scrollContent: {
    paddingVertical: 40,
    paddingBottom: 60,
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
  authMainTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  authDescription: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  illustrationHolder: {
    alignSelf: 'center',
    marginBottom: 28,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  inputCard: {
    backgroundColor: '#131926',
    borderWidth: 1.5,
    borderColor: '#232E42',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    marginBottom: 24,
  },
  textInputField: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 0,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  skillSelectCard: {
    width: (width - 60) / 2,
    backgroundColor: '#131926',
    borderWidth: 1.5,
    borderColor: '#232E42',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  skillSelectCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#10B98110',
  },
  skillEmoji: {
    fontSize: 22,
  },
  skillText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  skillTextActive: {
    color: '#FFFFFF',
  },
  citiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 35,
  },
  cityBadge: {
    backgroundColor: '#131926',
    borderWidth: 1,
    borderColor: '#232E42',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  cityBadgeActive: {
    backgroundColor: '#00D2FF15',
    borderColor: '#00D2FF',
  },
  cityText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cityTextActive: {
    color: '#00D2FF',
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
