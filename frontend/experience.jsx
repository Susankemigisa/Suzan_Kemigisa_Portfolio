import { useState } from 'react'
import styles from './experience.module.css'

const sections = {
  work: [
    {
      company: 'Codveda Technologies',
      period: 'Nov 2025 – Feb 2026',
      role: 'Web Developer · Internship',
      location: 'Kampala, Uganda',
      bullets: [
        'Contributed to design, development, and maintenance of responsive, user-friendly web applications.',
        'Developed and customised websites using modern web technologies (HTML, CSS, JavaScript, and relevant frameworks).',
        'Built responsive interfaces ensuring seamless performance across desktop and mobile devices.',
        'Collaborated with cross-functional teams to translate client requirements into functional web solutions.',
        'Implemented backend integrations and basic database management where required.',
        'Tested, debugged, and optimised web applications to improve performance and user experience.',
        'Maintained version control and followed clean coding practices for scalable development.',
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'Git', 'Version Control'],
    },
    {
      company: 'Hello World',
      period: 'Jul 2022 – Aug 2025',
      role: 'Community Support Officer · Full-time',
      location: 'Boma Fort Portal, Western Region, Uganda',
      bullets: [
        'Facilitated hands-on digital skills training for women, improving their confidence and access to online opportunities.',
        'Supported children through the Hub Heroes program, guiding them in foundational computer literacy and creative learning.',
        'Delivered life skills education sessions covering personal development, communication, and confidence building.',
        'Contributed to youth development through introductory journalism training and storytelling workshops.',
        'Provided basic technical support, including monitoring and regulating internet connectivity for consistent free community access.',
        'Assisted daily hub operations, user support, and community engagement activities.',
      ],
      tags: ['Digital Literacy', 'Youth Mentorship', 'Community Engagement', 'IT Support'],
    },
    {
      company: 'Baylor Uganda',
      period: 'Sep 2021 – Jun 2022',
      role: 'Data Entry Clerk · Part-time',
      location: 'Kabarole District, Uganda · Remote',
      bullets: [
        'Supported COVID-19 vaccination data management across health facilities in Kabarole District.',
        'Entered and verified vaccination records into the national health information system with high accuracy.',
        'Processed data for vaccinated individuals, ensuring completeness and correct documentation of doses administered.',
        'Maintained confidentiality and handled sensitive patient information in compliance with health data standards.',
        'Contributed to timely and accurate data reporting to support public health monitoring and decision-making.',
      ],
      tags: ['Data Entry', 'Health Information Systems', 'Accuracy', 'Confidentiality'],
    },
    {
      company: 'CARE Uganda (Ipsos)',
      period: 'Jan 2021 – Jul 2021',
      role: 'Research & Data Entry Assistant · Part-time',
      location: 'Fort Portal, Kyenjojo & Kasese, Western Uganda',
      bullets: [
        'Conducted community-based field research focused on women\'s economic livelihoods and savings behaviours across Kyenjojo.',
        'Collected field data from women\'s savings groups on income sources, saving methods, and financial decision-making.',
        'Supported data collection for a Vivo Energy (Shell) market research study on lubricants and fuel products in Fort Portal & Kasese.',
        'Ensured accurate documentation, ethical data collection, and proper data entry for reporting and analysis.',
        'Organised and cleaned datasets; conducted structured data validation for reporting purposes.',
        'Collaborated with field teams to maintain efficiency and data quality standards.',
      ],
      tags: ['Qualitative Research', 'Data Analysis', 'Community Engagement', 'Field Research'],
    },
  ],
  education: [
    {
      company: 'Turing College',
      period: '2025 – Present',
      role: 'AI Engineering Programme',
      location: 'Online · Expected completion 2026',
      bullets: [
        'Intensive programme covering core programming, AI engineering, and real-world software development.',
        'Key areas: Python, data structures, algorithms, OOP, version control, APIs, and testing.',
        'AI Engineering: LLMs, prompt engineering, evaluation techniques, RAG, LangChain, and AI agents with memory and tool usage.',
        'Built real-world applications including FinAdvisor AI, an AI interview practice app, an AI-powered reporting & emailing system, and agent-based solutions.',
        'Practical experience through peer code reviews, collaborative development using Git, and mentor feedback.',
        'Tools: Python, FastAPI, LangChain, REST APIs, Git, GitHub, PostgreSQL, Docker (basic), LLM APIs.',
      ],
      tags: ['Python', 'FastAPI', 'LangChain', 'RAG', 'LLMs', 'PostgreSQL'],
    },
    {
      company: 'Moringa School',
      period: '2026',
      role: 'Agentic AI — Completed 2026',
      location: 'Online',
      bullets: [
        'Completed an intensive Agentic AI specialisation covering modern agent architectures and real-world deployment.',
      ],
      tags: ['Agentic AI', 'LLM Agents'],
    },
    {
      company: 'Refactory Academy',
      period: '2025',
      role: 'Software Engineering Programme - Javascript',
      location: 'Online',
      bullets: [
        'Completed an intensive Software Engineering programme focused on JavaScript and modern web development.',
        'Key areas: Software engineering fundamentals, JavaScript, debugging, application security, and web application development.',
        'Specialisation: Frontend and backend development using JavaScript, including Node.js and Vue.js.',
        'Tools: JavaScript, Node.js, Vue.js, HTML, CSS, Git, GitHub.',
        'Additional focus: Agile and Lean methodologies, cloud computing fundamentals, automation basics, and business communication.',
        'Engaged in daily coaching sessions, peer collaboration, and project-based learning in a collaborative environment.',
      ],
      tags: ['JavaScript', 'Node.js', 'Vue.js', 'Agile', 'Git'],
    },
    {
      company: 'TechCrush',
      period: 'Ongoing',
      role: 'Project Management',
      location: 'Online',
      bullets: [
        'Currently enrolled in a Project Management programme covering modern PM frameworks and tools.',
      ],
      tags: ['Project Management', 'Jira', 'Agile', 'Scrum', 'Kanban', 'Trello', 'Asana', 'Microsoft Project', 'Communication', 'Leadership', 'Risk Management'],
    },
    {
      company: 'Digitaley Drive',
      period: 'Ongoing',
      role: 'Data Analysis',
      location: 'Online',
      bullets: [
        'Currently enrolled in a Data Analysis programme covering analytics, visualisation, and business intelligence.',
      ],
      tags: ['Data Analysis', 'Excel', 'Google Sheets', 'Tableau', 'Power BI', 'SQL', 'Python (Pandas, Matplotlib, Seaborn)', 'Data Cleaning', 'Data Visualisation', 'Business Intelligence'],
    },
  ],
}

export default function Experience() {
  const [tab, setTab] = useState('work')

  return (
    <section className={styles.section} id="experience">
      <div className="sec-label">Career</div>
      <h2 className="sec-title">Career <em>Timeline</em></h2>

      <div className={styles.tabs}>
        {[['work', 'Work Experience'], ['education', 'Education & Training']].map(([key, label]) => (
          <button
            key={key}
            className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.timeline}>
        {sections[tab].map(j => (
          <div key={j.company + j.role} className={styles.item}>
            <div className={styles.head}>
              <span className={styles.company}>{j.company}</span>
              <span className={styles.period}>{j.period}</span>
            </div>
            <div className={styles.role}>{j.role}</div>
            {j.location && <div className={styles.location}>📍 {j.location}</div>}
            <ul className={styles.bullets}>
              {j.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <div className={styles.tags}>
              {j.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
