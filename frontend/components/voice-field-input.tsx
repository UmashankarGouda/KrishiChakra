"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, SkipForward, Check } from 'lucide-react'

interface VoiceFieldInputProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: any) => void
}

export function VoiceFieldInput({ open, onOpenChange, onComplete }: VoiceFieldInputProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [voiceAnswers, setVoiceAnswers] = useState<string[]>([])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceLanguage, setVoiceLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN')
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null)

  // Questions to ask
  const voiceQuestions = [
    { 
      en: "What is your field name?", 
      hi: "आपके खेत का नाम क्या है?",
      placeholder: "e.g., North Farm A",
      field: 'name'
    },
    { 
      en: "What is the size in hectares?", 
      hi: "हेक्टेयर में आकार क्या है?",
      placeholder: "e.g., 2.5",
      field: 'size',
      parse: (text: string) => {
        const match = text.match(/(\d+\.?\d*)/)
        return match ? parseFloat(match[1]) : 0
      }
    },
    { 
      en: "What type of soil? Clay, Sandy, Black Soil, Red Soil, or Alluvial?", 
      hi: "मिट्टी का प्रकार क्या है? चिकनी, रेतीली, काली, लाल, या जलोढ़?",
      placeholder: "e.g., Clay",
      field: 'soil_type',
      parse: (text: string) => {
        const soilMap: { [key: string]: string } = {
          'clay|चिकनी': 'Clay',
          'sandy|रेतीली': 'Sandy',
          'black|काली': 'Black Soil',
          'red|लाल': 'Red Soil',
          'alluvial|जलोढ़': 'Alluvial',
          'loam|दोमट': 'Clay Loam',
          'silt|गाद': 'Silt'
        }
        for (const [pattern, type] of Object.entries(soilMap)) {
          if (new RegExp(pattern, 'i').test(text)) return type
        }
        return text
      }
    },
    { 
      en: "Which season? Kharif, Rabi, or Zaid?", 
      hi: "कौन सा मौसम? खरीफ, रबी, या जायद?",
      placeholder: "e.g., Kharif",
      field: 'season',
      parse: (text: string) => {
        if (/kharif|खरीफ|monsoon/i.test(text)) return 'Kharif'
        if (/rabi|रबी|winter/i.test(text)) return 'Rabi'
        if (/zaid|जायद|summer/i.test(text)) return 'Zaid'
        return text
      }
    },
    { 
      en: "What is your climate zone? Tropical, Sub-tropical, Semi-Arid, Arid, or Temperate?", 
      hi: "आपका जलवायु क्षेत्र क्या है? उष्णकटिबंधीय, उपोष्णकटिबंधीय, अर्ध शुष्क, शुष्क, या समशीतोष्ण?",
      placeholder: "e.g., Tropical",
      field: 'climate_zone',
      parse: (text: string) => {
        if (/tropical|उष्णकटिबंधीय/i.test(text) && !/sub/i.test(text)) return 'Tropical'
        if (/sub-tropical|subtropical|उपोष्णकटिबंधीय/i.test(text)) return 'Sub-tropical'
        if (/semi-arid|semi arid|अर्ध शुष्क/i.test(text)) return 'Semi-Arid'
        if (/arid|शुष्क/i.test(text) && !/semi/i.test(text)) return 'Arid'
        if (/temperate|समशीतोष्ण/i.test(text)) return 'Temperate'
        return text
      }
    },
    { 
      en: "What crop are you currently growing? Say 'none' or 'fallow' if empty.", 
      hi: "आप वर्तमान में कौन सी फसल उगा रहे हैं? खाली हो तो 'कोई नहीं' कहें।",
      placeholder: "e.g., Rice",
      field: 'current_crop',
      parse: (text: string) => {
        const cropMap: { [key: string]: string } = {
          'rice|धान|चावल': 'Rice',
          'wheat|गेहूं': 'Wheat',
          'chickpea|चना': 'Chickpea',
          'green gram|मूंग': 'Green Gram',
          'peas|मटर': 'Peas',
          'soybean|सोयाबीन': 'Soybean',
          'cowpea|लोबिया': 'Cowpea',
          'sunflower|सूरजमुखी': 'Sunflower',
          'maize|मक्का': 'Maize',
          'potato|आलू': 'Potato',
          'barley|जौ': 'Barley',
          'none|fallow|खाली|कोई नहीं': 'Fallow (No Crop)'
        }
        for (const [pattern, crop] of Object.entries(cropMap)) {
          if (new RegExp(pattern, 'i').test(text)) return crop
        }
        return text
      }
    }
  ]

  // Start listening for current question
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome or Edge.')
      return
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = voiceLanguage
      recognition.continuous = false
      recognition.interimResults = true

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript = event.results[i][0].transcript
        }
        setCurrentTranscript(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error)
        setIsListening(false)
        if (event.error === 'network') {
          // Network error is fine - Chrome can work offline
          console.log('Network error (this is normal for offline recognition)')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
      setIsListening(true)
      setRecognitionInstance(recognition)

      setTimeout(() => {
        try {
          recognition.stop()
        } catch (e) {}
      }, 8000)
    } catch (error) {
      console.error('Error starting recognition:', error)
    }
  }

  // Stop listening
  const stopListening = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop()
      } catch (e) {}
    }
    setIsListening(false)
  }

  // Save answer and move to next
  const handleNext = () => {
    const newAnswers = [...voiceAnswers]
    newAnswers[currentQuestion] = currentTranscript.trim()
    setVoiceAnswers(newAnswers)
    setCurrentTranscript('')

    if (currentQuestion < voiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // Skip question
  const handleSkip = () => {
    const newAnswers = [...voiceAnswers]
    newAnswers[currentQuestion] = ''
    setVoiceAnswers(newAnswers)
    setCurrentTranscript('')

    if (currentQuestion < voiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // Complete and send data
  const handleComplete = () => {
    const formData: any = {
      name: '',
      location: '',
      soil_type: '',
      season: '',
      climate_zone: '',
      current_crop: '',
      size: 0,
      status: 'planning',
      notes: ''
    }

    voiceQuestions.forEach((question, index) => {
      const answer = voiceAnswers[index]
      if (answer) {
        const value = question.parse ? question.parse(answer) : answer
        formData[question.field] = value
      }
    })

    onComplete(formData)
    reset()
  }

  // Reset
  const reset = () => {
    setCurrentQuestion(0)
    setVoiceAnswers([])
    setCurrentTranscript('')
    stopListening()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop()
        } catch (e) {}
      }
    }
  }, [recognitionInstance])

  const currentQ = voiceQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === voiceQuestions.length - 1
  const progress = ((currentQuestion + 1) / voiceQuestions.length) * 100

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) reset()
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎤 Voice Input - बोलकर भरें
          </DialogTitle>
          <DialogDescription>
            Answer each question by speaking. The assistant will guide you!
            <br />
            प्रत्येक प्रश्न का उत्तर बोलकर दें। सहायक आपका मार्गदर्शन करेगी!
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-gray-600 text-center">
          Question {currentQuestion + 1} of {voiceQuestions.length}
        </p>

        {/* Language Toggle */}
        <div className="flex gap-2 justify-center mb-4">
          <Button
            variant={voiceLanguage === 'en-IN' ? 'default' : 'outline'}
            onClick={() => setVoiceLanguage('en-IN')}
            size="sm"
          >
            🇬🇧 English
          </Button>
          <Button
            variant={voiceLanguage === 'hi-IN' ? 'default' : 'outline'}
            onClick={() => setVoiceLanguage('hi-IN')}
            size="sm"
          >
            🇮🇳 हिंदी
          </Button>
        </div>

        {/* Current Question */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold text-blue-900 mb-2">
            👩‍🌾 {voiceLanguage === 'en-IN' ? currentQ.en : currentQ.hi}
          </p>
          <p className="text-sm text-blue-700">{currentQ.placeholder}</p>
        </div>

        {/* Microphone Button */}
        <div className="flex flex-col items-center gap-4 py-4">
          <Button
            size="lg"
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full text-4xl ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isListening ? <MicOff /> : <Mic />}
          </Button>
          <p className="text-sm text-gray-600">
            {isListening ? '🔴 Listening... Speak now!' : 'Click microphone to answer'}
          </p>
        </div>

        {/* Live Transcript */}
        {currentTranscript && (
          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <p className="text-sm font-semibold text-green-800 mb-1">You said:</p>
            <p className="text-lg text-gray-900">{currentTranscript}</p>
          </div>
        )}

        {/* Previous Answers Summary */}
        {voiceAnswers.filter(a => a).length > 0 && (
          <div className="border rounded-lg p-3 bg-gray-50 max-h-32 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2">✅ Answered:</p>
            {voiceAnswers.map((answer, idx) => answer && (
              <p key={idx} className="text-xs text-gray-600">
                {idx + 1}. {answer}
              </p>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleSkip} disabled={isListening}>
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
          {!isLastQuestion ? (
            <Button 
              onClick={handleNext} 
              disabled={!currentTranscript.trim() || isListening}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next Question →
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={isListening}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Complete & Fill Form
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
