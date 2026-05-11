import { useState, useEffect } from 'react'
import styles from './projects.module.css'
import { useAdmin } from './app.jsx'

const BASE_PROJECTS = [
  {
    icon: '💎',
    color: 'gold',
    featured: true,
    title: 'FinAdvisor AI',
    desc: 'Full-stack AI financial advisor with a LangGraph agent, 32 tool plugins, RAG document search, streaming chat via SSE, Human-in-the-Loop confirmation, 4 LLM providers (OpenAI, Claude, Gemini, Llama), and 17-language support including Luganda and Swahili.',
    stack: ['LangGraph', 'FastAPI', 'Next.js 16', 'pgvector', 'Supabase', 'SSE', 'OpenAI', 'Claude', 'Gemini', 'Llama', 'Python', 'TypeScript', 'LangChain', 'Pydantic', 'PostgreSQL', 'Docker', 'Vercel'],
    github: 'https://github.com/Susankemigisa/Capstone-Finadvisor-ai',
    live: 'https://finadvisor-ai-app-two.vercel.app',
  },
  {
    icon: '🎤',
    color: 'purple',
    title: 'Voxel App',
    desc: 'A voice-first application for transport and navigation built for people with speech impairments. Leverages modern speech APIs combined with intelligent backend logic for real-time interaction.',
    stack: ['Voice AI', 'Python', 'React', 'Speech APIs', 'FastAPI', 'OpenAI', 'Whisper', 'Vercel', 'TTS'],
    github: 'https://github.com/Susankemigisa/Voxel-App',
  },
  {
    icon: '🪑',
    color: 'rose',
    title: 'Mayondo Wood & Furniture',
    desc: 'End-to-end business management system for a furniture shop — inventory, sales, customer records, and reporting. A full production internal tool built for a real Ugandan business client.',
    stack: ['React', 'Python', 'PostgreSQL', 'FastAPI'],
    github: 'https://github.com/Susankemigisa/project-mwf',
  },
  {
    icon: '🧠',
    color: 'teal',
    title: 'AI Interview Practice App',
    desc: 'Streamlit-based interview coach powered by OpenAI GPT. Features 5 prompt engineering techniques, adaptive difficulty, interviewer personas, real-time cost tracking, and STAR method feedback analysis.',
    stack: ['Python', 'Streamlit', 'OpenAI', 'Pydantic'],
    github: 'https://github.com/Susankemigisa',
  },
  {
    icon: '📊',
    color: 'muted',
    title: 'AI Reporter',
    desc: 'Automated report generation system — fetches live crypto data via CoinCap, writes professional summaries using GPT-4.1-mini, and emails them via SMTP. Full pytest coverage with mocked external dependencies.',
    stack: ['Python', 'OpenAI', 'SMTP', 'pytest', 'CoinCap API'],
    github: 'https://github.com/TuringCollegeSubmissions/ksusan-SAE.2.5',
  },
  {
    icon: '💬',
    color: 'gold',
    title: 'Chatbot Platform',
    desc: 'Configurable chatbot infrastructure supporting context-aware multi-turn conversations, persona injection, and evaluation via LangSmith tracing.',
    stack: ['Python', 'LangChain', 'Streamlit', 'LangSmith'],
    github: 'https://github.com/Susankemigisa',
  },
]

const STORAGE_KEY = 'ks-extra-projects'
const LATEST_KEY  = 'ks-latest-project'

function loadExtra() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

// ─── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: '', desc: '', github: '', live: '',
  icon: '', color: 'gold', featured: false, setLatest: false,
}

// ─── Add-Project Modal (admin only) ───────────────────────────────────────────
function AddProjectModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }
  const removeTag = (i) => setTags(prev => prev.filter((_, idx) => idx !== i))

  const save = () => {
    if (!form.title.trim() || !form.desc.trim()) {
      alert('Please fill in at least Title and Description.')
      return
    }
    const project = {
      icon: form.icon.trim() || '🔧',
      color: form.color,
      featured: form.featured,
      title: form.title.trim(),
      desc: form.desc.trim(),
      stack: tags,
      github: form.github.trim() || null,
      live: form.live.trim() || null,
      addedAt: Date.now(),
    }
    onAdd(project, form.setLatest)
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Add New Project</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel}>Project Title *</label>
          <input className={styles.formInput} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. AI Interview Coach" />
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel}>Description *</label>
          <textarea className={styles.formTextarea} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="What does this project do? What problems does it solve?" rows={4} />
        </div>

        <div className={styles.formRow2}>
          <div>
            <label className={styles.formLabel}>GitHub URL</label>
            <input className={styles.formInput} value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." type="url" />
          </div>
          <div>
            <label className={styles.formLabel}>Live URL</label>
            <input className={styles.formInput} value={form.live} onChange={e => set('live', e.target.value)} placeholder="https://..." type="url" />
          </div>
        </div>

        <div className={styles.formRow2}>
          <div>
            <label className={styles.formLabel}>Icon (emoji)</label>
            <input className={styles.formInput} value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🚀" style={{ maxWidth: 80 }} />
          </div>
          <div>
            <label className={styles.formLabel}>Colour Theme</label>
            <select className={styles.formSelect} value={form.color} onChange={e => set('color', e.target.value)}>
              <option value="gold">Gold</option>
              <option value="purple">Purple</option>
              <option value="teal">Teal</option>
              <option value="rose">Rose</option>
              <option value="muted">Red</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.formLabel}>Tech Stack</label>
          <div className={styles.tagInputRow}>
            <input
              className={styles.formInput}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Type a technology and press Enter or +"
            />
            <button className={styles.tagAddBtn} onClick={addTag}>+</button>
          </div>
          {tags.length > 0 && (
            <div className={styles.tagsPreview}>
              {tags.map((t, i) => (
                <span key={i} className={styles.tagPill} onClick={() => removeTag(i)}>{t} ×</span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formCheckRow}>
          <input type="checkbox" id="cb-featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
          <label htmlFor="cb-featured" className={styles.formLabel} style={{ marginBottom: 0 }}>Mark as Featured Project</label>
        </div>
        <div className={styles.formCheckRow}>
          <input type="checkbox" id="cb-latest" checked={form.setLatest} onChange={e => set('setLatest', e.target.checked)} />
          <label htmlFor="cb-latest" className={styles.formLabel} style={{ marginBottom: 0 }}>Set as Latest Project (updates the hero card)</label>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
          <button className={styles.modalSave} onClick={save}>Save Project</button>
        </div>
      </div>
    </div>
  )
}

// ─── Projects section ──────────────────────────────────────────────────────────
export default function Projects() {
  const isAdmin = useAdmin()
  const [extras, setExtras] = useState(loadExtra)
  const [showModal, setShowModal] = useState(false)
  const [banner, setBanner] = useState(null) // { title }

  // Combine: extras (newest first) + base projects
  const allProjects = [...extras, ...BASE_PROJECTS]

  const handleAdd = (project, setLatest) => {
    const updated = [project, ...extras]
    setExtras(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    // Update hero card if requested
    if (setLatest) {
      localStorage.setItem(LATEST_KEY, JSON.stringify({ title: project.title, sub: project.stack.slice(0, 4).join(' · ') || 'New project' }))
      // Update DOM directly (hero renders independently)
      const titleEl = document.getElementById('hero-latest-title')
      const subEl   = document.getElementById('hero-latest-sub')
      if (titleEl) titleEl.textContent = project.title
      if (subEl)   subEl.textContent   = project.stack.slice(0, 4).join(' · ') || 'New project'
    }

    // Show banner for 6 seconds
    setBanner({ title: project.title })
    setTimeout(() => setBanner(null), 6000)
  }

  // On mount — restore hero latest if saved
  useEffect(() => {
    const saved = localStorage.getItem(LATEST_KEY)
    if (saved) {
      try {
        const { title, sub } = JSON.parse(saved)
        const titleEl = document.getElementById('hero-latest-title')
        const subEl   = document.getElementById('hero-latest-sub')
        if (titleEl) titleEl.textContent = title
        if (subEl)   subEl.textContent   = sub
      } catch { /* ignore */ }
    }
  }, [])

  return (
    <section className={styles.section} id="projects">
      <div className="sec-label">Projects</div>
      <h2 className="sec-title">Things I've <em>Built</em></h2>

      {/* New-project banner */}
      {banner && (
        <div className={styles.newBanner}>
          <span className={styles.newDot} />
          <span>Just added: <strong>{banner.title}</strong></span>
        </div>
      )}

      <div className={styles.grid}>
        {allProjects.map(p => (
          <div
            key={p.title + (p.addedAt || '')}
            className={`${styles.card} ${p.featured ? styles.featured : ''}`}
          >
            <div className={styles.top}>
              <div className={`${styles.icon} ${styles[p.color]}`}>{p.icon}</div>
              <div className={styles.links}>
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer" className={styles.link}>GitHub ↗</a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className={styles.link}>Live ↗</a>
                )}
              </div>
            </div>
            {p.featured && <div className={styles.featBadge}>Featured Project</div>}
            <h3 className={styles.title}>{p.title}</h3>
            <p className={styles.desc}>{p.desc}</p>
            <div className={styles.stack}>
              {p.stack.map(s => <span key={s} className={styles.stackTag}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Admin-only: Add Project button */}
      {isAdmin && (
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Project
        </button>
      )}

      {showModal && <AddProjectModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </section>
  )
}
