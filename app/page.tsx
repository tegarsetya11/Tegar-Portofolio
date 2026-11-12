'use client';
import App from '@/components/band/App';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const f1AudioRef = useRef<HTMLAudioElement | null>(null);
  const lastF1PlayedRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Typewriter & Glitch Effect for Role
  const [typedRole, setTypedRole] = useState('');
  const fullRole = 'Junior Technical Support · Network · Web Specialist';

  useEffect(() => {
    let index = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setTypedRole(fullRole.slice(0, index));
        if (index >= fullRole.length) {
          clearInterval(interval);
        }
      }, 45);
      return () => clearInterval(interval);
    }, 600);

    return () => clearTimeout(startTimeout);
  }, []);

  const playF1Radio = () => {
    const now = Date.now();
    // Cooldown 2 detik agar tidak spam / double play
    if (now - lastF1PlayedRef.current < 2000) return;
    lastF1PlayedRef.current = now;

    if (!f1AudioRef.current) {
      const f1 = new Audio('/assets/f1-radio.mp3');
      f1.volume = 0.85; // Volume lebih tegas & jelas
      f1AudioRef.current = f1;
    } else {
      f1AudioRef.current.volume = 0.85;
    }
    f1AudioRef.current.currentTime = 0;
    f1AudioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    // ----- Audio Backsound -----
    const audio = new Audio('/assets/backsound.mp3');
    audio.loop = true;
    audio.volume = 0.25; // Suara lembut, tidak terlalu keras (25%)
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy prevented immediate playback
      });
    };

    // Coba autoplay langsung
    playAudio();

    // Jika diblokir oleh browser, putar otomatis pada interaksi pertama user (klik/scroll/sentuh)
    const handleFirstGesture = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('scroll', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      audio.pause();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  useEffect(() => {
    // ----- Loading Screen -----
    if (sessionStorage.getItem('loaded')) {
      if (loadingRef.current) loadingRef.current.style.display = 'none';
      return;
    }
    let p = 0;
    const duration = 1600;
    const interval = 20;
    const steps = duration / interval;
    const inc = 100 / steps;
    const timer = setInterval(() => {
      p = Math.min(100, p + inc + (Math.random() * 2 - 1));
      if (percentRef.current) percentRef.current.textContent = Math.floor(p) + '%';
      if (barRef.current) barRef.current.style.width = Math.floor(p) + '%';
      if (p >= 100) {
        clearInterval(timer);
        if (percentRef.current) percentRef.current.textContent = '100%';
        if (barRef.current) barRef.current.style.width = '100%';
        setTimeout(() => {
          if (loadingRef.current) loadingRef.current.classList.add('hidden');
          sessionStorage.setItem('loaded', '1');
        }, 400);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // ----- Floating Nav active state -----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.float-nav a');
    const backTop = document.getElementById('back-top');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.float-nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');

          if (entry.target.id === 'about') {
            playF1Radio();
          }
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));

    // Back to top visibility
    const handleScroll = () => {
      if (backTop) {
        if (window.scrollY > 400) backTop.classList.add('visible');
        else backTop.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal, .timeline-item');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    reveals.forEach(r => revealObs.observe(r));

    return () => {
      observer.disconnect();
      revealObs.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* ===== LOADING SCREEN ===== */}
      <div id="loading-screen" ref={loadingRef}>
        {/* Walking man SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <style>{`
            .body-g { animation: walkBody 0.5s ease-in-out infinite; transform-origin: 40px 40px; }
            .leg1 { animation: swingLeg1 0.5s ease-in-out infinite; transform-origin: 40px 52px; }
            .leg2 { animation: swingLeg2 0.5s ease-in-out infinite; transform-origin: 40px 52px; }
            .arm1 { animation: swingArm2 0.5s ease-in-out infinite; transform-origin: 40px 36px; }
            .arm2 { animation: swingArm1 0.5s ease-in-out infinite; transform-origin: 40px 36px; }
            @keyframes walkBody{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
            @keyframes swingLeg1{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}}
            @keyframes swingLeg2{0%,100%{transform:rotate(20deg)}50%{transform:rotate(-20deg)}}
            @keyframes swingArm1{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}
            @keyframes swingArm2{0%,100%{transform:rotate(18deg)}50%{transform:rotate(-18deg)}}
          `}</style>
          <g className="body-g">
            {/* Head */}
            <circle cx="40" cy="20" r="8" fill="#1677FF"/>
            {/* Body */}
            <rect x="36" y="28" width="8" height="18" rx="4" fill="#1677FF"/>
            {/* Arms */}
            <rect className="arm1" x="28" y="30" width="6" height="14" rx="3" fill="#55B8FF"/>
            <rect className="arm2" x="46" y="30" width="6" height="14" rx="3" fill="#55B8FF"/>
            {/* Legs */}
            <rect className="leg1" x="33" y="45" width="6" height="16" rx="3" fill="#1677FF"/>
            <rect className="leg2" x="41" y="45" width="6" height="16" rx="3" fill="#1677FF"/>
          </g>
        </svg>
        <span className="loader-percent" ref={percentRef}>0%</span>
        <div className="loader-bar-wrap">
          <div className="loader-bar" ref={barRef} style={{width:'0%'}}/>
        </div>
        <span className="loader-label">Initializing Portfolio</span>
      </div>

      {/* ===== FLOATING NAV ===== */}
      <nav className="float-nav">
        <a href="#home" className="active">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </a>
        <a href="#about" onClick={playF1Radio}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
          <span>About</span>
        </a>
        <a href="#contact">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>Contact</span>
        </a>
        <a href="#project">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <span>Project</span>
        </a>
        <a href="#experience">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.1 15.9 0 13.33 0c-1.33 0-2.6.5-3.53 1.42L8 3.17 6.2 1.37C5.27.5 4 0 2.67 0 1.1 0 0 1.1 0 2.67c0 .45.11.89.18 1.33H0v2h20c1.1 0 2 .9 2 2v2H2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
          <span>Experience</span>
        </a>
      </nav>

      {/* ===== HOME — 3D LANYARD ===== */}
      <section id="home">
        <div className="home-canvas-wrap">
          {/* 3D Canvas */}
          <App />
          {/* Hero Text Overlay */}
          <div className="home-hero-text">
            <div className="hero-badge">
              <span/>
              Available for Projects
            </div>
            <h1 className="hero-name">
              Tegar Setya<br/>
              <span>Andiputra</span>
            </h1>
            <p className="hero-role">
              <span className="glitch-text" data-text={typedRole || fullRole}>
                {typedRole}
              </span>
              <span className="typewriter-cursor" />
            </p>
            <p className="hero-desc">
              Siswa SMK Negeri 1 Pracimantoro jurusan Teknik Jaringan Komputer dan Telekomunikasi. 
              Bersertifikat BNSP, berpengalaman dalam troubleshooting jaringan, support teknis, dan pengembangan web.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">TJKT · SMKN 1 Pracimantoro</span>
              <span className="hero-tag">BNSP Certified</span>
              <span className="hero-tag">Network & Web</span>
            </div>
            <div className="hero-cta">
              <a href="#project" className="btn-primary">Lihat Proyek ↓</a>
              <a href="#contact" className="btn-secondary">Hubungi Saya</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT — F1 HUD ===== */}
      <section id="about">
        {/* F1 Header */}
        <div className="f1-header reveal">
          <div>
            <div className="f1-label">02 / PROFILE</div>
            <div style={{fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'2px',marginTop:'2px'}}>TEAM RADIO // PROFILE INFORMATION</div>
          </div>
          <div className="f1-live">
            <span/>LIVE CONNECTION
          </div>
          <div className="f1-section-num">TSA-2026</div>
        </div>

        <div className="f1-main">
          {/* Photo Panel */}
          <div className="f1-photo-panel reveal">
            <img src="/assets/tegar-portrait.jpg" alt="Tegar Setya Andiputra" />
            <div className="f1-photo-overlay">
              <div className="f1-photo-name">TEGAR SETYA A.</div>
              <div className="f1-photo-role">JUNIOR TECH SUPPORT · NETWORK · WEB</div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Radio */}
            <div className="f1-radio reveal reveal-delay-1">
              <div>
                <div className="f1-radio-label">Team Radio Active</div>
                <div className="f1-comm" style={{marginTop:'4px'}}>● COMMUNICATION ESTABLISHED</div>
              </div>
              <div className="f1-waveform">
                {[...Array(10)].map((_,i)=>(
                  <span key={i} style={{height:'4px'}}/>
                ))}
              </div>
            </div>

            {/* Info Panels */}
            <div className="f1-panels">
              <div className="f1-panel reveal reveal-delay-1">
                <div className="f1-panel-label">Education</div>
                <div className="f1-panel-value">SMK Negeri 1 Pracimantoro</div>
              </div>
              <div className="f1-panel reveal reveal-delay-2">
                <div className="f1-panel-label">Specialization</div>
                <div className="f1-panel-value">Teknik Jaringan Komputer & Telekomunikasi</div>
              </div>
              <div className="f1-panel reveal reveal-delay-3">
                <div className="f1-panel-label">Core Skills</div>
                <div className="f1-panel-value">Problem Solving · Troubleshooting · Networking</div>
              </div>
              <div className="f1-panel reveal reveal-delay-4">
                <div className="f1-panel-label">Certification</div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'6px'}}>
                  <div style={{
                    background:'#ffffff',
                    borderRadius:'10px',
                    padding:'6px 10px',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    flexShrink: 0,
                    boxShadow:'0 2px 10px rgba(0,0,0,0.25)'
                  }}>
                    <img src="/assets/logo-bnsp.png" alt="BNSP" style={{height:'38px',objectFit:'contain',display:'block'}}/>
                  </div>
                  <div>
                    <div className="f1-panel-value" style={{fontSize:'0.9rem'}}>BNSP Certified</div>
                    <div style={{fontSize:'0.75rem',color:'var(--blue-cyan)'}}>Junior Technical Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="about-desc reveal reveal-delay-2">
              Saya adalah siswa aktif SMK Negeri 1 Pracimantoro yang mendalami dunia teknologi jaringan dan web. 
              Dengan sertifikasi BNSP sebagai Junior Technical Support, saya memiliki kompetensi terverifikasi 
              dalam troubleshooting jaringan komputer, dukungan teknis, dan pengembangan website. 
              Saya berkomitmen untuk terus belajar dan berkontribusi di dunia teknologi informasi.
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section id="skills">
        <div className="section-header reveal">
          <span className="section-num">03</span>
          <h2 className="section-title">Skills</h2>
          <div className="section-line"/>
        </div>

        {/* Networking & Hardware */}
        <div className="skills-category">
          <div className="skills-cat-title reveal">Networking & Hardware</div>
          <div className="skills-grid">
            {[
              {icon:'🌐',name:'Cisco Packet Tracer',cat:'Network Sim'},
              {icon:'🔌',name:'Mikrotik',cat:'Router OS'},
              {icon:'📡',name:'Jaringan Komputer',cat:'Networking'},
              {icon:'🖥️',name:'Troubleshooting',cat:'Technical Support'},
              {icon:'⚡',name:'Kabel Jaringan',cat:'Hardware'},
              {icon:'🔧',name:'Perakitan PC',cat:'Hardware'},
            ].map((s,i)=>(
              <div key={i} className={`skill-card reveal reveal-delay-${(i%4)+1}`}>
                <span className="skill-icon">{s.icon}</span>
                <div className="skill-name">{s.name}</div>
                <div className="skill-cat">{s.cat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Web Development */}
        <div className="skills-category">
          <div className="skills-cat-title reveal">Web Development</div>
          <div className="skills-grid">
            {[
              {icon:'🌍',name:'HTML',cat:'Markup'},
              {icon:'🎨',name:'CSS',cat:'Styling'},
              {icon:'⚙️',name:'JavaScript',cat:'Programming'},
              {icon:'🐘',name:'PHP',cat:'Backend'},
              {icon:'🗄️',name:'MySQL',cat:'Database'},
              {icon:'⚛️',name:'React',cat:'Framework'},
              {icon:'▲',name:'Next.js',cat:'Framework'},
              {icon:'💨',name:'Tailwind CSS',cat:'Styling'},
            ].map((s,i)=>(
              <div key={i} className={`skill-card reveal reveal-delay-${(i%4)+1}`}>
                <span className="skill-icon">{s.icon}</span>
                <div className="skill-name">{s.name}</div>
                <div className="skill-cat">{s.cat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="skills-category">
          <div className="skills-cat-title reveal">Tools & Others</div>
          <div className="skills-grid">
            {[
              {icon:'📂',name:'Git & GitHub',cat:'Version Control'},
              {icon:'🐧',name:'Linux',cat:'OS'},
              {icon:'🖌️',name:'Figma',cat:'Design'},
              {icon:'📊',name:'Microsoft Office',cat:'Productivity'},
            ].map((s,i)=>(
              <div key={i} className={`skill-card reveal reveal-delay-${(i%4)+1}`}>
                <span className="skill-icon">{s.icon}</span>
                <div className="skill-name">{s.name}</div>
                <div className="skill-cat">{s.cat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section id="project">
        <div className="section-header reveal">
          <span className="section-num">04</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-line"/>
        </div>
        <div className="projects-grid">

          {/* Praci Siaga */}
          <div className="project-card reveal">
            <div className="project-img-wrap">
              <img className="project-img" src="/assets/logo-praci-siaga.png" alt="Praci Siaga"
                style={{objectFit:'contain',background:'#0B1B30',padding:'20px'}}/>
            </div>
            <div className="project-body">
              <div className="project-logo-row">
                <img className="project-logo" src="/assets/logo-praci-siaga.png" alt="Praci Siaga"/>
                <span className="project-name">Praci Siaga</span>
              </div>
              <div className="project-stack">
                <span className="project-tag">HTML</span>
                <span className="project-tag">CSS</span>
                <span className="project-tag">JavaScript</span>
                <span className="project-tag">PHP</span>
                <span className="project-tag">MySQL</span>
              </div>
              <p className="project-desc">
                Website sistem informasi siaga bencana untuk wilayah Pracimantoro. 
                Menyediakan informasi kebencanaan, peta risiko, dan panduan evakuasi.
              </p>
              <div className="project-links">
                <a href="#" className="project-btn primary">Lihat Detail</a>
              </div>
            </div>
          </div>

          {/* E-Lintas */}
          <div className="project-card reveal reveal-delay-1">
            <div className="project-img-wrap">
              <img className="project-img" src="/assets/e-lintas-screen-1.png" alt="E-Lintas"/>
            </div>
            <div className="project-body">
              <div className="project-logo-row">
                <img className="project-logo" src="/assets/logo-e-lintas.png" alt="E-Lintas"/>
                <span className="project-name">E-Lintas</span>
              </div>
              <div className="project-stack">
                <span className="project-tag">PHP</span>
                <span className="project-tag">MySQL</span>
                <span className="project-tag">Bootstrap</span>
              </div>
              <p className="project-desc">
                Sistem informasi manajemen lalu lintas digital. Membantu monitoring 
                dan pencatatan data lalu lintas secara efisien.
              </p>
              <div className="project-links">
                <a href="#" className="project-btn primary">Lihat Detail</a>
              </div>
            </div>
          </div>

          {/* Catat Uangmu */}
          <div className="project-card reveal reveal-delay-2">
            <div className="project-img-wrap">
              <img className="project-img" src="/assets/catat-uangmu-screen-1.png" alt="Catat Uangmu"/>
            </div>
            <div className="project-body">
              <div className="project-logo-row">
                <img className="project-logo" src="/assets/logo-catat-uangmu.png" alt="Catat Uangmu"/>
                <span className="project-name">Catat Uangmu</span>
              </div>
              <div className="project-stack">
                <span className="project-tag">React</span>
                <span className="project-tag">Next.js</span>
                <span className="project-tag">Tailwind</span>
              </div>
              <p className="project-desc">
                Aplikasi pencatat keuangan pribadi berbasis web. Fitur input pemasukan, 
                pengeluaran, dan laporan keuangan bulanan.
              </p>
              <div className="project-links">
                <a href="#" className="project-btn primary">Lihat Detail</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience">
        <div className="section-header reveal">
          <span className="section-num">05</span>
          <h2 className="section-title">Experience</h2>
          <div className="section-line"/>
        </div>
        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-period">2024 — Sekarang</div>
              <div className="timeline-title">Siswa Aktif TJKT</div>
              <div className="timeline-org">SMK Negeri 1 Pracimantoro · Wonogiri, Jawa Tengah</div>
              <div className="timeline-desc">
                Mendalami Teknik Jaringan Komputer dan Telekomunikasi. Belajar instalasi jaringan, 
                routing, switching, troubleshooting, dan pengembangan web.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-period">2024</div>
              <div className="timeline-title">BNSP Certification</div>
              <div className="timeline-org">Badan Nasional Sertifikasi Profesi (BNSP)</div>
              <div className="timeline-desc">
                Lulus uji kompetensi dan mendapatkan sertifikasi nasional sebagai 
                Junior Technical Support dari Badan Nasional Sertifikasi Profesi.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-period">2024</div>
              <div className="timeline-title">Web Developer — Praci Siaga</div>
              <div className="timeline-org">Proyek Sekolah · SMK Negeri 1 Pracimantoro</div>
              <div className="timeline-desc">
                Mengembangkan website sistem informasi siaga bencana Pracimantoro 
                menggunakan HTML, CSS, JavaScript, PHP, dan MySQL.
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-period">2023</div>
              <div className="timeline-title">Web Developer — E-Lintas</div>
              <div className="timeline-org">Proyek Sekolah · SMK Negeri 1 Pracimantoro</div>
              <div className="timeline-desc">
                Membangun sistem informasi manajemen lalu lintas berbasis web 
                dengan PHP, MySQL, dan Bootstrap.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact">
        <div className="section-header reveal">
          <span className="section-num">06</span>
          <h2 className="section-title">Contact</h2>
          <div className="section-line"/>
        </div>

        {/* Subhead pindahan dari panel status */}
        <div className="contact-subhead reveal" style={{marginBottom:'32px'}}>
          <div style={{
            display:'inline-flex',
            alignItems:'center',
            gap:'8px',
            background:'rgba(22,119,255,0.12)',
            border:'1px solid rgba(85,184,255,0.3)',
            borderRadius:'100px',
            padding:'5px 14px',
            marginBottom:'12px'
          }}>
            <span style={{
              width:'8px',
              height:'8px',
              background:'#00ff88',
              borderRadius:'50%',
              boxShadow:'0 0 8px #00ff88',
              animation:'pulse 2s infinite'
            }}/>
            <span style={{fontSize:'12px',fontWeight:'700',color:'#55B8FF',letterSpacing:'1px',textTransform:'uppercase'}}>
              Available for Projects
            </span>
          </div>
          <p style={{fontSize:'1rem',color:'var(--text-secondary)',maxWidth:'680px',lineHeight:'1.6',margin:0}}>
            Saya terbuka untuk kolaborasi proyek, magang, freelance, dan peluang belajar baru di bidang teknologi.
          </p>
        </div>

        <div className="contact-grid">
          <a href="https://wa.me/6285134548198" target="_blank" rel="noreferrer" className="contact-link reveal">
            <div className="contact-link-left">
              <span className="contact-link-icon">
                <img src="/assets/logo-whatsapp.png" alt="WhatsApp" style={{width:'36px',height:'36px',objectFit:'contain'}}/>
              </span>
              <div>
                <div className="contact-link-label">WhatsApp</div>
                <div className="contact-link-val">+62 851-3454-8198</div>
              </div>
            </div>
            <span className="contact-action-btn">
              Hubungi Sekarang
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>

          <a href="mailto:tegarsetyaandiputra128@gmail.com" className="contact-link reveal reveal-delay-1">
            <div className="contact-link-left">
              <span className="contact-link-icon">
                <img src="/assets/logo-gmail.png" alt="Email" style={{width:'36px',height:'36px',objectFit:'contain'}}/>
              </span>
              <div>
                <div className="contact-link-label">Email</div>
                <div className="contact-link-val">tegarsetyaandiputra128@gmail.com</div>
              </div>
            </div>
            <span className="contact-action-btn">
              Hubungi Sekarang
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>

          <a href="https://www.instagram.com/tegar__s.a/" target="_blank" rel="noreferrer" className="contact-link reveal reveal-delay-2">
            <div className="contact-link-left">
              <span className="contact-link-icon">
                <img src="/assets/logo-instagram.png" alt="Instagram" style={{width:'36px',height:'36px',objectFit:'contain'}}/>
              </span>
              <div>
                <div className="contact-link-label">Instagram</div>
                <div className="contact-link-val">@tegar__s.a</div>
              </div>
            </div>
            <span className="contact-action-btn">
              Lihat Profil Akun
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>

          <a href="https://www.tiktok.com/@tegar.s.a" target="_blank" rel="noreferrer" className="contact-link reveal reveal-delay-3">
            <div className="contact-link-left">
              <span className="contact-link-icon">
                <img src="/assets/logo-tiktok.png" alt="TikTok" style={{width:'36px',height:'36px',objectFit:'contain'}}/>
              </span>
              <div>
                <div className="contact-link-label">TikTok</div>
                <div className="contact-link-val">@tegar.s.a</div>
              </div>
            </div>
            <span className="contact-action-btn">
              Lihat Profil Akun
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="footer-left">
          © 2026 Tegar Setya Andiputra. Semua hak dilindungi.
        </div>
        <div className="footer-right">Dirancang dan dikembangkan dengan semangat inovasi dan teknologi.</div>
      </footer>

      {/* Floating Music Toggle Button */}
      <button
        id="music-toggle"
        onClick={toggleAudio}
        aria-label="Toggle Backsound"
        className={isPlaying ? 'playing' : ''}
      >
        <span className="music-waves">
          <span/>
          <span/>
          <span/>
        </span>
        <span>{isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}</span>
      </button>

      {/* Back to top */}
      <div id="back-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--blue-light)'}}>
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </div>
    </>
  );
}
