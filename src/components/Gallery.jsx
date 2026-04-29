import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import { photos } from '../data/photos.js'

function GalleryCard({ photo, index, onOpenLightbox }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [shinePos, setShinePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Calculate tilt angles (-10 to 10 degrees)
    const rotX = ((y - rect.height / 2) / rect.height) * -20
    const rotY = ((x - rect.width / 2) / rect.width) * 20

    setRotateX(rotX)
    setRotateY(rotY)

    // Shine position (0-100%)
    const shineX = (x / rect.width) * 100
    const shineY = (y / rect.height) * 100

    setShinePos({ x: shineX, y: shineY })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setShinePos({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={ref}
      className="gallery-card-wrapper"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="gallery-card-inner"
        style={{
          rotateX: `${rotateX}deg`,
          rotateY: `${rotateY}deg`,
          transformStyle: 'preserve-3d',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        <div
          className="gallery-card-image"
          style={{
            backgroundImage: `url(${photo.src})`,
          }}
          role="img"
          aria-label={photo.caption}
        />

        <div className="gallery-card-shine" style={{ left: `${shinePos.x}%`, top: `${shinePos.y}%` }} />

        <div className="gallery-card-caption">
          <p>{photo.caption}</p>
        </div>

        <button
          className="gallery-card-overlay"
          onClick={() => onOpenLightbox(photo)}
          aria-label={`View ${photo.caption}`}
        />
      </motion.div>
    </motion.div>
  )
}

function Lightbox({ photo, index, total, onClose, onNext, onPrev }) {
  return (
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={photo.src} alt={photo.caption} />

        <div className="lightbox-info">
          <p className="lightbox-caption">{photo.caption}</p>
          <span className="lightbox-counter">
            {index + 1} / {total}
          </span>
        </div>

        {index > 0 && (
          <button className="lightbox-btn lightbox-btn--prev" onClick={onPrev} aria-label="Previous photo">
            ‹
          </button>
        )}

        {index < total - 1 && (
          <button className="lightbox-btn lightbox-btn--next" onClick={onNext} aria-label="Next photo">
            ›
          </button>
        )}

        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <h2 className="gallery-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{verticalAlign: 'middle', marginRight: '8px'}}>
              <path d="M4 7h3l2-2h6l2 2h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="#F2C4CE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3" stroke="#F2C4CE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Moments
          </h2>
        </motion.div>

        <div className="gallery-grid-3d">
          {photos.map((photo, index) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              index={index}
              onOpenLightbox={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photo={currentPhoto}
          index={lightboxIndex}
          total={photos.length}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)}
        />
      )}
    </section>
  )
}

export default Gallery