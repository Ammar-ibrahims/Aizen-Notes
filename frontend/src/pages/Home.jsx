import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products')
      .then(res => setFeatured(res.data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero-layout" style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 24px', minHeight: '85vh', position: 'relative' }}>
        <div className="hero-content">
          <p style={styles.heroEyebrow}>Luxury Fragrance</p>
          <h1 className="hero-title" style={styles.heroTitle}>Aizen Notes<br /><span className="font-script" style={styles.heroTitleHighlight}>Pulse</span></h1>
          <p style={styles.heroSub}>Experience the essence of luxury. Each bottle tells a story of craftsmanship and elegance with 40% Oil concentration.</p>
          <div className="hero-btns" style={styles.heroBtns}>
            <Link to="/shop" className="btn-3d" style={{ padding: '16px 32px', fontSize: '14px' }}>Shop Now</Link>
          </div>
        </div>
        <div className="hero-image-section">
          <div style={styles.imageBg}></div>
          <div style={styles.heroImgWrapper}>
            <img
              src="/hero-bottle.jpg"
              alt="Aizen Notes Pulse Perfume"
              className="hero-img"
              style={styles.heroImg}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=800&fit=crop';
              }}
            />
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={styles.sectionHeader}>
            <h2 className="section-title" style={styles.sectionTitle}>Our Collection</h2>
            <div style={styles.titleUnderline}></div>
            <p style={styles.sectionSub}>Signature scents for every dimension</p>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading 3D Experience...</div>
          ) : (
            <div className="grid" style={styles.grid}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <Link to="/shop" className="btn-3d" style={{ padding: '14px 32px', fontSize: '13px' }}>View All Perfumes</Link>
          </div>
        </div>
        <div style={styles.ambientGlow1}></div>
        <div style={styles.ambientGlow2}></div>
      </section>

      <section style={styles.banner}>
        <div className="container">
          <div className="banner-inner glass" style={styles.bannerInner}>
            <div>
              <h2 className="section-title" style={styles.bannerTitle}>The Art of Perfumery</h2>
              <p style={styles.bannerText}>Each fragrance is an immersive journey — a blend of the finest ingredients sourced from around the world, composed by master perfumers.</p>
            </div>
            <Link to="/shop" className="btn-3d" style={{ padding: '16px 36px', fontSize: '14px', background: 'linear-gradient(135deg, rgba(255,215,0,0.4), rgba(255,215,0,0.1))' }}>Experience Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  heroEyebrow: {
    color: 'var(--color-primary)',
    fontSize: 14,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    marginBottom: 20,
    fontWeight: 800,
    textShadow: '0 0 20px rgba(255,215,0,0.5)',
  },
  heroTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 84,
    fontWeight: 900,
    color: 'var(--color-text)',
    lineHeight: 1.05,
    marginBottom: 30,
    letterSpacing: '-0.02em',
    textShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 60px rgba(255,215,0,0.1)',
  },
  heroTitleHighlight: {
    background: 'linear-gradient(to bottom right, #fff, #ffd700)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'block',
    marginTop: -10,
    paddingBottom: 10,
  },
  heroSub: {
    color: 'var(--color-text-muted)',
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 50,
    maxWidth: 500,
    fontWeight: 400,
  },
  heroBtns: {
    display: 'flex',
    gap: 20,
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #ffd700 0%, #aa8800 100%)',
    color: '#050505',
    padding: '18px 46px',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    boxShadow: 'var(--shadow-3d-btn)',
    transition: 'var(--transition)',
    cursor: 'pointer',
    border: 'none',
    display: 'inline-block',
  },
  heroImageSection: {
    position: 'relative',
    minHeight: 600,
    transformStyle: 'preserve-3d',
  },
  imageBg: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%)',
    filter: 'blur(50px)',
    animation: 'pulse-glow 5s ease-in-out infinite',
    transform: 'translateZ(-100px)',
  },
  heroImgWrapper: {
    position: 'relative',
    animation: 'float-3d 6s ease-in-out infinite',
    transformStyle: 'preserve-3d',
    zIndex: 2,
  },
  heroImg: {
    objectFit: 'cover',
    borderRadius: '40px',
    boxShadow: '0 60px 120px rgba(0,0,0,0.9), 0 0 80px rgba(255,215,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3)',
    border: '1px solid rgba(255,215,0,0.2)',
    transform: 'translateZ(30px) rotateY(-5deg)',
    transition: 'var(--transition)',
  },
  section: {
    padding: '120px 0',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(204,170,0,0.04) 0%, transparent 70%)',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 80,
    position: 'relative',
    zIndex: 2,
  },
  sectionTitle: {
    fontFamily: "var(--font-serif)",
    fontWeight: 800,
    color: '#fff',
    marginBottom: 16,
    letterSpacing: '-0.02em',
    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  titleUnderline: {
    width: 80,
    height: 4,
    background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
    margin: '0 auto 24px',
    borderRadius: 2,
  },
  sectionSub: {
    color: 'var(--color-text-muted)',
    fontSize: 18,
    letterSpacing: '0.05em',
  },
  grid: {
    display: 'grid',
    gap: 40,
    perspective: 1500,
  },
  loading: {
    textAlign: 'center',
    color: 'var(--color-primary)',
    padding: 100,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '0.1em',
    animation: 'pulse-glow 2s infinite',
  },
  btnOutline: {
    display: 'inline-block',
    border: '1px solid rgba(255,215,0,0.3)',
    color: 'var(--color-primary)',
    padding: '16px 42px',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'rgba(255,215,0,0.03)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    transition: 'var(--transition)',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
  },
  banner: {
    padding: '80px 24px',
    position: 'relative',
    zIndex: 2,
  },
  bannerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '80px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 50,
    flexWrap: 'wrap',
    boxShadow: 'var(--shadow-3d-card)',
    transform: 'translateZ(20px)',
  },
  bannerTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 52,
    color: '#fff',
    marginBottom: 20,
    letterSpacing: '-0.02em',
    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  bannerText: {
    color: 'var(--color-text-muted)',
    fontSize: 18,
    lineHeight: 1.8,
    maxWidth: 600,
    fontWeight: 400,
  },
  btnGold: {
    background: 'linear-gradient(135deg, #ffd700 0%, #aa8800 100%)',
    color: '#050505',
    padding: '18px 46px',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxShadow: 'var(--shadow-3d-btn)',
    transition: 'var(--transition)',
    cursor: 'pointer',
    border: 'none',
    display: 'inline-block',
  },
};


