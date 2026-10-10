const team = [
  { name: 'Chaitra', emoji: '👩‍💼' },
  { name: 'Abhijit', emoji: '👨‍💻' },
  { name: 'Humera', emoji: '👩‍🎓' },
  { name: 'Sagar', emoji: '🧑‍💼' },
  { name: 'Akash', emoji: '👨‍🔧' },
];

const values = [
  { icon: '🌱', title: 'Inclusive Growth', desc: 'Every Indian deserves access to quality work opportunities, regardless of background.' },
  { icon: '🔒', title: 'Trust & Safety', desc: 'Every employer and listing is carefully vetted so you can apply with confidence.' },
  { icon: '⚡', title: 'Simplicity First', desc: 'No complicated forms or jargon. We make job searching as simple as possible.' },
  { icon: '🤝', title: 'Community', desc: "We're building more than a platform — we're building a community of opportunity." },
];

export default function About() {
  return (
    <div>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 20px 80px', textAlign: 'center', background: '#FFFFFF' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="animate-blob" style={{ position: 'absolute', top: '10%', left: '5%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div className="animate-blob-delay" style={{ position: 'absolute', bottom: '5%', right: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(240,226,222,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div className="animate-float" style={{ position: 'absolute', top: '20%', right: '15%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(196,168,130,0.06)' }} />
          <div className="animate-float-delay" style={{ position: 'absolute', bottom: '25%', left: '8%', width: 60, height: 60, borderRadius: '50%', background: 'rgba(240,226,222,0.08)' }} />
        </div>
        <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ marginBottom: 20 }}>Our Story</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 700, color: '#1B2A4A', lineHeight: 1.1, marginBottom: 24 }}>
            Built for <span style={{ color: '#C4A882' }}>Every Indian</span> Worker
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 18, color: 'rgba(27,42,74,0.55)', lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
            Nexova was founded with a simple belief: finding a job or hiring the right person should never be complicated.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ background: '#FAF8F6', padding: '70px 20px' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-tag" style={{ marginBottom: 16 }}>Mission</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 700, color: '#1B2A4A', marginBottom: 20, lineHeight: 1.15 }}>
              Connecting Talent with Opportunity
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(27,42,74,0.55)', lineHeight: 1.8, marginBottom: 16 }}>
              We started Nexova in 2024 because we saw how difficult and frustrating the job search process was for millions of Indians — especially those in tier-2 and tier-3 cities.
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(27,42,74,0.55)', lineHeight: 1.8 }}>
              Today, Nexova serves 50,000+ job seekers and 5,000+ employers across India, with full support for 6 regional languages.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['50K+', 'Job Seekers'], ['5K+', 'Employers'], ['10K+', 'Active Jobs'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <div key={label} className="card-classic" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 44, fontWeight: 700, color: '#C4A882' }}>{num}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(27,42,74,0.45)', marginTop: 6, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ background: '#FFFFFF', padding: '70px 20px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag" style={{ marginBottom: 16 }}>Our Values</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(34px, 4vw, 50px)', fontWeight: 700, color: '#1B2A4A' }}>What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card-classic" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#1B2A4A', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(27,42,74,0.5)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ background: '#FAF8F6', padding: '70px 20px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag" style={{ marginBottom: 16 }}>Team</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(34px, 4vw, 50px)', fontWeight: 700, color: '#1B2A4A' }}>Meet the People Behind Nexova</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {team.map((m, i) => (
              <div key={i} className="card-classic" style={{ padding: '32px 20px', textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C4A882, #E8DCC8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, margin: '0 auto 16px',
                }}>{m.emoji}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: '#1B2A4A' }}>{m.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
