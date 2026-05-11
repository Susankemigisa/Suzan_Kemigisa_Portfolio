import styles from './skills.module.css'

const categories = [
  {
    icon: '🤖', color: 'purple', title: 'AI / LLM Engineering',
    skills: [
      { name: 'LangChain / LangGraph',    pct: 95 },
      { name: 'RAG Pipelines',            pct: 90 },
      { name: 'OpenAI / Anthropic / Gemini APIs', pct: 92 },
      { name: 'Prompt Engineering',       pct: 93 },
      { name: 'AI Agents & Memory',       pct: 88 },
      { name: 'LangSmith / Evals',        pct: 80 },
    ],
  },
  {
    icon: '⚙️', color: 'gold', title: 'Backend & APIs',
    skills: [
      { name: 'Python / FastAPI',          pct: 95 },
      { name: 'Node.js / Express',         pct: 80 },
      { name: 'Supabase / PostgreSQL',     pct: 85 },
      { name: 'REST APIs / SSE Streaming', pct: 88 },
      { name: 'Docker / Render / Vercel',  pct: 80 },
      { name: 'pytest / unittest',         pct: 85 },
    ],
  },
  {
    icon: '🖥️', color: 'rose', title: 'Frontend',
    skills: [
      { name: 'React / Next.js',  pct: 88 },
      { name: 'Vue.js',           pct: 78 },
      { name: 'TypeScript / JS',  pct: 85 },
      { name: 'Tailwind CSS',     pct: 90 },
      { name: 'HTML / CSS',       pct: 95 },
      { name: 'Streamlit',        pct: 86 },
    ],
  },
  {
    icon: '🔬', color: 'teal', title: 'ML / Data',
    skills: [
      { name: 'NLP / HuggingFace',     pct: 83 },
      { name: 'pgvector / ChromaDB',   pct: 85 },
      { name: 'TensorFlow / PyTorch',  pct: 72 },
      { name: 'Data Analysis',         pct: 82 },
      { name: 'Qualitative Research',  pct: 88 },
      { name: 'MLOps / Pipelines',     pct: 78 },
    ],
  },
]

const toolGroups = [
  {
    label: 'Dev & Collaboration',
    tools: ['Git', 'GitHub', 'VS Code', 'Cursor', 'Jira', 'Notion', 'Slack', 'Linear'],
  },
  {
    label: 'AI & Cloud Platforms',
    tools: ['OpenAI Platform', 'Anthropic Console', 'Vercel', 'Render', 'Supabase', 'LangSmith', 'HuggingFace', 'Docker'],
  },
  {
    label: 'Data & Productivity',
    tools: ['Google Sheets', 'Excel', 'Airtable', 'Postman', 'pgAdmin', 'Figma', 'Trello', 'Zoom'],
  },
]

export default function Skills() {
  return (
    <section className={styles.section} id="skills">
      <div className="sec-label">Technical Skills</div>
      <h2 className="sec-title">My <em>Stack</em></h2>
      <div className={styles.grid}>
        {categories.map(cat => (
          <div key={cat.title} className={styles.card}>
            <div className={styles.head}>
              <div className={`${styles.icon} ${styles[cat.color]}`}>{cat.icon}</div>
              <h4 className={styles.catTitle}>{cat.title}</h4>
            </div>
            {cat.skills.map(sk => (
              <div key={sk.name} className={styles.skillRow}>
                <div className={styles.skillTop}>
                  <span className={styles.skillName}>{sk.name}</span>
                  <span className={styles.skillPct}>{sk.pct}%</span>
                </div>
                <div className={styles.barBg}>
                  <div
                    className={`${styles.bar} ${styles[cat.color]}`}
                    style={{ width: `${sk.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.toolsSection}>
        <div className={styles.toolsLabel}>Tools &amp; Platforms</div>
        <div className={styles.toolsGrid}>
          {toolGroups.map(group => (
            <div key={group.label} className={styles.toolGroup}>
              <div className={styles.toolGroupLabel}>{group.label}</div>
              <div className={styles.toolPills}>
                {group.tools.map(t => (
                  <span key={t} className={styles.toolPill}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
