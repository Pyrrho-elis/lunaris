"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { LogOut, Settings } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface UserProfileProps {
  onLogout: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const { currentUser } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleLogout = async () => {
    try {
      await onLogout()
      setShowDropdown(false)
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!currentUser) return null

  const displayName = currentUser.displayName || "Cosmic Explorer"
  const email = currentUser.email
  const photoURL = currentUser.photoURL

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className="flex items-center gap-2 glassmorphism px-2 py-1.5 md:px-3 md:py-2 rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
      >
        {photoURL ? (
          <img
            src={photoURL || "/placeholder.svg"}
            alt={displayName}
            className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-space-700 flex items-center justify-center text-moonglow text-xs md:text-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-white text-xs md:text-sm hidden sm:block">{displayName}</span>
      </motion.button>

      {showDropdown && (
        <motion.div
          className="absolute right-0 mt-2 w-56 md:w-64 glassmorphism rounded-lg shadow-xl z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="p-3 md:p-4 border-b border-stardust/10">
            <div className="flex items-center gap-3">
              {photoURL ? (
                <img
                  src={photoURL || "/placeholder.svg"}
                  alt={displayName}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-space-700 flex items-center justify-center text-moonglow text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium text-white text-sm md:text-base">{displayName}</div>
                <div className="text-xs text-stardust/70">{email}</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full text-left px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-stardust text-sm md:text-base hover:bg-space-700/50 transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <button
              className="w-full text-left px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-red-300 text-sm md:text-base hover:bg-red-900/30 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default UserProfile

