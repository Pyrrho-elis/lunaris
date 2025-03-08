"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Star {
  id: number
  size: number
  top: string
  left: string
  delay: number
  duration: number
  color: string
}

interface StarFieldProps {
  optimized?: boolean
}

const StarField: React.FC<StarFieldProps> = ({ optimized = false }) => {
  const [stars, setStars] = useState<Star[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const generateStars = () => {
      // Reduce star count by 50% if mobile, 30% if optimized desktop
      let densityFactor = 1
      if (isMobile) {
        densityFactor = 0.5
      } else if (optimized) {
        densityFactor = 0.7
      }

      const starCount = Math.floor((window.innerWidth * window.innerHeight) / (6000 / densityFactor))
      const newStars: Star[] = []

      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 2 + (isMobile ? 0.5 : 1)
        const top = `${Math.random() * 100}%`
        const left = `${Math.random() * 100}%`

        // Simpler animation timing for mobile or optimized mode
        const delay = isMobile || optimized ? Math.random() * 2 : Math.random() * 5
        const duration = isMobile || optimized ? 2 : Math.random() * 3 + 2

        // Occasionally create colored stars
        const colors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#E9D8FD", "#FDE68A", "#A78BFA"]
        const color = colors[Math.floor(Math.random() * colors.length)]

        newStars.push({
          id: i,
          size,
          top,
          left,
          delay,
          duration,
          color,
        })
      }

      setStars(newStars)
    }

    generateStars()

    const handleResize = () => {
      generateStars()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("resize", checkMobile)
    }
  }, [optimized, isMobile])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={isMobile || optimized ? "star-optimized" : "star"}
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            backgroundColor: star.color,
            boxShadow:
              isMobile || optimized ? `0 0 ${star.size}px ${star.color}` : `0 0 ${star.size * 2}px ${star.color}`,
            willChange: "opacity, transform",
          }}
          animate={
            isMobile || optimized
              ? {
                  opacity: [0.3, 0.6, 0.3],
                }
              : {
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1, 0.8],
                }
          }
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default StarField

