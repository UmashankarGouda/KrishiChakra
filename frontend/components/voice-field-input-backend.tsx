"use client"

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface VoiceFieldInputProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: any) => void
}

export function VoiceFieldInput({ open, onOpenChange, onComplete }: VoiceFieldInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Start recording audio
  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await sendToBackend(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permission.')
      console.error('Error accessing microphone:', err)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Send audio to backend for processing
  const sendToBackend = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setTranscript('')
    
    try {
      const formData = new FormData()
      formData.append('audio_file', audioBlob, 'recording.webm')
      formData.append('language', language)

      const response = await fetch(`${API_URL}/api/voice/process`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setTranscript(data.transcript || '')
        
        // Auto-fill form if we have parsed data
        if (data.parsed_data) {
          setTimeout(() => {
            onComplete(data.parsed_data)
            handleClose()
          }, 1500)
        }
      } else {
        setError(data.error || 'Failed to process audio')
      }
    } catch (err) {
      setError('Backend connection error. Make sure backend is running on port 8000')
      console.error('Error sending to backend:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (isRecording) {
      stopRecording()
    }
    setTranscript('')
    setError('')
    onOpenChange(false)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en-IN' ? 'hi-IN' : 'en-IN')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
            🎤 Voice Field Input
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="ml-auto text-xs"
              disabled={isRecording || isProcessing}
            >
              {language === 'en-IN' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
            </Button>
          </DialogTitle>
          <DialogDescription>
            {language === 'en-IN' 
              ? 'Speak about your field in English. Describe the name, size, soil type, crop, etc.' 
              : 'अपने खेत के बारे में हिंदी में बोलें। नाम, आकार, मिट्टी का प्रकार, फसल आदि बताएं।'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-2">💡 How to use:</p>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Click the microphone button below</li>
              <li>Speak about your field (name, size, soil, crop, etc.)</li>
              <li>Click again to stop recording</li>
              <li>AI will process and auto-fill the form!</li>
            </ol>
          </div>

          {/* Example Phrases */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-800 mb-2">📝 Example:</p>
            <div className="text-xs text-green-700 space-y-1">
              {language === 'en-IN' ? (
                <p>"My field name is Green Valley, size is 5 hectares, clay loam soil, kharif season, tropical climate, growing rice"</p>
              ) : (
                <p>"मेरे खेत का नाम हरित घाटी है, 5 हेक्टेयर है, चिकनी दोमट मिट्टी, खरीफ मौसम, उष्णकटिबंधीय जलवायु, धान उगा रहा हूं"</p>
              )}
            </div>
          </div>

          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-4 py-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              size="lg"
              className={`w-32 h-32 rounded-full text-6xl ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-green-500 hover:bg-green-600'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <Loader2 className="h-16 w-16 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-16 w-16" />
              ) : (
                <Mic className="h-16 w-16" />
              )}
            </Button>
            <div className="text-center">
              {isProcessing ? (
                <p className="text-sm font-semibold text-blue-600">
                  🤖 Processing your voice...
                </p>
              ) : isRecording ? (
                <p className="text-sm font-semibold text-red-600">
                  🔴 Recording... Click to stop
                  <br />
                  <span className="text-xs text-gray-600">रिकॉर्डिंग चल रहा है... रोकने के लिए क्लिक करें</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Click microphone to start
                  <br />
                  <span className="text-xs">माइक्रोफ़ोन पर क्लिक करें</span>
                </p>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                ✅ Recognized:
              </p>
              <p className="text-base text-gray-800 italic">
                "{transcript}"
              </p>
              <p className="text-xs text-green-600 mt-2">
                ✓ Auto-filling form...
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800 mb-1">❌ Error:</p>
              <p className="text-xs text-red-700">{error}</p>
              {error.includes('Backend') && (
                <p className="text-xs text-red-600 mt-2">
                  💡 Make sure backend is running: <code className="bg-red-100 px-1 rounded">cd backend && .\start_backend_venv.bat</code>
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isRecording || isProcessing}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
