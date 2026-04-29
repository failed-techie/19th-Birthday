import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function MusicPlayer({ audioRef, isPlaying, setIsPlaying }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const toggle = () => {
    const audio = audioRef?.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = 0.3
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  return (
    <div>
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="floating-music-button"
          onClick={toggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <>
              <span className="floating-music-ring" aria-hidden />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="#ffffff" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="#ffffff" />
              </svg>
            </>
          ) : (
            <span className="floating-music-note">♪</span>
          )}
        </motion.button>
      </AnimatePresence>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.18 }}
            className="floating-music-tooltip"
          >
            <div className="floating-music-tooltip__inner">🎵 Birthday tune</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
