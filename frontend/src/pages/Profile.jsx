import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import BackgroundBlobs from '../components/BackgroundBlobs';

export default function Profile() {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  const fileRef = useRef(null);
  const selfieRef = useRef(null);
  const selfieCamRef = useRef(null);
  const [jobType, setJobType] = useState('domestic');

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [selfieUploading, setSelfieUploading] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const vs = user?.verificationStatus || 'none';
  const [lang, setLang] = useState('en');

  const LANG = {
    en: { domesticJobs:'Domestic', officeJobs:'Office / Technical', skilledJobs:'Skilled Trade', deliveryJobs:'Delivery', parttimeJobs:'Part-Time', profile:'My Profile', subtitle:'Manage your account and verification', badges:'Trust Badges', basicInfo:'Basic Info', fullName:'Full Name', email:'Email', phone:'Phone', location:'Location', save:'Save Changes', saving:'Saving...', jobTypeQ:'What type of jobs are you looking for?', professionalOpt:'Add optional details for professional jobs:', resume:'Resume', education:'Education', skills:'Skills', experience:'Experience', optional:'(optional)', selfieVer:'Selfie Verification', selfieDesc:'Take a selfie to show employers who you are', selfieDone:'✅ You are selfie verified!', takeSelfie:'Take Selfie', retake:'Retake', choosePhoto:'Choose Photo', uploading:'Uploading...', selfieVerified:'✅ Selfie verified — employers can see you!', aadhaar:'Aadhaar ID', uploadAadhaar:'Upload Aadhaar', uploaded:'Uploaded', verifiedBadge:'Get Verified Badge', submitting:'Submitting...', pendingReview:'⏳ Pending Review', requestVer:'Request Verification', emailVerified:'Email Verified', selfieVerifiedLabel:'Selfie Verified', aadhaarUploaded:'Aadhaar Uploaded', emailLabel:'Email', selfieLabel:'Selfie', aadhaarLabel:'Aadhaar', emailVerifiedBadge:'📧 Email Verified', emailBadge:'📧 Email', selfieVerifiedBadge:'🤳 Selfie Verified', selfieBadge:'🤳 Selfie', aadhaarUploadedBadge:'🪪 Aadhaar Uploaded', aadhaarBadge:'🪪 Aadhaar' },
    hi: { domesticJobs:'घरेलू', officeJobs:'ऑफिस / टेक्निकल', skilledJobs:'कुशल काम', deliveryJobs:'डिलीवरी', parttimeJobs:'पार्ट-टाइम', profile:'मेरी प्रोफ़ाइल', subtitle:'खाता और सत्यापन प्रबंधित करें', badges:'विश्वास बैज', basicInfo:'बुनियादी जानकारी', fullName:'पूरा नाम', email:'ईमेल', phone:'फ़ोन', location:'शहर', save:'सहेजें', saving:'सहेज रहा...', jobTypeQ:'आप किस तरह की नौकरी ढूंढ रहे हैं?', professionalOpt:'प्रोफेशनल नौकरियों के लिए वैकल्पिक विवरण:', resume:'रिज्यूमे', education:'शिक्षा', skills:'कौशल', experience:'अनुभव', optional:'(वैकल्पिक)', selfieVer:'सेल्फी सत्यापन', selfieDesc:'नियोक्ताओं को दिखाने के लिए सेल्फी लें', selfieDone:'✅ आप सेल्फी सत्यापित हैं!', takeSelfie:'सेल्फी लें', retake:'दोबारा लें', choosePhoto:'फ़ोटो चुनें', uploading:'अपलोड...', selfieVerified:'✅ सेल्फी सत्यापित — नियोक्ता आपको देख सकते हैं!', aadhaar:'आधार ID', uploadAadhaar:'आधार अपलोड', uploaded:'अपलोड हुआ', verifiedBadge:'✅ वेरिफ़ाइड बैज प्राप्त करें', submitting:'सबमिट...', pendingReview:'⏳ समीक्षा हो रही है', requestVer:'वेरिफिकेशन का अनुरोध करें' },
    kn: { domesticJobs:'ಮನೆ ಕೆಲಸ', officeJobs:'ಆಫೀಸ್ / ಟೆಕ್ನಿಕಲ್', skilledJobs:'ಕೌಶಲ್ಯ ಕೆಲಸ', deliveryJobs:'ಡೆಲಿವರಿ', parttimeJobs:'ಪಾರ್ಟ್-ಟೈಮ್', profile:'ನನ್ನ ಪ್ರೊಫೈಲ್', subtitle:'ಖಾತೆ ಮತ್ತು ಪರಿಶೀಲನೆ ನಿರ್ವಹಿಸಿ', badges:'ಟ್ರಸ್ಟ್ ಬ್ಯಾಡ್ಜ್', basicInfo:'ಮೂಲ ಮಾಹಿತಿ', fullName:'ಪೂರ್ಣ ಹೆಸರು', email:'ಇಮೇಲ್', phone:'ಮೊಬೈಲ್', location:'ನಗರ', save:'ಉಳಿಸಿ', saving:'ಉಳಿಸಲಾಗುತ್ತಿದೆ...', jobTypeQ:'ನೀವು ಯಾವ ರೀತಿಯ ಕೆಲಸ ಹುಡುಕುತ್ತಿದ್ದೀರಿ?', professionalOpt:'ವೃತ್ತಿಪರ ಕೆಲಸಗಳಿಗೆ ಐಚ್ಛಿಕ ವಿವರಗಳು:', resume:'ರೆಸ್ಯೂಮ್', education:'ಶಿಕ್ಷಣ', skills:'ಕೌಶಲ್ಯ', experience:'ಅನುಭವ', optional:'(ಐಚ್ಛಿಕ)', selfieVer:'ಸೆಲ್ಫಿ ಪರಿಶೀಲನೆ', selfieDesc:'ನಿಮ್ಮನ್ನು ತೋರಿಸಲು ಸೆಲ್ಫಿ ತೆಗೆಯಿರಿ', selfieDone:'✅ ನೀವು ಸೆಲ್ಫಿ ಪರಿಶೀಲಿಸಿದ್ದೀರಿ!', takeSelfie:'ಸೆಲ್ಫಿ ತೆಗೆಯಿರಿ', retake:'ಮರು ತೆಗೆಯಿರಿ', choosePhoto:'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ', uploading:'ಅಪ್ಲೋಡ್...', selfieVerified:'✅ ಸೆಲ್ಫಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ — ಉದ್ಯೋಗದಾತರು ನಿಮ್ಮನ್ನು ನೋಡಬಹುದು!', aadhaar:'ಆಧಾರ್ ID', uploadAadhaar:'ಆಧಾರ್ ಅಪ್ಲೋಡ್', uploaded:'ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿದೆ', verifiedBadge:'✅ ಪರಿಶೀಲಿತ ಬ್ಯಾಡ್ಜ್ ಪಡೆಯಿರಿ', submitting:'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...', pendingReview:'⏳ ಸಮೀಕ್ಷೆಯಲ್ಲಿದೆ', requestVer:'ಪರಿಶೀಲನೆ ಕೋರಿ' },
    te: { domesticJobs:'ఇంటి పనులు', officeJobs:'ఆఫీస్ / టెక్నికల్', skilledJobs:'నైపుణ్యం పనులు', deliveryJobs:'డెలివరీ', parttimeJobs:'పార్ట్-టైమ్', profile:'నా ప్రొఫైల్', subtitle:'ఖాతా మరియు ధృవీకరణ నిర్వహించండి', badges:'ట్రస్ట్ బ్యాడ్జ్', basicInfo:'ప్రాథమిక సమాచారం', fullName:'పూర్తి పేరు', email:'ఇమెయిల్', phone:'ఫోన్', location:'నగరం', save:'సేవ్', saving:'సేవ్ చేస్తోంది...', jobTypeQ:'మీరు ఏ రకమైన ఉద్యోగాలు వెతుకుతున్నారు?', professionalOpt:'ప్రొఫెషనల్ ఉద్యోగాలకు ఐచ్ఛిక వివరాలు:', resume:'రెజ్యూమ్', education:'చదువు', skills:'నైపుణ్యాలు', experience:'అనుభవం', optional:'(ఐచ్ఛికం)', selfieVer:'సెల్ఫీ ధృవీకరణ', selfieDesc:'యజమానులకు చూపించడానికి సెల్ఫీ తీయండి', selfieDone:'✅ మీరు సెల్ఫీ ధృవీకరించారు!', takeSelfie:'సెల్ఫీ తీయండి', retake:'మళ్లీ తీయండి', choosePhoto:'ఫోటో ఎంచుకోండి', uploading:'అప్‌లోడ్...', selfieVerified:'✅ సెల్ఫీ ధృవీకరించబడింది — యజమానులు మిమ్మల్ని చూడగలరు!', aadhaar:'ఆధార్ ID', uploadAadhaar:'ఆధార్ అప్‌లోడ్', uploaded:'అప్‌లోడ్ చేయబడింది', verifiedBadge:'✅ ధృవీకరించబడిన బ్యాడ్జ్ పొందండి', submitting:'సమర్పిస్తోంది...', pendingReview:'⏳ సమీక్షలో ఉంది', requestVer:'ధృవీకరణను అభ్యర్థించండి' },
    ta: { domesticJobs:'வீட்டு வேலை', officeJobs:'அலுவலக / டெக்னிகல்', skilledJobs:'திறமை வேலை', deliveryJobs:'டெலிவரி', parttimeJobs:'பார்ட்-டைம்', profile:'என் சுயவிவரம்', subtitle:'கணக்கு மற்றும் சரிபார்ப்பை நிர்வகிக்கவும்', badges:'நம்பக பேட்ஜ்', basicInfo:'அடிப்படை தகவல்', fullName:'முழு பெயர்', email:'மின்னஞ்சல்', phone:'மொபைல்', location:'நகரம்', save:'சேமி', saving:'சேமிக்கிறது...', jobTypeQ:'நீங்கள் என்ன வகையான வேலைகளை தேடுகிறீர்கள்?', professionalOpt:'தொழில் வேலைகளுக்கான விருப்ப விவரங்கள்:', resume:'ரெஸ்யூம்', education:'கல்வி', skills:'திறமைகள்', experience:'அனுபவம்', optional:'(விருப்பம்)', selfieVer:'செல்ஃபி சரிபார்ப்பு', selfieDesc:'முதலாளிகளுக்கு காட்ட செல்ஃபி எடுக்கவும்', selfieDone:'✅ நீங்கள் செல்ஃபி சரிபார்க்கப்பட்டீர்கள்!', takeSelfie:'செல்ஃபி எடு', retake:'மீண்டும் எடு', choosePhoto:'புகைப்படம் தேர்வு', uploading:'பதிவேற்றம்...', selfieVerified:'✅ செல்ஃபி சரிபார்க்கப்பட்டது — முதலாளிகள் உங்களைப் பார்க்கலாம்!', aadhaar:'ஆதார் ID', uploadAadhaar:'ஆதார் பதிவேற்று', uploaded:'பதிவேற்றப்பட்டது', verifiedBadge:'✅ சரிபார்க்கப்பட்ட பேட்ஜ் பெறுக', submitting:'சமர்ப்பிக்கிறது...', pendingReview:'⏳ மதிப்பாய்வில் உள்ளது', requestVer:'சரிபார்ப்பைக் கோருக' },
    mr: { domesticJobs:'घरगुती', officeJobs:'ऑफिस / टेक्निकल', skilledJobs:'कौशल्य काम', deliveryJobs:'डिलिव्हरी', parttimeJobs:'पार्ट-टाइम', profile:'माझे प्रोफाईल', subtitle:'खाते आणि सत्यापन व्यवस्थापित करा', badges:'विश्वास बॅज', basicInfo:'मूलभूत माहिती', fullName:'पूर्ण नाव', email:'ईमेल', phone:'मोबाईल', location:'शहर', save:'जतन करा', saving:'जतन करत आहे...', jobTypeQ:'तुम्ही कोणत्या प्रकारच्या नोकऱ्या शोधत आहात?', professionalOpt:'व्यावसायिक नोकऱ्यांसाठी ऐच्छिक तपशील:', resume:'रिझ्युमे', education:'शिक्षण', skills:'कौशल्ये', experience:'अनुभव', optional:'(ऐच्छिक)', selfieVer:'सेल्फी सत्यापन', selfieDesc:'नियोक्त्यांना दाखवण्यासाठी सेल्फी घ्या', selfieDone:'✅ तुम्ही सेल्फी सत्यापित आहात!', takeSelfie:'सेल्फी घ्या', retake:'पुन्हा घ्या', choosePhoto:'फोटो निवडा', uploading:'अपलोड...', selfieVerified:'✅ सेल्फी सत्यापित — नियोक्ते तुम्हाला पाहू शकतात!', aadhaar:'आधार ID', uploadAadhaar:'आधार अपलोड', uploaded:'अपलोड केले', verifiedBadge:'✅ सत्यापित बॅज मिळवा', submitting:'सबमिट करत आहे...', pendingReview:'⏳ पुनरावलोकन प्रतीक्षेत', requestVer:'सत्यापनाची विनंती करा' },
  };

  function t(key) { return (LANG[lang] || LANG.en)[key] || key; }

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    localStorage.setItem('jobType', jobType);
    setSaving(true);
    try {
      const { data } = await api.post('/auth/update-profile', { name, phone, location, jobType });
      login(data.user, data.token);
      addToast({ message: 'Profile updated!' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Update failed', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleUploadId = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('idProof', file);
      const { data } = await api.post('/auth/upload-id', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login(data.user, data.token);
      addToast({ message: 'ID uploaded!' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Upload failed', type: 'error' });
    } finally { setUploading(false); }
  };

  const handleUploadSelfie = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelfieUploading(true);
    try {
      const form = new FormData();
      form.append('selfie', file);
      const { data } = await api.post('/auth/upload-selfie', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login(data.user, data.token);
      addToast({ message: 'Selfie uploaded! You are now verified.' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Selfie upload failed', type: 'error' });
    } finally { setSelfieUploading(false); }
  };

  const handleRequestVerification = async () => {
    setRequesting(true);
    try {
      const { data } = await api.post('/auth/request-verification');
      login(data.user, data.token);
      addToast({ message: 'Verification requested! Admin will review.' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Could not request', type: 'error' });
    } finally { setRequesting(false); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('jobType');
    if (saved) setJobType(saved);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px', position: 'relative', zIndex: 1 }}>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 2px' }}>{t('profile')}</h1>
        <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>{t('subtitle')}</p>
        {/* Language bar */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:16 }}>
          {[
            { code:'en', label:'English' }, { code:'hi', label:'हिंदी' }, { code:'kn', label:'ಕನ್ನಡ' },
            { code:'te', label:'తెలుగు' }, { code:'ta', label:'தமிழ்' }, { code:'mr', label:'मराठी' }
          ].map(l => (
            <button key={l.code} onClick={() => setLang(l.code)} style={{
              padding:'4px 10px', borderRadius:14, border:`2px solid ${lang===l.code?'#1B2A4A':'rgba(27,42,74,0.08)'}`,
              background:lang===l.code?'#1B2A4A':'transparent', cursor:'pointer', fontSize:11, fontWeight:600,
              color:lang===l.code?'#fff':'#4A5F85', fontFamily:'DM Sans, sans-serif', transition:'all 0.15s',
            }}>{l.label}</button>
          ))}
        </div>

        {/* TRUST BADGES */}
        <div className="card-classic" style={{ padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 8 }}>🛡️ {t('badges')}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: user?.emailVerified ? '#E8F5E9' : '#FFF8E1', color: user?.emailVerified ? '#2E7D32' : '#F57F17', fontWeight: 600 }}>
              📧 {user?.emailVerified ? t('emailVerifiedBadge') : t('emailBadge')}
            </span>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: user?.selfieVerified ? '#E8F5E9' : '#F5F5F5', color: user?.selfieVerified ? '#2E7D32' : '#9E9E9E', fontWeight: 600 }}>
              🤳 {user?.selfieVerified ? t('selfieVerifiedBadge') : t('selfieBadge')}
            </span>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: user?.idProof ? '#E8F5E9' : '#F5F5F5', color: user?.idProof ? '#2E7D32' : '#9E9E9E', fontWeight: 600 }}>
              🪪 {user?.idProof ? t('aadhaarUploadedBadge') : t('aadhaarBadge')}
            </span>
          </div>
        </div>

        {/* PROFILE FORM */}
        <div className="card-classic" style={{ padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: '#1B2A4A', margin: '0 0 16px' }}>{t('basicInfo')}</h2>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{t('fullName')}</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('fullName')} className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{t('email')}</label>
              <input type="email" value={user?.email || ''} disabled className="input-field" style={{ opacity: 0.6 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{t('phone')}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('phone')} className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{t('location')}</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder={t('location')} className="input-field" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', padding: '14px 0' }}>
              {saving ? t('saving') : t('save')}
            </button>
          </form>
        </div>

        {/* WHAT TYPE OF JOBS? - Adaptive Onboarding */}
        <div className="card-classic" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2A4A', marginBottom: 10 }}>🔍 {t('jobTypeQ')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[
              { type: 'domestic', icon: '🏠', key: 'domesticJobs' },
              { type: 'office', icon: '💼', key: 'officeJobs' },
              { type: 'skilled', icon: '🔧', key: 'skilledJobs' },
              { type: 'delivery', icon: '🚚', key: 'deliveryJobs' },
              { type: 'parttime', icon: '⏰', key: 'parttimeJobs' },
            ].map(jt => (
              <button key={jt.type} onClick={() => { setJobType(jt.type); localStorage.setItem('jobType', jt.type); }} style={{
                padding: '10px 4px', borderRadius: 10, border: `2px solid ${jobType === jt.type ? '#1B2A4A' : 'rgba(27,42,74,0.08)'}`,
                background: jobType === jt.type ? 'rgba(27,42,74,0.04)' : '#FAF8F6', cursor: 'pointer', textAlign: 'center',
                fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: jobType === jt.type ? '#1B2A4A' : '#4A5F85', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 2 }}>{jt.icon}</span>{t(jt.key)}
              </button>
            ))}
          </div>
          {/* Adaptive fields — shown only for Office/Technical jobs */}
          <div style={{ display: jobType === 'office' ? 'block' : 'none', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(27,42,74,0.06)' }}>
            <div style={{ fontSize: 12, color: '#4A5F85', marginBottom: 8 }}>{t('professionalOpt')}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#4A5F85', marginBottom: 3 }}>📄 {t('resume')} <span style={{ fontWeight: 400, color: '#8B9BB5' }}>{t('optional')}</span></div>
            <input type="file" accept=".pdf,.doc,.docx" className="big-input" onChange={() => {}} style={{ marginBottom: 8, padding: '8px 12px', fontSize: 13 }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: '#4A5F85', marginBottom: 3 }}>🎓 {t('education')} <span style={{ fontWeight: 400, color: '#8B9BB5' }}>{t('optional')}</span></div>
            <input className="big-input" type="text" placeholder="e.g. 10th pass, Diploma, Degree" style={{ marginBottom: 8, padding: '8px 12px', fontSize: 13 }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: '#4A5F85', marginBottom: 3 }}>⚡ {t('skills')} <span style={{ fontWeight: 400, color: '#8B9BB5' }}>{t('optional')}</span></div>
            <input className="big-input" type="text" placeholder="e.g. Computer, Typing, English" style={{ marginBottom: 8, padding: '8px 12px', fontSize: 13 }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: '#4A5F85', marginBottom: 3 }}>💼 {t('experience')} <span style={{ fontWeight: 400, color: '#8B9BB5' }}>{t('optional')}</span></div>
            <input className="big-input" type="text" placeholder="e.g. 2 years in sales" style={{ padding: '8px 12px', fontSize: 13 }} />
          </div>
        </div>

        {/* SELFIE VERIFICATION */}
        <div className="card-classic" style={{ padding: 16, marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 700, color: '#1B2A4A', margin: '0 0 4px' }}>🤳 {t('selfieVer')}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(27,42,74,0.45)', marginBottom: 10 }}>
            {user?.selfieVerified ? t('selfieDone') : t('selfieDesc')}
          </p>
          {user?.selfie && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <img src={`${user.selfie}`} alt="Your selfie"
                style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid #C4A882', cursor: 'pointer' }}
                onClick={() => selfieCamRef.current?.click()}
                onError={(e) => { e.target.style.display = 'none' }} />
            </div>
          )}
          <input ref={selfieRef} type="file" accept="image/*" onChange={handleUploadSelfie} style={{ display: 'none' }} />
          <input ref={selfieCamRef} type="file" accept="image/*" capture="user" onChange={handleUploadSelfie} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => selfieCamRef.current?.click()} disabled={selfieUploading} style={{
              flex: 1, minWidth: 120, padding: '14px 12px', borderRadius: 12, border: '2px dashed rgba(27,42,74,0.15)',
              background: user?.selfieVerified ? '#E8F5E9' : '#FFF8E1', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#1B2A4A',
            }}>
              <span style={{ fontSize: 28 }}>🤳</span>
              {selfieUploading ? t('uploading') : user?.selfie ? t('retake') : t('takeSelfie')}
            </button>
            {!user?.selfie && (
              <button onClick={() => selfieRef.current?.click()} disabled={selfieUploading} style={{
                flex: 1, minWidth: 120, padding: '14px 12px', borderRadius: 12, border: '2px dashed rgba(27,42,74,0.15)',
                background: '#FAF8F6', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#1B2A4A',
              }}>
                <span style={{ fontSize: 28 }}>🖼️</span>
                {t('choosePhoto')}
              </button>
            )}
          </div>
          {user?.selfieVerified && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#2E7D32', fontWeight: 600, marginTop: 12, textAlign: 'center' }}>{t('selfieVerified')}</p>
          )}
        </div>

        {/* ID UPLOAD - optional, compact */}
        <div className="card-classic" style={{ padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>🪪</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: '#1B2A4A' }}>{t('aadhaar')}</span>
            <span style={{ fontSize: 11, color: '#8B9BB5', fontWeight: 400 }}>{t('optional')}</span>
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleUploadId} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              padding: '8px 16px', borderRadius: 8, border: '1.5px solid rgba(27,42,74,0.1)',
              background: user?.idProof ? '#E8F5E9' : '#FAF8F6', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#1B2A4A',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {uploading ? '⏳' : user?.idProof ? '✅' : '📁'} {uploading ? t('uploading') : user?.idProof ? t('uploaded') : t('uploadAadhaar')}
            </button>
          </div>
        </div>

        {/* REQUEST VERIFICATION */}
        {vs !== 'verified' && (
          <div className="card-classic" style={{ padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>✅ {t('verifiedBadge')}</div>
            <button onClick={handleRequestVerification} disabled={requesting} className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>
              {requesting ? t('submitting') : user?.verificationStatus === 'pending' ? t('pendingReview') : t('requestVer')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
