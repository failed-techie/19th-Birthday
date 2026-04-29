import './App.css'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import FloatingPetals from './components/FloatingPetals.jsx'
import Gallery from './components/Gallery.jsx'
import EntryPage from './components/EntryPage.jsx'
import Hero from './components/Hero.jsx'
import MessageWall from './components/MessageWall.jsx'
import Navbar from './components/Navbar.jsx'
import Wishes from './components/Wishes.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import birthdayTune from './assets/music/birthday.mp3'

function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const handleEnter = () => setHasEntered(true)

    window.addEventListener('birthday-enter', handleEnter)

    return () => {
      window.removeEventListener('birthday-enter', handleEnter)
    }
  }, [])

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at top, #2D0A1E 0%, #1A0812 50%, #0D0408 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <EntryPage
              onEnter={() => {
                setHasEntered(true)
                // attempt to auto-play music after a short delay by signaling the player
                setTimeout(() => window.dispatchEvent(new Event('birthday-play-music')), 1200)
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            className="app-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <FloatingPetals />
            <Navbar />

            <main>
              <Hero />
              <Gallery />
              <Wishes />
              <MessageWall />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      {/* global audio element always present */}
      <audio ref={audioRef} loop preload="auto" src={birthdayTune} />
      <MusicPlayer audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </div>
  )
}

export default App
