import { useState, useEffect, useCallback } from 'react'
import styles from './navbar.module.css'

const links = ['Skills', 'Experience', 'Projects']

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = links.map(l => document.getElementById(l.toLowerCase())).filter(Boolean)
      const current = sections.reduce((acc, el) => {
        return el.getBoundingClientRect().top <= 120 ? el.id : acc
      }, '')
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      {/* Logo */}
      <button className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
          <text x="0" y="24" fontFamily="Playfair Display, Georgia, serif" fontStyle="italic"
            fontSize="28" fill="currentColor" letterSpacing="-0.5">KS</text>
        </svg>
      </button>

      {/* Desktop links */}
      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {links.map(l => (
          <button
            key={l}
            className={`${styles.link} ${active === l.toLowerCase() ? styles.linkActive : ''}`}
            onClick={() => scrollTo(l.toLowerCase())}
          >
            {l}
          </button>
        ))}
      </div>

      <div className={styles.right}>
        <div className={styles.avail}>
          <span className={styles.dot} />
          Open to work
        </div>

        {/* Theme toggle */}
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Hire me → smooth scroll to Contact */}
        <button
          className={styles.hirebtn}
          onClick={() => scrollTo('contact')}
        >
          Let’s Connect
        </button>
      </div>

      <button
        className={styles.burger}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span className={menuOpen ? styles.burgerX1 : ''} />
        <span className={menuOpen ? styles.burgerHide : ''} />
        <span className={menuOpen ? styles.burgerX2 : ''} />
      </button>
    </nav>
  )
}