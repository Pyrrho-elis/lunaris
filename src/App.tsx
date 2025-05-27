"use client"

import { useState, useEffect } from "react"
import { format, addDays, differenceInDays, isSameDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Star, Save, Calendar, ChevronLeft, ChevronRight, LogIn, Menu } from "lucide-react"
import StarField from "./components/StarField"
import MoonPhase from "./components/MoonPhase"
import LunarCalendar from "./components/LunarCalendar"
import AuthModal from "./components/AuthModal"
import UserProfile from "./components/UserProfile"
import { getMoonPhase, getMoonIllumination, getNextFullMoonDate } from "./utils/moonCalculations"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { saveNote, getUserNotes, updateNote, type Note } from "./services/noteService"
import { Analytics } from "@vercel/analytics/react"

function AppContent() {
  const { currentUser, logout } = useAuth()
  const [note, setNote] = useState("")
  const [savedNotes, setSavedNotes] = useState<Note[]>([])
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [specialMessage, setSpecialMessage] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentViewDate, setCurrentViewDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get current moon phase
  const today = new Date()
  const moonPhase = getMoonPhase(currentViewDate)
  const illumination = getMoonIllumination(currentViewDate)
  const nextFullMoon = getNextFullMoonDate(currentViewDate)
  const daysUntilFullMoon = differenceInDays(nextFullMoon, currentViewDate)

  // Fetch user notes when user is authenticated
  useEffect(() => {
    async function fetchNotes() {
      if (currentUser) {
        setIsLoading(true)
        try {
          const notes = await getUserNotes(currentUser.uid)
          setSavedNotes(notes)
        } catch (error) {
          console.error("Error fetching notes:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSavedNotes([])
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [currentUser])

  // Check for special dates
  useEffect(() => {
    const dayOfMonth = today.getDate()
    const month = today.getMonth()

    // Full moon
    if (moonPhase === "Full Moon") {
      setSpecialMessage("Full Moon tonight! A time for completion and clarity. ✨")
    }
    // New moon
    else if (moonPhase === "New Moon") {
      setSpecialMessage("New Moon tonight! Set your intentions for the cycle ahead. 🌑")
    }
    // Birthday example (replace with actual logic)
    else if (dayOfMonth === 15 && month === 3) {
      setSpecialMessage("Tonight, the universe celebrates YOU. 🌙🎉")
    } else {
      setSpecialMessage(null)
    }
  }, [moonPhase, today])

  const handleSaveNote = async () => {
    if (!note.trim() || !currentUser) return

    setSaveStatus("saving")

    try {
      const dateStr = format(currentViewDate, "yyyy-MM-dd")
      const existingNote = savedNotes.find((n) => n.date === dateStr)

      let updatedNote
      if (existingNote) {
        // Update existing note
        await updateNote(existingNote.id!, note.trim())
        updatedNote = { ...existingNote, text: note.trim() }

        // Update the notes array
        setSavedNotes(savedNotes.map((n) => (n.id === existingNote.id ? updatedNote : n)))
      } else {
        // Create new note
        const newNote = await saveNote({
          date: dateStr,
          text: note.trim(),
          userId: currentUser.uid,
        })

        setSavedNotes([newNote, ...savedNotes])
      }

      setSaveStatus("saved")

      // Reset status after showing success
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Error saving note:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  // Add this function after the fetchNotes useEffect
  const loadNoteForSelectedDate = () => {
    if (!currentUser) return

    const selectedDateStr = format(currentViewDate, "yyyy-MM-dd")
    const existingNote = savedNotes.find((note) => note.date === selectedDateStr)

    if (existingNote) {
      setNote(existingNote.text)
    } else {
      setNote("")
    }
  }

  // Add this useEffect to load notes when the date changes
  useEffect(() => {
    loadNoteForSelectedDate()
  }, [currentViewDate, savedNotes, currentUser])

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
    setIsMobileMenuOpen(false)
  }

  const toggleAuthModal = () => {
    setShowAuthModal(!showAuthModal)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const goToPreviousDay = () => {
    setCurrentViewDate((prevDate) => addDays(prevDate, -1))
  }

  const goToNextDay = () => {
    setCurrentViewDate((prevDate) => addDays(prevDate, 1))
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Convert savedNotes to the format expected by LunarCalendar
  const formattedNotes = savedNotes.map((note) => ({
    date: note.date,
    text: note.text,
  }))

  return (
    <div className="min-h-screen disabled-content">
      <Analytics />
      {/* <p className="text-center text-lg text-white">The site is temporarily disabled. Please check back later.</p> */}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

