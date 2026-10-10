import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

const translations = {
  english: {
    badge: '10,000+ jobs available',
    hero1: 'Need a Job?', hero2: 'Need Workers?', sub: 'Find both in minutes.',
    desc: 'Nexova connects daily-wage workers and employers across India. Plumbers, electricians, cleaners, drivers — find work or hire instantly. No experience needed.',
    btn1: 'Get Started Free', btn2: 'Sign In',
    browseJobs: 'Browse Jobs', postJob: 'Post a Job', dashboard: 'My Dashboard',
    statsLabels: ['Active Jobs', 'Job Seekers', 'Companies', 'Happy Users'],
    howTitle: 'How It Works', howSub: 'Simple. Fast. Free.',
    steps: [
      { title: 'Create Account', desc: 'Sign up in 30 seconds with just your name and email.' },
      { title: 'Find Work or Hire', desc: 'Browse jobs near you or post a job and get applicants in minutes.' },
      { title: 'Start Working', desc: 'Apply with one click. No long forms. No experience needed.' },
    ],
    ctaTitle: 'Start Today — It\'s Free',
    ctaDesc: 'Create your free account and find work or hire someone in minutes.',
    ctaBtn: 'Create Free Account',
  },
  hindi: {
    badge: '१०,००० से अधिक नौकरियाँ',
    hero1: 'नौकरी चाहिए?', hero2: 'कर्मचारी चाहिए?', sub: 'दोनों मिनटों में खोजें।',
    desc: 'Nexova आपको रोज़गार खोजने या कर्मचारी नियुक्त करने में मदद करता है। प्लंबर, इलेक्ट्रीशियन, क्लीनर, ड्राइवर — आसानी से काम खोजें।',
    btn1: 'मुफ्त शुरू करें', btn2: 'लॉगिन',
    browseJobs: 'नौकरियाँ देखें', postJob: 'नौकरी पोस्ट करें', dashboard: 'डैशबोर्ड',
    statsLabels: ['सक्रिय नौकरियाँ', 'नौकरी खोजने वाले', 'कंपनियाँ', 'खुश उपयोगकर्ता'],
    howTitle: 'कैसे काम करता है', howSub: 'सरल। तेज़। मुफ्त।',
    steps: [
      { title: 'अकाउंट बनाएं', desc: 'सिर्फ नाम और ईमेल से 30 सेकंड में साइन अप करें।' },
      { title: 'नौकरी खोजें या पोस्ट करें', desc: 'अपने पास की नौकरियाँ देखें या नौकरी पोस्ट करें।' },
      { title: 'काम शुरू करें', desc: 'एक क्लिक में आवेदन करें। कोई लंबा फॉर्म नहीं।' },
    ],
    ctaTitle: 'आज शुरू करें — मुफ्त', ctaDesc: 'मुफ्त अकाउंट बनाएं और मिनटों में काम खोजें।', ctaBtn: 'मुफ्त अकाउंट बनाएं →',
  },
  kannada: {
    badge: '೧೦,೦೦೦+ ಉದ್ಯೋಗಗಳು',
    hero1: 'ಕೆಲಸ ಬೇಕೇ?', hero2: 'ಕೆಲಸಗಾರ ಬೇಕೇ?', sub: 'ಎರಡೂ ನಿಮಿಷಗಳಲ್ಲಿ ಹುಡುಕಿ.',
    desc: 'Nexova ನಿಮಗೆ ದೈನಂದಿನ ಕೆಲಸ ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಪ್ಲಂಬರ್, ಎಲೆಕ್ಟ್ರಿಶಿಯನ್, ಕ್ಲೀನರ್, ಡ್ರೈವರ್ — ಸುಲಭವಾಗಿ ಕೆಲಸ ಹುಡುಕಿ.',
    btn1: 'ಉಚಿತ ಪ್ರಾರಂಭ', btn2: 'ಲಾಗಿನ್',
    browseJobs: 'ಉದ್ಯೋಗ ನೋಡಿ', postJob: 'ಪೋಸ್ಟ್ ಮಾಡಿ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    statsLabels: ['ಸಕ್ರಿಯ ಉದ್ಯೋಗ', 'ಅರ್ಜಿದಾರರು', 'ಕಂಪನಿಗಳು', 'ಸಂತುಷ್ಟ ಬಳಕೆದಾರರು'],
    howTitle: 'ಹೇಗೆ ಕಾರ್ಯ', howSub: 'ಸರಳ. ವೇಗ. ಉಚಿತ.',
    steps: [
      { title: 'ಖಾತೆ ತೆರೆಯಿರಿ', desc: '30 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ನೋಂದಣಿ.' },
      { title: 'ಹುಡುಕಿ ಅಥವಾ ಪೋಸ್ಟ್ ಮಾಡಿ', desc: 'ಹತ್ತಿರದ ಕೆಲಸ ನೋಡಿ.' },
      { title: 'ಕೆಲಸ ಆರಂಭಿಸಿ', desc: 'ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಅರ್ಜಿ.' },
    ],
    ctaTitle: 'ಇಂದೇ ಪ್ರಾರಂಭ — ಉಚಿತ', ctaDesc: 'ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ.', ctaBtn: 'ಉಚಿತ ಖಾತೆ →',
  },
  telugu: {
    badge: '౧౦,౦౦౦+ ఉద్యోగాలు',
    hero1: 'ఉద్యోగం కావాలా?', hero2: 'కూలీ కావాలా?', sub: 'రెండూ నిమిషాల్లో కనుగొనండి.',
    desc: 'Nexova మీకు సులభంగా ఉద్యోగం వెతకడానికి సహాయపడుతుంది. ప్లంబర్, ఎలక్ట్రీషియన్, క్లీనర్, డ్రైవర్ — సులభంగా పని కనుగొనండి.',
    btn1: 'ఉచితంగా ప్రారంభించండి', btn2: 'లాగిన్',
    browseJobs: 'ఉద్యోగాలు చూడండి', postJob: 'పోస్ట్ చేయండి', dashboard: 'డాష్‌బోర్డ్',
    statsLabels: ['ఉద్యోగాలు', 'అభ్యర్థులు', 'కంపెనీలు', 'వినియోగదారులు'],
    howTitle: 'ఎలా పని చేస్తుంది', howSub: 'సరళం. వేగం. ఉచితం.',
    steps: [
      { title: 'ఖాతా తెరవండి', desc: '30 సెకన్లలో సైన్ అప్.' },
      { title: 'వెతకండి', desc: 'దగ్గర్లో ఉద్యోగాలు చూడండి.' },
      { title: 'దరఖాస్తు', desc: 'ఒక్క క్లిక్‌లో.' },
    ],
    ctaTitle: 'ఈరోజే ప్రారంభించండి — ఉచితం', ctaDesc: 'ఉచిత ఖాతా తెరవండి.', ctaBtn: 'ఖాతా తెరవండి →',
  },
  tamil: {
    badge: '10,000+ வேலைகள்',
    hero1: 'வேலை வேண்டுமா?', hero2: 'ஆள் வேண்டுமா?', sub: 'இரண்டும் நிமிடங்களில் கண்டுபிடி.',
    desc: 'Nexova உங்களுக்கு எளிதாக வேலை தேட உதவுகிறது. பிளம்பர், எலக்ட்ரீஷியன், கிளீனர், டிரைவர் — எளிதாக வேலை கண்டுபிடி.',
    btn1: 'இலவசமாக தொடங்கு', btn2: 'உள்நுழைய',
    browseJobs: 'வேலைகள் பார்க்க', postJob: 'பதிவிட', dashboard: 'டாஷ்போர்டு',
    statsLabels: ['வேலைகள்', 'தேடுவோர்', 'நிறுவனங்கள்', 'பயனர்கள்'],
    howTitle: 'எப்படி', howSub: 'எளிமையானது. வேகமானது. இலவசம்.',
    steps: [
      { title: 'கணக்கு', desc: '30 வினாடிகளில் பதிவு.' },
      { title: 'தேடு', desc: 'அருகில் உள்ள வேலைகளை பாருங்கள்.' },
      { title: 'விண்ணப்பி', desc: 'ஒரே கிளிக்கில்.' },
    ],
    ctaTitle: 'இன்றே தொடங்குங்கள் — இலவசம்', ctaDesc: 'இலவச கணக்கு உருவாக்கு.', ctaBtn: 'கணக்கு உருவாக்கு →',
  },
  marathi: {
    badge: '१०,००० नोकऱ्या उपलब्ध',
    hero1: 'नोकरी हवी?', hero2: 'कर्मचारी हवा?', sub: 'दोन्ही मिनिटांत शोधा.',
    desc: 'Nexova तुम्हाला सहजपणे नोकरी शोधण्यास मदत करते. प्लंबर, इलेक्ट्रिशियन, क्लीनर, ड्रायव्हर — सहज काम शोधा.',
    btn1: 'मोफत सुरू करा', btn2: 'लॉगिन',
    browseJobs: 'नोकऱ्या पहा', postJob: 'नोकरी पोस्ट करा', dashboard: 'डॅशबोर्ड',
    statsLabels: ['नोकऱ्या', 'शोधणारे', 'कंपन्या', 'वापरकर्ते'],
    howTitle: 'कसे कार्य करते', howSub: 'सोपे. जलद. मोफत.',
    steps: [
      { title: 'खाते तयार करा', desc: '30 सेकंदात साइन अप करा.' },
      { title: 'नोकरी शोधा किंवा पोस्ट करा', desc: 'जवळच्या नोकऱ्या पहा.' },
      { title: 'अर्ज करा', desc: 'एका क्लिकमध्ये.' },
    ],
    ctaTitle: 'आज सुरू करा — मोफत', ctaDesc: 'मोफत खाते तयार करा.', ctaBtn: 'मोफत खाते →',
  },
};

const languages = [
  { key: 'english', label: 'English', flag: '🇬🇧' },
  { key: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
  { key: 'kannada', label: 'ಕನ್ನಡ', flag: '⭐' },
  { key: 'telugu', label: 'తెలుగు', flag: '⭐' },
  { key: 'tamil', label: 'தமிழ்', flag: '⭐' },
  { key: 'marathi', label: 'मराठी', flag: '⭐' },
];

const stats = ['10K+', '50K+', '5K+', '98%'];

const marqueeIcons = [
  { icon: '💼', label: 'Full-Time Jobs' },
  { icon: '🏠', label: 'Work From Home' },
  { icon: '🔧', label: 'Home Services' },
  { icon: '👩‍💻', label: 'Tech Roles' },
  { icon: '🏗️', label: 'Construction' },
  { icon: '🍽️', label: 'Hospitality' },
  { icon: '🚚', label: 'Logistics' },
  { icon: '🏥', label: 'Healthcare' },
  { icon: '📚', label: 'Education' },
  { icon: '🎨', label: 'Creative' },
  { icon: '💰', label: 'Finance' },
  { icon: '🛒', label: 'Retail' },
];

const features = [
  { icon: '⚡', title: 'Instant Apply', desc: 'Apply to any job with one click — no lengthy forms.' },
  { icon: '🔔', title: 'Real-Time Alerts', desc: 'Get notified the moment a matching job is posted.' },
  { icon: '🌐', title: 'Multilingual', desc: 'Navigate in English, Hindi, Kannada, Tamil, and more.' },
  { icon: '🛡️', title: 'Verified Employers', desc: 'Every company is vetted for your safety and trust.' },
  { icon: '📊', title: 'Smart Dashboard', desc: 'Track all your applications in one beautiful dashboard.' },
  { icon: '🤝', title: 'Home Services', desc: 'Find plumbers, electricians, cleaners near you instantly.' },
];

export default function Home() {
  const { user } = useAuth();
  const [lang, setLang] = useState('english');
  const t = translations[lang];

  return (
    <div>
      <BackgroundBlobs opacity={0.5} />

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="animate-blob" style={{
            position: 'absolute', top: '5%', left: '10%', width: 380, height: 380,
            background: 'radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)',
          }} />
          <div className="animate-blob-delay" style={{
            position: 'absolute', top: '30%', right: '8%', width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(245,240,235,0.4) 0%, transparent 70%)',
          }} />
          <div className="animate-blob-delay2" style={{
            position: 'absolute', bottom: '10%', left: '30%', width: 250, height: 250,
            background: 'radial-gradient(circle, rgba(27,42,74,0.04) 0%, transparent 70%)',
          }} />
          <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.04 }} width="400" height="400" viewBox="0 0 400 400">
            {Array.from({ length: 10 }, (_, r) =>
              Array.from({ length: 10 }, (_, c) => (
                <circle key={`${r}-${c}`} cx={c * 40 + 20} cy={r * 40 + 20} r="2.5" fill="#1B2A4A" />
              ))
            )}
          </svg>

          {/* Floating diamonds */}
          <div className="animate-float" style={{ position: 'absolute', top: '15%', right: '18%', opacity: 0.04 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="1.5">
              <path d="M12 2L22 12L12 22L2 12L12 2Z" />
            </svg>
          </div>
          <div className="animate-float-delay" style={{ position: 'absolute', bottom: '20%', left: '15%', opacity: 0.03 }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="1.5">
              <path d="M12 2L22 12L12 22L2 12L12 2Z" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 py-20 w-full" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-up">
            {languages.map((l) => (
              <button key={l.key} onClick={() => setLang(l.key)} style={{
                padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                background: lang === l.key ? '#1B2A4A' : '#F5F0EB',
                color: lang === l.key ? '#FFFFFF' : '#1B2A4A',
                border: lang === l.key ? '1.5px solid #1B2A4A' : '1.5px solid rgba(27,42,74,0.1)',
                cursor: 'pointer', transition: 'all 0.25s ease',
                backdropFilter: 'blur(8px)',
              }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-up" style={{ marginBottom: 20 }}>
              <span className="section-tag">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4A882', display: 'inline-block' }} />
                {t.badge}
              </span>
            </div>

            <h1 className="animate-fade-up-delay" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(52px, 8vw, 96px)',
              fontWeight: 700, lineHeight: 1.05,
              color: '#1B2A4A', marginBottom: 12,
            }}>
              {t.hero1}<br />
              <span style={{ color: '#C4A882' }}>{t.hero2}</span>
            </h1>

            <p className="animate-fade-up-delay" style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(22px, 3vw, 32px)',
              color: 'rgba(27,42,74,0.4)', marginBottom: 20,
            }}>{t.sub}</p>

            <p className="animate-fade-up-delay2" style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 17,
              color: 'rgba(27,42,74,0.55)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7,
            }}>{t.desc}</p>

            <div className="animate-fade-up-delay2 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/jobs" className="btn-primary">🔍 {t.browseJobs}</Link>
                  {user.role === 'recruiter' && <Link to="/post-job" className="btn-outline">📝 {t.postJob}</Link>}
                  <Link to="/dashboard" className="btn-ghost">📊 {t.dashboard}</Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary">{t.btn1} →</Link>
                  <Link to="/login" className="btn-outline">{t.btn2}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ background: 'rgba(245,240,235,0.4)', borderTop: '1px solid rgba(27,42,74,0.06)', borderBottom: '1px solid rgba(27,42,74,0.06)', padding: '16px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {[...marqueeIcons, ...marqueeIcons].map((item, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '0 32px', borderRight: '1px solid rgba(27,42,74,0.06)',
              }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#1B2A4A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="animate-marquee-reverse" style={{ display: 'flex', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {[...marqueeIcons, ...marqueeIcons].reverse().map((item, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '0 32px', borderRight: '1px solid rgba(27,42,74,0.04)',
              }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, color: 'rgba(27,42,74,0.45)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#FAF8F6', padding: '60px 20px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((num, i) => (
              <div key={i} className="card-classic" style={{
                textAlign: 'center', padding: '32px 20px',
                background: i % 2 === 0 ? '#FFFFFF' : '#FAF8F6',
              }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 700, color: '#C4A882', lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(27,42,74,0.5)', marginTop: 8, fontWeight: 500 }}>{t.statsLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#FFFFFF', padding: '80px 20px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag" style={{ marginBottom: 16 }}>Process</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: '#1B2A4A', marginBottom: 12 }}>{t.howTitle}</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(27,42,74,0.5)' }}>{t.howSub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.steps.map((step, i) => (
              <div key={i} className="card-classic" style={{ padding: '40px 32px', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C4A882, #E8DCC8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 24px rgba(196,168,130,0.2)',
                }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 700, color: '#FFFFFF' }}>{i + 1}</span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(27,42,74,0.5)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#FAF8F6', padding: '80px 20px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag" style={{ marginBottom: 16 }}>Why Nexova</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: '#1B2A4A' }}>Everything You Need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-classic" style={{ padding: '32px 28px' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: 'rgba(196,168,130,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 18,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(27,42,74,0.5)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1B2A4A', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-3xl mx-auto text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>{t.ctaTitle}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.7 }}>{t.ctaDesc}</p>
          <Link to="/signup" className="btn-ghost" style={{ fontSize: 16, padding: '16px 40px', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', backdropFilter: 'blur(4px)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>{t.ctaBtn} →</Link>
        </div>
      </section>
    </div>
  );
}
