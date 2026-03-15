<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SayCymraeg — README</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg: #09090f;
      --surface: #11111c;
      --surface2: #18182a;
      --border: rgba(163, 42, 203, 0.18);
      --border-light: rgba(255,255,255,0.07);
      --accent: #A32ACB;
      --accent2: #c94fff;
      --accent-glow: rgba(163, 42, 203, 0.35);
      --text: #e8e8f0;
      --text-muted: #7a7a9a;
      --text-dim: #4a4a6a;
      --green: #00e676;
      --welsh-red: #c8102e;
      --font: 'Sora', sans-serif;
      --mono: 'JetBrains Mono', monospace;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      overflow-x: hidden;
    }

    /* ─── NOISE OVERLAY ─── */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }

    /* ─── HEADER ─── */
    header {
      position: relative;
      padding: 90px 5vw 70px;
      overflow: hidden;
      border-bottom: 1px solid var(--border);
    }

    header::after {
      content: '';
      position: absolute;
      top: -120px; left: 50%;
      transform: translateX(-50%);
      width: 700px; height: 400px;
      background: radial-gradient(ellipse, rgba(163,42,203,0.22) 0%, transparent 70%);
      pointer-events: none;
    }

    .header-inner {
      max-width: 960px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .flag-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(163,42,203,0.12);
      border: 1px solid var(--border);
      border-radius: 100px;
      padding: 5px 14px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent2);
      margin-bottom: 28px;
      animation: fadeUp 0.5s ease both;
    }

    h1 {
      font-size: clamp(2.8rem, 7vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.05;
      animation: fadeUp 0.6s 0.1s ease both;
    }

    h1 span.grad {
      background: linear-gradient(135deg, #A32ACB, #e040fb, #A32ACB);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    @keyframes shimmer { to { background-position: 200% center; } }

    .header-sub {
      margin-top: 18px;
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 580px;
      font-weight: 400;
      animation: fadeUp 0.6s 0.2s ease both;
    }

    .header-meta {
      margin-top: 36px;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
      animation: fadeUp 0.6s 0.3s ease both;
    }

    .meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-chip svg { opacity: 0.6; }

    .btn-group {
      margin-top: 40px;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      animation: fadeUp 0.6s 0.4s ease both;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 24px;
      border-radius: 8px;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--accent);
      color: #fff;
      box-shadow: 0 0 24px var(--accent-glow);
    }

    .btn-primary:hover {
      background: var(--accent2);
      box-shadow: 0 0 36px rgba(163,42,203,0.55);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--surface2);
      color: var(--text);
      border: 1px solid var(--border-light);
    }

    .btn-secondary:hover {
      border-color: var(--accent);
      background: rgba(163,42,203,0.1);
      transform: translateY(-2px);
    }

    /* ─── LAYOUT ─── */
    main {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 5vw 80px;
      position: relative;
      z-index: 1;
    }

    section { margin-top: 72px; }

    .section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 10px;
    }

    h2 {
      font-size: 1.7rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
      margin-bottom: 6px;
    }

    .section-divider {
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), transparent);
      margin: 12px 0 28px;
    }

    p { color: var(--text-muted); font-size: 15px; margin-bottom: 14px; }
    p:last-child { margin-bottom: 0; }

    /* ─── FEATURES GRID ─── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    .feature-card {
      background: var(--surface);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 24px;
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    }

    .feature-card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(163,42,203,0.12);
    }

    .feature-icon {
      width: 40px; height: 40px;
      background: rgba(163,42,203,0.12);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 14px;
    }

    .feature-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 6px;
    }

    .feature-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin: 0;
    }

    /* ─── TECH STACK ─── */
    .stack-group { margin-bottom: 28px; }

    .stack-group-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      margin-bottom: 12px;
    }

    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--surface2);
      border: 1px solid var(--border-light);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .badge:hover {
      border-color: var(--accent);
      color: var(--text);
      background: rgba(163,42,203,0.08);
    }

    .badge-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
    }

    /* ─── SETUP STEPS ─── */
    .steps { display: flex; flex-direction: column; gap: 0; }

    .step {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: 0 20px;
      position: relative;
    }

    .step:not(:last-child) .step-line {
      position: absolute;
      left: 23px; top: 48px;
      width: 2px;
      height: calc(100% - 24px);
      background: linear-gradient(to bottom, var(--accent), transparent);
      opacity: 0.3;
    }

    .step-num {
      width: 48px; height: 48px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: var(--accent2);
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .step-body {
      padding-bottom: 36px;
    }

    .step-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 6px;
      padding-top: 12px;
    }

    .step-desc { font-size: 13.5px; color: var(--text-muted); margin-bottom: 12px; }

    /* ─── CODE BLOCKS ─── */
    pre {
      background: var(--surface);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 16px 20px;
      overflow-x: auto;
      margin-top: 10px;
    }

    code {
      font-family: var(--mono);
      font-size: 13px;
      color: #c8b8ff;
    }

    .code-comment { color: var(--text-dim); }
    .code-key { color: #79c0ff; }
    .code-val { color: #a5d6ff; }
    .code-cmd { color: var(--green); }

    /* ─── PROJECT STRUCTURE ─── */
    .tree {
      background: var(--surface);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 24px 28px;
      font-family: var(--mono);
      font-size: 13px;
    }

    .tree-line {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 0;
      color: var(--text-muted);
    }

    .tree-line.dir { color: var(--text); font-weight: 600; }
    .tree-line.root { color: var(--accent2); font-weight: 700; font-size: 14px; }
    .tree-indent { color: var(--text-dim); }

    /* ─── TEST ACCOUNT ─── */
    .cred-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px 28px;
      display: flex;
      gap: 32px;
      flex-wrap: wrap;
    }

    .cred-item label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-dim);
      display: block;
      margin-bottom: 6px;
    }

    .cred-item span {
      font-family: var(--mono);
      font-size: 14px;
      color: var(--accent2);
      font-weight: 600;
    }

    /* ─── AUTHOR CARD ─── */
    .author-card {
      background: var(--surface);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      align-items: flex-start;
      gap: 28px;
      flex-wrap: wrap;
    }

    .author-avatar {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), #6c00ff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 800;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 0 24px var(--accent-glow);
    }

    .author-info { flex: 1; min-width: 200px; }
    .author-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .author-bio { font-size: 13px; color: var(--text-muted); margin: 0 0 14px; }

    .author-links { display: flex; gap: 10px; flex-wrap: wrap; }

    .author-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-decoration: none;
      border: 1px solid var(--border-light);
      border-radius: 6px;
      padding: 6px 12px;
      transition: all 0.2s;
    }

    .author-link:hover {
      color: var(--text);
      border-color: var(--accent);
      background: rgba(163,42,203,0.08);
    }

    /* ─── FOOTER ─── */
    footer {
      border-top: 1px solid var(--border-light);
      padding: 32px 5vw;
      text-align: center;
      font-size: 13px;
      color: var(--text-dim);
      position: relative;
      z-index: 1;
    }

    footer span { color: var(--accent); }

    /* ─── ANIMATIONS ─── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .fade-up {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .fade-up.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ─── CALLOUT ─── */
    .callout {
      background: rgba(163,42,203,0.07);
      border: 1px solid rgba(163,42,203,0.25);
      border-left: 3px solid var(--accent);
      border-radius: 8px;
      padding: 16px 20px;
      font-size: 13.5px;
      color: var(--text-muted);
    }

    .callout strong { color: var(--accent2); }

    /* ─── ROADMAP ─── */
    .roadmap-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }

    .roadmap-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-muted);
    }

    .roadmap-item .tag {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .tag-done { background: rgba(0,230,118,0.12); color: var(--green); }
    .tag-wip  { background: rgba(255,193,7,0.12); color: #ffc107; }
    .tag-plan { background: rgba(163,42,203,0.12); color: var(--accent2); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
  </style>
</head>
<body>

  <!-- ═══ HEADER ═══ -->
  <header>
    <div class="header-inner">
      <div class="flag-badge">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh Language Learning Platform</div>
      <h1>Say<span class="grad">Cymraeg</span></h1>
      <p class="header-sub">An interactive, gamified web application to help you learn the Welsh language — powered by AI, built with passion.</p>
      <div class="header-meta">
        <span class="meta-chip">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Rakshit Rangarajan
        </span>
        <span class="meta-chip">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Next.js 14 · Flask · Firebase
        </span>
        <span class="meta-chip">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Live on Vercel
        </span>
      </div>
      <div class="btn-group">
        <a href="https://saycymraeg.rakshitr.co.in" target="_blank" class="btn btn-primary">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Live Demo
        </a>
        <a href="https://api.rakshitr.co.in/saycymraeg/api/docs" target="_blank" class="btn btn-secondary">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Swagger API Docs
        </a>
      </div>
    </div>
  </header>

  <main>

    <!-- ═══ OVERVIEW ═══ -->
    <section class="fade-up">
      <div class="section-label">Overview</div>
      <h2>What is SayCymraeg?</h2>
      <div class="section-divider"></div>
      <p>SayCymraeg is a full-stack, gamified language learning platform built for Welsh learners. It combines dynamic flashcards, challenging quizzes, AI-powered conversation practice, and community features — all wrapped in a responsive, modern interface.</p>
      <p>What started as a small personal project exploring local language models quickly grew into a feature-rich application, incorporating real-time pronunciation feedback, speech recognition, competitive leaderboards, and an AI tutor powered by Llama 3.1. The project was built over the course of a month and became a deep dive into full-stack development, AI integration, and product design.</p>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="fade-up">
      <div class="section-label">Features</div>
      <h2>What's Inside</h2>
      <div class="section-divider"></div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🃏</div>
          <div class="feature-title">Interactive Flashcards</div>
          <p class="feature-desc">Dynamic vocabulary cards with English/Welsh flip animations. Supports custom AI-generated topic sets.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧠</div>
          <div class="feature-title">Engaging Quizzes</div>
          <p class="feature-desc">Multiple quiz formats to test and reinforce Welsh vocabulary and grammar at your own pace.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <div class="feature-title">AI Welsh Tutor</div>
          <p class="feature-desc">Chat with a conversational AI tutor powered by Llama 3.1 via Ollama for natural language practice.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎙️</div>
          <div class="feature-title">Pronunciation Tutor</div>
          <p class="feature-desc">Text-to-speech via gTTS paired with speech recognition to help you nail Welsh pronunciation.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <div class="feature-title">Competitive Leaderboard</div>
          <p class="feature-desc">Track your progress against other learners in real time, fuelling motivation and consistency.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <div class="feature-title">Social Chat</div>
          <p class="feature-desc">Connect with fellow Welsh learners through an integrated community chat room.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <div class="feature-title">Custom Flashcard Generator</div>
          <p class="feature-desc">Generate vocabulary sets on any topic using AI — explore Welsh for cooking, travel, tech, and more.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <div class="feature-title">Fully Responsive</div>
          <p class="feature-desc">Seamless experience across all screen sizes — learn on desktop, tablet, or mobile.</p>
        </div>
      </div>
    </section>

    <!-- ═══ TECH STACK ═══ -->
    <section class="fade-up">
      <div class="section-label">Tech Stack</div>
      <h2>Built With</h2>
      <div class="section-divider"></div>

      <div class="stack-group">
        <div class="stack-group-label">Frontend</div>
        <div class="badges">
          <span class="badge"><span class="badge-dot" style="background:#fff;"></span>Next.js 14</span>
          <span class="badge"><span class="badge-dot" style="background:#61DAFB;"></span>React 19</span>
          <span class="badge"><span class="badge-dot" style="background:#3178c6;"></span>TypeScript</span>
          <span class="badge"><span class="badge-dot" style="background:#38B2AC;"></span>Tailwind CSS</span>
          <span class="badge"><span class="badge-dot" style="background:#888;"></span>Radix UI</span>
        </div>
      </div>

      <div class="stack-group">
        <div class="stack-group-label">Backend API</div>
        <div class="badges">
          <span class="badge"><span class="badge-dot" style="background:#3776AB;"></span>Python 3.9+</span>
          <span class="badge"><span class="badge-dot" style="background:#fff;"></span>Flask</span>
          <span class="badge"><span class="badge-dot" style="background:#fff;"></span>Flask-CORS</span>
          <span class="badge"><span class="badge-dot" style="background:#85EA2D;"></span>Swagger UI</span>
        </div>
      </div>

      <div class="stack-group">
        <div class="stack-group-label">AI & Machine Learning</div>
        <div class="badges">
          <span class="badge"><span class="badge-dot" style="background:#fff;"></span>Ollama (Llama 3.1)</span>
          <span class="badge"><span class="badge-dot" style="background:#4285F4;"></span>gTTS</span>
          <span class="badge"><span class="badge-dot" style="background:#3776AB;"></span>SpeechRecognition</span>
          <span class="badge"><span class="badge-dot" style="background:#c0392b;"></span>pydub</span>
        </div>
      </div>

      <div class="stack-group">
        <div class="stack-group-label">Database & Auth</div>
        <div class="badges">
          <span class="badge"><span class="badge-dot" style="background:#FFCA28;"></span>Firebase</span>
          <span class="badge"><span class="badge-dot" style="background:#FFCA28;"></span>Firestore</span>
          <span class="badge"><span class="badge-dot" style="background:#FFCA28;"></span>Firebase Auth</span>
        </div>
      </div>
    </section>

    <!-- ═══ PREREQUISITES ═══ -->
    <section class="fade-up">
      <div class="section-label">Getting Started</div>
      <h2>Prerequisites</h2>
      <div class="section-divider"></div>
      <p>Before setting up the project, make sure you have the following installed:</p>
      <div class="callout" style="margin-bottom: 14px;">
        <strong>Node.js</strong> v18+ with npm or pnpm &nbsp;·&nbsp; <strong>Python</strong> v3.9+ with pip &nbsp;·&nbsp; <strong>Ollama</strong> with the Llama 3.1 model pulled
      </div>
      <p>To pull the required AI model, run:</p>
      <pre><code><span class="code-cmd">ollama pull llama3.1</span></code></pre>
    </section>

    <!-- ═══ SETUP ═══ -->
    <section class="fade-up">
      <h2>Setup Guide</h2>
      <div class="section-divider"></div>
      <div class="steps">

        <div class="step">
          <div class="step-line"></div>
          <div class="step-num">1</div>
          <div class="step-body">
            <div class="step-title">Clone the repository</div>
            <p class="step-desc">Get the project files onto your local machine.</p>
            <pre><code><span class="code-cmd">git clone https://github.com/your-username/SayCymraeg.git
cd SayCymraeg</span></code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-line"></div>
          <div class="step-num">2</div>
          <div class="step-body">
            <div class="step-title">Install frontend dependencies</div>
            <p class="step-desc">Navigate to the frontend directory and install packages.</p>
            <pre><code><span class="code-cmd">cd frontend
npm install</span></code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-line"></div>
          <div class="step-num">3</div>
          <div class="step-body">
            <div class="step-title">Configure frontend environment</div>
            <p class="step-desc">Create a <code>.env.local</code> file in the frontend directory with your Firebase credentials:</p>
            <pre><code><span class="code-key">NEXT_PUBLIC_FIREBASE_API_KEY</span>=<span class="code-val">your_api_key</span>
<span class="code-key">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</span>=<span class="code-val">your_auth_domain</span>
<span class="code-key">NEXT_PUBLIC_FIREBASE_PROJECT_ID</span>=<span class="code-val">your_project_id</span>
<span class="code-key">NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</span>=<span class="code-val">your_storage_bucket</span>
<span class="code-key">NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</span>=<span class="code-val">your_sender_id</span>
<span class="code-key">NEXT_PUBLIC_FIREBASE_APP_ID</span>=<span class="code-val">your_app_id</span></code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-line"></div>
          <div class="step-num">4</div>
          <div class="step-body">
            <div class="step-title">Set up the backend</div>
            <p class="step-desc">Navigate to the backend directory, create a virtual environment, and install Python dependencies.</p>
            <pre><code><span class="code-cmd">cd ../backend
python -m venv venv
source venv/bin/activate    <span class="code-comment"># Windows: venv\Scripts\activate</span>
pip install -r requirements.txt</span></code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-line"></div>
          <div class="step-num">5</div>
          <div class="step-body">
            <div class="step-title">Configure backend environment</div>
            <p class="step-desc">Create a <code>.env</code> file in the backend directory pointing to your Firebase Admin SDK key:</p>
            <pre><code><span class="code-key">GOOGLE_APPLICATION_CREDENTIALS</span>=<span class="code-val">"path/to/firebase-adminsdk-key.json"</span></code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-num">6</div>
          <div class="step-body">
            <div class="step-title">Run both servers</div>
            <p class="step-desc">Open two terminals and start the servers simultaneously.</p>
            <pre><code><span class="code-comment"># Terminal 1 — Backend</span>
<span class="code-cmd">cd backend && flask run</span>

<span class="code-comment"># Terminal 2 — Frontend</span>
<span class="code-cmd">cd frontend && npm run dev</span></code></pre>
            <p class="step-desc" style="margin-top:12px;">Frontend → <code>http://localhost:3000</code> &nbsp;·&nbsp; Backend API → <code>http://localhost:5000</code> &nbsp;·&nbsp; Swagger → <code>http://localhost:5000/swagger</code></p>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══ TEST ACCOUNT ═══ -->
    <section class="fade-up">
      <div class="section-label">Try It Now</div>
      <h2>Test Account</h2>
      <div class="section-divider"></div>
      <p>Use the following credentials to log in and explore all features without creating an account:</p>
      <div class="cred-card">
        <div class="cred-item">
          <label>Email</label>
          <span>test@test.com</span>
        </div>
        <div class="cred-item">
          <label>Password</label>
          <span>password</span>
        </div>
      </div>
    </section>

    <!-- ═══ PROJECT STRUCTURE ═══ -->
    <section class="fade-up">
      <div class="section-label">Architecture</div>
      <h2>Project Structure</h2>
      <div class="section-divider"></div>
      <div class="tree">
        <div class="tree-line root">📁 SayCymraeg/</div>
        <div class="tree-line dir"><span class="tree-indent">├── 📁</span> frontend/</div>
        <div class="tree-line"><span class="tree-indent">│   ├── 📁</span> app/</div>
        <div class="tree-line"><span class="tree-indent">│   ├── 📁</span> components/</div>
        <div class="tree-line"><span class="tree-indent">│   ├── 📄</span> .env.local</div>
        <div class="tree-line"><span class="tree-indent">│   └── 📄</span> package.json</div>
        <div class="tree-line dir"><span class="tree-indent">├── 📁</span> backend/</div>
        <div class="tree-line"><span class="tree-indent">│   ├── 📄</span> app.py</div>
        <div class="tree-line"><span class="tree-indent">│   ├── 📄</span> requirements.txt</div>
        <div class="tree-line"><span class="tree-indent">│   ├── 📄</span> .env</div>
        <div class="tree-line"><span class="tree-indent">│   └── 📁</span> venv/</div>
        <div class="tree-line"><span class="tree-indent">└── 📄</span> README.md</div>
      </div>
    </section>

    <!-- ═══ ROADMAP ═══ -->
    <section class="fade-up">
      <div class="section-label">Roadmap</div>
      <h2>What's Next</h2>
      <div class="section-divider"></div>
      <ul class="roadmap-list">
        <li class="roadmap-item"><span class="tag tag-done">Done</span> Interactive flashcards with custom AI topic generator</li>
        <li class="roadmap-item"><span class="tag tag-done">Done</span> AI-powered Welsh tutor via Llama 3.1</li>
        <li class="roadmap-item"><span class="tag tag-done">Done</span> Pronunciation tutor with speech recognition</li>
        <li class="roadmap-item"><span class="tag tag-done">Done</span> Leaderboard & social chat</li>
        <li class="roadmap-item"><span class="tag tag-done">Done</span> Swagger API documentation</li>
        <li class="roadmap-item"><span class="tag tag-wip">In Progress</span> Spaced repetition system for flashcards</li>
        <li class="roadmap-item"><span class="tag tag-plan">Planned</span> Mobile app (React Native)</li>
        <li class="roadmap-item"><span class="tag tag-plan">Planned</span> Additional Celtic language support (Irish, Scottish Gaelic)</li>
        <li class="roadmap-item"><span class="tag tag-plan">Planned</span> Progress analytics dashboard</li>
      </ul>
    </section>

    <!-- ═══ CONTRIBUTING ═══ -->
    <section class="fade-up">
      <div class="section-label">Contributing</div>
      <h2>Get Involved</h2>
      <div class="section-divider"></div>
      <p>Contributions, issues, and feature requests are welcome! Here's how to get started:</p>
      <div class="steps">
        <div class="step">
          <div class="step-line"></div>
          <div class="step-num" style="font-size:15px;">🍴</div>
          <div class="step-body">
            <div class="step-title">Fork the repository</div>
            <p class="step-desc">Create your own fork on GitHub and clone it locally.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-line"></div>
          <div class="step-num" style="font-size:15px;">🌿</div>
          <div class="step-body">
            <div class="step-title">Create a feature branch</div>
            <pre><code><span class="code-cmd">git checkout -b feature/your-feature-name</span></code></pre>
          </div>
        </div>
        <div class="step">
          <div class="step-num" style="font-size:15px;">🚀</div>
          <div class="step-body">
            <div class="step-title">Open a Pull Request</div>
            <p class="step-desc">Commit your changes, push to your branch, and open a PR with a clear description of what you've added.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ AUTHOR ═══ -->
    <section class="fade-up">
      <div class="section-label">Author</div>
      <h2>About the Developer</h2>
      <div class="section-divider"></div>
      <div class="author-card">
        <div class="author-avatar">RR</div>
        <div class="author-info">
          <div class="author-name">Rakshit Rangarajan</div>
          <p class="author-bio">Full-stack developer with a passion for language, AI, and building things that genuinely help people. SayCymraeg was built as a personal experiment that grew into something much bigger.</p>
          <div class="author-links">
            <a href="https://linkedin.com/in/rakshit-rangarajan-2084b2211/" target="_blank" class="author-link">
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a href="mailto:rakshitr2000@gmail.com" target="_blank" class="author-link">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </a>
            <a href="https://www.rakshitr.co.in" target="_blank" class="author-link">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <footer>
    Built with <span>♥</span> by Rakshit Rangarajan &nbsp;·&nbsp; SayCymraeg &nbsp;·&nbsp; 🏴󠁧󠁢󠁷󠁬󠁳󠁥 <em>Cymru am byth</em>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  </script>
</body>
</html>
