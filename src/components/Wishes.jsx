import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import photo from '../assets/photos/photo1.jpeg'

const wish = {
  author: '~Prayas',
  message:
    "Happy Birthday Prachi 🎂❤️\n\nBhondu, you're honestly one of the best things that have happened. It just feels better with you in it — more fun, more stupid, more everything, more gossips.\n\nI don't say it much — I'll always be there for you…!\n\nEnjoy your day, eat a lot, smile more, and stay the same cute, annoying bhondu I know 🐙❤️\n\nHappy Birthday once again 🎉✨",
  src: photo,
}

function Wishes() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <section className="wishes-section" id="wishes" ref={ref}>
      <motion.div
        className="wishes-header"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="wishes-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{verticalAlign: 'middle', marginRight: '8px'}}>
            <path d="M3 7.5v9A2.5 2.5 0 0 0 5.5 19h13a2.5 2.5 0 0 0 2.5-2.5v-9" stroke="#F2C4CE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 7.5l-9 6-9-6" stroke="#F2C4CE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 13s1.5-1.2 3-2.4" stroke="#F2C4CE" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          A Note from the Heart
        </h2>
      </motion.div>

      <motion.div
        className="wishes-container"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="circular-wish">
          <div className="wish-ring">
            <div className="wish-ring-inner" />
          </div>

          <div className="wish-image-wrapper">
            <img src={wish.src} alt={wish.author} className="wish-image" />
          </div>

          <div className="wish-content">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="wish-author">{wish.author}</h3>
              <p className="wish-text">{wish.message}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Wishes