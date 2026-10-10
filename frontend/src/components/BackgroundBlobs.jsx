export default function BackgroundBlobs({ opacity = 1 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity, overflow: 'hidden' }}>

      {/* Large gradient orbs */}
      <div className="animate-blob" style={{
        position: 'absolute', top: '3%', right: '5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(196,168,130,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div className="animate-blob-delay" style={{
        position: 'absolute', bottom: '2%', left: '3%', width: 420, height: 420,
        background: 'radial-gradient(circle, rgba(240,226,222,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div className="animate-blob-alt" style={{
        position: 'absolute', top: '40%', left: '50%', width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(196,168,130,0.04) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div className="animate-blob-delay2" style={{
        position: 'absolute', top: '60%', left: '10%', width: 250, height: 250,
        background: 'radial-gradient(circle, rgba(240,226,222,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      {/* Floating circles */}
      <div className="animate-float" style={{
        position: 'absolute', top: '8%', left: '8%', width: 120, height: 120,
        borderRadius: '50%', background: 'rgba(196,168,130,0.04)',
        border: '1px solid rgba(196,168,130,0.08)',
      }} />
      <div className="animate-float-delay" style={{
        position: 'absolute', bottom: '20%', right: '10%', width: 80, height: 80,
        borderRadius: '50%', background: 'rgba(240,226,222,0.05)',
        border: '1px solid rgba(240,226,222,0.08)',
      }} />
      <div className="animate-float-slow" style={{
        position: 'absolute', top: '70%', left: '4%', width: 55, height: 55,
        borderRadius: '50%', background: 'rgba(196,168,130,0.03)',
        border: '1px solid rgba(196,168,130,0.06)',
      }} />
      <div className="animate-float-alt" style={{
        position: 'absolute', top: '20%', right: '25%', width: 40, height: 40,
        borderRadius: '50%', background: 'rgba(240,226,222,0.05)',
        border: '1px solid rgba(240,226,222,0.08)',
      }} />

      {/* Drift elements */}
      <div className="animate-drift" style={{
        position: 'absolute', top: '15%', left: '20%', width: 30, height: 30,
        borderRadius: '50%', background: 'rgba(196,168,130,0.04)',
      }} />
      <div className="animate-drift-delay" style={{
        position: 'absolute', bottom: '30%', right: '20%', width: 20, height: 20,
        borderRadius: '50%', background: 'rgba(240,226,222,0.05)',
      }} />

      {/* Floating geometric diamonds */}
      <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.025 }}>
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" />
        </svg>
      </div>
      <div className="animate-float-delay" style={{ position: 'absolute', bottom: '15%', right: '6%', opacity: 0.02 }}>
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" />
        </svg>
      </div>
      <div className="animate-float-slow" style={{ position: 'absolute', top: '50%', left: '85%', opacity: 0.025 }}>
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" />
        </svg>
      </div>
      <div className="animate-float-alt" style={{ position: 'absolute', top: '30%', left: '70%', opacity: 0.02 }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" />
        </svg>
      </div>

      {/* Twinkling stars */}
      {[
        { top: '18%', left: '15%', size: 3, delay: '0s' },
        { top: '28%', left: '75%', size: 2, delay: '1s' },
        { top: '55%', left: '30%', size: 4, delay: '2s' },
        { top: '70%', left: '65%', size: 2, delay: '0.5s' },
        { top: '85%', left: '20%', size: 3, delay: '1.5s' },
        { top: '10%', left: '50%', size: 2, delay: '2.5s' },
        { top: '40%', left: '90%', size: 3, delay: '0.8s' },
        { top: '65%', left: '45%', size: 2, delay: '1.8s' },
      ].map((star, i) => (
        <div key={i} className="animate-twinkle" style={{
          position: 'absolute',
          top: star.top,
          left: star.left,
          width: star.size,
          height: star.size,
          borderRadius: '50%',
          background: '#C4A882',
          boxShadow: '0 0 6px rgba(196,168,130,0.4)',
          animationDelay: star.delay,
        }} />
      ))}

      {/* Glowing dots */}
      <div className="animate-pulse-soft" style={{
        position: 'absolute', top: '22%', left: '25%', width: 5, height: 5,
        borderRadius: '50%', background: '#C4A882', boxShadow: '0 0 16px rgba(196,168,130,0.3)',
      }} />
      <div className="animate-pulse-soft" style={{
        position: 'absolute', bottom: '38%', right: '30%', width: 4, height: 4,
        borderRadius: '50%', background: '#F0E2DE', boxShadow: '0 0 12px rgba(240,226,222,0.25)',
        animationDelay: '1.5s',
      }} />
      <div className="animate-pulse-soft" style={{
        position: 'absolute', top: '78%', left: '15%', width: 6, height: 6,
        borderRadius: '50%', background: '#C4A882', boxShadow: '0 0 20px rgba(196,168,130,0.25)',
        animationDelay: '3s',
      }} />
      <div className="animate-pulse-soft" style={{
        position: 'absolute', top: '35%', right: '15%', width: 3, height: 3,
        borderRadius: '50%', background: '#F0E2DE', boxShadow: '0 0 10px rgba(240,226,222,0.2)',
        animationDelay: '4s',
      }} />

      {/* Subtle grid overlay */}
      <div className="animate-grid" style={{
        position: 'absolute', inset: 0, opacity: 0.02,
        backgroundImage: `
          linear-gradient(rgba(27,42,74,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(27,42,74,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </div>
  );
}
