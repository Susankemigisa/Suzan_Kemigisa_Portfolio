import styles from './hero.module.css'

// Static assets — place your files in the frontend/public folder:
//   public/photo.jpg  (or .png / .webp)
//   public/cv.pdf
const PHOTO_URL = '/Kemigisa_Suzan.jpg'   // change extension if needed
const CV_URL    = '/CV_Kemigisa_Suzan.pdf'

const stats = [
  { val: '10+', label: 'Projects shipped', sub: 'Production & portfolio' },
  { val: '32',  label: 'AI Tools built',   sub: 'In FinAdvisor AI alone' },
]

function PulseDot({ color = '#4ADE80' }) {
  return (
    <span className={styles.pulseDot} style={{ '--pd-color': color }} aria-hidden="true">
      <span className={styles.pulseDotInner} />
    </span>
  )
}

export default function Hero() {
  const WHATSAPP_NUMBER = '256778544520'
  const WHATSAPP_MSG = encodeURIComponent("Hi Suzan! I'd love to connect with you.")

  return (
    <section className={styles.hero} id="home">
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      {/* Left */}
      <div className={`${styles.left} reveal-left`}>
        <div className={styles.eyebrow}>
          <PulseDot color="#4ADE80" />
          Software &amp; AI Engineer · Available for hire
        </div>
        <h1 className={styles.name}>
          Kemigisa<br />
          <em>Suzan</em>
        </h1>
        <p className={styles.tagline}>
          Building intelligent software — from model to product
        </p>
        <p className={styles.bio}>
          I design and ship full-stack applications powered by AI. My work spans
          LangGraph agents, RAG pipelines, production APIs, and polished user
          interfaces — built for real people solving real problems.
          Based in Kampala, Uganda, working with teams globally.
        </p>
        <div className={`${styles.cta} stagger`}>
          <a href="#projects" className="btn-gold">View My Work</a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
            target="_blank"
            rel="noreferrer"
            className={styles.waBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.118 1.529 5.845L.057 23.428a.5.5 0 00.515.572l5.783-1.517A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.01-1.377l-.36-.213-3.714.975.992-3.618-.235-.372A9.818 9.818 0 1112 21.818z"/>
            </svg>
            WhatsApp Me
            <span className={styles.waBlink} />
          </a>
          <a href={CV_URL} download="CV_Kemigisa_Suzan.pdf" className="btn-ghost">
            📄 Download CV
          </a>
        </div>
      </div>

      {/* Right */}
      <div className={`${styles.right} reveal-right`}>

        {/* Photo card */}
        <div className={styles.photoCard}>
          <div className={styles.photoRing}>
            <img src={PHOTO_URL} alt="Kemigisa Suzan" className={styles.photoImg} />
          </div>
          <div className={styles.photoMeta}>
            <div className={styles.photoName}>Kemigisa Suzan</div>
            <div className={styles.photoTitle}>
              <PulseDot color="#4ADE80" /> Software &amp; AI Engineer
            </div>
          </div>
        </div>

        <div className={styles.cardsRow}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className={styles.featCard} id="latestProjectCard">
          <div className={styles.featLabel}>Latest project</div>
          <div className={styles.featTitle} id="hero-latest-title">FinAdvisor AI</div>
          <div className={styles.featSub} id="hero-latest-sub">
            LangGraph agent · 4 LLM providers · RAG · 17 languages
          </div>
        </div>

        <div className={styles.locCard}>
          <span>📍</span>
          <div>
            <div className={styles.locCity}>Kampala, Uganda</div>
            <div className={styles.locSub}>Open to on-site, hybrid &amp; remote roles</div>
          </div>
        </div>
      </div>
    </section>
  )
}