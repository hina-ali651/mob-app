package com.myapp

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class VoiceAssistantModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), TextToSpeech.OnInitListener {

    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var pendingSpeakText: String? = null
    private var pendingSpeakLocale: String? = null

    init {
        Handler(Looper.getMainLooper()).post {
            tts = TextToSpeech(reactContext.applicationContext, this)
        }
    }

    override fun getName(): String = "VoiceAssistant"

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            ttsReady = true
            pendingSpeakText?.let { text ->
                val locale = pendingSpeakLocale ?: "en"
                speakInternal(text, locale)
                pendingSpeakText = null
                pendingSpeakLocale = null
            }
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun startListening(locale: String) {
        Handler(Looper.getMainLooper()).post {
            try {
                if (speechRecognizer == null) {
                    speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext.applicationContext)
                    speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                        override fun onReadyForSpeech(params: Bundle?) {
                            sendEvent("onSpeechStart", null)
                        }

                        override fun onBeginningOfSpeech() {}
                        override fun onRmsChanged(rmsdB: Float) {}
                        override fun onBufferReceived(buffer: ByteArray?) {}
                        override fun onEndOfSpeech() {
                            sendEvent("onSpeechEnd", null)
                        }

                        override fun onError(error: Int) {
                            val errorMsg = when (error) {
                                SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                                SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                                SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
                                SpeechRecognizer.ERROR_NETWORK -> "Network error"
                                SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                                SpeechRecognizer.ERROR_NO_MATCH -> "No recognition match"
                                SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Recognition service busy"
                                SpeechRecognizer.ERROR_SERVER -> "Server error"
                                SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech input timeout"
                                else -> "Unknown speech error"
                            }
                            val map = Arguments.createMap().apply {
                                putString("error", errorMsg)
                            }
                            sendEvent("onSpeechError", map)
                        }

                        override fun onResults(results: Bundle?) {
                            val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            if (!matches.isNullOrEmpty()) {
                                val map = Arguments.createMap().apply {
                                    putString("transcript", matches[0])
                                }
                                sendEvent("onSpeechResults", map)
                            } else {
                                val map = Arguments.createMap().apply {
                                    putString("error", "No speech detected")
                                }
                                sendEvent("onSpeechError", map)
                            }
                        }

                        override fun onPartialResults(partialResults: Bundle?) {
                            val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            if (!matches.isNullOrEmpty()) {
                                val map = Arguments.createMap().apply {
                                    putString("transcript", matches[0])
                                }
                                sendEvent("onSpeechPartialResults", map)
                            }
                        }

                        override fun onEvent(eventType: Int, params: Bundle?) {}
                    })
                }

                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, locale)
                    putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, locale)
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                }
                speechRecognizer?.startListening(intent)
            } catch (e: Exception) {
                val map = Arguments.createMap().apply {
                    putString("error", e.message ?: "Failed to start speech recognizer")
                }
                sendEvent("onSpeechError", map)
            }
        }
    }

    @ReactMethod
    fun stopListening() {
        Handler(Looper.getMainLooper()).post {
            try {
                speechRecognizer?.stopListening()
            } catch (e: Exception) {
                // ignore
            }
        }
    }

    @ReactMethod
    fun speak(text: String, locale: String) {
        if (!ttsReady || tts == null) {
            pendingSpeakText = text
            pendingSpeakLocale = locale
            return
        }
        Handler(Looper.getMainLooper()).post {
            speakInternal(text, locale)
        }
    }

    private fun speakInternal(text: String, locale: String) {
        try {
            val ttsLocale = if (locale.startsWith("ur")) Locale("ur", "PK") else Locale.US
            tts?.language = ttsLocale
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "VoiceAssistantUtteranceId")
        } catch (e: Exception) {
            // ignore
        }
    }

    @ReactMethod
    fun stopSpeaking() {
        Handler(Looper.getMainLooper()).post {
            try {
                tts?.stop()
            } catch (e: Exception) {
                // ignore
            }
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        Handler(Looper.getMainLooper()).post {
            try {
                speechRecognizer?.destroy()
                tts?.shutdown()
            } catch (e: Exception) {
                // ignore
            }
        }
    }
}
