// Custom Vector-like Components for Hunar & Hifazat
// Drawn dynamically using native React Native Views to guarantee 100% cross-platform compatibility and high-fidelity glows.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MicroIcon = ({ color = '#00D2FF', size = 24 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.4, height: size * 0.7, backgroundColor: color, borderRadius: size * 0.2 }} />
    <View style={{ width: size * 0.6, height: size * 0.1, backgroundColor: color, marginTop: 2, borderRadius: 1 }} />
  </View>
);

export const ShieldIcon = ({ color = '#10B981', size = 24 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.8, borderLeftWidth: 2.5, borderRightWidth: 2.5, borderBottomWidth: 2.5, borderColor: color, borderBottomLeftRadius: size * 0.3, borderBottomRightRadius: size * 0.3, borderTopWidth: 2, borderTopLeftRadius: size * 0.1, borderTopRightRadius: size * 0.1 }} />
    <View style={{ width: size * 0.3, height: size * 0.3, backgroundColor: color, position: 'absolute', borderRadius: size * 0.05 }} />
  </View>
);

export const ChartIcon = ({ color = '#FFB800', size = 24 }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', padding: 2 }}>
    <View style={{ width: size * 0.2, height: size * 0.4, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size * 0.2, height: size * 0.8, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size * 0.2, height: size * 0.6, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const LockIcon = ({ color = '#E2E8F0', size = 20 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.4, borderWidth: 1.5, borderColor: color, borderTopLeftRadius: size * 0.2, borderTopRightRadius: size * 0.2, borderBottomWidth: 0, marginBottom: -1 }} />
    <View style={{ width: size * 0.6, height: size * 0.5, backgroundColor: color, borderRadius: 2 }} />
  </View>
);

export const CardIcon = ({ color = '#00D2FF', size = 20 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.8, height: size * 0.6, borderWidth: 1.5, borderColor: color, borderRadius: 3, justifyContent: 'space-between', padding: 2 }}>
      <View style={{ width: size * 0.4, height: 1.5, backgroundColor: color }} />
      <View style={{ width: size * 0.2, height: 1.5, backgroundColor: color, alignSelf: 'flex-end' }} />
    </View>
  </View>
);

export const SearchIcon = ({ color = '#CBD5E1', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25, borderWidth: 1.5, borderColor: color }} />
    <View style={{ width: 1.5, height: size * 0.35, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: 1, right: 1 }} />
  </View>
);

export const MapPinIcon = ({ color = '#EF4444', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09, backgroundColor: '#090D14' }} />
    </View>
    <View style={{ width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: size * 0.15, borderRightWidth: size * 0.15, borderTopWidth: size * 0.3, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color, marginTop: -1 }} />
  </View>
);

export const AudioIcon = ({ color = '#00D2FF', size = 18 }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
    <View style={{ width: 2, height: size * 0.4, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: 2, height: size * 0.8, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: 2, height: size * 0.5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: 2, height: size * 0.3, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const BriefcaseIcon = ({ color = '#10B981', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.4, height: size * 0.2, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
    <View style={{ width: size * 0.8, height: size * 0.5, borderWidth: 1.5, borderColor: color, borderRadius: 2 }} />
  </View>
);

// --- Expanded Custom Icon Library to Replace All Emojis ---

export const StarIcon = ({ color = '#FFB800', size = 16 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color, fontSize: size, fontWeight: 'bold', lineHeight: size }}>★</Text>
  </View>
);

export const ArrowLeftIcon = ({ color = '#94A3B8', size = 16 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Arrow Stem */}
    <View style={{ width: size * 0.7, height: 1.5, backgroundColor: color }} />
    {/* Arrow Head */}
    <View style={{ width: size * 0.35, height: size * 0.35, borderColor: color, borderLeftWidth: 1.5, borderTopWidth: 1.5, transform: [{ rotate: '-45deg' }], position: 'absolute', left: 0 }} />
  </View>
);

export const StormCloudIcon = ({ color = '#94A3B8', size = 20 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Cloud circles */}
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 }}>
      <View style={{ width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, backgroundColor: color, marginRight: -size * 0.15 }} />
      <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25, backgroundColor: color }} />
      <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.175, backgroundColor: color, marginLeft: -size * 0.15 }} />
    </View>
    {/* Lightning bolt */}
    <View style={{ position: 'absolute', bottom: -1, width: 3, height: 6, backgroundColor: '#FFB800', transform: [{ skewX: '-20deg' }] }} />
  </View>
);

export const PakistanFlagIcon = ({ size = 18 }) => (
  <View style={{ width: size * 1.5, height: size, flexDirection: 'row', borderRadius: 2, overflow: 'hidden', borderWidth: 0.5, borderColor: '#FFFFFF30' }}>
    {/* White left stripe */}
    <View style={{ width: '30%', backgroundColor: '#FFFFFF' }} />
    {/* Green right stripe with crescent and star */}
    <View style={{ width: '70%', backgroundColor: '#0F5132', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.55, fontWeight: 'bold', marginTop: -2 }}>☾☆</Text>
    </View>
  </View>
);

export const VerifiedBadgeIcon = ({ color = '#00D2FF', size = 16 }) => (
  <View style={{ width: size, height: size, backgroundColor: `${color}15`, borderWidth: 1.5, borderColor: color, borderRadius: size * 0.3, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.4, height: size * 0.2, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: color, transform: [{ rotate: '-45deg' }], marginTop: -2 }} />
  </View>
);

export const PhoneIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.3, backgroundColor: color, borderRadius: 2, transform: [{ rotate: '-45deg' }] }} />
    <View style={{ width: size * 0.2, height: size * 0.2, backgroundColor: color, borderRadius: 1, position: 'absolute', top: 2, left: size * 0.5 }} />
    <View style={{ width: size * 0.2, height: size * 0.2, backgroundColor: color, borderRadius: 1, position: 'absolute', bottom: 2, right: size * 0.5 }} />
  </View>
);

export const ClockIcon = ({ color = '#64748B', size = 16 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 1.5, height: size * 0.3, backgroundColor: color, position: 'absolute', top: size * 0.15 }} />
    <View style={{ width: size * 0.25, height: 1.5, backgroundColor: color, position: 'absolute', right: size * 0.15, top: size * 0.45 }} />
  </View>
);

export const BoxIcon = ({ color = '#64748B', size = 16 }) => (
  <View style={{ width: size, height: size, borderWidth: 1.5, borderColor: color, borderRadius: 2, padding: 2 }}>
    <View style={{ width: '100%', height: 1.5, backgroundColor: color }} />
    <View style={{ width: 1.5, height: '100%', backgroundColor: color, alignSelf: 'center' }} />
  </View>
);

export const PeopleIcon = ({ color = '#64748B', size = 16 }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: -3 }}>
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: color }} />
      <View style={{ width: size * 0.5, height: size * 0.25, borderTopLeftRadius: size * 0.2, borderTopRightRadius: size * 0.2, backgroundColor: color }} />
    </View>
    <View style={{ alignItems: 'center', opacity: 0.7 }}>
      <View style={{ width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125, backgroundColor: color }} />
      <View style={{ width: size * 0.4, height: size * 0.2, borderTopLeftRadius: size * 0.15, borderTopRightRadius: size * 0.15, backgroundColor: color }} />
    </View>
  </View>
);

export const TrowelIcon = ({ color = '#EF4444', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 0, height: 0, borderLeftWidth: size * 0.3, borderRightWidth: size * 0.3, borderBottomWidth: size * 0.6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
    <View style={{ width: 2, height: size * 0.3, backgroundColor: '#94A3B8' }} />
    <View style={{ width: 6, height: 4, backgroundColor: '#B45309', borderRadius: 1 }} />
  </View>
);

export const PaintRollerIcon = ({ color = '#10B981', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.6, height: size * 0.25, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ width: size * 0.3, height: size * 0.3, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#94A3B8', alignSelf: 'flex-start', marginLeft: size * 0.1, marginTop: -2 }} />
    <View style={{ width: 3, height: size * 0.4, backgroundColor: '#B45309', borderRadius: 1 }} />
  </View>
);

export const LightningIcon = ({ color = '#FFB800', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>⚡</Text>
  </View>
);

export const WaterTapIcon = ({ color = '#00D2FF', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.25, backgroundColor: '#94A3B8', borderRadius: 2, alignSelf: 'flex-start' }} />
    <View style={{ width: size * 0.25, height: size * 0.4, backgroundColor: '#64748B', borderRadius: 2, position: 'absolute', top: 0, right: 4 }} />
    <View style={{ width: size * 0.4, height: 4, backgroundColor: color, borderRadius: 1, position: 'absolute', top: -3, right: 2 }} />
    <View style={{ width: 4, height: 6, backgroundColor: color, borderRadius: 2, position: 'absolute', bottom: -2, left: 2 }} />
  </View>
);

export const WoodSawIcon = ({ color = '#A855F7', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
    <View style={{ width: size * 0.6, height: size * 0.3, borderBottomWidth: 1.5, borderBottomColor: '#64748B', borderStyle: 'dotted', backgroundColor: '#CBD5E1', borderTopRightRadius: 2 }} />
    <View style={{ width: size * 0.3, height: size * 0.4, backgroundColor: '#B45309', borderRadius: 3, marginLeft: -2, borderWidth: 1, borderColor: '#78350F' }} />
  </View>
);

export const BricksIcon = ({ color = '#EF4444', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', gap: 2 }}>
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <View style={{ width: size * 0.4, height: size * 0.2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: size * 0.4, height: size * 0.2, backgroundColor: color, borderRadius: 1 }} />
    </View>
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <View style={{ width: size * 0.2, height: size * 0.2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: size * 0.4, height: size * 0.2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: size * 0.2, height: size * 0.2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  </View>
);

export const LogoutIcon = ({ color = '#EF4444', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.7, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: color, borderRadius: 2 }} />
    <View style={{ width: size * 0.5, height: 1.5, backgroundColor: color, position: 'absolute', right: 0 }} />
    <View style={{ width: size * 0.25, height: size * 0.25, borderRightWidth: 1.5, borderTopWidth: 1.5, borderColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', right: 0 }} />
  </View>
);

export const CrescentStarIcon = ({ color = '#10B981', size = 100 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    {/* Crescent Moon shape */}
    <View style={{ width: size * 0.8, height: size * 0.8, borderRadius: size * 0.4, borderLeftWidth: size * 0.16, borderBottomWidth: size * 0.12, borderTopWidth: size * 0.08, borderColor: color, transform: [{ rotate: '-35deg' }] }} />
    {/* Pakistan Star shape */}
    <View style={{ position: 'absolute', top: size * 0.2, right: size * 0.22 }}>
      <Text style={{ color: '#FFFFFF', fontSize: size * 0.32, fontWeight: 'bold' }}>★</Text>
    </View>
  </View>
);

// --- Skill Selector Mini Graphic Map ---
export const MiniSkillIcon = ({ skill, color = '#E2E8F0', size = 18 }) => {
  switch (skill) {
    case 'painter':
      return <PaintRollerIcon color={color} size={size} />;
    case 'electrician':
      return <LightningIcon color={color} size={size} />;
    case 'plumber':
      return <WaterTapIcon color={color} size={size} />;
    case 'carpenter':
      return <WoodSawIcon color={color} size={size} />;
    case 'mason':
      return <BricksIcon color={color} size={size} />;
    default:
      return <BriefcaseIcon color={color} size={size} />;
  }
};

// Dynamic Header Icon reflecting the chosen skill
export const DynamicSkillIllustration = ({ skill, size = 120 }) => {
  const getIllustration = () => {
    switch (skill) {
      case 'electrician':
        return (
          <View style={[styles.illusBg, { borderColor: '#FFB80030' }]}>
            {/* Glowing Lightbulb */}
            <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: '#FFB80030', borderWidth: 2, borderColor: '#FFB800', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: size * 0.1, height: size * 0.15, backgroundColor: '#FFB800', borderRadius: size * 0.05 }} />
            </View>
            <View style={{ width: size * 0.15, height: size * 0.08, backgroundColor: '#E2E8F0', marginTop: 1, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />
            <View style={{ marginTop: 8 }}>
              <LightningIcon color="#FFB800" size={24} />
            </View>
          </View>
        );
      case 'plumber':
        return (
          <View style={[styles.illusBg, { borderColor: '#00D2FF30' }]}>
            {/* Water Drops & Pipe shape */}
            <View style={{ width: size * 0.4, height: size * 0.15, backgroundColor: '#334155', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: size * 0.3, height: size * 0.06, backgroundColor: '#00D2FF', borderRadius: 2 }} />
            </View>
            <View style={{ width: size * 0.15, height: size * 0.2, backgroundColor: '#475569', marginTop: -4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#00D2FF', marginTop: 12 }} />
            </View>
            <View style={{ marginTop: 4 }}>
              <WaterTapIcon color="#00D2FF" size={24} />
            </View>
          </View>
        );
      case 'carpenter':
        return (
          <View style={[styles.illusBg, { borderColor: '#A855F730' }]}>
            {/* Wood Block & Saw Mockup */}
            <View style={{ width: size * 0.45, height: size * 0.12, backgroundColor: '#B45309', borderRadius: 2 }} />
            <View style={{ width: size * 0.35, height: size * 0.15, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: '#A855F7', borderStyle: 'dashed', marginTop: 6 }} />
            <View style={{ marginTop: 4 }}>
              <WoodSawIcon color="#A855F7" size={24} />
            </View>
          </View>
        );
      case 'mason':
        return (
          <View style={[styles.illusBg, { borderColor: '#EF444430' }]}>
            {/* Bricks */}
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <View style={{ width: 28, height: 14, backgroundColor: '#EF4444', borderRadius: 2 }} />
              <View style={{ width: 28, height: 14, backgroundColor: '#EF4444', borderRadius: 2 }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
              <View style={{ width: 14, height: 14, backgroundColor: '#B91C1C', borderRadius: 2 }} />
              <View style={{ width: 28, height: 14, backgroundColor: '#EF4444', borderRadius: 2 }} />
              <View style={{ width: 14, height: 14, backgroundColor: '#B91C1C', borderRadius: 2 }} />
            </View>
            <View style={{ marginTop: 6 }}>
              <BricksIcon color="#EF4444" size={24} />
            </View>
          </View>
        );
      case 'painter':
      default:
        return (
          <View style={[styles.illusBg, { borderColor: '#10B98130' }]}>
            {/* Paint roller & bucket */}
            <View style={{ width: size * 0.35, height: size * 0.25, borderWidth: 3, borderColor: '#10B981', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: size * 0.2, height: size * 0.08, backgroundColor: '#10B981', borderRadius: 2 }} />
            </View>
            <View style={{ width: 4, height: 20, backgroundColor: '#94A3B8' }} />
            <View style={{ marginTop: 4 }}>
              <PaintRollerIcon color="#10B981" size={24} />
            </View>
          </View>
        );
    }
  };

  return getIllustration();
};

const styles = StyleSheet.create({
  illusBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#131926',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
