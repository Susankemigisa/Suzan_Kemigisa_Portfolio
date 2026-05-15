import { useState, useEffect, createContext, useContext, useRef } from 'react'
import Navbar from './navbar.jsx'
import Hero from './hero.jsx'
import Skills from './skills.jsx'
import Experience from './experience.jsx'
import Projects from './projects.jsx'
import Contact from './contact.jsx'
import Footer from './footer.jsx'

// ─── Admin Context ─────────────────────────────────────────────────────────────
// Shared across all components so Hero + Projects know if admin is unlocked
export const AdminContext = createContext(false)
export function useAdmin() { return useContext(AdminContext) }

// ─── Cursor sparkles (follows mouse, NOT background) ──────────────────────────
function CursorSparkles() {
  const cursorRef = useRef(null)
  const trailRef  = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const trail = useRef({ x: 0, y: 0 })
  const raf  = useRef(null)
  const lastSparkle = useRef(0)

  useEffect(() => {
    const cursor = cursorRef.current
    const trailEl = trailRef.current
    if (!cursor || !trailEl) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'

      // Spawn sparkle every ~80ms while moving
      const now = Date.now()
      if (now - lastSparkle.current > 80) {
        lastSparkle.current = now
        const spark = document.createElement('div')
        spark.className = 'cursor-spark'
        const colors = ['#F0C060', '#9D7FEA', '#2DD4BF', '#E87EA1']
        const c = colors[Math.floor(Math.random() * colors.length)]
        const dx = (Math.random() - 0.5) * 28
        const dy = (Math.random() - 0.5) * 28
        spark.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${c};--sdx:${dx}px;--sdy:${dy}px`
        document.body.appendChild(spark)
        setTimeout(() => spark.remove(), 600)
      }
    }

    const onDown = () => cursor.classList.add('clicking')
    const onUp   = () => cursor.classList.remove('clicking')

    const onEnter = () => {
      cursor.classList.add('hovering')
      trailEl.classList.add('hovering')
    }
    const onLeave = () => {
      cursor.classList.remove('hovering')
      trailEl.classList.remove('hovering')
    }

    // Smooth trail animation
    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.18
      trail.current.y += (pos.current.y - trail.current.y) * 0.18
      trailEl.style.left = trail.current.x + 'px'
      trailEl.style.top  = trail.current.y + 'px'
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div id="ks-cursor" ref={cursorRef} aria-hidden="true" />
      <div id="ks-trail"  ref={trailRef}  aria-hidden="true" />
    </>
  )
}

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─── Admin password — set VITE_ADMIN_PASSWORD in your Vercel env vars ──────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''

// ─── Custom admin login modal ──────────────────────────────────────────────────
const modalStyles = `
  .admin-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    z-index: 9000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn .2s ease;
  }
  .admin-modal {
    background: var(--s1);
    border: 1px solid var(--border2);
    border-radius: 16px;
    padding: 2.2rem 2rem;
    width: min(380px, 90vw);
    animation: slideUp .22s cubic-bezier(.16,1,.3,1);
  }
  .admin-modal-icon {
    width: 44px; height: 44px;
    background: rgba(240,192,96,0.1);
    border: 1px solid rgba(240,192,96,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; margin-bottom: 1.2rem;
  }
  .admin-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 400;
    color: var(--text); margin-bottom: .3rem;
  }
  .admin-modal-sub {
    font-size: 12px; color: var(--muted);
    margin-bottom: 1.5rem; line-height: 1.6;
  }
  .admin-modal-label {
    font-size: 11px; letter-spacing: .1em;
    text-transform: uppercase; color: var(--muted);
    display: block; margin-bottom: 6px;
  }
  .admin-modal-input-wrap {
    position: relative; margin-bottom: .5rem;
  }
  .admin-modal-input {
    width: 100%; background: var(--s3);
    border: 1px solid var(--border2);
    color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14px; padding: 11px 42px 11px 14px;
    border-radius: 8px; outline: none; box-sizing: border-box;
    transition: border-color .2s;
  }
  .admin-modal-input:focus { border-color: var(--gold); }
  .admin-modal-input.shake { animation: shake .35s ease; }
  .admin-modal-eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--muted); padding: 4px; display: flex;
    transition: color .2s;
  }
  .admin-modal-eye:hover { color: var(--text); }
  .admin-modal-error {
    font-size: 12px; color: var(--rose);
    margin-bottom: 1rem; min-height: 16px;
  }
  .admin-modal-actions {
    display: flex; gap: .7rem; justify-content: flex-end;
  }
  .admin-modal-cancel {
    background: transparent;
    border: 1px solid var(--border2); color: var(--muted);
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    letter-spacing: .07em; text-transform: uppercase;
    padding: 10px 18px; border-radius: 4px;
    cursor: pointer; transition: all .2s;
  }
  .admin-modal-cancel:hover { border-color: var(--rose); color: var(--rose); }
  .admin-modal-submit {
    background: var(--gold); color: #06060A;
    font-family: 'DM Sans', sans-serif; font-weight: 700;
    font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
    padding: 10px 22px; border-radius: 4px; border: none;
    cursor: pointer; transition: filter .2s;
  }
  .admin-modal-submit:hover { filter: brightness(1.12); }
  .admin-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--gold); color: #06060A;
    font-family: 'DM Sans', sans-serif; font-weight: 700;
    font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
    padding: 11px 20px; border-radius: 6px; z-index: 9999;
    display: flex; align-items: center; gap: 8px;
    animation: fadeInUp .3s ease;
    box-shadow: 0 4px 24px rgba(240,192,96,0.25);
  }
  @keyframes shake {
    0%,100%{ transform:translateX(0) }
    20%    { transform:translateX(-6px) }
    40%    { transform:translateX(6px) }
    60%    { transform:translateX(-4px) }
    80%    { transform:translateX(4px) }
  }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
`

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function AdminLoginModal({ onSuccess, onClose }) {
  const [value, setValue]   = useState('')
  const [error, setError]   = useState('')
  const [shake, setShake]   = useState(false)
  const [show,  setShow]    = useState(false)
  const inputRef = useRef()

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = () => {
    if (value === ADMIN_PASSWORD) {
      onSuccess()
      onClose()
    } else {
      setError('Incorrect password. Try again.')
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 400)
      inputRef.current?.focus()
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter')  submit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="admin-overlay" onClick={e => e.target.classList.contains('admin-overlay') && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-icon">🔐</div>
        <div className="admin-modal-title">Admin Access</div>
        <div className="admin-modal-sub">Enter your password to unlock portfolio management.</div>
        <label className="admin-modal-label" htmlFor="admin-pwd">Password</label>
        <div className="admin-modal-input-wrap">
          <input
            id="admin-pwd"
            ref={inputRef}
            type={show ? 'text' : 'password'}
            className={`admin-modal-input${shake ? ' shake' : ''}`}
            placeholder="Enter password"
            value={value}
            onChange={e => { setValue(e.target.value); setError('') }}
            onKeyDown={onKey}
            autoComplete="current-password"
          />
          <button
            className="admin-modal-eye"
            onClick={() => setShow(v => !v)}
            type="button"
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={show} />
          </button>
        </div>
        <div className="admin-modal-error">{error}</div>
        <div className="admin-modal-actions">
          <button className="admin-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="admin-modal-submit" onClick={submit}>Unlock →</button>
        </div>
      </div>
    </div>
  )
}

function AdminToast({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [onDone])
  return (
    <div className="admin-toast">
      <span>✓</span> Admin mode enabled
    </div>
  )
}

// ─── Admin unlock hook ─────────────────────────────────────────────────────────
function useAdminUnlock() {
  const [isAdmin,    setIsAdmin]    = useState(false)
  const [showModal,  setShowModal]  = useState(false)
  const [showToast,  setShowToast]  = useState(false)
  const clickCount = useRef(0)
  const clickTimer = useRef(null)

  const handleSecretClick = () => {
    clickCount.current += 1
    clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => { clickCount.current = 0 }, 1500)
    if (clickCount.current >= 5) {
      clickCount.current = 0
      setShowModal(true)
    }
  }

  const handleSuccess = () => {
    setIsAdmin(true)
    setShowToast(true)
  }

  return {
    isAdmin,
    handleSecretClick,
    adminModal: showModal
      ? <AdminLoginModal onSuccess={handleSuccess} onClose={() => setShowModal(false)} />
      : null,
    adminToast: showToast
      ? <AdminToast onDone={() => setShowToast(false)} />
      : null,
  }
}

// ─── Inject modal CSS once ─────────────────────────────────────────────────────
function useModalStyles() {
  useEffect(() => {
    if (document.getElementById('admin-modal-styles')) return
    const el = document.createElement('style')
    el.id = 'admin-modal-styles'
    el.textContent = modalStyles
    document.head.appendChild(el)
  }, [])
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ks-theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ks-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const { isAdmin, handleSecretClick, adminModal, adminToast } = useAdminUnlock()

  useModalStyles()
  useReveal()

  return (
    <AdminContext.Provider value={isAdmin}>
      <CursorSparkles />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer onSecretClick={handleSecretClick} />
      {adminModal}
      {adminToast}
    </AdminContext.Provider>
  )
}