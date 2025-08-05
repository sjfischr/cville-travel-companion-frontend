'use client'

import React, { useState, useRef, useEffect } from "react"
import { MessageCircle, Mic } from "lucide-react"

type AppScreen = "onboarding" | "chat" | "voice-chat"

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("chat")
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Location state
  const [useTestLocation, setUseTestLocation] = useState(true) // Default to test location for now
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const testLocation = { lat: 38.035029, lng: -78.4865547 } // Charlottesville, VA

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hey there! I'm Sam, your beer-savvy Charlottesville guide. Let's get started."
    }
  ])

  // Voice chat state
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [voiceStatus, setVoiceStatus] = useState<
    "recording" | "processing" | "idle" | "error"
  >("idle")

  // for voice recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [chatMessages])

  // Get user's current location
  useEffect(() => {
    if (!useTestLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [useTestLocation])

  // Send a text message (now returns assistant reply and handles loading state)
  async function handleSendMessage(message: string): Promise<string> {
    setLoading(true)
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: message }
    setChatMessages((prev) => [...prev, userMsg])
    const locationToSend = useTestLocation ? testLocation : userLocation

    try {
      const res = await fetch(
        "https://cville-travel-companion-backend.onrender.com/chat",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, location: locationToSend }) }
      )
      const { reply } = await res.json()
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: reply }
      ])
      return reply
    } catch {
      const errorMsg = "Sorry, something went wrong."
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: errorMsg }
      ])
      return ""
    } finally {
      setLoading(false)
    }
  }

  // Handle send from input
  async function handleSend() {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    await handleSendMessage(text)
  }

  // Start voice recording → onstop will process
  async function handleStartRecording() {
    setVoiceStatus("recording")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        setVoiceStatus("processing")
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        const form = new FormData()
        form.append("audio", audioBlob)
        // send to STT
        const sttRes = await fetch("https://cville-travel-companion-backend.onrender.com/stt", {
          method: "POST", body: form
        })
        const { transcript } = await sttRes.json()
        console.log("STT returned:", transcript)
        if (!transcript.trim()) {
          setChatMessages(prev => [
            ...prev,
            { id: Date.now().toString(), role: "assistant", content: "Sorry, I didn't catch that. Could you try again?" }
          ])
          setVoiceStatus("idle")
          return
        }
        setVoiceTranscript(transcript)
        // send to chat and play back
        const reply = await handleSendMessage(transcript)
        if (reply) handlePlayAudio(reply)
        setVoiceStatus("idle")
      }

      mediaRecorderRef.current = recorder
      recorder.start()
    } catch (err) {
      console.error("Could not start recording", err)
      setVoiceStatus("error")
    }
  }

  // Stop recording & trigger onstop
  function handleStopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  // Play TTS audio
  async function handlePlayAudio(text: string) {
    try {
      const res = await fetch(
        "https://cville-travel-companion-backend.onrender.com/speak",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        }
      )
      if (!res.ok) {
        console.error("TTS request failed", res.status, await res.text())
        return
      }
      const contentType = res.headers.get("Content-Type") || ""
      if (!contentType.startsWith("audio/")) {
        console.error("Unexpected response type for TTS:", contentType)
        return
      }
      const arrayBuffer = await res.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: contentType })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => URL.revokeObjectURL(url)
      await audio.play()
    } catch (err) {
      console.error("TTS playback failed", err)
    }
  }

  // Dummy OnboardingFlow component (replace with your actual implementation or import)
  function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6 space-y-4 bg-card border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Welcome to Cycling Trip Companion!</h2>
        <p className="mb-6">Get started by clicking below.</p>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold"
        >
          Start Chatting
        </button>
      </div>
    )
  }

  // Render the correct screen
  if (currentScreen === "onboarding") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <OnboardingFlow onComplete={() => setCurrentScreen("chat")} />
      </div>
    )
  }

  if (currentScreen === "chat") {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col h-full w-full max-w-md bg-white font-sans md:h-[90vh] md:rounded-xl md:shadow-lg md:border md:border-gray-300">
          {/* Location toggle header */}
          <div className="p-3 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Location: {useTestLocation ? "Charlottesville (Test)" : "Current"}
            </span>
            <button
              onClick={() => setUseTestLocation(!useTestLocation)}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              {useTestLocation ? "Use Real Location" : "Use Test Location"}
            </button>
          </div>

          <div
            ref={containerRef}
            className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
          >
            {chatMessages.map((m) => (
              <div key={m.id} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    style={{
                      backgroundColor: m.role === 'user' ? '#3B82F6' : '#E5E7EB',
                      color: m.role === 'user' ? 'white' : '#1F2937',
                      padding: '12px 16px',
                      borderRadius: m.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      wordBreak: 'break-word',
                      lineHeight: '1.4',
                      fontSize: '16px'
                    }}
                  >
                    {m.content}
                  </div>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handlePlayAudio(m.content)}
                      className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0 mb-1 ml-2"
                      aria-label="Play message"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div key="loading-indicator" className="flex w-full justify-start">
                <div className="flex items-end max-w-[80%]">
                  <div
                    className="px-4 py-3 bg-gray-200"
                    style={{
                      borderRadius: '20px 20px 20px 6px',
                    }}
                  >
                    <div className="flex items-center justify-center space-x-1.5">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center border-t border-gray-200 p-3 bg-white">
            <button
              onClick={() => setCurrentScreen("voice-chat")}
              className="p-2 mr-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
              aria-label="Switch to voice"
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:opacity-50 font-medium flex items-center gap-2 transition-colors"
            >
              <MessageCircle size={18} /> Send
            </button>
          </div>
        </div>
      </div>
    )
  }

  // voice-chat screen
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-6 space-y-4 bg-white md:h-auto md:rounded-lg md:shadow-lg">
        {voiceStatus === 'idle' && (
          <p className="text-gray-900">Tap to start voice chat with Sam</p>
        )}
        {voiceStatus === 'recording' && (
          <p className="text-red-600 animate-pulse">Recording…</p>
        )}
        {voiceStatus === 'processing' && (
          <p className="text-gray-900">Processing your voice…</p>
        )}
        {voiceTranscript && (
          <div className="w-full p-3 bg-gray-50 rounded-md border">
            <strong>You said:</strong>
            <p>{voiceTranscript}</p>
          </div>
        )}

        <div className="flex space-x-4">
          {voiceStatus === 'recording' ? (
            <button
              onClick={handleStopRecording}
              className="p-4 bg-red-500 text-white rounded-full"
            >
              <Mic size={24} />
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="p-4 bg-blue-500 text-white rounded-full"
            >
              <Mic size={24} />
            </button>
          )}

          <button
            onClick={() => setCurrentScreen("chat")}
            className="p-4 bg-gray-500 text-white rounded-full"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
