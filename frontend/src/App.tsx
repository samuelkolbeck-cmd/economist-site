import React, { useState, useEffect } from 'react';

interface CVData {
  profile: {
    name: string;
    title: string;
    location: string;
    summary: string;
  };
  education: Array<{
    institution: string;
    location: string;
    degree: string;
    period: string;
    details: string;
  }>;
  experience: Array<{
    company: string;
    location: string;
    role: string;
    period: string;
    tasks: string[];
  }>;
  skills: {
    econometrics: string;
    business_tools: string;
    languages: string;
    interests: string;
  };
  legal: {
    impressum: {
      name: string;
      address: string;
      contact: string;
      disclaimer: string;
    };
  };
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/cv')
      .then(res => res.json())
      .then(data => setCvData(data))
      .catch(err => console.error('Error fetching CV data:', err));
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('Something went wrong. Please try again.');
      }
    } catch (err) {
      setFormStatus('Failed to connect to the server.');
    }
  };

  const renderSkillTags = (skillString: string) => {
    return skillString.split(',').map((skill, index) => (
      <span key={index} className="skill-tag">{skill.trim()}</span>
    ));
  };

  if (!cvData) return <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>Loading Digital CV...</div>;

  return (
    <div className="container">
      <header>
        <div className="logo">{cvData.profile.name}</div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
        </button>
      </header>

      <div className="main-content">
        <section className="hero">
          <div className="subtitle">{cvData.profile.title}</div>
          <h1>{cvData.profile.name}</h1>
          <p className="summary">{cvData.profile.summary}</p>
        </section>

        <section id="experience">
          <h2>Professional Experience</h2>
          <div className="timeline">
            {cvData.experience.map((exp, index) => (
              <article key={index} className="timeline-item">
                <div className="timeline-header">
                  <h3>{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <div className="timeline-org">{exp.company} — {exp.location}</div>
                <ul className="tasks-list">
                  {exp.tasks.map((task, tIndex) => (
                    <li key={tIndex}>{task}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="education">
          <h2>Education</h2>
          <div className="timeline">
            {cvData.education.map((edu, index) => (
              <article key={index} className="timeline-item">
                <div className="timeline-header">
                  <h3>{edu.degree}</h3>
                  <span className="timeline-period">{edu.period}</span>
                </div>
                <div className="timeline-org">{edu.institution} — {edu.location}</div>
                <div className="timeline-details">{edu.details}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills">
          <h2>Expertise & Skills</h2>
          <div className="skills-container">
            <div className="skill-category">
              <h4>Econometrics & Data</h4>
              <div className="skill-tags">{renderSkillTags(cvData.skills.econometrics)}</div>
            </div>
            <div className="skill-category">
              <h4>Business Tools</h4>
              <div className="skill-tags">{renderSkillTags(cvData.skills.business_tools)}</div>
            </div>
            <div className="skill-category">
              <h4>Languages</h4>
              <div className="skill-tags">{renderSkillTags(cvData.skills.languages)}</div>
            </div>
            <div className="skill-category">
              <h4>Interests</h4>
              <div className="skill-tags">{renderSkillTags(cvData.skills.interests)}</div>
            </div>
          </div>
        </section>

        <section id="contact">
          <h2>Get In Touch</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="john@example.com"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                placeholder="How can I help you?"
                value={formData.message} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <button type="submit" className="btn-submit">Send Inquiry</button>
            {formStatus && <p style={{ marginTop: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--accent)' }}>{formStatus}</p>}
          </form>
        </section>

        <section id="legal" style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', opacity: 0.8 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Legal Notice / Impressum</h2>
          <div className="modal-body">
            <p><strong>Name:</strong> {cvData.legal.impressum.name}</p>
            <p><strong>Address:</strong> {cvData.legal.impressum.address}</p>
            <p><strong>Contact:</strong> {cvData.legal.impressum.contact}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>{cvData.legal.impressum.disclaimer}</p>
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} {cvData.profile.name}</p>
      </footer>
    </div>
  );
}

export default App;
