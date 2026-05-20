import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';

const { VoiceAssistant } = NativeModules;

export interface VoiceAssistantEvents {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onSpeechResults?: (result: { transcript: string }) => void;
  onSpeechPartialResults?: (result: { transcript: string }) => void;
  onSpeechError?: (error: { error: string }) => void;
}

class VoiceAssistantService {
  private emitter: NativeEventEmitter | null = null;
  private subscriptions: any[] = [];

  constructor() {
    if (Platform.OS === 'android' && VoiceAssistant) {
      this.emitter = new NativeEventEmitter(VoiceAssistant);
    }
  }

  async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Daily Wage Workers App needs access to your microphone to listen to your voice commands.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  registerListeners(events: VoiceAssistantEvents) {
    this.unregisterListeners();
    if (!this.emitter) return;

    if (events.onSpeechStart) {
      this.subscriptions.push(this.emitter.addListener('onSpeechStart', events.onSpeechStart));
    }
    if (events.onSpeechEnd) {
      this.subscriptions.push(this.emitter.addListener('onSpeechEnd', events.onSpeechEnd));
    }
    if (events.onSpeechResults) {
      this.subscriptions.push(this.emitter.addListener('onSpeechResults', events.onSpeechResults));
    }
    if (events.onSpeechPartialResults) {
      this.subscriptions.push(this.emitter.addListener('onSpeechPartialResults', events.onSpeechPartialResults));
    }
    if (events.onSpeechError) {
      this.subscriptions.push(this.emitter.addListener('onSpeechError', events.onSpeechError));
    }
  }

  unregisterListeners() {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }

  startListening(language: 'ur' | 'en') {
    if (!VoiceAssistant) return;
    this.stopSpeaking();
    const locale = language === 'ur' ? 'ur-PK' : 'en-US';
    VoiceAssistant.startListening(locale);
  }

  stopListening() {
    if (!VoiceAssistant) return;
    VoiceAssistant.stopListening();
  }

  speak(text: string, language: 'ur' | 'en') {
    if (!VoiceAssistant) return;
    const locale = language === 'ur' ? 'ur' : 'en';
    // Clean up text from markdown bolding or asterisks to sound natural
    const cleanText = text.replace(/[*#_`]/g, '').trim();
    VoiceAssistant.speak(cleanText, locale);
  }

  stopSpeaking() {
    if (!VoiceAssistant) return;
    VoiceAssistant.stopSpeaking();
  }

  isSupported(): boolean {
    return !!VoiceAssistant;
  }
}

export const VoiceAssistantManager = new VoiceAssistantService();
