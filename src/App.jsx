import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import Papa from 'papaparse';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_PTFlGYO25K83M-Eo8_toJR03s0pCW5Yk9b7RfR2_ErR0wmu_9h7DF06pnojg-hah11ndjGyzszep/pub?output=csv";

const COLORS = {
  bg: '#1B2623',
  surface: '#2A3431',
  accent: '#C5A059',
  text: '#F4F1EA',
  textMuted: '#9DA6A2'
};

const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      background-color: ${COLORS.bg}; 
      width: 100%; 
      overflow-x: hidden; 
      -webkit-font-smoothing: antialiased;
    }
    #root { width: 100%; }
  `}</style>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- COMPONENTI ---

const MenuItem = ({ name, desc, price }) => {
  // Logica per i prezzi: trasforma 4.5 in 4,50 e aggiunge €
  const formattedPrice = parseFloat(price.toString().replace(',', '.'))
    .toFixed(2)
    .replace('.', ',');

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '24px 0',
      borderBottom: `1px solid rgba(244, 241, 234, 0.08)`,
      width: '100%'
    }}>
      <div style={{ flex: 1, paddingRight: '20px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: COLORS.text, fontWeight: '600', fontFamily: 'Inter' }}>{name}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: COLORS.textMuted, lineHeight: '1.6', fontStyle: 'italic' }}>{desc}</p>
      </div>
      <div style={{ fontWeight: '700', fontSize: '18px', color: COLORS.accent, fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
        {formattedPrice}€
      </div>
    </div>
  );
};

const CategoryPage = ({ menuData }) => {
  const { id } = useParams();
  const items = menuData[id] || [];

  return (
    <div style={{ 
      backgroundColor: COLORS.bg, 
      minHeight: '100vh', 
      width: '100%',
      padding: '0 20px' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        margin: '0 auto', // Centra il blocco senza usare Flexbox (evita vibrazioni)
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: COLORS.accent, fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', display: 'inline-block', marginBottom: '30px', textTransform: 'uppercase' }}>
          ← TORNA AL MENU
        </Link>
        <h1 style={{ 
          fontFamily: 'Playfair Display', color: COLORS.text, fontSize: '38px', marginBottom: '40px',
          textTransform: 'capitalize', borderLeft: `5px solid ${COLORS.accent}`, paddingLeft: '20px', textAlign: 'left'
        }}>
          {id.replace(/-/g, ' ')}
        </h1>
        <div style={{ width: '100%' }}>
          {items.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = ({ menuData }) => {
  const categories = Object.keys(menuData);

  return (
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.bg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Centra i bottoni nella Home
      alignItems: 'center',
      padding: '60px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <header style={{ marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '52px', margin: 0, color: COLORS.text, letterSpacing: '3px' }}>Le Radici</h1>
          <div style={{ height: '2px', width: '60px', backgroundColor: COLORS.accent, margin: '20px auto' }}></div>
          <p style={{ color: COLORS.textMuted, fontSize: '13px', letterSpacing: '5px', textTransform: 'uppercase' }}>Rovereto</p>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {categories.map(catId => (
            <Link key={catId} to={`/category/${catId}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '28px', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px',
                borderRadius: '20px', background: `linear-gradient(145deg, ${COLORS.surface}, #151d1b)`, color: COLORS.text,
                border: `1px solid rgba(197, 160, 89, 0.2)`, boxShadow: '0 12px 24px rgba(0,0,0,0.4)', fontFamily: 'Inter'
              }}>
                {catId.replace(/-/g, ' ')}
              </div>
            </Link>
          ))}
        </main>

        <footer style={{ marginTop: '80px', color: COLORS.textMuted, fontSize: '10px', letterSpacing: '2px' }}>
          &copy; 2026 LE RADICI ROVERETO
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const groupedData = {};
        results.data.forEach(item => {
          if (!item.category) return;
          const cat = item.category.trim().toLowerCase().replace(/\s+/g, '-');
          if (!groupedData[cat]) groupedData[cat] = [];
          groupedData[cat].push(item);
        });
        setMenuData(groupedData);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg, color: COLORS.accent }}>
        <p style={{ fontFamily: 'Inter', letterSpacing: '2px' }}>CARICAMENTO MENU...</p>
      </div>
    );
  }

  return (
    <Router>
      <GlobalStyles />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home menuData={menuData} />} />
        <Route path="/category/:id" element={<CategoryPage menuData={menuData} />} />
      </Routes>
    </Router>
  );
}