import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const themeColor = '#6a8273';

const LandingPage = () => {
  const [blurEnabled, setBlurEnabled] = useState(true);
  const blurIntensity = 3;

  const heroStyle = {
    background: 'url("/images/clinic-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '70vh',
    width: '100vw',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const darkOverlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 1,
  };

  const blurredBackgroundStyle = {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    background: 'url("/images/clinic-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: `blur(${blurIntensity}px)`,
    zIndex: 0,
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div style={heroStyle}>
        {blurEnabled && <div style={blurredBackgroundStyle}></div>}
        <div style={darkOverlay}></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '30px 35px',
                borderRadius: '15px',
                backdropFilter: 'blur(5px)',
              }}>
                <h1 className="display-3 fw-bold" style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  Welcome to <span style={{ color: '#a8c5b5' }}>Trajkovski Dent</span>
                </h1>
                <p className="lead mt-3" style={{ color: '#e0e0e0', textShadow: '1px 1px 3px rgba(0,0,0,0.8)', fontSize: '1.25rem' }}>
                  Your family's comfort is our priority. We provide gentle, comprehensive dental care 
                  for patients of all ages in a warm and friendly environment.
                </p>
                <div className="mt-4">
                  <Link to="/register" className="btn btn-lg me-3 shadow text-white" style={{ backgroundColor: themeColor, border: 'none' }}>
                    Book an Appointment
                  </Link>
                  <a href="#services" className="btn btn-outline-light btn-lg me-3">
                    Our Services
                  </a>
                  <a href="#contact" className="btn btn-outline-light btn-lg">
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src="/images/family-dental.png"
                alt="Family dental care"
                className="img-fluid rounded-circle shadow"
                style={{ maxWidth: '350px', border: `4px solid ${themeColor}` }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div id="services" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: themeColor }}>Our Dental Services</h2>
            <p className="text-muted mt-2">Complete care for the whole family</p>
          </div>
          <div className="row g-4">
            {[
              { icon: '🔍', title: 'Basic Check-up', desc: 'Routine exams and cleanings', duration: '20 min' },
              { icon: '🦷', title: 'Cavity Filling', desc: 'Tooth-colored fillings', duration: '30 min' },
              { icon: '✨', title: 'Deep Cleaning', desc: 'Scaling and root planing', duration: '40 min' },
              { icon: '🦷', title: 'Tooth Extraction', desc: 'Gentle extractions', duration: '45 min' },
              { icon: '🔧', title: 'Root Canal', desc: 'Save your natural tooth', duration: '60 min' },
              { icon: '👶', title: 'Pediatric Care', desc: 'Child-friendly treatments', duration: 'Varies' },
            ].map((service, idx) => (
              <div key={idx} className="col-md-4 col-lg-4">
                <div className="card h-100 shadow-sm border-0 hover-effect">
                  <div className="card-body text-center">
                    <div className="display-4 mb-3">{service.icon}</div>
                    <h5 className="card-title">{service.title}</h5>
                    <p className="card-text text-muted">{service.desc}</p>
                    <span className="badge text-white" style={{ backgroundColor: themeColor }}>{service.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT US / WHY CHOOSE US */}
      <div className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="/images/clinic-interior.jpg"
                alt="Modern clinic interior"
                className="img-fluid rounded shadow"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3" style={{ color: themeColor }}>Why Families Trust Trajkovski Dent</h2>
              <ul className="list-unstyled">
                {[
                  'Experienced team with over 15 years of practice',
                  'State-of-the-art equipment and modern techniques',
                  'Warm, welcoming atmosphere for children and adults',
                  'Flexible scheduling and emergency appointments',
                  'Affordable payment plans and insurance accepted',
                ].map((item, i) => (
                  <li key={i} className="mb-2">
                    <span style={{ color: themeColor }} className="me-2">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-lg text-white shadow mt-3" style={{ backgroundColor: themeColor, border: 'none' }}>
                Join Our Family of Patients
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: themeColor }}>What Our Patients Say</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Stefan T.', text: 'The whole team is amazing! My kids actually look forward to dentist visits now.' },
              { name: 'Toni Z.', text: 'Professional and gentle. I had a root canal done with almost no discomfort.' },
              { name: 'Ana A.', text: 'Very clean and modern office. They really care about your comfort.' },
            ].map((t, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <p className="card-text fst-italic">"{t.text}"</p>
                    <footer className="blockquote-footer mt-2">{t.name}</footer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT & MAP */}
      <div id="contact" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <h2 className="fw-bold" style={{ color: themeColor }}>Get In Touch</h2>
              <div className="card shadow-sm">
                <div className="card-body">
                  <p><strong>📍 Address:</strong> Vasko Karanǵelevski 41, Bitola 7000</p>
                  <p><strong>📞 Phone:</strong> (389) 78-358-446</p>
                  <p><strong>✉️ Email:</strong> info@trajkovskident.mk</p>
                  <p><strong>🕐 Hours:</strong> Mon–Fri 09:00 – 17:00</p>
                  <div className="mt-3">
                    <a href="tel:+38978358446" className="btn me-2 text-white" style={{ backgroundColor: themeColor, border: 'none' }}>Call Now</a>
                    <a href="mailto:info@trajkovskident.mk" className="btn text-white" style={{ backgroundColor: '#5a6e63' }}>Email Us</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold" style={{ color: themeColor }}>Our Location</h2>
              <div className="ratio ratio-4x3 shadow-sm rounded overflow-hidden">
                <iframe
                  title="Trajkovski Dent Location"
                  src="https://maps.google.com/maps?width=600&amp;height=450&amp;hl=en&amp;q=Vasko%20Karang%CC%81elevski%2041,%20Bitola%207000%20Bitola+(Trajkovski%20Dent)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-white py-4" style={{ backgroundColor: '#4a5d52' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Trajkovski Dent</h5>
              <p className="small">Family dental care you can rely on.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="small mb-0">© {new Date().getFullYear()} Trajkovski Dent. All rights reserved.</p>
              <p className="small">Designed for your family's smile.</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .hover-effect:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;