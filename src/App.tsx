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
    <div className="cosmic-container min-h-screen">
      <StarField optimized={true} />

      <div className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <motion.button
            className="md:hidden flex items-center justify-center p-2 glassmorphism rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5 text-moonglow" />
          </motion.button>

          <div className="hidden md:block">{/* Empty div for layout balance */}</div>

          {currentUser ? (
            <UserProfile onLogout={handleLogout} />
          ) : (
            <motion.button
              className="flex items-center gap-2 glassmorphism px-3 py-1.5 md:px-4 md:py-2 rounded-full text-moonglow text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAuthModal}
            >
              <LogIn className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Sign In</span>
            </motion.button>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 bg-space-900/90 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                className="glassmorphism m-4 rounded-xl p-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-4">
                  <button
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-space-700/50 transition-colors"
                    onClick={toggleCalendar}
                  >
                    <Calendar className="h-5 w-5 text-moonglow" />
                    <span>Open Calendar</span>
                  </button>

                  {!currentUser ? (
                    <button
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-space-700/50 transition-colors"
                      onClick={toggleAuthModal}
                    >
                      <LogIn className="h-5 w-5 text-moonglow" />
                      <span>Sign In</span>
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 text-red-300 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date Header */}
        <motion.div
          className="mb-6 md:mb-8 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-2 font-mono">
            <motion.button
              className="text-white/60 hover:text-moonglow transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <button
              className="text-moonglow text-xl font-medium hover:text-white transition-colors"
              onClick={toggleCalendar}
            >
              {format(currentViewDate, "MMM dd")}
            </button>

            <motion.button
              className="text-white/60 hover:text-moonglow transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNextDay}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>

          <p className="text-space-100/60 text-xs md:text-sm mt-1 font-poppins">
            {daysUntilFullMoon === 0
              ? "Full Moon tonight! 🌕"
              : `Next full moon in ${daysUntilFullMoon} day${daysUntilFullMoon !== 1 ? "s" : ""} 🌕`}
          </p>
        </motion.div>

        <header className="text-center mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-moonglow flex items-center justify-center gap-2">
              <Moon className="h-6 w-6 md:h-8 md:w-8" />
              <span>Lunaris</span>
            </h1>
            <p className="text-stardust/80 font-poppins font-light mt-1 text-sm md:text-base">
              Moon Phase & Daily Reflection
            </p>
          </motion.div>
        </header>

        <div className="lg:flex lg:items-center lg:gap-12">
          {/* Moon Phase Section */}
          <motion.div
            className="flex-1 flex flex-col items-center mb-8 lg:mb-0 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
              }}
            >
              <MoonPhase phase={moonPhase} size={window.innerWidth < 768 ? 200 : 300} optimized={true} />

              {/* Calendar Button */}
              <motion.button
                className="absolute top-0 right-0 p-2 glassmorphism rounded-full text-moonglow hover:text-white hover:bg-space-700/70 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCalendar}
                aria-label="Open lunar calendar"
              >
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              </motion.button>
            </motion.div>

            <motion.h2
              className="text-2xl md:text-3xl font-bold mt-4 md:mt-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {moonPhase}
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-stardust flex items-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <Moon className="h-4 w-4 md:h-5 md:w-5 text-moonglow" />
              {Math.round(illumination * 100)}% Illuminated
            </motion.p>

            <motion.p
              className="text-xs md:text-sm text-stardust/70 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {format(currentViewDate, "MMMM d, yyyy")}
              {!isSameDay(currentViewDate, today) && <span className="ml-2 text-pink-300">(Selected Date)</span>}
            </motion.p>

            {specialMessage && (
              <motion.div
                className="mt-4 md:mt-6 glassmorphism p-3 md:p-4 rounded-lg border border-moonglow/30 text-moonglow text-sm md:text-base"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {specialMessage}
              </motion.div>
            )}
          </motion.div>

          {/* Daily Note Section */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="glassmorphism rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-medium text-moonglow mb-3 md:mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 md:h-5 md:w-5" />
                {format(currentViewDate, "MMMM d, yyyy")} Reflection
              </h3>

              {!currentUser ? (
                <div className="text-center py-4 md:py-6">
                  <p className="text-stardust/80 mb-3 md:mb-4 text-sm md:text-base">
                    Sign in to save your reflections to the stars ✨
                  </p>
                  <motion.button
                    className="btn-primary inline-flex items-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAuthModal}
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </motion.button>
                </div>
              ) : (
                <>
                  <textarea
                    className="input-field h-32 md:h-40 resize-none font-poppins text-sm md:text-base"
                    placeholder="The moon remembers… write your thoughts here."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  <div className="mt-3 md:mt-4 flex justify-end">
                    <motion.button
                      className={`btn-primary flex items-center gap-2 text-sm md:text-base py-1.5 md:py-2 ${
                        saveStatus === "saving" ? "opacity-70" : ""
                      } ${saveStatus === "error" ? "border-red-500 text-red-400" : ""}`}
                      onClick={handleSaveNote}
                      disabled={saveStatus === "saving" || !note.trim()}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{
                        backgroundColor: "rgba(44, 25, 80, 0.7)",
                      }}
                      animate={
                        saveStatus === "saved"
                          ? {
                              boxShadow: [
                                "0 0 0 rgba(253, 230, 138, 0)",
                                "0 0 15px rgba(253, 230, 138, 0.7)",
                                "0 0 0 rgba(253, 230, 138, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={
                        saveStatus === "saved"
                          ? {
                              duration: 0.5,
                              ease: "easeInOut",
                            }
                          : {}
                      }
                    >
                      {saveStatus === "saving" ? (
                        "Saving..."
                      ) : saveStatus === "saved" ? (
                        <>Saved</>
                      ) : saveStatus === "error" ? (
                        "Failed to save 🌑"
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save to the Stars ✨
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}

              {isLoading ? (
                <div className="text-center py-3 md:py-4">
                  <p className="text-stardust/60 text-sm">Loading your cosmic notes...</p>
                </div>
              ) : (
                currentUser &&
                savedNotes.length === 0 && (
                  <p className="text-center text-stardust/60 mt-4 md:mt-6 font-poppins text-xs md:text-sm italic">
                    No notes tonight. Let the moon inspire you…
                  </p>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Calendar Button */}
      <motion.button
        className="fixed bottom-4 md:bottom-6 right-4 md:right-6 p-3 md:p-4 glassmorphism rounded-full text-moonglow shadow-lg shadow-moonglow/20 z-20"
        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(253, 230, 138, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleCalendar}
        aria-label="Toggle lunar calendar"
      >
        <Moon className="h-5 w-5 md:h-6 md:w-6" />
      </motion.button>

      {/* Lunar Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
          <LunarCalendar
            onClose={toggleCalendar}
            savedNotes={formattedNotes}
            specialDates={[{ date: "2025-04-15", type: "birthday", message: "Your cosmic birthday! 🎂✨" }]}
            currentDate={currentViewDate}
            onDateChange={setCurrentViewDate}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>{showAuthModal && <AuthModal onClose={toggleAuthModal} />}</AnimatePresence>
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

