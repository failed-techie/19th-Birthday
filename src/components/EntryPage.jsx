import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import FloatingPetals from './FloatingPetals.jsx'
import Gallery from './Gallery.jsx'
import Hero from './Hero.jsx'
import MessageWall from './MessageWall.jsx'
import Navbar from './Navbar.jsx'
import Wishes from './Wishes.jsx'

const CORRECT_CODE = '3004'
const INPUT_COUNT = 4

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

function EntryPage({ onEnter }) {
  const [code, setCode] = useState(Array(INPUT_COUNT).fill(''))
  const [status, setStatus] = useState('idle')
  const [showButton, setShowButton] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const inputRefs = useRef([])
  const enterButtonRef = useRef(null)

  useEffect(() => {
    let clearInputsTimer
    let clearStatusTimer

    if (status === 'error') {
      clearInputsTimer = window.setTimeout(() => {
        setCode(Array(INPUT_COUNT).fill(''))
        inputRefs.current[0]?.focus()
      }, 400)

      clearStatusTimer = window.setTimeout(() => {
        setStatus('idle')
      }, 2500)
    }

    return () => {
      if (clearInputsTimer) window.clearTimeout(clearInputsTimer)
      if (clearStatusTimer) window.clearTimeout(clearStatusTimer)
    }
  }, [status])

  useEffect(() => {
    const candidate = code.join('')

    if (status !== 'idle' || candidate.length !== INPUT_COUNT || code.some((digit) => !digit)) {
      return
    }

    if (candidate === CORRECT_CODE) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [code, status])

  useEffect(() => {
    let actionTimer

    if (status === 'success') {
      actionTimer = window.setTimeout(() => {
        setShowButton(true)
      }, 1000)
    } else {
      setShowButton(false)
    }

    return () => {
      if (actionTimer) window.clearTimeout(actionTimer)
    }
  }, [status])

  useEffect(() => {
    const buttonNode = enterButtonRef.current

    if (!buttonNode || !showButton) {
      return undefined
    }

    const handleNativeEnter = () => {
      setIsUnlocked(true)
      window.dispatchEvent(new Event('birthday-enter'))
      onEnter?.()
    }

    buttonNode.addEventListener('click', handleNativeEnter)

    return () => {
      buttonNode.removeEventListener('click', handleNativeEnter)
    }
  }, [showButton, onEnter])

  useEffect(() => {
    if (status !== 'success' || !showButton || isUnlocked) {
      return undefined
    }

    const autoUnlockTimer = window.setTimeout(() => {
      setIsUnlocked(true)
    }, 1200)

    return () => window.clearTimeout(autoUnlockTimer)
  }, [status, showButton, isUnlocked])

  if (isUnlocked) {
    return (
      <motion.div
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
    )
  }

  const handleChange = (index, value) => {
    const nextValue = value.replace(/[^0-9]/g, '').slice(-1)
    const nextCode = [...code]
    nextCode[index] = nextValue

    setCode(nextCode)

    if (nextValue && index < INPUT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setCode((currentCode) => {
        const updatedCode = [...currentCode]
        updatedCode[index - 1] = ''
        return updatedCode
      })
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedValue = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, INPUT_COUNT)

    if (!pastedValue) return

    const nextCode = Array(INPUT_COUNT).fill('')

    pastedValue.split('').forEach((char, index) => {
      nextCode[index] = char
    })

    setCode(nextCode)

    if (pastedValue.length !== INPUT_COUNT) {
      const targetIndex = Math.min(pastedValue.length, INPUT_COUNT - 1)
      inputRefs.current[targetIndex]?.focus()
    }
  }

  return (
    <motion.section
      className="entry-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <FloatingPetals />

      <div className="entry-page__inner">
        <motion.div
          className="entry-page__content"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } },
          }}
        >
          <motion.p className="entry-page__label" variants={fadeUp}>
            — a little something for —
          </motion.p>

          <motion.h1 className="entry-page__title" variants={fadeUp}>
            Prachi
          </motion.h1>

          <motion.p className="entry-page__subtitle" variants={fadeUp}>
            Enter your special date to continue
          </motion.p>

          <motion.div className="entry-page__divider" variants={fadeUp} />

          <motion.div
            className="entry-page__otp-shell"
            variants={fadeUp}
            animate={status === 'success' ? { boxShadow: '0 0 20px rgba(242,196,206,0.4)' } : { boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="entry-page__otp-row"
              animate={status === 'error' ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    inputRefs.current[index] = node
                  }}
                  className="entry-page__otp-input"
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onFocus={(event) => event.currentTarget.select()}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.p
                key="error"
                className="entry-page__message entry-page__message--error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                Oops! Try kar Bhonduuu! 🙈
              </motion.p>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                className="entry-page__success-wrap"
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <p className="entry-page__message entry-page__message--success">Bhonduu samjhdar to hai! 🎉</p>

                {showButton && (
                  <motion.div
                    className="entry-page__enter-button-shell"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.28 }}
                  >
                    <button
                      ref={enterButtonRef}
                      type="button"
                      className="entry-page__enter-button"
                      onClick={onEnter}
                    >
                      Dive into the Special Day ✨
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </motion.section>
  )
}

export default EntryPage