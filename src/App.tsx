"use client"

import { useState, useEffect } from "react"
import { format, addDays, differenceInDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Star, Save, Calendar, ChevronLeft, ChevronRight, LogIn } from "lucide-react"
import StarField from "./components/StarField"
import MoonPhase from "./components/MoonPhase"
import LunarCalendar from "./components/LunarCalendar"
import AuthModal from "./components/AuthModal"
import UserProfile from "./components/UserProfile"
import { getMoonPhase, getMoonIllumination, getNextFullMoonDate } from "./utils/moonCalculations"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { saveNote, getUserNotes, type Note } from "./services/noteService"

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

  // Get current moon phase
  const today = new Date()
  const moonPhase = getMoonPhase(today)
  const illumination = getMoonIllumination(today)
  const nextFullMoon = getNextFullMoonDate(today)
  const daysUntilFullMoon = differenceInDays(nextFullMoon, today)

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
      const newNote = await saveNote({
        date: format(today, "yyyy-MM-dd"),
        text: note.trim(),
        userId: currentUser.uid,
      })

      setSavedNotes([newNote, ...savedNotes])
      setNote("")
      setSaveStatus("saved")

      // Reset status after showing success
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Error saving note:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const toggleAuthModal = () => {
    setShowAuthModal(!showAuthModal)
  }

  const handleLogout = async () => {
    try {
      await logout()
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

  // Convert savedNotes to the format expected by LunarCalendar
  const formattedNotes = savedNotes.map((note) => ({
    date: note.date,
    text: note.text,
  }))

  return (
    <div className="cosmic-container min-h-screen">
      <StarField optimized={true} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Auth */}
        <div className="flex justify-end mb-6">
          {currentUser ? (
            <UserProfile onLogout={handleLogout} />
          ) : (
            <motion.button
              className="flex items-center gap-2 glassmorphism px-4 py-2 rounded-full text-moonglow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAuthModal}
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

        {/* Date Header */}
        <motion.div
          className="mb-8 flex flex-col items-center"
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

          <p className="text-space-100/60 text-sm mt-1 font-poppins">
            {daysUntilFullMoon === 0
              ? "Full Moon tonight! 🌕"
              : `Next full moon in ${daysUntilFullMoon} day${daysUntilFullMoon !== 1 ? "s" : ""} 🌕`}
          </p>
        </motion.div>

        <header className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-4xl font-bold text-moonglow flex items-center justify-center gap-2">
              <Moon className="h-8 w-8" />
              <span>Luna</span>
            </h1>
            <p className="text-stardust/80 font-poppins font-light mt-1">Moon Phase & Daily Reflection</p>
          </motion.div>
        </header>

        <div className="lg:flex lg:items-center lg:gap-12">
          {/* Moon Phase Section */}
          <motion.div
            className="flex-1 flex flex-col items-center mb-12 lg:mb-0 relative"
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
              <MoonPhase phase={moonPhase} size={300} optimized={true} />

              {/* Calendar Button */}
              <motion.button
                className="absolute top-0 right-0 p-2 glassmorphism rounded-full text-moonglow hover:text-white hover:bg-space-700/70 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCalendar}
                aria-label="Open lunar calendar"
              >
                <Calendar className="h-5 w-5" />
              </motion.button>
            </motion.div>

            <motion.h2
              className="text-3xl font-bold mt-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {moonPhase}
            </motion.h2>

            <motion.p
              className="text-xl text-stardust flex items-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <Moon className="h-5 w-5 text-moonglow" />
              {Math.round(illumination * 100)}% Illuminated
            </motion.p>

            <motion.p
              className="text-sm text-stardust/70 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {format(today, "MMMM d, yyyy")}
            </motion.p>

            {specialMessage && (
              <motion.div
                className="mt-6 glassmorphism p-4 rounded-lg border border-moonglow/30 text-moonglow"
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
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-medium text-moonglow mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Daily Reflection
              </h3>

              {!currentUser ? (
                <div className="text-center py-6">
                  <p className="text-stardust/80 mb-4">Sign in to save your reflections to the stars ✨</p>
                  <motion.button
                    className="btn-primary inline-flex items-center gap-2"
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
                    className="input-field h-40 resize-none font-poppins"
                    placeholder="The moon remembers… write your thoughts here."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  <div className="mt-4 flex justify-end">
                    <motion.button
                      className={`btn-primary flex items-center gap-2 ${saveStatus === "saving" ? "opacity-70" : ""} ${
                        saveStatus === "error" ? "border-red-500 text-red-400" : ""
                      }`}
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
                <div className="text-center py-4">
                  <p className="text-stardust/60">Loading your cosmic notes...</p>
                </div>
              ) : (
                currentUser &&
                savedNotes.length === 0 && (
                  <p className="text-center text-stardust/60 mt-6 font-poppins text-sm italic">
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
        className="fixed bottom-6 right-6 p-4 glassmorphism rounded-full text-moonglow shadow-lg shadow-moonglow/20 z-20"
        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(253, 230, 138, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleCalendar}
        aria-label="Toggle lunar calendar"
      >
        <Moon className="h-6 w-6" />
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

