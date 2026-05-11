import { useState } from 'react'
import styles from './contact.module.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [errMsg, setErrMsg] = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      setErrMsg('Please fill in all fields.')
      return
    }
    setStatus('sending')
    setErrMsg('')
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrMsg(data.detail || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrMsg('Could not reach the server. Please email me directly.')
    }
  }

  const WHATSAPP_NUMBER = '256778544520'
  const WHATSAPP_MSG = encodeURIComponent("Hi Suzan! I'd love to connect with you about a project.")

  const sideLinks = [
    {
      href: 'mailto:kemigisasuzan@gmail.com',
      icon: '✉',
      label: 'Email',
      val: 'kemigisasuzan@gmail.com',
      color: null,
    },
    {
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.118 1.529 5.845L.057 23.428a.5.5 0 00.515.572l5.783-1.517A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.01-1.377l-.36-.213-3.714.975.992-3.618-.235-.372A9.818 9.818 0 1112 21.818z"/>
        </svg>
      ),
      label: 'WhatsApp',
      val: '+256 778 544 520',
      color: '#25D366',
      live: true,
    },
    {
      href: 'https://github.com/Susankemigisa',
      icon: '⌥',
      label: 'GitHub',
      val: 'Susankemigisa',
      color: null,
    },
    {
      href: 'https://www.linkedin.com/in/suzan-kemigisa/',
      icon: 'in',
      label: 'LinkedIn',
      val: 'suzan-kemigisa',
      color: null,
    },
  ]

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className="sec-label reveal">Contact</div>
        <h2 className="sec-title reveal">Let's build something <em>together</em></h2>
        <p className={`${styles.sub} reveal`}>
          Open to full-time roles, freelance projects, and interesting collaborations.
          Send a message and I'll get back to you within 24 hours.
        </p>

        <div className={styles.layout}>
          {/* Form */}
          <div className={`${styles.formWrap} reveal`}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">Your name</label>
                <input
                  id="name" name="name"
                  className={styles.input}
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handle}
                  disabled={status === 'sending' || status === 'sent'}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <input
                  id="email" name="email" type="email"
                  className={styles.input}
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={handle}
                  disabled={status === 'sending' || status === 'sent'}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="subject">Subject</label>
              <input
                id="subject" name="subject"
                className={styles.input}
                placeholder="Job opportunity / Project collaboration / Other"
                value={form.subject}
                onChange={handle}
                disabled={status === 'sending' || status === 'sent'}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea
                id="message" name="message"
                className={styles.textarea}
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                value={form.message}
                onChange={handle}
                disabled={status === 'sending' || status === 'sent'}
              />
            </div>

            {errMsg && <p className={styles.errorNote}>{errMsg}</p>}

            {status === 'sent' ? (
              <div className={styles.successBox}>
                <span className={styles.successIcon}>✓</span>
                <div>
                  <div className={styles.successTitle}>Message sent!</div>
                  <div className={styles.successSub}>I'll get back to you within 12–24 hours. Check your inbox for a confirmation.</div>
                </div>
              </div>
            ) : (
              <button
                className={`btn-gold ${styles.sendBtn}`}
                onClick={submit}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            )}
          </div>

          {/* Side links */}
          <div className={`${styles.links} stagger`}>
            {sideLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                className={`${styles.card} reveal`}
                style={link.color ? { '--card-accent': link.color } : {}}
              >
                <span
                  className={styles.cardIcon}
                  style={link.color ? { background: link.color + '18', borderColor: link.color + '44', color: link.color } : {}}
                >
                  {link.icon}
                </span>
                <div>
                  <div className={styles.cardLabel}>
                    {link.live && (
                      <span className={styles.liveDot} title="Live on WhatsApp" />
                    )}
                    {link.label}
                  </div>
                  <div className={styles.cardVal}>{link.val}</div>
                </div>
                <span className={styles.arrow}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}