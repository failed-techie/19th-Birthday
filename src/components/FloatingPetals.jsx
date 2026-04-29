import { useEffect, useState } from 'react'

const HEART_COLORS = ['#FF0000', '#CC0000', '#FF3333']
const BALLOON_COLORS = ['#FF69B4', '#FF1493', '#FF69B4']

function generateFloatingElements(targetCount = 35) {
  const elements = []

  const hearts = Math.round(targetCount * 0.5)
  const balloons = targetCount - hearts

  for (let i = 0; i < hearts; i++) {
    elements.push({
      id: `heart-${i}`,
      type: 'heart',
      color: HEART_COLORS[i % HEART_COLORS.length],
      size: 10 + Math.random() * 18,
      left: Math.random() * 100,
      top: Math.random() * 120 - 10,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
    })
  }

  for (let i = 0; i < balloons; i++) {
    elements.push({
      id: `balloon-${i}`,
      type: 'balloon',
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      size: 10 + Math.random() * 20,
      left: Math.random() * 100,
      top: Math.random() * 120 - 10,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
    })
  }

  return elements
}

function FloatingPetals() {
  const [elements, setElements] = useState([])

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 18 : 35

    setElements(generateFloatingElements(count))

    function onResize() {
      const nowMobile = window.innerWidth < 768
      const target = nowMobile ? 18 : 35
      setElements(generateFloatingElements(target))
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="floating-petals-global" aria-hidden="true">
      {elements.map((element) => (
        <span
          key={element.id}
          className={`floating-element floating-element--${element.type}`}
          style={{
            left: `${element.left}%`,
            top: `${element.top}vh`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            '--element-color': element.color,
            '--element-duration': `${element.duration}s`,
            '--element-delay': `${element.delay}s`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
            willChange: 'transform, opacity',
          }}
        >
          {element.type === 'heart' ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 28" aria-hidden="true">
              <ellipse cx="12" cy="10" rx="8" ry="10" fill="currentColor" />
              <path d="M12 20.5v5.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      ))}
    </div>
  )
}

export default FloatingPetals