import styles from './footer.module.css'

// SVG icons for each social platform
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.118 1.529 5.845L.057 23.428a.5.5 0 00.515.572l5.783-1.517A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.01-1.377l-.36-.213-3.714.975.992-3.618-.235-.372A9.818 9.818 0 1112 21.818z"/>
  </svg>
)

export default function Footer({ onSecretClick }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.inner}>

        {/* Brand — secret admin trigger (5 rapid clicks) */}
        <div className={styles.brandWrap}>
          <button
            className={styles.brand}
            onClick={onSecretClick}
            aria-label="Kemigisa Suzan"
            title="Kemigisa Suzan"
          >
            Kemigisa Suzan
          </button>
          {/* Alive indicator */}
          <div className={styles.alive}>
            <span className={styles.aliveDot} />
            Available · Kampala, Uganda
          </div>
        </div>

        <div className={styles.copy}>
          © {new Date().getFullYear()} · Built with React &amp; Vite
        </div>

        {/* Icon-only social links */}
        <div className={styles.icons}>
          <a
            href="https://github.com/Susankemigisa"
            target="_blank"
            rel="noreferrer"
            className={`${styles.iconLink} ${styles.github}`}
            title="GitHub"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/suzan-kemigisa/"
            target="_blank"
            rel="noreferrer"
            className={`${styles.iconLink} ${styles.linkedin}`}
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:Kemigisa32@gmail.com"
            className={`${styles.iconLink} ${styles.email}`}
            title="Email"
            aria-label="Email"
          >
            <EmailIcon />
          </a>
          <a
            href="https://wa.me/256778544520"
            target="_blank"
            rel="noreferrer"
            className={`${styles.iconLink} ${styles.whatsapp}`}
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </div>

      </div>
    </footer>
  )
}
