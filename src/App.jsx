import React, { useEffect, useState, useCallback } from 'react';
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
    html, body {
      margin: 0;
      padding: 0;
      background-color: ${COLORS.bg};
      width: 100%;
      overscroll-behavior-y: none; /* Cambiato in none per gestire noi il refresh */
      -webkit-tap-highlight-color: transparent;
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #root { width: 100%; }
  `}</style>
);

// --- COMPONENTI ---

const MenuItem = ({ name, desc, price }) => {
  const safePrice = price ? price.toString().replace(',', '.') : "0";
  const formattedPrice = parseFloat(safePrice).toFixed(2).replace('.', ',');

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px 0',
      borderBottom: `1px solid rgba(244, 241, 234, 0.08)`,
      width: '100%'
    }}>
      <div style={{ flex: 1, paddingRight: '15px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: COLORS.text, fontWeight: '600' }}>{name}</h3>
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
    <div style={{ minHeight: '100dvh', width: '100%', padding: '0 20px' }}>
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
      minHeight: '100dvh',
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

        {categories.length === 0 ? (
          <div style={{ color: COLORS.accent, border: `1px solid ${COLORS.accent}`, padding: '20px', borderRadius: '8px' }}>
            {menuData === null ? "Caricamento Menu..." : "Nessun prodotto trovato."}
          </div>
        ) : (
          <main style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categories.map(catId => (
              <Link key={catId} to={`/category/${catId}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '24px', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px',
                  borderRadius: '16px', backgroundColor: COLORS.surface, color: COLORS.text,
                  border: `1px solid rgba(197, 160, 89, 0.3)`, transform: 'translateZ(0)'
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

// --- APP PRINCIPALE ---

export default function App() {
  const [menuData, setMenuData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  // Funzione per caricare i dati (usata al mount e al refresh)
  const loadMenu = useCallback(() => {
    if (SHEET_URL === "INCOLLA_QUI_IL_TUO_LINK_CSV") return;
    
    setIsRefreshing(true);
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const groupedData = {};
        results.data.forEach(item => {
          if (!item.category) return;
          const cat = item.category.trim().toLowerCase().replace(/\s+/g, '-');
          if (!groupedData[cat]) groupedData[cat] = [];
          groupedData[cat].push(item);
        });
        setMenuData(groupedData);
        // Ritardo estetico per non far sparire subito lo spinner
        setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
        }, 800);
      },
      error: () => {
        setIsRefreshing(false);
        setPullDistance(0);
        setMenuData({});
      }
    });
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Gestione Touch
  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStart === 0 || window.scrollY > 0) return;

    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;

    if (distance > 0) {
      // Resistenza: più tiri, più diventa duro (max 70px)
      const easedDistance = Math.min(distance * 0.4, 70);
      setPullDistance(easedDistance);
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 50) {
      loadMenu();
    } else {
      setPullDistance(0);
    }
    setTouchStart(0);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', width: '100%', backgroundColor: COLORS.bg }}
    >
      <Router>
        <GlobalStyles />
        
        {/* Spinner di Refresh */}
        <div style={{
          height: isRefreshing ? '60px' : `${pullDistance}px`,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
          transition: isRefreshing ? 'height 0.3s' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: COLORS.bg,
          width: '100%',
          position: isRefreshing ? 'relative' : 'absolute',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: `2px solid ${COLORS.surface}`,
            borderTop: `2px solid ${COLORS.accent}`,
            borderRadius: '50%',
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
            transform: `rotate(${pullDistance * 5}deg)`
          }} />
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>

        <Routes>
          <Route path="/" element={<Home menuData={menuData} />} />
          <Route path="/category/:id" element={<CategoryPage menuData={menuData} />} />
        </Routes>
      </Router>
    </div>
  );
}