import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const GLASS_CARDS = [
  {
    id: 1,
    message: 'May your 19th feel gentle, golden, and a little bit unforgettable.',
    gradient: 'linear-gradient(135deg, rgba(242, 196, 206, 0.15), rgba(232, 160, 176, 0.1))', // blush
  },
  {
    id: 2,
    message: 'Here is to more laughter at the table and more reasons to celebrate.',
    gradient: 'linear-gradient(135deg, rgba(216, 180, 254, 0.15), rgba(200, 160, 230, 0.1))', // lilac
  },
  {
    id: 3,
    message: ' I\'m proud of the strength you carry and the passion you put into everything you do. You inspire me every single day. Keep going  I\'ll always be right here cheering for you. Even if I\'m not there.',
    gradient: 'linear-gradient(135deg, rgba(181, 201, 183, 0.15), rgba(160, 190, 160, 0.1))', // sage
  },
]

function GlassCard({ message, gradient, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

  // Mouse tracking for 3D tilt (disabled on touch devices)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e) => {
    if (isTouch) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = e.clientX - rect.left - centerX
    const mouseY = e.clientY - rect.top - centerY
    
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    if (!isTouch) {
      x.set(0)
      y.set(0)
    }
    setIsHovered(false)
  }

  return (
    <motion.div
      className="glass-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        rotateX: isTouch ? 0 : rotateX,
        rotateY: isTouch ? 0 : rotateY,
      }}
      whileHover={{ scale: 1.03 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <div
        className="glass-card-bg"
        style={{
          background: gradient,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px rgba(232, 160, 176, 0.2)',
        }}
      />
      <p className="glass-card-text">{message}</p>
    </motion.div>
  )
}

function MessageWall() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [messageText, setMessageText] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (name.trim() && messageText.trim()) {
      const newMessage = {
        id: Date.now(),
        message: messageText,
        gradient: `linear-gradient(135deg, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.15), rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1))`,
      }
      
      setMessages([...messages, newMessage])
      setName('')
      setMessageText('')
      
      // Show toast
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const allCards = [...GLASS_CARDS, ...messages]

  return (
    <section className="message-wall-section" id="messages">
      <motion.h2
        className="message-wall-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{verticalAlign: 'middle', marginRight: '8px'}}>
          <path d="M12 2l1.5 4.5L18 8l-3.75 2.75L15 15l-3-2-3 2 .75-4.25L6 8l4.5-1.5L12 2z" stroke="#F2C4CE" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Some more wishes
      </motion.h2>

      <div className="message-wall-grid">
        {allCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <GlassCard
              message={card.message}
              gradient={card.gradient}
              index={index}
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        className="message-wall-closing"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        Any more options ma'am? Hahhaaa just kidding
      </motion.p>

      {showToast && (
        <motion.div
          className="message-wall-toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          ✨ Wish sent!
        </motion.div>
      )}
    </section>
  )
}

export default MessageWall