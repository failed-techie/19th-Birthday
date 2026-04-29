import { useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#wishes', label: 'Wishes' },
  { href: '#messages', label: 'Wall' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav-wrap">
      <div className="nav-shell">
        <a className="brand" href="#home" aria-label="Bhonduuu's 19th birthday website">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{verticalAlign: 'middle', marginRight: '8px'}}>
            <path d="M12 2l2 3.5L18 6l-2 2 1 3-3-1-3 1 1-3-2-2 4-0.5L12 2z" stroke="#F2C4CE" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Bhonduuu 19
        </a>

        <nav aria-label="Primary">
          <button
            className="nav-hamburger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
              <rect width="24" height="2" rx="1" fill="#F2C4CE" />
              <rect y="8" width="24" height="2" rx="1" fill="#F2C4CE" />
              <rect y="16" width="24" height="2" rx="1" fill="#F2C4CE" />
            </svg>
          </button>

          <ul className={`nav-links ${open ? 'nav-links--open' : ''}`}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar