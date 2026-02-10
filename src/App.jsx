import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import Papa from 'papaparse';

// --- IMPORTANTE: INCOLLA QUI SOTTO IL TUO LINK CSV ---
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
    html, body {
      margin: 0;
      padding: 0;
      background-color: ${COLORS.bg};
      width: 100%;
      overscroll-behavior-y: none; /* Blocca il rimbalzo elastico */
      -webkit-tap-highlight-color: transparent; /* Toglie il flash blu al tocco */
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
  // Gestione sicura del prezzo
  const safePrice = price ? price.toString().replace(',', '.') : "0";
  const formattedPrice = parseFloat(safePrice).toFixed(2).replace('.', ',');

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px 0', // Ridotto leggermente il padding per meno scroll
      borderBottom: `1px solid rgba(244, 241, 234, 0.08)`,
      width: '100%'
    }}>
      <div style={{ flex: 1, paddingRight: '15px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: COLORS.text, fontWeight: '600', fontFamily: 'sans-serif' }}>{name}</h3>
        <p style={{ margin: 0, fontSize: '13px', color: COLORS.textMuted, lineHeight: '1.4' }}>{desc}</p>
      </div>
      <div style={{ fontWeight: '700', fontSize: '17px', color: COLORS.accent, whiteSpace: 'nowrap' }}>
        {formattedPrice}€
      </div>
    </div>
  );
};

const CategoryPage = ({ menuData }) => {
  const { id } = useParams();
  const items = menuData ? (menuData[id] || []) : [];

  return (
    <div style={{ minHeight: '100dvh', width: '100%', padding: '0 20px', backgroundColor: COLORS.bg }}>
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', paddingTop: '30px', paddingBottom: '50px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: COLORS.accent, fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', display: 'inline-block', marginBottom: '25px', textTransform: 'uppercase' }}>
          ← Indietro
        </Link>
        <h1 style={{ 
          fontFamily: 'serif', color: COLORS.text, fontSize: '32px', marginBottom: '30px',
          textTransform: 'capitalize', borderLeft: `4px solid ${COLORS.accent}`, paddingLeft: '15px', textAlign: 'left'
        }}>
          {id ? id.replace(/-/g, ' ') : 'Caricamento...'}
        </h1>
        <div>
          {items.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = ({ menuData }) => {
  const categories = menuData ? Object.keys(menuData) : [];

  return (
    <div style={{ 
      width: '100%',
      minHeight: '100dvh', // Usa l'altezza dinamica moderna
      backgroundColor: COLORS.bg,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <header style={{ marginBottom: '50px' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '48px', margin: 0, color: COLORS.text, letterSpacing: '2px' }}>Le Radici</h1>
          <div style={{ height: '2px', width: '50px', backgroundColor: COLORS.accent, margin: '15px auto' }}></div>
          <p style={{ color: COLORS.textMuted, fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase' }}>Rovereto</p>
        </header>

        {/* Verifica se il link è rotto */}
        {categories.length === 0 ? (
          <div style={{ color: COLORS.accent, border: `1px solid ${COLORS.accent}`, padding: '20px', borderRadius: '8px' }}>
            {menuData === null ? "Caricamento Menu..." : "Nessun prodotto trovato. Controlla il Link CSV!"}
          </div>
        ) : (
          <main style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categories.map(catId => (
              <Link key={catId} to={`/category/${catId}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '24px', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px',
                  borderRadius: '16px', 
                  backgroundColor: COLORS.surface, // Rimossa la sfumatura pesante per performance
                  color: COLORS.text,
                  border: `1px solid rgba(197, 160, 89, 0.3)`,
                  fontFamily: 'sans-serif',
                  transform: 'translateZ(0)' // Forza l'accelerazione hardware
                }}>
                  {catId.replace(/-/g, ' ')}
                </div>
              </Link>
            ))}
          </main>
        )}

        <footer style={{ marginTop: '60px', color: COLORS.textMuted, fontSize: '10px', letterSpacing: '2px', opacity: 0.7 }}>
          &copy; 2026 LE RADICI ROVERETO
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    // Se non c'è il link, non provare nemmeno a caricare
    if (SHEET_URL === "INCOLLA_QUI_IL_TUO_LINK_CSV") {
        setMenuData({}); // Mette un oggetto vuoto per mostrare l'avviso
        return;
    }

    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true, // Salta le righe vuote automaticamente
      complete: (results) => {
        const groupedData = {};
        results.data.forEach(item => {
          if (!item.category) return;
          const cat = item.category.trim().toLowerCase().replace(/\s+/g, '-');
          if (!groupedData[cat]) groupedData[cat] = [];
          groupedData[cat].push(item);
        });
        setMenuData(groupedData);
      },
      error: (err) => {
          console.error("Errore nel caricamento:", err);
          setMenuData({});
      }
    });
  }, []);

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