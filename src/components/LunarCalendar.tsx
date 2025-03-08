"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns"
import { ChevronLeft, ChevronRight, X, Moon, Star } from "lucide-react"
import { getMoonPhase } from "../utils/moonCalculations"

interface Note {
  id?: string
  date: string
  text: string
}

interface SpecialDate {
  date: string
  type: string
  message: string
}

interface LunarCalendarProps {
  onClose: () => void
  savedNotes: Note[]
  specialDates: SpecialDate[]
  currentDate: Date
  onDateChange: (date: Date) => void
}

interface DateDetails {
  date: Date
  moonPhase: string
  hasNote: boolean
  isSpecialDate: boolean
  isFullMoon: boolean
  specialMessage?: string
  noteText?: string
  noteId?: string
}

const LunarCalendar: React.FC<LunarCalendarProps> = ({
  onClose,
  savedNotes,
  specialDates,
  currentDate,
  onDateChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(currentDate))
  const [selectedDate, setSelectedDate] = useState<DateDetails | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Update current month when currentDate changes
  useEffect(() => {
    setCurrentMonth(new Date(currentDate))
  }, [currentDate])

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Get days for the current month view
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: startDate, end: endDate })
  }

  // Check if a date has a saved note
  const hasNote = (date: Date) => {
    return savedNotes.some((note) => isSameDay(parseISO(note.date), date))
  }

  // Get note text for a date
  const getNoteText = (date: Date) => {
    const note = savedNotes.find((note) => isSameDay(parseISO(note.date), date))
    return note ? note.text : ""
  }

  // Check if a date is a special date
  const isSpecialDate = (date: Date) => {
    return specialDates.some((special) => isSameDay(parseISO(special.date), date))
  }

  // Get special message for a date
  const getSpecialMessage = (date: Date) => {
    const special = specialDates.find((special) => isSameDay(parseISO(special.date), date))
    return special ? special.message : ""
  }

  // Check if a date is a full moon
  const isFullMoon = (date: Date) => {
    return getMoonPhase(date) === "Full Moon"
  }

  // Handle date selection
  const handleDateClick = (date: Date) => {
    const moonPhase = getMoonPhase(date)
    const hasNoteFlag = hasNote(date)
    const isSpecialDateFlag = isSpecialDate(date)
    const isFullMoonFlag = isFullMoon(date)

    // Update the selected date in the parent component
    onDateChange(date)

    // Find the note for this date to get its id
    const noteForDate = savedNotes.find((note) => isSameDay(parseISO(note.date), date))

    setSelectedDate({
      date,
      moonPhase,
      hasNote: hasNoteFlag,
      isSpecialDate: isSpecialDateFlag,
      isFullMoon: isFullMoonFlag,
      specialMessage: isSpecialDateFlag ? getSpecialMessage(date) : undefined,
      noteText: hasNoteFlag ? getNoteText(date) : undefined,
      noteId: noteForDate?.id,
    })

    // On mobile, close the calendar after selecting a date
    if (isMobile) {
      setTimeout(() => {
        onClose()
      }, 500)
    }
  }

  // Close date details popover
  const closeDetails = () => {
    setSelectedDate(null)
  }

  // Render the calendar days
  const renderDays = () => {
    const days = getDaysInMonth()
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
      <div className="calendar-grid">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-stardust/70 text-xs md:text-sm py-1 md:py-2 font-medium">
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, currentDate)
            const hasNoteFlag = hasNote(day)
            const isSpecialDateFlag = isSpecialDate(day)
            const isFullMoonFlag = isFullMoon(day)

            return (
              <motion.button
                key={day.toString()}
                className={`
                  relative h-8 md:h-12 w-full rounded-full flex items-center justify-center
                  ${isCurrentMonth ? "text-white" : "text-white/30"}
                  ${isToday ? "bg-space-700/50" : ""}
                  ${isSelected ? "bg-space-600/70" : ""}
                  hover:bg-space-700/30 transition-all
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={() => handleDateClick(day)}
              >
                {/* Full Moon Indicator */}
                {isFullMoonFlag && isCurrentMonth && (
                  <div className="absolute inset-0 rounded-full border border-moonglow/70"></div>
                )}

                {/* Date Number */}
                <span
                  className={`z-10 text-xs md:text-base ${isToday ? "font-bold" : ""} ${isSelected ? "text-moonglow font-bold" : ""}`}
                >
                  {format(day, "d")}
                </span>

                {/* Special Date Indicator */}
                {isSpecialDateFlag && isCurrentMonth && (
                  <div className="absolute top-0 md:top-1 right-0 md:right-1">
                    <Star className="h-2 w-2 md:h-3 md:w-3 text-cyan-300" fill="#6EE7B7" />
                  </div>
                )}

                {/* Note Indicator */}
                {hasNoteFlag && isCurrentMonth && (
                  <div className="absolute bottom-0 md:bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 md:h-2 md:w-2 rounded-full bg-pink-400"></div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 bg-space-900/80 backdrop-blur-md flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Calendar Container */}
      <motion.div
        className="w-11/12 max-w-sm md:max-w-lg glassmorphism rounded-xl p-4 md:p-6 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 300,
          duration: 0.2,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="absolute top-2 right-2 md:top-4 md:right-4 text-white/70 hover:text-white" onClick={onClose}>
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            onClick={prevMonth}
            className="p-1 text-moonglow/70 hover:text-moonglow"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>

          <h2 className="text-lg md:text-xl font-bold text-white font-mono">{format(currentMonth, "MMMM yyyy")}</h2>

          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            onClick={nextMonth}
            className="p-1 text-moonglow/70 hover:text-moonglow"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        {renderDays()}

        {/* Empty State */}
        {getDaysInMonth().every((day) => !hasNote(day) && !isSpecialDate(day) && !isFullMoon(day)) && (
          <p className="text-center text-stardust/60 mt-4 md:mt-6 font-poppins text-xs md:text-sm italic">
            No notes or events this month... yet. 🌙
          </p>
        )}

        {/* Legend */}
        <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 md:h-3 md:w-3 rounded-full border border-moonglow/70"></div>
            <span>Full Moon</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-2 w-2 md:h-3 md:w-3 text-cyan-300" fill="#6EE7B7" />
            <span>Special Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 md:h-2 md:w-2 rounded-full bg-pink-400"></div>
            <span>Saved Note</span>
          </div>
        </div>
      </motion.div>

      {/* Date Details Popover - Only show on larger screens */}
      {selectedDate && !isMobile && (
        <motion.div
          className="absolute glassmorphism rounded-lg p-3 md:p-4 shadow-xl max-w-xs w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            damping: 20,
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="absolute top-2 right-2 text-white/70 hover:text-white" onClick={closeDetails}>
            <X className="h-3 w-3 md:h-4 md:w-4" />
          </button>

          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-space-700/50 rounded-full text-sm md:text-base">
              {format(selectedDate.date, "d")}
            </div>
            <div>
              <h3 className="font-medium text-sm md:text-base">{format(selectedDate.date, "MMMM d, yyyy")}</h3>
              <div className="flex items-center text-xs md:text-sm text-stardust/70">
                <Moon className="h-3 w-3 mr-1" />
                {selectedDate.moonPhase}
              </div>
            </div>
          </div>

          {selectedDate.isFullMoon && (
            <div className="mb-2 md:mb-3 p-2 bg-space-700/30 rounded border-l-2 border-moonglow">
              <h4 className="text-moonglow font-medium text-xs md:text-sm">Full Moon Tonight!</h4>
              <p className="text-xs text-stardust/80">A time for completion and clarity.</p>
            </div>
          )}

          {selectedDate.isSpecialDate && selectedDate.specialMessage && (
            <div className="mb-2 md:mb-3 p-2 bg-space-700/30 rounded border-l-2 border-cyan-400">
              <h4 className="text-cyan-300 font-medium text-xs md:text-sm">A Special Day ✨</h4>
              <p className="text-xs text-stardust/80">{selectedDate.specialMessage}</p>
            </div>
          )}

          {selectedDate.hasNote && selectedDate.noteText && (
            <div className="p-2 bg-space-700/30 rounded border-l-2 border-pink-400">
              <h4 className="text-pink-300 font-medium text-xs md:text-sm">Your Note:</h4>
              <p className="text-xs text-stardust/80 line-clamp-3">{selectedDate.noteText}</p>
            </div>
          )}

          {!selectedDate.isFullMoon && !selectedDate.isSpecialDate && !selectedDate.hasNote && (
            <p className="text-center text-stardust/60 italic text-xs">No events or notes for this day.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default LunarCalendar

