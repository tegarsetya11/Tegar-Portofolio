'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const App = dynamic(() => import('@/components/band/App'), {
  ssr: false,
});

const softSkillsList = [
  {
    name: 'Problem Solving',
    theme: 'theme-amber',
    icon: '🎯',
    tag: 'ANALYTICAL',
    desc: 'Identifikasi akar masalah teknis & perumusan solusi logis terstruktur.',
    detail: 'Mampu membedah insiden teknis (jaringan maupun hardware) secara bertahap, menemukan sumber gangguan dengan efisien, dan merumuskan perbaikan yang tahan lama.',
    points: ['Metodologi isolasi layer-by-layer', 'Penanganan insiden downtime sistem', 'Pencegahan masalah berulang']
  },
  {
    name: 'Critical Thinking',
    theme: 'theme-purple',
    icon: '🧠',
    tag: 'DIAGNOSTIC',
    desc: 'Analisis objektif arsitektur sistem & pengambilan keputusan berbasis data.',
    detail: 'Menilai konfigurasi arsitektur jaringan dan spesifikasi perangkat secara analitis sebelum melakukan implementasi atau perubahan konfigurasi penting.',
    points: ['Evaluasi performa infrastruktur', 'Analisis risiko perubahan sistem', 'Pengambilan keputusan berbasis data']
  },
  {
    name: 'Communication',
    theme: 'theme-blue',
    icon: '💬',
    tag: 'COMMUNICATION',
    desc: 'Penyampaian teknis lugas ke tim, dokumentasi SOP & koordinasi pengguna.',
    detail: 'Mampu menjelaskan kendala teknis dan alur perbaikan dalam bahasa yang mudah dimengerti oleh pengguna non-teknis serta membuat dokumentasi yang jelas.',
    points: ['Pelaporan status teknis terstruktur', 'Interaksi empatik dengan pengguna', 'Dokumentasi SOP perbaikan']
  },
  {
    name: 'Teamwork',
    theme: 'theme-green',
    icon: '🤝',
    tag: 'COLLABORATION',
    desc: 'Kolaborasi aktif menyelesaikan proyek bersama & sinergi antarperan.',
    detail: 'Berpartisipasi aktif dalam pembagian peran tim, saling mendukung dalam penarikan kabel, konfigurasi bersama, dan integrasi modul aplikasi.',
    points: ['Kolaborasi lintas disiplin', 'Sinergi pengerjaan proyek', 'Kesiapan mendukung anggota tim']
  },
  {
    name: 'Leadership',
    theme: 'theme-gold',
    icon: '👑',
    tag: 'LEADERSHIP',
    desc: 'Pengalaman memimpin organisasi sekolah & kepanduan tingkat regional.',
    detail: 'Terbukti sebagai Ketua OSIS SMP dan pimpinan regu DIANPINRU yang mampu mengarahkan tim, menjaga semangat kelompok, dan mengawal kegiatan hingga sukses.',
    points: ['Manajemen koordinasi organisasi', 'Delegasi tugas yang jelas', 'Integritas dan keteladanan']
  },
  {
    name: 'Discipline',
    theme: 'theme-rose',
    icon: '🛡️',
    tag: 'INTEGRITY',
    desc: 'Konsistensi tinggi terhadap SOP keselamatan kerja & ketepatan waktu.',
    detail: 'Menjaga kepatuhan ketat terhadap prosedur operasional standar, standar keselamatan kerja kelistrikan/jaringan, dan ketepatan waktu tugas.',
    points: ['Kepatuhan SOP keselamatan kerja', 'Ketepatan jadwal pemeliharaan', 'Ketelitian dalam perakitan & konfigurasi']
  },
  {
    name: 'Responsibility',
    theme: 'theme-teal',
    icon: '🧭',
    tag: 'ACCOUNTABILITY',
    desc: 'Integritas penuh terhadap amanah perangkat keras, kerahasiaan & data.',
    detail: 'Bertanggung jawab atas keamanan data pengguna, ketersediaan perangkat operasional, serta menjaga kerahasiaan kredensial sistem.',
    points: ['Integritas terhadap aset perangkat', 'Akuntabilitas tugas penugasan', 'Perlindungan privasi data']
  },
  {
    name: 'Adaptability',
    theme: 'theme-indigo',
    icon: '⚡',
    tag: 'AGILITY',
    desc: 'Cepat mempelajari teknologi, distro OS & protokol jaringan baru.',
    detail: 'Cepat menyesuaikan diri dengan perangkat keras generasi baru, distro sistem operasi berbeda, maupun framework web modern yang berkembang pesat.',
    points: ['Belajar mandiri (self-learning) cepat', 'Fleksibel menghadapi dinamika', 'Antusias mengadopsi standar teknologi baru']
  },
  {
    name: 'Time Management',
    theme: 'theme-orange',
    icon: '⏱️',
    tag: 'EFFICIENCY',
    desc: 'Pengelolaan prioritas tiket insiden & efisiensi alur troubleshooting.',
    detail: 'Menetapkan prioritas penanganan tiket masalah secara teratur sehingga masalah kritis dapat diselesaikan sesegera mungkin tanpa mengabaikan tugas rutin.',
    points: ['Penentuan prioritas urgensi insiden', 'Penyelesaian proyek tepat waktu', 'Efisiensi waktu troubleshooting']
  },
  {
    name: 'Initiative',
    theme: 'theme-fuchsia',
    icon: '🚀',
    tag: 'PROACTIVITY',
    desc: 'Proaktif dalam pemeliharaan preventif, manajemen kabel & improvisasi.',
    detail: 'Tidak hanya menunggu laporan kendala, melainkan proaktif melakukan pengecekan kesehatan kabel, monitoring log jaringan, dan merapikan manajemen kabel.',
    points: ['Pemeliharaan berkala preventif', 'Pemberian usulan perbaikan sistem', 'Inisiatif optimasi performa']
  }
];

export default function Home() {
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const f1AudioRef = useRef<HTMLAudioElement | null>(null);
  const lastF1PlayedRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Typewriter & Glitch Effect for Role
  const [typedRole, setTypedRole] = useState('');
  const fullRole = 'Junior Technical Support 2026 · Network · Web Specialist';

  // Skills Dashboard State
  const [skillsFilter, setSkillsFilter] = useState<'all' | 'hard' | 'soft'>('all');
  const [activeRadarAxis, setActiveRadarAxis] = useState<number>(0);
  const [selectedSoftSkill, setSelectedSoftSkill] = useState<{
    name: string;
    icon: string;
    desc: string;
    detail: string;
    points: string[];
    theme?: string;
  } | null>(null);

  // Aura 3D Perspective Stacked Carousel State
  const [activeSoftIdx, setActiveSoftIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const isMouseDownRef = useRef<boolean>(false);

  // Projects Screenshot Sliders State
  const [eLintasSlide, setELintasSlide] = useState<number>(0);
  const [catatUangmuSlide, setCatatUangmuSlide] = useState<number>(0);

  const eLintasImages = [
    { src: '/assets/e-lintas-screen-home.png', alt: 'E-Lintas Beranda' },
    { src: '/assets/e-lintas-screen-quiz-rambu.png', alt: 'E-Lintas Kuis Rambu' },
    { src: '/assets/e-lintas-screen-quiz-simulasi.png', alt: 'E-Lintas Uji Teori SIM' },
    { src: '/assets/e-lintas-screen-praktik-sim.png', alt: 'E-Lintas Simulasi Ujian Praktik SIM C' },
  ];

  const catatUangmuImages = [
    { src: '/assets/catat-uangmu-screen-onboarding.png', alt: 'Catat Uangmu Onboarding' },
    { src: '/assets/catat-uangmu-screen-dashboard.png', alt: 'Catat Uangmu Dashboard' },
    { src: '/assets/catat-uangmu-screen-add-income.png', alt: 'Catat Uangmu Tambah Pemasukan' },
    { src: '/assets/catat-uangmu-screen-add-expense.png', alt: 'Catat Uangmu Tambah Pengeluaran' },
    { src: '/assets/catat-uangmu-screen-reports.png', alt: 'Catat Uangmu Laporan' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrevSoft = () => {
    setActiveSoftIdx((prev) => (prev - 1 + softSkillsList.length) % softSkillsList.length);
  };

  const handleNextSoft = () => {
    setActiveSoftIdx((prev) => (prev + 1) % softSkillsList.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    if (delta > 45) {
      handlePrevSoft();
    } else if (delta < -45) {
      handleNextSoft();
    }
    touchStartXRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    mouseStartXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || mouseStartXRef.current === null) return;
    const delta = e.clientX - mouseStartXRef.current;
    if (delta > 45) {
      handlePrevSoft();
    } else if (delta < -45) {
      handleNextSoft();
    }
    isMouseDownRef.current = false;
    mouseStartXRef.current = null;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    mouseStartXRef.current = null;
  };

  const getCard3DStyle = (idx: number) => {
    const n = softSkillsList.length;
    let offset = idx - activeSoftIdx;
    while (offset > n / 2) offset -= n;
    while (offset < -n / 2) offset += n;

    const absOffset = Math.abs(offset);
    const sign = offset < 0 ? -1 : 1;

    if (absOffset > 3) {
      return {
        transform: `translateX(${sign * (isMobile ? 260 : 640)}px) translateZ(-460px) scale(0.35)`,
        opacity: 0,
        visibility: 'hidden' as const,
        zIndex: 0,
        pointerEvents: 'none' as const,
      };
    }

    let tx = 0;
    let tz = 0;
    let ry = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 12;
    let blur = 0;

    if (!isMobile) {
      if (absOffset === 0) {
        tx = 0;
        tz = 0;
        ry = 0;
        scale = 1;
        opacity = 1;
        zIndex = 14;
        blur = 0;
      } else if (absOffset === 1) {
        tx = sign * 230;
        tz = -120;
        ry = -sign * 24;
        scale = 0.88;
        opacity = 0.86;
        zIndex = 10;
        blur = 0;
      } else if (absOffset === 2) {
        tx = sign * 420;
        tz = -240;
        ry = -sign * 34;
        scale = 0.74;
        opacity = 0.55;
        zIndex = 7;
        blur = 1.2;
      } else if (absOffset === 3) {
        tx = sign * 560;
        tz = -360;
        ry = -sign * 42;
        scale = 0.6;
        opacity = 0.22;
        zIndex = 4;
        blur = 2.5;
      }
    } else {
      // Mobile responsive spacing
      if (absOffset === 0) {
        tx = 0;
        tz = 0;
        ry = 0;
        scale = 1;
        opacity = 1;
        zIndex = 14;
        blur = 0;
      } else if (absOffset === 1) {
        tx = sign * 120;
        tz = -90;
        ry = -sign * 20;
        scale = 0.86;
        opacity = 0.76;
        zIndex = 10;
        blur = 0;
      } else if (absOffset === 2) {
        tx = sign * 200;
        tz = -180;
        ry = -sign * 28;
        scale = 0.7;
        opacity = 0.38;
        zIndex = 7;
        blur = 1;
      } else if (absOffset === 3) {
        tx = sign * 260;
        tz = -260;
        ry = -sign * 35;
        scale = 0.55;
        opacity = 0.12;
        zIndex = 4;
        blur = 2;
      }
    }

    return {
      transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      pointerEvents: 'auto' as const,
    };
  };

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
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('loaded')) {
        if (loadingRef.current) loadingRef.current.style.display = 'none';
        const t = setTimeout(() => setIsLoaded(true), 200);
        return () => clearTimeout(t);
      }
    } catch {}

    let p = 0;
    const duration = 1400;
    const interval = 20;
    const steps = duration / interval;
    const inc = 100 / steps;

    const finishLoading = () => {
      if (percentRef.current) percentRef.current.textContent = '100%';
      if (barRef.current) barRef.current.style.width = '100%';
      setTimeout(() => {
        if (loadingRef.current) {
          loadingRef.current.classList.add('hidden');
          setTimeout(() => {
            if (loadingRef.current) loadingRef.current.style.display = 'none';
          }, 600);
        }
        setIsLoaded(true);
        try {
          sessionStorage.setItem('loaded', '1');
        } catch {}
      }, 300);
    };

    const timer = setInterval(() => {
      p = Math.min(100, p + inc + (Math.random() * 2 - 1));
      if (percentRef.current) percentRef.current.textContent = Math.floor(p) + '%';
      if (barRef.current) barRef.current.style.width = Math.floor(p) + '%';
      if (p >= 100) {
        clearInterval(timer);
        finishLoading();
      }
    }, interval);

    // Fallback maksimal 2 detik agar tidak pernah stuck
    const fallbackTimer = setTimeout(() => {
      clearInterval(timer);
      finishLoading();
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    // ----- Floating Nav active state & scroll-spy -----
    const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];
    const navLinks = Array.from(document.querySelectorAll('.float-nav a')) as HTMLAnchorElement[];
    const backTop = document.getElementById('back-top');

    let isManualClick = false;
    let manualTimeout: NodeJS.Timeout;

    const setActiveLink = (sectionId: string) => {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    // Immediate active highlight when a nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (targetId) {
          isManualClick = true;
          clearTimeout(manualTimeout);
          setActiveLink(targetId);
          manualTimeout = setTimeout(() => {
            isManualClick = false;
          }, 800);
        }
      });
    });

    const updateActiveNav = () => {
      if (isManualClick) return;

      let currentSectionId = '';
      const viewThreshold = 260;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= viewThreshold && rect.bottom > viewThreshold) {
          currentSectionId = sec.id;
        }
      });

      if (window.scrollY < 120) {
        currentSectionId = 'home';
      } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        const last = sections[sections.length - 1];
        if (last) currentSectionId = last.id;
      }

      if (currentSectionId) {
        setActiveLink(currentSectionId);
      }
    };

    // Sound trigger when about section appears
    const aboutSection = document.getElementById('about');
    let aboutObs: IntersectionObserver | null = null;
    if (aboutSection) {
      aboutObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playF1Radio();
          }
        });
      }, { threshold: 0.3 });
      aboutObs.observe(aboutSection);
    }

    // Handle scroll for nav & back-to-top button
    const handleScroll = () => {
      updateActiveNav();
      if (backTop) {
        if (window.scrollY > 400) backTop.classList.add('visible');
        else backTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveNav();

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal, .timeline-item');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    reveals.forEach(r => revealObs.observe(r));

    return () => {
      if (aboutObs) aboutObs.disconnect();
      revealObs.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(manualTimeout);
    };
  }, []);

  return (
    <>
      {/* ===== LOADING SCREEN ===== */}
      <div id="loading-screen" ref={loadingRef}>
        {/* Logo */}
        <img
          src="/assets/logo-tegar-loading.jpg"
          alt="Logo Tegar"
          className="loader-logo"
        />
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
        <a href="#skills">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
          <span>Skills</span>
        </a>
        <a href="#project">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <span>Project</span>
        </a>
        <a href="#experience">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.1 15.9 0 13.33 0c-1.33 0-2.6.5-3.53 1.42L8 3.17 6.2 1.37C5.27.5 4 0 2.67 0 1.1 0 0 1.1 0 2.67c0 .45.11.89.18 1.33H0v2h20c1.1 0 2 .9 2 2v2H2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
          <span>Experience</span>
        </a>
        <a href="#contact">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>Contact</span>
        </a>
      </nav>

      {/* ===== HOME — 3D LANYARD ===== */}
      <section id="home">
        <div className="home-canvas-wrap">
          {/* 3D Canvas */}
          <App isLoaded={isLoaded} />
          {/* Hero Text Overlay */}
          <div className="home-hero-text">
            <div className="hero-logo-wrap">
              <img
                src="/assets/logo-tegar-hero.png?v=3"
                alt="Logo Tegar"
                className="hero-brand-logo"
              />
            </div>
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
              <a href="/cv" className="btn-cv">Lihat CV 📄</a>
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
                    <div style={{fontSize:'0.75rem',color:'var(--blue-cyan)'}}>Junior Technical Support · 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="about-desc reveal reveal-delay-2">
              Saya adalah siswa aktif SMK Negeri 1 Pracimantoro yang mendalami dunia teknologi jaringan dan web. 
              Dengan sertifikasi BNSP sebagai Junior Technical Support 2026, saya memiliki kompetensi terverifikasi 
              dalam troubleshooting jaringan komputer, dukungan teknis, dan pengembangan website. 
              Saya berkomitmen untuk terus belajar dan berkontribusi di dunia teknologi informasi.
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS DASHBOARD & ANALYTICS ===== */}
      <section id="skills">
        {/* Main Header */}
        <div className="skills-hero-header reveal">
          <div className="skills-module-tag">
            <span/>
            SYSTEM MODULE // SKILLS
          </div>
          <h2 className="skills-title">My Skills & Expertise</h2>
          <p className="skills-subtitle">
            Dashboard analitik keahlian teknis dan profesional, dirancang untuk merawat infrastruktur handal, 
            memberikan dukungan teknis terverifikasi, dan membangun pengalaman antarmuka digital modern.
          </p>

          {/* Interactive Filter Bar */}
          <div className="skills-filter-bar">
            <button
              className={`skills-filter-btn ${skillsFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSkillsFilter('all')}
            >
              All Skills
            </button>
            <button
              className={`skills-filter-btn ${skillsFilter === 'hard' ? 'active' : ''}`}
              onClick={() => setSkillsFilter('hard')}
            >
              Hard Skills
            </button>
            <button
              className={`skills-filter-btn ${skillsFilter === 'soft' ? 'active' : ''}`}
              onClick={() => setSkillsFilter('soft')}
            >
              Soft Skills
            </button>
          </div>
        </div>

        {/* 1. SKILL OVERVIEW — INTERACTIVE RADAR CHART */}
        <div className="radar-overview-sec reveal">
          <div className="skills-subhead-label">Skill Overview & Analytics Radar</div>
          <div className="radar-panel-card">
            {/* SVG Spider / Radar Chart */}
            <div className="radar-chart-wrap">
              <svg viewBox="0 0 350 310" className="radar-chart-svg">
                {/* Concentric Web Polygons */}
                {[0.25, 0.5, 0.75, 1.0].map((lvl, lidx) => {
                  const pts = [
                    { score: lvl, a: -90 },
                    { score: lvl, a: -30 },
                    { score: lvl, a: 30 },
                    { score: lvl, a: 90 },
                    { score: lvl, a: 150 },
                    { score: lvl, a: 210 },
                  ].map((p) => {
                    const rad = p.a * (Math.PI / 180);
                    const x = 175 + 100 * p.score * Math.cos(rad);
                    const y = 155 + 100 * p.score * Math.sin(rad);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={lidx}
                      points={pts}
                      fill={lidx === 3 ? "rgba(22, 119, 255, 0.05)" : "none"}
                      stroke="rgba(85, 184, 255, 0.2)"
                      strokeWidth={lidx === 3 ? "1.5" : "1"}
                      strokeDasharray={lidx < 3 ? "3 3" : "none"}
                    />
                  );
                })}

                {/* Axes Lines */}
                {[
                  { a: -90 },
                  { a: -30 },
                  { a: 30 },
                  { a: 90 },
                  { a: 150 },
                  { a: 210 },
                ].map((axis, i) => {
                  const rad = axis.a * (Math.PI / 180);
                  const x = 175 + 100 * Math.cos(rad);
                  const y = 155 + 100 * Math.sin(rad);
                  const isAct = activeRadarAxis === i;
                  return (
                    <line
                      key={i}
                      x1={175}
                      y1={155}
                      x2={x}
                      y2={y}
                      stroke={isAct ? "#00f0ff" : "rgba(85, 184, 255, 0.25)"}
                      strokeWidth={isAct ? "2" : "1"}
                    />
                  );
                })}

                {/* Data Polygon */}
                <polygon
                  points={[
                    { s: 0.92, a: -90 },
                    { s: 0.94, a: -30 },
                    { s: 0.88, a: 30 },
                    { s: 0.90, a: 90 },
                    { s: 0.86, a: 150 },
                    { s: 0.88, a: 210 },
                  ].map((p) => {
                    const rad = p.a * (Math.PI / 180);
                    const x = 175 + 100 * p.s * Math.cos(rad);
                    const y = 155 + 100 * p.s * Math.sin(rad);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ')}
                  fill="rgba(0, 240, 255, 0.2)"
                  stroke="#55B8FF"
                  strokeWidth="2.5"
                  style={{ filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))" }}
                />

                {/* Vertices */}
                {[
                  { s: 0.92, a: -90 },
                  { s: 0.94, a: -30 },
                  { s: 0.88, a: 30 },
                  { s: 0.90, a: 90 },
                  { s: 0.86, a: 150 },
                  { s: 0.88, a: 210 },
                ].map((p, i) => {
                  const rad = p.a * (Math.PI / 180);
                  const x = 175 + 100 * p.s * Math.cos(rad);
                  const y = 155 + 100 * p.s * Math.sin(rad);
                  const isAct = activeRadarAxis === i;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={isAct ? 6.5 : 4.5}
                      fill={isAct ? "#00f0ff" : "#1677FF"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                      onMouseEnter={() => setActiveRadarAxis(i)}
                    />
                  );
                })}

                {/* Axis Labels */}
                {[
                  { name: "Networking", a: -90 },
                  { name: "Tech Support", a: -30 },
                  { name: "Web Dev", a: 30 },
                  { name: "Problem Solving", a: 90 },
                  { name: "Communication", a: 150 },
                  { name: "Leadership", a: 210 },
                ].map((item, i) => {
                  const rad = item.a * (Math.PI / 180);
                  const lx = 175 + 124 * Math.cos(rad);
                  const ly = 155 + 114 * Math.sin(rad);
                  const cosVal = Math.cos(rad);
                  const anchor = cosVal > 0.3 ? "start" : cosVal < -0.3 ? "end" : "middle";
                  const isAct = activeRadarAxis === i;
                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      textAnchor={anchor}
                      dominantBaseline="central"
                      fill={isAct ? "#00f0ff" : "#d2e4ff"}
                      fontSize="9.5"
                      fontWeight={isAct ? "700" : "600"}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                      onMouseEnter={() => setActiveRadarAxis(i)}
                    >
                      {item.name}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Radar Information Side */}
            <div className="radar-info-side">
              <div>
                <div className="radar-badge-title">
                  <span style={{width:'6px', height:'6px', borderRadius:'50%', background:'#00f0ff'}}/>
                  Holistic Skill Distribution
                </div>
                <h3 className="radar-main-title">Multi-Discipline Synergy</h3>
                <p className="radar-main-desc">
                  Kombinasi berimbang antara ketrampilan keras (infrastruktur & web) dengan ketrampilan lunak (analisis logis & kepemimpinan). Sentuh atau arahkan kursor pada simpul radar untuk melihat fokus kemampuan.
                </p>
              </div>

              {/* Dynamic Axis Readout List */}
              <div className="radar-axes-list">
                {[
                  { name: 'Networking & Infra', scope: 'MikroTik, TCP/IP, Routing & Kabel' },
                  { name: 'Technical Support', scope: 'PC Assembly, OS & BNSP Certified' },
                  { name: 'Web Development', scope: 'HTML, CSS, JavaScript & REST API' },
                  { name: 'Problem Solving', scope: 'Diagnostik akar masalah terstruktur' },
                  { name: 'Communication', scope: 'Koordinasi teknis & dokumentasi SOP' },
                  { name: 'Leadership', scope: 'Kepemimpinan regu & organisasi sekolah' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`radar-axis-item ${activeRadarAxis === idx ? 'active' : ''}`}
                    onMouseEnter={() => setActiveRadarAxis(idx)}
                  >
                    <span className="radar-axis-name">{item.name}</span>
                    <span className="radar-axis-scope">{item.scope}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. HARD SKILLS DASHBOARD (Visible on 'all' and 'hard') */}
        {(skillsFilter === 'all' || skillsFilter === 'hard') && (
          <div className="hard-skills-sec reveal">
            <div className="skills-subhead-label">Hard Skills Dashboard</div>
            <div className="hard-skills-grid">
              {/* Panel A: NETWORKING & INFRASTRUCTURE */}
              <div className="hard-skill-panel theme-card theme-blue">
                <div className="hard-panel-top">
                  <div className="hard-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="6" height="6" rx="1"/>
                      <rect x="16" y="2" width="6" height="6" rx="1"/>
                      <rect x="9" y="16" width="6" height="6" rx="1"/>
                      <path d="M5 8v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/>
                      <path d="M12 12v4"/>
                    </svg>
                  </div>
                  <span className="hard-count-pill">12 Competencies</span>
                </div>
                <h3 className="hard-panel-title">NETWORKING & INFRASTRUCTURE</h3>
                <p className="hard-panel-desc">
                  Arsitektur topologi jaringan, perutean protokol, alokasi IP, dan infrastruktur transmisi data fisik & nirkabel.
                </p>
                <div className="hard-chips-container">
                  {[
                    'Computer Networking', 'TCP/IP', 'IP Addressing', 'Subnetting',
                    'Routing', 'MikroTik', 'DHCP', 'NAT',
                    'Firewall', 'Fiber Optic', 'UTP Cabling', 'Cisco Packet Tracer'
                  ].map((sk, idx) => (
                    <span key={idx} className="hard-chip">{sk}</span>
                  ))}
                </div>
              </div>

              {/* Panel B: TECHNICAL SUPPORT */}
              <div className="hard-skill-panel theme-card theme-green">
                <div className="hard-panel-top">
                  <div className="hard-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                      <circle cx="12" cy="10" r="2.5"/>
                    </svg>
                  </div>
                  <span className="hard-count-pill">6 Competencies</span>
                </div>
                <h3 className="hard-panel-title">TECHNICAL SUPPORT</h3>
                <p className="hard-panel-desc">
                  Penanganan langsung perangkat keras, perakitan, pemeliharaan preventif, dan diagnosis software sistem.
                </p>
                <div className="hard-chips-container">
                  {[
                    'PC Assembly', 'Hardware Troubleshooting', 'Software Troubleshooting',
                    'Operating System Installation', 'Windows Configuration', 'Hardware Maintenance'
                  ].map((sk, idx) => (
                    <span key={idx} className="hard-chip">{sk}</span>
                  ))}
                </div>
              </div>

              {/* Panel C: WEB DEVELOPMENT & DESIGN */}
              <div className="hard-skill-panel theme-card theme-purple">
                <div className="hard-panel-top">
                  <div className="hard-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/>
                      <polyline points="8 6 2 12 8 18"/>
                      <line x1="14" y1="4" x2="10" y2="20"/>
                    </svg>
                  </div>
                  <span className="hard-count-pill">8 Competencies</span>
                </div>
                <h3 className="hard-panel-title">WEB DEVELOPMENT & DESIGN</h3>
                <p className="hard-panel-desc">
                  Penyusunan kode frontend modern, pengelolaan versi proyek, serta perancangan aset grafis kreatif.
                </p>
                <div className="hard-chips-container">
                  {[
                    'HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design',
                    'Git & GitHub', 'Visual Studio Code', 'CorelDRAW', 'Adobe Photoshop'
                  ].map((sk, idx) => (
                    <span key={idx} className="hard-chip">{sk}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. PROFESSIONAL SOFT SKILLS (Aura-style 3D Perspective Stacked Carousel) */}
        {(skillsFilter === 'all' || skillsFilter === 'soft') && (
          <div className="aura-carousel-sec reveal">
            <div className="skills-subhead-label">Professional Soft Skills</div>

            {/* Carousel Header */}
            <div className="aura-carousel-header">
              <div className="aura-title-wrap">
                <h3 className="aura-sec-title">Personal & Professional Skills</h3>
                <p className="aura-sec-desc">
                  Kenali kemampuan interpersonal dan karakter kerja saya dalam berkomunikasi, bekerja sama, beradaptasi, serta menyelesaikan berbagai tantangan.
                </p>
              </div>
            </div>

            {/* 3D Stage Wrapper with Simple Side Navigation (< and >) */}
            <div className="aura-stage-wrap">
              {/* Left Navigation Button (<) */}
              <button
                type="button"
                className="aura-side-nav-btn left"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSoft();
                }}
                aria-label="Previous soft skill"
                title="Kartu Sebelumnya"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* 3D Perspective Stage */}
              <div
                className="aura-stage-container"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {softSkillsList.map((item, idx) => {
                  const style = getCard3DStyle(idx);
                  const isActive = activeSoftIdx === idx;

                  return (
                    <div
                      key={idx}
                      className={`aura-card-3d theme-card ${item.theme} ${isActive ? 'active-center' : ''}`}
                      style={style}
                      onClick={() => {
                        if (!isActive) {
                          setActiveSoftIdx(idx);
                        } else {
                          setSelectedSoftSkill(item);
                        }
                      }}
                    >
                      {/* Top Bar */}
                      <div className="aura-card-topbar">
                        <span className="aura-category-badge">{item.tag}</span>
                        <span className="aura-card-num">#{String(idx + 1).padStart(2, '0')}</span>
                      </div>

                      {/* Glowing Icon */}
                      <div className="aura-card-icon-wrap">
                        <span>{item.icon}</span>
                      </div>

                      {/* Title & Desc */}
                      <h4 className="aura-card-title">{item.name}</h4>
                      <p className="aura-card-desc">{item.desc}</p>

                      {/* Mini Highlight Badges */}
                      <div className="aura-card-points">
                        {item.points.slice(0, 2).map((pt, pidx) => (
                          <div key={pidx} className="aura-card-point">
                            <span className="aura-point-bullet" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Action */}
                      <div className="aura-card-footer">
                        <span className="aura-action-link">
                          Detail Insight →
                        </span>
                        <span className="aura-status-pill">
                          {isActive ? '● Active View' : 'Click to Focus'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Navigation Button (>) */}
              <button
                type="button"
                className="aura-side-nav-btn right"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSoft();
                }}
                aria-label="Next soft skill"
                title="Kartu Selanjutnya"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Aura Dots Pagination */}
            <div className="aura-dots-bar">
              {softSkillsList.map((item, dIdx) => (
                <button
                  key={dIdx}
                  type="button"
                  className={`aura-dot ${activeSoftIdx === dIdx ? 'active' : ''}`}
                  onClick={() => setActiveSoftIdx(dIdx)}
                  aria-label={`Pilih skill ${dIdx + 1}: ${item.name}`}
                  title={item.name}
                />
              ))}
            </div>
            <div className="aura-swipe-hint">
              Geser atau klik kartu samping untuk navigasi · Klik kartu tengah untuk detail.
            </div>
          </div>
        )}

        {/* Soft Skill Expandable Insight Modal */}
        {selectedSoftSkill && (
          <div className="soft-modal-backdrop" onClick={() => setSelectedSoftSkill(null)}>
            <div className={`soft-modal-card theme-card ${(selectedSoftSkill as any).theme || 'theme-blue'}`} onClick={(e) => e.stopPropagation()}>
              <button
                className="soft-modal-close"
                onClick={() => setSelectedSoftSkill(null)}
                aria-label="Tutup"
              >
                ✕
              </button>
              <div className="soft-modal-header">
                <div className="soft-modal-icon">{selectedSoftSkill.icon}</div>
                <div>
                  <h3 className="soft-modal-title">{selectedSoftSkill.name}</h3>
                  <div className="soft-modal-category">Professional Competency</div>
                </div>
              </div>
              <p className="soft-modal-body">{selectedSoftSkill.detail}</p>
              <div className="soft-modal-points">
                {selectedSoftSkill.points.map((pt, pidx) => (
                  <div key={pidx} className="soft-modal-point-item">
                    <span/>
                    <div>{pt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== PROJECTS ===== */}
      <section id="project">
        <div className="section-header reveal">
          <span className="section-num">04</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-line"/>
        </div>
        {/* Featured Showcase Projects List */}
        <div style={{display:'flex',flexDirection:'column',gap:'40px'}}>

          {/* 1. PRACI SIAGA — PROYEK UNGGULAN */}
          <div className="featured-project-card reveal">
            {/* Decorative subtle background rings */}
            <img src="/assets/logo-t-silhouette.png?v=2" alt="" className="featured-decor-logo" />

            {/* Top Bar: Proyek Unggulan & Live Project */}
            <div className="featured-card-topbar">
              <span className="featured-tag">Proyek Unggulan</span>
              <span className="featured-live-badge">
                <span className="live-dot" /> Live project
              </span>
            </div>

            {/* Header Row: Logo & Descriptions */}
            <div className="featured-header-row">
              <div className="featured-logo-box">
                <img src="/assets/logo-praci-siaga.png?v=2" alt="Logo Praci Siaga" />
              </div>
              <div>
                <div className="featured-subhead">PRACI SIAGA · LAYANAN DARURAT</div>
                <h3 className="featured-title">Akses bantuan penting, lebih mudah.</h3>
                <p className="featured-desc">
                  Portal layanan darurat untuk membantu warga Pracimantoro mengakses kontak instansi penting seperti Kepolisian, Puskesmas, Pemadam Kebakaran, PMI, BPBD, dan SAR.
                </p>
              </div>
            </div>

            {/* Main Grid: YouTube Video (Left) & 3 Feature Panels (Right) */}
            <div className="featured-main-grid">
              {/* Embedded In-Place YouTube Video Player */}
              <div className="featured-video-wrap">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/TZM98ft9raw?rel=0"
                  title="PRACI SIAGA | Inovasi Aplikasi Layanan Darurat, Kesehatan..."
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="featured-video-iframe"
                />
              </div>

              {/* 3 Stacked Feature Boxes */}
              <div className="featured-features-column">
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Akses langsung</div>
                  <div className="featured-feature-desc">Panggilan dan pesan via WhatsApp deep link.</div>
                </div>
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Pelaporan cepat</div>
                  <div className="featured-feature-desc">Membantu warga menemukan jalur bantuan.</div>
                </div>
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Mudah digunakan</div>
                  <div className="featured-feature-desc">Tampilan responsif untuk memudahkan warga mengakses informasi.</div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tech Chips & Action Button */}
            <div className="featured-bottom-row">
              <div className="featured-tech-chips">
                <span className="featured-chip">JavaScript</span>
                <span className="featured-chip">HTML / CSS</span>
                <span className="featured-chip">WhatsApp API</span>
                <span className="featured-chip">Vercel</span>
              </div>
              <div className="featured-actions">
                <a
                  href="https://praci-siaga-official-website.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-cta-btn"
                >
                  Coba Sekarang ↗
                </a>
              </div>
            </div>
          </div>

          {/* 2. E-LINTAS — PROYEK */}
          <div className="featured-project-card reveal">
            <img src="/assets/logo-t-silhouette.png?v=2" alt="" className="featured-decor-logo" />

            <div className="featured-card-topbar">
              <span className="featured-tag">Proyek</span>
              <span className="featured-live-badge">
                <span className="live-dot" /> Live project
              </span>
            </div>

            <div className="featured-header-row">
              <div className="featured-logo-box">
                <img src="/assets/logo-e-lintas.png" alt="Logo E-Lintas" />
              </div>
              <div>
                <div className="featured-subhead">E-LINTAS · EDUKASI & SIMULASI LALU LINTAS</div>
                <h3 className="featured-title">Belajar lalu lintas, lebih interaktif.</h3>
                <p className="featured-desc">
                  Platform edukasi digital untuk mempelajari rambu dan aturan berkendara melalui kuis interaktif serta simulasi jalur ujian praktik SIM C.
                </p>
              </div>
            </div>

            <div className="featured-main-grid">
              {/* Interactive Screenshot Slider (Sky Blue Theme) */}
              <div className="featured-slider-wrap elintas-slider">
                <img
                  src={eLintasImages[eLintasSlide].src}
                  alt={eLintasImages[eLintasSlide].alt}
                  className="featured-slider-img"
                />
                <button
                  type="button"
                  className="slider-arrow-btn left"
                  onClick={() => setELintasSlide((prev) => (prev - 1 + eLintasImages.length) % eLintasImages.length)}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="slider-arrow-btn right"
                  onClick={() => setELintasSlide((prev) => (prev + 1) % eLintasImages.length)}
                  aria-label="Next slide"
                >
                  ›
                </button>
                <div className="slider-dots-row">
                  {eLintasImages.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      className={`slider-dot ${eLintasSlide === sIdx ? 'active' : ''}`}
                      onClick={() => setELintasSlide(sIdx)}
                      aria-label={`Slide ${sIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="featured-features-column">
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Kuis rambu & aturan</div>
                  <div className="featured-feature-desc">35 soal untuk menguji pemahaman peraturan lalu lintas dan rambu.</div>
                </div>
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Simulasi SIM C</div>
                  <div className="featured-feature-desc">Latihan interaktif mengenal jalur ujian praktik berkendara.</div>
                </div>
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Belajar keselamatan</div>
                  <div className="featured-feature-desc">Membantu membangun pemahaman dan keputusan berkendara yang aman.</div>
                </div>
              </div>
            </div>

            <div className="featured-bottom-row">
              <div className="featured-tech-chips">
                <span className="featured-chip">Edukasi lalu lintas</span>
                <span className="featured-chip">Kuis interaktif</span>
                <span className="featured-chip">Simulasi SIM C</span>
              </div>
              <div className="featured-actions">
                <a
                  href="https://e-lintas.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-cta-btn"
                >
                  Coba Sekarang ↗
                </a>
              </div>
            </div>
          </div>

          {/* 3. CATAT UANGMU — PROYEK */}
          <div className="featured-project-card reveal">
            <img src="/assets/logo-t-silhouette.png?v=2" alt="" className="featured-decor-logo" />

            <div className="featured-card-topbar">
              <span className="featured-tag">Proyek</span>
              <span className="featured-live-badge">
                <span className="live-dot" /> Live project
              </span>
            </div>

            <div className="featured-header-row">
              <div className="featured-logo-box">
                <img src="/assets/logo-catat-uangmu.png" alt="Logo Catat Uangmu" />
              </div>
              <div>
                <div className="featured-subhead">CATAT UANGMU · MANAJEMEN KEUANGAN PERSONAL</div>
                <h3 className="featured-title">Kelola keuangan harian, lebih teratur.</h3>
                <p className="featured-desc">
                  Platform pencatatan keuangan pribadi untuk memantau pemasukan, pengeluaran, serta anggaran harian secara praktis dan terstruktur.
                </p>
              </div>
            </div>

            <div className="featured-main-grid">
              {/* Interactive Screenshot Slider (Slate Blue Theme) */}
              <div className="featured-slider-wrap catatuangmu-slider">
                <img
                  src={catatUangmuImages[catatUangmuSlide].src}
                  alt={catatUangmuImages[catatUangmuSlide].alt}
                  className="featured-slider-img"
                />
                <button
                  type="button"
                  className="slider-arrow-btn left"
                  onClick={() => setCatatUangmuSlide((prev) => (prev - 1 + catatUangmuImages.length) % catatUangmuImages.length)}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="slider-arrow-btn right"
                  onClick={() => setCatatUangmuSlide((prev) => (prev + 1) % catatUangmuImages.length)}
                  aria-label="Next slide"
                >
                  ›
                </button>
                <div className="slider-dots-row">
                  {catatUangmuImages.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      className={`slider-dot ${catatUangmuSlide === sIdx ? 'active' : ''}`}
                      onClick={() => setCatatUangmuSlide(sIdx)}
                      aria-label={`Slide ${sIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="featured-features-column">
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Pencatatan Pemasukan & Pengeluaran</div>
                  <div className="featured-feature-desc">Catat transaksi harian secara cepat dengan kategori yang jelas dan rapi.</div>
                </div>
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Analisis & Rekap Keuangan</div>
                  <div className="featured-feature-desc">Pantau alur kas dan ringkasan anggaran untuk mengontrol pengeluaran harian.</div>
                </div>
                <div className="featured-feature-box">
                  <div className="featured-feature-title">Manajemen Anggaran</div>
                  <div className="featured-feature-desc">Membantu merencanakan target keuangan dan menjaga finansial tetap stabil.</div>
                </div>
              </div>
            </div>

            <div className="featured-bottom-row">
              <div className="featured-tech-chips">
                <span className="featured-chip">Manajemen Keuangan</span>
                <span className="featured-chip">Pencatatan Transaksi</span>
                <span className="featured-chip">Analisis Finansial</span>
              </div>
              <div className="featured-actions">
                <a
                  href="https://catat-uangmu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-cta-btn"
                >
                  Coba Sekarang ↗
                </a>
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
        <div className="reveal" style={{ marginTop: '-28px', marginBottom: '38px', maxWidth: '720px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e0f2fe', marginBottom: '4px' }}>
            Bertumbuh lewat tanggung jawab dan kerja sama.
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Pengalaman organisasi membentuk disiplin, kepemimpinan, dan kemampuan bekerja bersama.
          </p>
        </div>
        <div className="timeline">

          {/* 1. Paskibra 79 Giritontro */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">2024 · HUT ke-79 RI</span>
                <span className="timeline-cat-pill pill-paskibra">Paskibra</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-paskibra.png" alt="Logo Paskibra" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">Paskibra 79 Giritontro</div>
                  <div className="timeline-org">Paskibra Tingkat Kecamatan Giritontro</div>
                  <div className="timeline-desc">
                    Bertugas sebagai pasukan pengibar bendera pada peringatan HUT ke-79 RI tingkat Kecamatan Giritontro.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Paskibra 80 Pracimantoro */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">2025 · HUT ke-80 RI</span>
                <span className="timeline-cat-pill pill-paskibra">Paskibra</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-paskibra.png" alt="Logo Paskibra" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">Paskibra 80 Pracimantoro</div>
                  <div className="timeline-org">Paskibra Tingkat Kecamatan Pracimantoro</div>
                  <div className="timeline-desc">
                    Bertugas sebagai pasukan pengibar bendera pada peringatan HUT ke-80 RI tingkat Kecamatan Pracimantoro.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Ketua OSIS SMP */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">2022 — 2023</span>
                <span className="timeline-cat-pill pill-osis">Organisasi Sekolah</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-osis.png" alt="Logo OSIS" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">Ketua OSIS SMP</div>
                  <div className="timeline-org">Organisasi Siswa Intra Sekolah (OSIS)</div>
                  <div className="timeline-desc">
                    Belajar memimpin, mengelola organisasi, dan berkolaborasi dalam kegiatan sekolah.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DIANPINRU */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">Kepemimpinan</span>
                <span className="timeline-cat-pill pill-penggalang">Pramuka Penggalang</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-dianpinru.png" alt="Logo DIANPINRU Korwil Surakarta" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">DIANPINRU — Korwil Surakarta</div>
                  <div className="timeline-org">Korwil Surakarta · Pelatihan Kepemimpinan Regu</div>
                  <div className="timeline-desc">
                    Mengikuti pelatihan kepemimpinan regu untuk mengembangkan jiwa kepemimpinan, kedisiplinan, dan karakter.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. JOTA-JOTI 2024 */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">2024 · Kegiatan</span>
                <span className="timeline-cat-pill pill-penegak">Pramuka Penegak</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-jota-joti-2024.png" alt="Logo JOTA-JOTI 2024" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">JOTA-JOTI 2024</div>
                  <div className="timeline-org">Pramuka Penegak · Komunikasi Radio & Internet</div>
                  <div className="timeline-desc">
                    Mengikuti kegiatan kepanduan melalui komunikasi radio dan internet serta berkenalan dengan Pramuka dari berbagai daerah.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. SOLIDARITAS 25 */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">2025 · Kegiatan</span>
                <span className="timeline-cat-pill pill-penegak">Pramuka Penegak</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-solidaritas-25.png" alt="Logo SOLIDARITAS 25 Kwarcab Demak" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">SOLIDARITAS 25 — Kwarcab Demak</div>
                  <div className="timeline-org">Kwarcab Demak · Pramuka Penegak</div>
                  <div className="timeline-desc">
                    Mengikuti kegiatan Pramuka yang mempererat solidaritas, kebersamaan, dan kerja sama antarpeserta.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. JOTA-JOTI 2025 */}
          <div className="timeline-item">
            <div className="timeline-dot"/>
            <div className="timeline-card">
              <div className="timeline-badge-row">
                <span className="timeline-period">2025 · Kegiatan</span>
                <span className="timeline-cat-pill pill-penegak">Pramuka Penegak</span>
              </div>
              <div className="timeline-body-flex">
                <img src="/assets/logo-jota-joti-2025.png" alt="Logo JOTA-JOTI 2025" className="timeline-activity-logo" />
                <div className="timeline-text-wrap">
                  <div className="timeline-title">JOTA-JOTI 2025</div>
                  <div className="timeline-org">Pramuka Penegak · Komunikasi Radio & Internet</div>
                  <div className="timeline-desc">
                    Melanjutkan pengalaman berkomunikasi dan berkolaborasi dengan Pramuka melalui radio dan internet.
                  </div>
                </div>
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
              background:'#10b981',
              borderRadius:'50%',
              animation:'pulse 2s infinite'
            }}/>
            <span style={{fontSize:'12px',fontWeight:'700',color:'#34d399',letterSpacing:'1px',textTransform:'uppercase'}}>
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
