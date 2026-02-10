import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';

const menuData = {
  "succhi": [
    { name: "Spremuta d'Arancia", desc: "Arance fresche di stagione", price: "4.50" },
    { name: "Ace", desc: "Arancia, carota e limone", price: "3.50" },
    { name: "Succo alla Pera", desc: "Nettare di pera Williams", price: "3.00" },
    { name: "Succo alla Pesca", desc: "Nettare di pesca nettarina", price: "3.00" },
    { name: "Succo all'Ananas", desc: "100% ananas senza zuccheri", price: "3.00" },
    { name: "Succo di Mela", desc: "Mela limpida del Trentino", price: "3.00" },
    { name: "Mirtillo", desc: "Mirtilli neri di bosco", price: "3.50" },
    { name: "Pompelmo Rosa", desc: "Gusto aspro e rinfrescante", price: "3.50" },
    { name: "Melograno", desc: "Ricco di antiossidanti", price: "4.00" },
    { name: "Albicocca", desc: "Dolce e vellutato", price: "3.00" },
    { name: "Pomodoro Condito", desc: "Sale, pepe, tabasco e limone", price: "4.50" },
    { name: "Tropical", desc: "Mix di frutti esotici", price: "3.50" },
    { name: "Mela e Bergamotto", desc: "Mix aromatico e fresco", price: "4.00" },
    { name: "Spremuta di Pompelmo", desc: "Frizzante e amara", price: "4.50" },
    { name: "Succo al Mango", desc: "Denso e profumato", price: "3.50" }
  ],
  "vini": [
    { name: "Marzemino", desc: "Rosso tipico di Rovereto, morbido", price: "4.50" },
    { name: "Teroldego Rotaliano", desc: "Rosso strutturato e intenso", price: "5.00" },
    { name: "Gewürztraminer", desc: "Bianco aromatico dell'Alto Adige", price: "5.50" },
    { name: "Lagrein Rosato", desc: "Fresco, note di frutti rossi", price: "5.00" },
    { name: "Trento DOC", desc: "Bollicine metodo classico locale", price: "7.00" },
    { name: "Prosecco Superiore", desc: "Extra dry, note floreali", price: "4.50" },
    { name: "Chardonnay", desc: "Bianco fermo, elegante", price: "4.00" },
    { name: "Pinot Grigio", desc: "Fresco e minerale", price: "4.50" },
    { name: "Müller Thurgau", desc: "Note di erbe alpine", price: "4.50" },
    { name: "Cabernet Sauvignon", desc: "Rosso internazionale, speziato", price: "5.50" },
    { name: "Merlot del Trentino", desc: "Fruttato e facile da bere", price: "4.50" },
    { name: "Sauvignon Blanc", desc: "Note di peperone e frutta esotica", price: "5.50" },
    { name: "Amarone della Valpolicella", desc: "Vino da meditazione (Calice)", price: "12.00" },
    { name: "Schiava", desc: "Rosso leggero, servito fresco", price: "4.00" },
    { name: "Franciacorta", desc: "Bollicine eleganti della Lombardia", price: "8.00" }
  ],
  "drink-alcolici": [
    { name: "Negroni", desc: "Gin, Vermouth Rosso, Campari", price: "8.00" },
    { name: "Spritz Aperol", desc: "Aperol, Prosecco, Soda", price: "4.50" },
    { name: "Spritz Campari", desc: "Campari, Prosecco, Soda", price: "5.00" },
    { name: "Mojito", desc: "Rum Bianco, Menta, Lime, Zucchero", price: "7.50" },
    { name: "Moscow Mule", desc: "Vodka, Ginger Beer, Lime", price: "8.00" },
    { name: "Gin Tonic", desc: "Gin Premium e Tonica Dry", price: "9.00" },
    { name: "Margarita", desc: "Tequila, Triple Sec, Succo di Lime", price: "8.00" },
    { name: "Americano", desc: "Campari, Vermouth Rosso, Soda", price: "7.00" },
    { name: "Espresso Martini", desc: "Vodka, Caffè, Liquore al caffè", price: "8.50" },
    { name: "Old Fashioned", desc: "Bourbon, Angostura, Zucchero", price: "9.00" },
    { name: "Whiskey Sour", desc: "Bourbon, Succo di Limone, Albume", price: "8.50" },
    { name: "Daiquiri", desc: "Rum, Lime, Sciroppo di zucchero", price: "7.50" },
    { name: "London Mule", desc: "Gin, Ginger Beer, Lime", price: "8.00" },
    { name: "Paloma", desc: "Tequila, Soda al Pompelmo, Lime", price: "8.50" },
    { name: "Boulevardier", desc: "Bourbon, Campari, Vermouth Rosso", price: "9.00" }
  ],
  "drink-analcolici": [
    { name: "Virgin Mojito", desc: "Lime, Menta, Ginger Ale", price: "6.00" },
    { name: "Shirley Temple", desc: "Ginger Ale, Granatina", price: "5.50" },
    { name: "Crodino", desc: "L'analcolico biondo", price: "3.50" },
    { name: "Sanbitter Rosso", desc: "Gusto amaro classico", price: "3.50" },
    { name: "Fruit Punch", desc: "Mix di succhi di frutta e granatina", price: "6.00" },
    { name: "Virgin Mary", desc: "Succo di pomodoro condito", price: "6.50" },
    { name: "Lemon Soda", desc: "Limonata gassata fresca", price: "3.50" },
    { name: "Ginger Beer", desc: "Zenzero piccante e rinfrescante", price: "4.00" },
    { name: "Florida", desc: "Pompelmo, Arancia, Limone, Zucchero", price: "6.00" },
    { name: "Tè Freddo alla Pesca", desc: "Fatto in casa con menta fresca", price: "4.00" },
    { name: "Tè Freddo al Limone", desc: "Fatto in casa con scorza di limone", price: "4.00" },
    { name: "Sunset", desc: "Arancia e granatina", price: "5.50" },
    { name: "No-Groni", desc: "Distillato analcolico, bitter e vermouth", price: "7.00" },
    { name: "Hugo Zero", desc: "Sambuco, Seltz, Menta analcolico", price: "5.00" },
    { name: "Cedrata", desc: "Classica Tassoni", price: "3.50" }
  ],
  "birre": [
    { name: "Pilsner Urquell", desc: "Chiara, amara, alla spina (0.3L)", price: "4.50" },
    { name: "Hacker-Pschorr Weiss", desc: "Birra di frumento non filtrata", price: "5.50" },
    { name: "IPA Artigianale", desc: "Luppolata e intensa", price: "6.00" },
    { name: "Guinness", desc: "Stout scura irlandese", price: "6.00" },
    { name: "Birra Moretti", desc: "Lager italiana classica", price: "3.50" },
    { name: "Ichnusa Non Filtrata", desc: "Corposa e velata", price: "4.50" },
    { name: "Radler", desc: "Birra e limonata", price: "4.00" },
    { name: "Analcolica", desc: "Tutto il gusto, zero alcol", price: "4.00" },
    { name: "Leffe Blonde", desc: "Belga d'abbazia, ambrata", price: "5.50" },
    { name: "Duvel", desc: "Belga strong ale (Bottiglia)", price: "7.00" },
    { name: "Forst Kronen", desc: "Tipica del Trentino-Alto Adige", price: "4.00" },
    { name: "Corona", desc: "Servita con fetta di lime", price: "5.00" },
    { name: "Tennent's Super", desc: "Strong lager doppio malto", price: "5.50" },
    { name: "Blanche de Bruxelles", desc: "Frescissima con scorza d'arancia", price: "6.00" },
    { name: "Birra Locale Rovereto", desc: "Prodotta da micro-birrificio", price: "6.50" }
  ]
};

const COLORS = {
  bg: '#1B2623',
  surface: '#2A3431',
  accent: '#C5A059',
  text: '#F4F1EA',
  textMuted: '#9DA6A2'
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- COMPONENTI ---

const MenuItem = ({ name, desc, price }) => (
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
      {price}€
    </div>
  </div>
);

const CategoryPage = () => {
  const { id } = useParams();
  const items = menuData[id] || [];

  return (
    <div style={{ 
      backgroundColor: COLORS.bg, 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center', // CORREZIONE: Forza l'allineamento centrale
      padding: '0 20px' // CORREZIONE: Aggiunge padding laterale di sicurezza
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: COLORS.accent, fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', display: 'inline-block', marginBottom: '30px' }}>
          ← TORNA AL MENU
        </Link>
        <h1 style={{ 
          fontFamily: 'Playfair Display', 
          color: COLORS.text, 
          fontSize: '38px', 
          marginBottom: '40px',
          textTransform: 'capitalize',
          borderLeft: `5px solid ${COLORS.accent}`,
          paddingLeft: '20px',
          textAlign: 'left'
        }}>
          {id.replace('-', ' ')}
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

const Home = () => {
  const categories = [
    { id: 'succhi', label: 'Succhi' },
    { id: 'vini', label: 'Vini' },
    { id: 'drink-alcolici', label: 'Drink Alcolici' },
    { id: 'drink-analcolici', label: 'Drink Analcolici' },
    { id: 'birre', label: 'Birre' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: COLORS.bg, 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 20px' // CORREZIONE: Padding laterale per evitare che tocchi i bordi
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        paddingTop: '60px', 
        paddingBottom: '60px',
        textAlign: 'center'
      }}>
        <header style={{ marginBottom: '60px' }}>
          <h1 style={{ 
            fontFamily: 'Playfair Display', 
            fontSize: '52px', 
            margin: 0, 
            color: COLORS.text, 
            letterSpacing: '3px' 
          }}>Le Radici</h1>
          <div style={{ height: '2px', width: '60px', backgroundColor: COLORS.accent, margin: '20px auto' }}></div>
          <p style={{ color: COLORS.textMuted, fontSize: '13px', letterSpacing: '5px', textTransform: 'uppercase' }}>Rovereto</p>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '28px',
                fontSize: '15px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                borderRadius: '20px',
                background: `linear-gradient(145deg, ${COLORS.surface}, #151d1b)`,
                color: COLORS.text,
                border: `1px solid rgba(197, 160, 89, 0.2)`,
                boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
                fontFamily: 'Inter',
                transition: 'all 0.2s ease'
              }}>
                {cat.label}
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
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}