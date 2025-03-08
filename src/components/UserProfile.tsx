"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, Settings } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface UserProfileProps {
  onLogout: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const { currentUser } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

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

  if (!currentUser) return null

  const displayName = currentUser.displayName || "Cosmic Explorer"
  const email = currentUser.email
  const photoURL = currentUser.photoURL

  return (
    <div className="relative">
      <motion.button
        className="flex items-center gap-2 glassmorphism px-3 py-2 rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
      >
        {photoURL ? (
          <img src={photoURL || "/placeholder.svg"} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-space-700 flex items-center justify-center text-moonglow">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-white text-sm hidden md:block">{displayName}</span>
      </motion.button>

      {showDropdown && (
        <motion.div
          className="absolute right-0 mt-2 w-64 glassmorphism rounded-lg shadow-xl z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="p-4 border-b border-stardust/10">
            <div className="flex items-center gap-3">
              {photoURL ? (
                <img
                  src={photoURL || "/placeholder.svg"}
                  alt={displayName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-space-700 flex items-center justify-center text-moonglow text-xl">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium text-white">{displayName}</div>
                <div className="text-xs text-stardust/70">{email}</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 text-stardust hover:bg-space-700/50 transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <button
              className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 text-red-300 hover:bg-red-900/30 transition-colors"
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

