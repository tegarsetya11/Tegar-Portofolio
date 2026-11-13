'use client';
import Link from 'next/link';

export default function CVPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020c1b 0%, #0a1628 50%, #020c1b 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 16px 60px',
    }}>
      {/* Header bar */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#e0f2fe',
          padding: '10px 22px',
          borderRadius: '50px',
          fontWeight: 600,
          fontSize: '0.92rem',
          textDecoration: 'none',
          transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
        }}>
          ← Kembali ke Portofolio
        </Link>

        <span style={{
          color: 'rgba(224,242,254,0.5)',
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
        }}>
          CV · Tegar Setya Andiputra
        </span>
      </div>

      {/* CV Image */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
      }}>
        <img
          src="/assets/cv-tegar.jpg"
          alt="CV Tegar Setya Andiputra"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      {/* Bottom back button */}
      <div style={{ marginTop: '36px' }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: '#fff',
          padding: '12px 32px',
          borderRadius: '50px',
          fontWeight: 700,
          fontSize: '0.95rem',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(37,99,235,0.55)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,99,235,0.4)';
        }}>
          ← Kembali ke Portofolio
        </Link>
      </div>
    </div>
  );
}
