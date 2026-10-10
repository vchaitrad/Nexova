import { useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundBlobs from '../components/BackgroundBlobs';

const services = [
  {
    id: 'domestic',
    title: 'Domestic Help',
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=280&fit=crop&q=80',
    fb: '#D4A5A5',
  },
  {
    id: 'cleaning',
    title: 'Cleaning Service',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=280&fit=crop&q=80',
    fb: '#A5D4B8',
  },
  {
    id: 'babysitter',
    title: 'Babysitters',
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=280&fit=crop&q=80',
    fb: '#A5B8D4',
  },
  {
    id: 'electrician',
    title: 'Electrician',
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=280&fit=crop&q=80',
    fb: '#D4C4A5',
  },
  {
    id: 'ac-repair',
    title: 'AC Repair',
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=280&fit=crop&q=80',
    fb: '#A5D4D4',
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=280&fit=crop&q=80',
    fb: '#D4A5C4',
  },
  {
    id: 'painting',
    title: 'Painting Service',
    rating: 4.5,
    img: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=280&fit=crop&q=80',
    fb: '#D4B8A5',
  },
  {
    id: 'home-cook',
    title: 'Home Cook',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=280&fit=crop&q=80',
    fb: '#C4D4A5',
  },
];

function ServiceCard({ s }) {
  const [failed, setFailed] = useState(false);

  return (
    <div style={{
      flex: '0 0 auto', width: 248,
      background: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(27,42,74,0.06)',
      transition: 'all 0.3s ease', cursor: 'pointer',
      scrollSnapAlign: 'start', border: '1px solid rgba(27,42,74,0.04)',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(27,42,74,0.1)'; e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,42,74,0.06)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
    >
      <div style={{ width: '100%', height: 200, overflow: 'hidden', position: 'relative' }}>
        {failed ? (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${s.fb}, ${s.fb}dd)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 60, fontWeight: 700,
              color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
            }}>
              {s.title[0]}
            </span>
          </div>
        ) : (
          <img
            src={s.img}
            alt={s.title}
            loading="lazy"
            onError={() => setFailed(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        )}
      </div>
      <div style={{ padding: '16px 16px 20px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#1B2A4A', margin: '0 0 10px' }}>{s.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= Math.round(s.rating) ? '#F5A623' : 'rgba(27,42,74,0.08)'}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ))}
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginLeft: 4 }}>{s.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default function HomeServices() {
  const [search, setSearch] = useState('');
  const scrollRef = useState(null);
  const scrollContainer = scrollRef[0];
  const setScrollContainer = scrollRef[1];
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const filtered = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  const updateScrollState = () => {
    if (!scrollContainer) return;
    setCanScrollLeft(scrollContainer.scrollLeft > 4);
    setCanScrollRight(scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 4);
  };

  const scroll = (dir) => {
    if (!scrollContainer) return;
    const card = scrollContainer.querySelector('div');
    const step = (card?.offsetWidth || 248) + 20;
    scrollContainer.scrollBy({ left: dir * step, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />

      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px 50px', textAlign: 'center', background: '#FFFFFF' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="animate-blob" style={{ position: 'absolute', top: '10%', right: '15%', width: 240, height: 240, background: 'radial-gradient(circle, rgba(196,168,130,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div className="animate-blob-delay" style={{ position: 'absolute', bottom: '5%', left: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(27,42,74,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>
        <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#C4A882', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Home Services</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, color: '#1B2A4A', lineHeight: 1.1, marginBottom: 16 }}>
            Trusted Professionals,<br /><span style={{ color: '#C4A882' }}>At Your Doorstep</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(27,42,74,0.5)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
            Find skilled home service professionals near you — verified, rated, and ready to help.
          </p>
          <div style={{ maxWidth: 440, margin: '0 auto', position: 'relative' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(27,42,74,0.3)" strokeWidth="2.5" strokeLinecap="round" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21L16.65 16.65" />
            </svg>
            <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." style={{ paddingLeft: 48, borderRadius: 100, fontSize: 14, background: '#FAF8F6', border: '1.5px solid rgba(27,42,74,0.06)' }} />
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 20px 70px' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, color: '#1B2A4A', margin: '0 0 4px' }}>Popular Services</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(27,42,74,0.45)', margin: 0 }}>{filtered.length} services available</p>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%) translateX(-50%)', zIndex: 10,
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: '#FFFFFF', cursor: canScrollLeft ? 'pointer' : 'default',
                boxShadow: canScrollLeft ? '0 4px 16px rgba(27,42,74,0.12)' : '0 2px 8px rgba(27,42,74,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease', opacity: canScrollLeft ? 1 : 0.25,
                pointerEvents: canScrollLeft ? 'auto' : 'none',
              }}
              onMouseEnter={e => { if (canScrollLeft) { e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,42,74,0.18)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(-50%) scale(1.08)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,42,74,0.12)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(-50%) scale(1)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div ref={setScrollContainer} onScroll={updateScrollState} style={{
              display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 12,
              WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
            }} className="services-scroll">
              {filtered.map(s => (
                <ServiceCard key={s.id} s={s} />
              ))}
            </div>

            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) translateX(50%)', zIndex: 10,
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: '#FFFFFF', cursor: canScrollRight ? 'pointer' : 'default',
                boxShadow: canScrollRight ? '0 4px 16px rgba(27,42,74,0.12)' : '0 2px 8px rgba(27,42,74,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease', opacity: canScrollRight ? 1 : 0.25,
                pointerEvents: canScrollRight ? 'auto' : 'none',
              }}
              onMouseEnter={e => { if (canScrollRight) { e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,42,74,0.18)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(50%) scale(1.08)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,42,74,0.12)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(50%) scale(1)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section style={{ background: '#FFFFFF', padding: '60px 20px' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ display: 'inline-block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#C4A882', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>How It Works</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Book in 3 Easy Steps</h2>
          </div>
          <div className="grid md:grid-cols-3" style={{ gap: 24 }}>
            {[
              { step: '1', title: 'Choose a Service', desc: 'Browse categories and pick the service you need.' },
              { step: '2', title: 'Pick a Professional', desc: 'View profiles, ratings, and pricing. Choose your match.' },
              { step: '3', title: 'Get it Done', desc: 'Confirm your booking. The pro arrives at your doorstep.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#FAF8F6', borderRadius: 20, padding: '36px 28px', textAlign: 'center', border: '1px solid rgba(27,42,74,0.04)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #C4A882, #E8DCC8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 20px rgba(196,168,130,0.2)' }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>{s.step}</span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(27,42,74,0.5)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#1B2A4A', padding: '60px 20px', textAlign: 'center' }}>
        <div className="max-w-xl mx-auto">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Need Help at Home?</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.7 }}>Create a free account and book a professional in minutes.</p>
          <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 14, background: '#C4A882', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(196,168,130,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#B89B74'}
            onMouseLeave={e => e.currentTarget.style.background = '#C4A882'}>
            Get Started <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
