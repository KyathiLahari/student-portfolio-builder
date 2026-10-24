import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Camera, Check, Code2, Eye, Github, Linkedin, Mail,
  MapPin, Pencil, Plus, Save, Sparkles, Trash2, UserRound, X, LayoutDashboard,
  FolderOpen, ExternalLink
} from "lucide-react";

const API_URL = "http://localhost:5000/api/portfolio";
const templates = [
  { id: "midnight", name: "Midnight Developer", description: "Dark navy with violet and aqua accents", mood: "Dark / modern" },
  { id: "minimal", name: "Minimal Professional", description: "Clean light layout with crisp typography", mood: "Clean / simple" },
  { id: "gradient", name: "Gradient Creative", description: "Vibrant gradients and playful cards", mood: "Bright / creative" },
  { id: "terminal", name: "Terminal Hacker", description: "Cyber-inspired black and green interface", mood: "Code / terminal" },
  { id: "cyberpunk", name: "Cyberpunk Neon", description: "Electric neon accents and futuristic panels", mood: "Neon / futuristic" },
  { id: "editorial", name: "Elegant Editorial", description: "Magazine-inspired typography and warm paper tones", mood: "Elegant / editorial" },
  { id: "glass", name: "Glassmorphism", description: "Translucent cards with a soft luminous backdrop", mood: "Glass / luminous" },
  { id: "bento", name: "Bento Grid", description: "A modular grid of compact portfolio sections", mood: "Grid / modular" }
];

const blankPortfolio = (title = "My Portfolio") => ({
  title, template: "midnight", name: "", role: "", email: "", location: "",
  objective: "", education: "", skills: [], projects: [], github: "", linkedin: "", photo: ""
});

async function api(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function normalizePortfolio(data) {
  const base = blankPortfolio(data.title || "My Portfolio");
  return {
    ...base, ...data,
    template: templates.some((item) => item.id === data.template) ? data.template : "midnight",
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    photo: data.photo || ""
  };
}

export default function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [portfolio, setPortfolio] = useState(blankPortfolio());
  const [activeId, setActiveId] = useState("");
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");

  async function refreshPortfolios(selectId = "") {
    const data = await api();
    const list = data.portfolios || [];
    setPortfolios(list);
    if (selectId) {
      const selected = list.find((item) => item._id === selectId);
      if (selected) {
        setActiveId(selected._id);
        setPortfolio(normalizePortfolio(selected));
      }
    }
    return list;
  }

  useEffect(() => {
    refreshPortfolios().catch((err) => setError(`${err.message} Make sure the backend and MongoDB are running.`)).finally(() => setLoading(false));
  }, []);

  function goHome() {
    setPage("home"); setMessage(""); setError("");
  }

  function startCreate() {
    setActiveId("");
    setPortfolio(blankPortfolio(`Portfolio ${portfolios.length + 1}`));
    setMessage(""); setError("");
    setPage("editor");
  }

  function editPortfolio(item) {
    setActiveId(item._id);
    setPortfolio(normalizePortfolio(item));
    setMessage(""); setError("");
    setPage("editor");
  }

  async function savePortfolio(event) {
    event?.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      const path = activeId ? `/${activeId}` : "";
      const result = await api(path, { method: activeId ? "PUT" : "POST", body: JSON.stringify(portfolio) });
      const saved = normalizePortfolio(result.portfolio);
      setActiveId(saved._id);
      setPortfolio(saved);
      await refreshPortfolios(saved._id);
      setMessage("Portfolio saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePortfolio(item) {
    if (!window.confirm(`Delete "${item.title || item.name || "this portfolio"}"? This cannot be undone.`)) return;
    try {
      await api(`/${item._id}`, { method: "DELETE" });
      await refreshPortfolios();
      if (activeId === item._id) { setActiveId(""); setPortfolio(blankPortfolio()); }
      setMessage("Portfolio deleted.");
    } catch (err) {
      setError(err.message);
    }
  }

  function updateField(field, value) {
    setPortfolio((current) => ({ ...current, [field]: value }));
  }
  function updateProject(index, field, value) {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.map((project, i) => i === index ? { ...project, [field]: value } : project)
    }));
  }
  function addProject() {
    updateField("projects", [...portfolio.projects, { title: "", description: "", technologies: "", link: "" }]);
  }
  function removeProject(index) {
    updateField("projects", portfolio.projects.filter((_, i) => i !== index));
  }
  function addSkill(event) {
    event.preventDefault();
    const skill = skillInput.trim();
    if (skill && !portfolio.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      updateField("skills", [...portfolio.skills, skill]);
    }
    setSkillInput("");
  }
  function removeSkill(skill) {
    updateField("skills", portfolio.skills.filter((item) => item !== skill));
  }
  async function choosePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 4 * 1024 * 1024) { setError("Please choose an image smaller than 4 MB."); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { updateField("photo", String(reader.result || "")); setError(""); };
    reader.onerror = () => setError("Could not read this image. Please try another file.");
    reader.readAsDataURL(file);
  }

  if (loading) return <main className="loading-screen"><div className="loader" /><p>Loading your portfolio dashboard…</p></main>;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <button className="brand" onClick={goHome} aria-label="Go to home"><span className="brand-mark"><Code2 size={20} /></span><span>folio<span className="brand-dot">.</span></span></button>
        <nav className="top-nav">
          <button className={page === "home" ? "nav-item active" : "nav-item"} onClick={goHome}><LayoutDashboard size={16} /> Home</button>
          <button className={page === "home" ? "nav-item" : "nav-item"} onClick={goHome}><FolderOpen size={16} /> My Portfolios <span className="nav-count">{portfolios.length}</span></button>
          <button className="nav-create" onClick={startCreate}><Plus size={16} /> Create portfolio</button>
        </nav>
      </header>

      {page === "home" && (
        <main className="dashboard-page">
          <section className="dashboard-hero">
            <div className="hero-glow" />
            <div className="eyebrow"><Sparkles size={14} /> YOUR WORK, YOUR STORY</div>
            <h1>Make your next<br /><span>first impression.</span></h1>
            <p>Build and manage multiple portfolios, explore eight visual styles, and keep every version saved in your database.</p>
            <button className="primary-button" onClick={startCreate}><Plus size={17} /> Create a portfolio <ArrowUpRight size={16} /></button>
            <div className="hero-stats">
              <div><strong>{portfolios.length.toString().padStart(2, "0")}</strong><span>Saved portfolios</span></div>
              <div><strong>08</strong><span>Design templates</span></div>
              <div><strong>01</strong><span>Place to manage it all</span></div>
            </div>
          </section>
          {error && <div className="status-message error">{error}</div>}
          {message && <div className="status-message success">{message}</div>}
          <section className="portfolio-list-section">
            <div className="section-heading"><div><span className="section-kicker">YOUR WORKSPACE</span><h2>My portfolios <span className="heading-count">{portfolios.length}</span></h2></div><button className="text-button" onClick={startCreate}><Plus size={15} /> New portfolio</button></div>
            {portfolios.length === 0 ? (
              <div className="empty-state"><div className="empty-icon"><FolderOpen size={28} /></div><h3>Your workspace is ready</h3><p>Create your first portfolio and it will appear here. Each one can have its own content, photo, and template.</p><button className="primary-button" onClick={startCreate}><Plus size={16} /> Create first portfolio</button></div>
            ) : (
              <div className="portfolio-grid">
                {portfolios.map((item) => {
                  const template = templates.find((t) => t.id === item.template) || templates[0];
                  return <article className={`portfolio-card card-${item.template || "midnight"}`} key={item._id}>
                    <div className="portfolio-card-art"><div className="mini-window"><i /><i /><i /><span>{template.name}</span><b>{(item.name || "Your Name").slice(0, 1).toUpperCase()}</b></div><span className="template-chip">{template.name}</span></div>
                    <div className="portfolio-card-body"><div className="portfolio-card-title"><h3>{item.title || item.name || "Untitled portfolio"}</h3><span className="status-dot" /></div><p>{item.name || "Name not added yet"}{item.role ? ` · ${item.role}` : ""}</p><div className="card-meta"><span><Code2 size={13} /> {(item.projects || []).length} projects</span><span><Sparkles size={13} /> {(item.skills || []).length} skills</span></div>
                    <div className="card-actions"><button className="primary-button compact" onClick={() => editPortfolio(item)}><Pencil size={14} /> Edit</button><button className="secondary-button compact" onClick={() => { setActiveId(item._id); setPortfolio(normalizePortfolio(item)); setPage("preview"); }}><Eye size={14} /> Preview</button><button className="icon-button danger" onClick={() => deletePortfolio(item)} aria-label="Delete portfolio"><Trash2 size={16} /></button></div></div>
                  </article>;
                })}
              </div>
            )}
          </section>
          <section className="template-gallery"><div className="section-heading"><div><span className="section-kicker">FIND YOUR LOOK</span><h2>Eight ways to tell your story</h2></div></div><div className="template-gallery-grid">{templates.map((template, i) => <button key={template.id} className={`template-tile tile-${template.id}`} onClick={() => { startCreate(); setPortfolio((current) => ({ ...current, template: template.id })); }}><span className="tile-index">0{i + 1}</span><span className="tile-visual"><i /><i /><i /><b /></span><span className="tile-name">{template.name}</span><span className="tile-mood">{template.mood}</span></button>)}</div></section>
        </main>
      )}

      {page === "editor" && (
        <main className="workspace-page">
          <div className="page-toolbar"><button className="back-button" onClick={goHome}><ArrowLeft size={16} /> Back to home</button><span className="toolbar-caption">{activeId ? "EDIT SAVED PORTFOLIO" : "CREATE NEW PORTFOLIO"}</span><button className="secondary-button" onClick={() => setPage("preview")}><Eye size={16} /> Preview</button></div>
          <div className="editor-heading"><span className="section-kicker">PORTFOLIO STUDIO</span><h1>{activeId ? "Shape your story." : "Start with your story."}</h1><p>Every field is optional. The examples are placeholders, not saved text—click any field and start typing.</p></div>
          <form className="editor-form" onSubmit={savePortfolio}>
            <section className="editor-section">
              <div className="editor-section-heading"><span className="section-icon"><LayoutDashboard size={17} /></span><div><h2>Portfolio setup</h2><p>Give this portfolio a name and choose its own design.</p></div></div>
              <div className="form-grid">
                <label className="full-width">Portfolio title<input value={portfolio.title || ""} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Software Developer Portfolio" /></label>
                <label className="full-width">Choose a template<select value={portfolio.template || "midnight"} onChange={(e) => updateField("template", e.target.value)}>{templates.map((t) => <option value={t.id} key={t.id}>{t.name} — {t.mood}</option>)}</select></label>
              </div>
              <div className="template-choice-grid">{templates.map((t) => <button type="button" key={t.id} onClick={() => updateField("template", t.id)} className={`template-choice ${portfolio.template === t.id ? "selected" : ""} choice-${t.id}`}><span className="choice-swatch"><i /><i /><i /></span><span><b>{t.name}</b><small>{t.description}</small></span>{portfolio.template === t.id && <Check size={17} />}</button>)}</div>
            </section>

            <section className="editor-section">
              <div className="editor-section-heading"><span className="section-icon"><UserRound size={17} /></span><div><h2>Personal information</h2><p>Use the details you want visitors to see.</p></div></div>
              <div className="photo-upload-row">
                <div className="photo-preview">{portfolio.photo ? <img src={portfolio.photo} alt="Portfolio profile" /> : <UserRound size={28} />}</div>
                <div className="photo-upload-copy"><strong>Profile photo</strong><p>JPG, PNG, or WebP · up to 4 MB. Saved with this portfolio.</p><label className="upload-button"><Camera size={15} /> {portfolio.photo ? "Change photo" : "Upload photo"}<input type="file" accept="image/*" onChange={choosePhoto} /></label>{portfolio.photo && <button type="button" className="remove-photo" onClick={() => updateField("photo", "")}><X size={13} /> Remove photo</button>}</div>
              </div>
              <div className="form-grid">
                <label>Full name<input value={portfolio.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Aanya Sharma" /></label>
                <label>Professional role<input value={portfolio.role || ""} onChange={(e) => updateField("role", e.target.value)} placeholder="e.g. Frontend Developer" /></label>
                <label>Email address<input type="email" value={portfolio.email || ""} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" /></label>
                <label>Location<input value={portfolio.location || ""} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Hyderabad, India" /></label>
                <label className="full-width">Career objective<textarea rows="4" value={portfolio.objective || ""} onChange={(e) => updateField("objective", e.target.value)} placeholder="Write a short introduction about yourself and what you hope to build..." /></label>
                <label className="full-width">Education<input value={portfolio.education || ""} onChange={(e) => updateField("education", e.target.value)} placeholder="e.g. B.Tech in Computer Science, 2027" /></label>
              </div>
            </section>

            <section className="editor-section">
              <div className="editor-section-heading"><span className="section-icon"><Code2 size={17} /></span><div><h2>Technical skills</h2><p>Add technologies, tools, and strengths.</p></div></div>
              <div className="skill-add"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g. Java, React, Python" onKeyDown={(e) => { if (e.key === "Enter") addSkill(e); }} /><button className="secondary-button" type="button" onClick={addSkill}><Plus size={15} /> Add skill</button></div>
              <div className="skill-chips">{portfolio.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}<button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)}><X size={13} /></button></span>)}</div>
            </section>

            <section className="editor-section">
              <div className="editor-section-heading between"><span className="section-icon"><Sparkles size={17} /></span><div><h2>Projects</h2><p>Show what you have built and what you learned.</p></div><button type="button" className="text-button" onClick={addProject}><Plus size={15} /> Add project</button></div>
              {portfolio.projects.map((project, index) => <div className="project-form-card" key={project._id || index}><div className="project-form-title"><span>PROJECT {String(index + 1).padStart(2, "0")}</span>{<button type="button" className="icon-button danger" onClick={() => removeProject(index)} aria-label="Remove project"><Trash2 size={15} /></button>}</div><label>Project title<input value={project.title || ""} onChange={(e) => updateProject(index, "title", e.target.value)} placeholder="e.g. Campus Event Portal" /></label><label>Description<textarea rows="3" value={project.description || ""} onChange={(e) => updateProject(index, "description", e.target.value)} placeholder="What does your project do? What problem does it solve?" /></label><label>Technologies used<input value={project.technologies || ""} onChange={(e) => updateProject(index, "technologies", e.target.value)} placeholder="React, Express, MongoDB" /></label><label>Project link (optional)<input value={project.link || ""} onChange={(e) => updateProject(index, "link", e.target.value)} placeholder="https://github.com/username/project" /></label></div>)}
              {portfolio.projects.length === 0 && <div className="inline-empty">No projects added yet. Use “Add project” to include one.</div>}
            </section>

            <section className="editor-section">
              <div className="editor-section-heading"><span className="section-icon"><ExternalLink size={17} /></span><div><h2>Online profiles</h2><p>Optional links to your public work.</p></div></div>
              <div className="form-grid"><label>GitHub URL<input value={portfolio.github || ""} onChange={(e) => updateField("github", e.target.value)} placeholder="https://github.com/username" /></label><label>LinkedIn URL<input value={portfolio.linkedin || ""} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" /></label></div>
            </section>
            {error && <div className="status-message error">{error}</div>}
            {message && <div className="status-message success">{message}</div>}
            <div className="sticky-save-bar"><span>{activeId ? "Changes stay local until you save." : "Create your portfolio to save it to MongoDB."}</span><button type="button" className="secondary-button" onClick={() => setPage("preview")}><Eye size={16} /> Preview</button><button type="submit" className="primary-button" disabled={saving}><Save size={16} /> {saving ? "Saving…" : activeId ? "Save changes" : "Create & save portfolio"}</button></div>
          </form>
        </main>
      )}

      {page === "preview" && <PortfolioPreview portfolio={portfolio} onEdit={() => setPage("editor")} onHome={goHome} />}
      <footer className="app-footer"><button className="footer-brand" onClick={goHome}>folio<span>.</span></button><span>Made to show what you can do.</span><span>React · Express · MongoDB</span></footer>
    </div>
  );
}

function PortfolioPreview({ portfolio, onEdit, onHome }) {
  const initials = (portfolio.name || "YN").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <main className={`preview-page preview-${portfolio.template || "midnight"}`}>
    <div className="preview-toolbar"><button className="back-button" onClick={onHome}><ArrowLeft size={16} /> Dashboard</button><div><span className="live-dot" /> PORTFOLIO PREVIEW</div><button className="secondary-button" onClick={onEdit}><Pencil size={15} /> Edit portfolio</button></div>
    <section className="hero-preview"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> OPEN TO LEARNING & OPPORTUNITIES</div><h1>Hi, I'm <span>{portfolio.name || "Your Name"}.</span></h1><h2>{portfolio.role || "Your professional role"}</h2><p>{portfolio.objective || "Add a short introduction in the editor to tell visitors about your goals, interests, and the kind of work you enjoy."}</p><div className="hero-buttons">{portfolio.email && <a className="primary-button link-button" href={`mailto:${portfolio.email}`}><Mail size={16} /> Get in touch</a>}{portfolio.github && <a className="secondary-button link-button" href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>}</div><div className="hero-meta">{portfolio.location && <span><MapPin size={14} /> {portfolio.location}</span>}{portfolio.email && <span><Mail size={14} /> {portfolio.email}</span>}</div></div><div className="avatar-wrap">{portfolio.photo ? <img className="profile-photo" src={portfolio.photo} alt={`${portfolio.name || "Profile"} portrait`} /> : <div className="avatar-ring"><div className="avatar">{initials || "YN"}</div></div>}<div className="floating-tag tag-top"><Code2 size={14} /> Build & learn</div><div className="floating-tag tag-bottom"><Sparkles size={14} /> Curious by nature</div></div></section>
    <section className="preview-section"><div className="preview-section-heading"><span>01 / WHAT I KNOW</span><h2>Skills & tools</h2></div>{portfolio.skills?.length ? <div className="preview-skills">{portfolio.skills.map((skill) => <div className="preview-skill" key={skill}><span className="skill-dot" />{skill}</div>)}</div> : <p className="preview-empty">Your skills will appear here when you add them.</p>}</section>
    <section className="preview-section"><div className="preview-section-heading"><span>02 / WHAT I'VE BUILT</span><h2>Selected projects</h2></div>{portfolio.projects?.some((p) => p.title || p.description) ? <div className="preview-projects">{portfolio.projects.filter((p) => p.title || p.description).map((project, index) => <article className="preview-project" key={project._id || index}><div className="project-number">0{index + 1}</div><div className="project-content"><h3>{project.title || "Untitled project"}</h3><p>{project.description}</p><div className="project-tech">{(project.technologies || "").split(",").map((tech) => tech.trim()).filter(Boolean).map((tech) => <span key={tech}>{tech}</span>)}</div>{project.link && <a className="project-link" href={project.link} target="_blank" rel="noreferrer">View project <ArrowUpRight size={14} /></a>}</div><Code2 className="project-art" size={30} /></article>)}</div> : <p className="preview-empty">Your projects will appear here when you add them.</p>}</section>
    {portfolio.education && <section className="preview-section education-section"><div className="preview-section-heading"><span>03 / MY JOURNEY</span><h2>Education</h2></div><div className="education-card"><div className="education-icon"><Code2 size={21} /></div><div><h3>{portfolio.education}</h3><p>Building a strong foundation through learning and hands-on projects.</p></div></div></section>}
    <section className="contact-banner"><div><span className="section-kicker">HAVE A PROJECT IN MIND?</span><h2>Let's build something<br />meaningful.</h2><p>I'm always happy to connect, learn, and collaborate.</p></div><div className="contact-links">{portfolio.email && <a href={`mailto:${portfolio.email}`}><Mail size={16} /> {portfolio.email}</a>}{portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>}{portfolio.github && <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>}</div></section>
    <div className="preview-bottom"><span>© {new Date().getFullYear()} {portfolio.name || "Your Name"}</span><span>Designed with curiosity <Sparkles size={13} /></span></div>
  </main>;
}
