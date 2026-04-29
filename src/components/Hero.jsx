import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

const HEART_COLORS = ['#FF0000', '#CC0000']
const BALLOON_COLORS = ['#FF69B4', '#FF1493']
const BOKEH = [
  { top: '8%', left: '10%', size: 240, color: '#F2C4CE' },
  { top: '18%', right: '8%', size: 320, color: '#D8B4FE' },
  { top: '50%', left: '6%', size: 280, color: '#E8C99A' },
  { top: '56%', right: '12%', size: 260, color: '#B5C9B7' },
  { bottom: '10%', left: '42%', size: 340, color: '#E8A0B0' },
]

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function createShapes(count = 30, scaleFactor = 1) {
  return Array.from({ length: count }, (_, index) => {
    const type = Math.random() > 0.5 ? 'heart' : 'balloon'
    const palette = type === 'heart' ? HEART_COLORS : BALLOON_COLORS
    return {
      id: `shape-${index}`,
      type,
      color: palette[index % palette.length],
      size: Math.round((randomBetween(12, 28) * (type === 'heart' ? 1.15 : 1.2)) * scaleFactor),
      left: `${randomBetween(0, 100).toFixed(2)}%`,
      top: `${randomBetween(0, 100).toFixed(2)}%`,
      duration: `${randomBetween(6, 14).toFixed(2)}s`,
      delay: `${randomBetween(0, 8).toFixed(2)}s`,
      opacity: randomBetween(0.6, 0.85).toFixed(2),
      sway: randomBetween(6, 18).toFixed(1),
      bob: randomBetween(3, 10).toFixed(1),
      rotate: randomBetween(-18, 18).toFixed(1),
      parallaxX: randomBetween(8, 26).toFixed(1),
      parallaxY: randomBetween(8, 26).toFixed(1),
    }
  })
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function Hero() {
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 })
  const isClient = typeof window !== 'undefined'
  const isMobile = isClient && window.innerWidth < 768
  const shapes = useMemo(() => createShapes(isMobile ? 20 : 30, isMobile ? 0.6 : 1), [isMobile])

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    setCursor({
      x: Number.isFinite(x) ? x : 0.5,
      y: Number.isFinite(y) ? y : 0.5,
    })
  }

  return (
    <section
      className="birthday-hero"
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setCursor({ x: 0.5, y: 0.5 })}
    >
      <div className="birthday-hero__bokeh" aria-hidden="true">
        <div
          className="birthday-hero__glow"
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,0,100,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {BOKEH.map((circle, index) => (
          <div
            className="birthday-hero__bokeh-circle"
            key={`${circle.color}-${index}`}
            style={{
              top: circle.top,
              left: circle.left,
              right: circle.right,
              bottom: circle.bottom,
              width: `${Math.round(circle.size * (isMobile ? 0.6 : 1))}px`,
              height: `${Math.round(circle.size * (isMobile ? 0.6 : 1))}px`,
              background: circle.color,
            }}
          />
        ))}
      </div>

      <div className="birthday-hero__shapes" aria-hidden="true">
        {shapes.map((shape) => {
          const offsetX = (cursor.x - 0.5) * Number(shape.parallaxX)
          const offsetY = (cursor.y - 0.5) * Number(shape.parallaxY)

          return (
            <div
              className="birthday-hero__shape-shell"
              key={shape.id}
              style={{
                left: shape.left,
                top: shape.top,
                opacity: shape.opacity,
                transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
              }}
            >
              <span
                className={`birthday-hero__shape birthday-hero__shape--${shape.type}`}
                style={{
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                  '--shape-color': shape.color,
                  '--shape-duration': shape.duration,
                  '--shape-delay': shape.delay,
                  '--shape-sway': `${shape.sway}px`,
                  '--shape-bob': `${shape.bob}px`,
                  '--shape-rotate': `${shape.rotate}deg`,
                }}
              >
                {shape.type === 'heart' ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 28" aria-hidden="true">
                    <ellipse cx="12" cy="10" rx="8" ry="10" fill="currentColor" />
                    <path d="M12 20.5v5.5" stroke="#7A5C6A" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M12 26l-1.2-2.2" stroke="#7A5C6A" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </div>
          )
        })}
      </div>

      <motion.div
        className="birthday-hero__content"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.15,
            },
          },
        }}
      >
        <motion.p className="birthday-hero__label" variants={fadeUp}>
          today is all about
        </motion.p>
        <motion.h1 className="birthday-hero__title" variants={fadeUp}>
          Prachi
        </motion.h1>
        <motion.h2 className="birthday-hero__subtitle" variants={fadeUp}>
          Turns 19
        </motion.h2>
        <motion.div className="birthday-hero__divider" variants={fadeUp} />
        <motion.p className="birthday-hero__tagline" variants={fadeUp}>
          Every candle lit, every wish made — this day was written just for you.
        </motion.p>
      </motion.div>

      <motion.div
        className="birthday-hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="birthday-hero__scroll-chevron">⌄</span>
      </motion.div>
    </section>
  )
}

export default Hero