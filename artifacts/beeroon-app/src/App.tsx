import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coffee,
  Compass,
  Globe2,
  Heart,
  Home as HomeIcon,
  Instagram,
  ListFilter,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Utensils,
  X,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';

const queryClient = new QueryClient();
const logoPath = `${import.meta.env.BASE_URL}beeroon-logo.svg`;

type Category = 'همه' | 'غذا و رستوران' | 'کافه' | 'فرهنگ و خرید' | 'تندرستی';
type Area = 'همه شهر' | 'احمدآباد' | 'سجاد' | 'هاشمیه' | 'مرکز شهر';
type Place = {
  id: string;
  name: string;
  category: Exclude<Category, 'همه'>;
  area: Exclude<Area, 'همه شهر'>;
  address: string;
  rating: string;
  reviews: number;
  price: string;
  hours: string;
  visual: string;
  mark: string;
  description: string;
  features: string[];
  phone: string;
  website: string;
  instagram: string;
};

const places: Place[] = [
  {
    id: 'toranj',
    name: 'ترنج؛ خانه‌ی غذا',
    category: 'غذا و رستوران',
    area: 'احمدآباد',
    address: 'بلوار احمدآباد، کوچه بهار',
    rating: '۴.۸',
    reviews: 142,
    price: 'متوسط',
    hours: '۱۱:۳۰ تا ۲۳:۰۰',
    visual: 'visual-1',
    mark: 'ترنج',
    description: 'جایی برای غذای ایرانیِ دقیق و بی‌تکلف؛ با حیاطی روشن که عصرهای مشهد را آرام‌تر می‌کند.',
    features: ['غذای ایرانی', 'حیاط دنج', 'رزرو تلفنی', 'پارکینگ نزدیک'],
    phone: '05138441220',
    website: 'https://toranj.example.com',
    instagram: 'https://instagram.com/toranj.mashhad',
  },
  {
    id: 'dorna',
    name: 'دُرنا کافه',
    category: 'کافه',
    area: 'سجاد',
    address: 'بلوار سجاد، بین سجاد ۱۲ و ۱۴',
    rating: '۴.۶',
    reviews: 89,
    price: 'متوسط',
    hours: '۸:۰۰ تا ۲۳:۳۰',
    visual: 'visual-2',
    mark: 'دُرنا',
    description: 'قهوه‌ی صبح، نور نرم و میزهایی که برای یک گفت‌وگوی طولانی ساخته شده‌اند.',
    features: ['قهوه تخصصی', 'صبحانه', 'وای‌فای', 'مناسب کار'],
    phone: '05136081211',
    website: 'https://dorna.example.com',
    instagram: 'https://instagram.com/dorna.cafe',
  },
  {
    id: 'ketabestan',
    name: 'کتابستان آفتاب',
    category: 'فرهنگ و خرید',
    area: 'مرکز شهر',
    address: 'خیابان امام خمینی، پلاک ۲۸',
    rating: '۴.۹',
    reviews: 57,
    price: 'اقتصادی',
    hours: '۹:۰۰ تا ۲۱:۳۰',
    visual: 'visual-3',
    mark: 'آفتاب',
    description: 'کتاب‌فروشی مستقل با انتخابی از ادبیات، کودک و کتاب‌های کاربردی برای سفر.',
    features: ['کتاب کودک', 'بخش زبان', 'بسته‌بندی هدیه', 'کارت هدیه'],
    phone: '05132214418',
    website: 'https://aftab-book.example.com',
    instagram: 'https://instagram.com/aftab.book',
  },
  {
    id: 'nafas',
    name: 'نَفَس؛ استودیو حرکت',
    category: 'تندرستی',
    area: 'هاشمیه',
    address: 'هاشمیه ۲۲، مجتمع آبان',
    rating: '۴.۷',
    reviews: 64,
    price: 'ویژه',
    hours: '۷:۰۰ تا ۲۱:۰۰',
    visual: 'visual-4',
    mark: 'نَفَس',
    description: 'استودیویی جمع‌وجور برای یوگا، پیلاتس و چند دقیقه فاصله گرفتن از شلوغی روز.',
    features: ['یوگا', 'پیلاتس', 'کلاس خصوصی', 'رزرو آنلاین'],
    phone: '05138891230',
    website: 'https://nafas.example.com',
    instagram: 'https://instagram.com/nafas.studio',
  },
  {
    id: 'shandiz',
    name: 'کباب‌خانه شاندیزِ قدیم',
    category: 'غذا و رستوران',
    area: 'مرکز شهر',
    address: 'خیابان دانشگاه، نبش دانشگاه ۹',
    rating: '۴.۵',
    reviews: 203,
    price: 'ویژه',
    hours: '۱۲:۰۰ تا ۰۰:۰۰',
    visual: 'visual-5',
    mark: 'قدیم',
    description: 'چلوکباب و مخلفات اصیل، با همان حال‌وهوای مهمانی‌های قدیمی و میزهای خانوادگی.',
    features: ['کباب شاندیزی', 'مناسب خانواده', 'سرویس بیرون‌بر', 'رزرو میز'],
    phone: '05138409932',
    website: 'https://shandiz-ghadim.example.com',
    instagram: 'https://instagram.com/shandiz.ghadim',
  },
  {
    id: 'naqqash',
    name: 'نقاش؛ گالری و هدیه',
    category: 'فرهنگ و خرید',
    area: 'سجاد',
    address: 'سجاد ۱۷، پاساژ آبان، طبقه اول',
    rating: '۴.۷',
    reviews: 38,
    price: 'متوسط',
    hours: '۱۰:۰۰ تا ۲۲:۰۰',
    visual: 'visual-6',
    mark: 'نقاش',
    description: 'هدیه‌های دست‌ساز و آثار کوچک هنرمندان خراسان برای وقتی که دنبال چیز معمولی نیستید.',
    features: ['هدیه خاص', 'هنر خراسان', 'بسته‌بندی', 'خرید حضوری'],
    phone: '05137671018',
    website: 'https://naqqash.example.com',
    instagram: 'https://instagram.com/naqqash.gallery',
  },
];

const categories: { name: Category; icon: LucideIcon }[] = [
  { name: 'همه', icon: Compass },
  { name: 'غذا و رستوران', icon: Utensils },
  { name: 'کافه', icon: Coffee },
  { name: 'فرهنگ و خرید', icon: Store },
  { name: 'تندرستی', icon: Sparkles },
];
const areas: Area[] = ['همه شهر', 'احمدآباد', 'سجاد', 'هاشمیه', 'مرکز شهر'];
const toLatinDigits = (value: string) => value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace('٫', '.');

function Header({ onOwner }: { onOwner: () => void }) {
  const [, setLocation] = useLocation();
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setLocation('/')} data-testid="button-brand-home" aria-label="بازگشت به خانه">
        <img className="brand-logo" src={logoPath} alt="لوگوی بیرون" />
        <span className="brand-name">بیرون</span>
        <span className="brand-sub">راهنمای مشهد</span>
      </button>
      <div className="top-actions">
        <button className="top-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-how-it-works">چطور کار می‌کند؟</button>
        <button className="owner-button" onClick={onOwner} data-testid="button-add-business"><Plus size={16} /> افزودن کسب‌وکار</button>
      </div>
    </header>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="search-panel">
      <div className="search-input-wrap">
        <Search size={19} aria-hidden="true" />
        <input
          className="search-input"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="دنبال کجا می‌گردی؟ مثلا کافه دنج در سجاد"
          aria-label="جست‌وجوی مکان"
          data-testid="input-search-places"
        />
      </div>
      <button className="search-button" onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-submit-search">بگرد</button>
    </div>
  );
}

function PlaceCard({ place, saved, onSave, onOpen, index }: { place: Place; saved: boolean; onSave: () => void; onOpen: () => void; index: number }) {
  return (
    <article className="place-card" style={{ animationDelay: `${index * 55}ms` }} data-testid={`card-place-${place.id}`}>
      <div className={`place-visual ${place.visual}`}>
        <span className="art-grid" />
        <span className="visual-mark">{place.mark}</span>
        <span className="visual-caption">{place.category}</span>
        <button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? `حذف ${place.name} از ذخیره‌ها` : `ذخیره ${place.name}`} data-testid={`button-save-${place.id}`}>
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="place-content">
        <div className="place-title-row">
          <div>
            <h3 className="place-title" data-testid={`text-place-name-${place.id}`}>{place.name}</h3>
            <span className="verified"><CheckCircle2 size={13} /> بررسی‌شده در بیرون</span>
          </div>
        </div>
        <div className="place-meta"><MapPin size={13} /> <span>{place.area}</span><span>{place.price}</span></div>
        <div className="place-bottom">
          <span className="rating"><Star size={14} /> {place.rating} <span style={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--app-font-sans)', fontSize: 10 }}>({place.reviews})</span></span>
          <button className="view-button" onClick={onOpen} data-testid={`button-view-${place.id}`}>دیدن جزئیات <ArrowLeft size={13} style={{ verticalAlign: 'middle' }} /></button>
        </div>
      </div>
    </article>
  );
}

function DetailView({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <button className="modal-close" onClick={onClose} aria-label="بستن جزئیات" data-testid="button-close-detail"><X size={18} /></button>
      <div className="detail-hero">
        <div className={`place-visual ${place.visual}`}><span className="art-grid" /><span className="visual-mark">{place.mark}</span></div>
        <div className="detail-hero-content">
          <span className="verified" style={{ color: 'hsl(var(--secondary))' }}><CheckCircle2 size={14} /> بررسی‌شده توسط تیم بیرون</span>
          <h2 id="detail-title" data-testid={`text-detail-name-${place.id}`}>{place.name}</h2>
          <p>{place.category} در {place.area} · {place.address}</p>
        </div>
      </div>
      <div className="detail-body">
        <div className="detail-stats">
          <span className="detail-stat"><Star size={15} style={{ color: 'hsl(var(--secondary))', fill: 'hsl(var(--secondary))' }} /><strong>{place.rating}</strong> از {place.reviews} نظر</span>
          <span className="detail-stat"><Clock3 size={15} /><strong>{place.hours}</strong></span>
          <span className="detail-stat"><MapPin size={15} /><strong>{place.area}</strong></span>
        </div>
        <p className="detail-description">{place.description}</p>
        <h3 className="detail-section-title">چیزی که باید بدانی</h3>
        <ul className="feature-list">{place.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <div className="action-grid">
          <a className="action-button" href={`tel:${place.phone}`} data-testid={`link-call-${place.id}`}><Phone size={18} /><span>تماس</span></a>
          <a className="action-button" href={place.website} target="_blank" rel="noreferrer" data-testid={`link-website-${place.id}`}><Globe2 size={18} /><span>وب‌سایت</span></a>
          <a className="action-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} مشهد`)}`} target="_blank" rel="noreferrer" data-testid={`link-directions-${place.id}`}><Navigation size={18} /><span>مسیریابی</span></a>
          <a className="action-button" href={place.instagram} target="_blank" rel="noreferrer" data-testid={`link-instagram-${place.id}`}><Instagram size={18} /><span>اینستاگرام</span></a>
        </div>
      </div>
    </div>
  );
}

function OwnerModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal owner-modal" role="dialog" aria-modal="true" aria-labelledby="owner-title">
        <button className="modal-close" onClick={onClose} aria-label="بستن فرم" data-testid="button-close-owner-form"><X size={18} /></button>
        {submitted ? (
          <div className="form-success" data-testid="status-owner-submitted"><CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginLeft: 6 }} /> اطلاعاتت ثبت شد. تیم بیرون برای بررسی و هماهنگی با تو تماس می‌گیرد.</div>
        ) : (
          <>
            <h2 id="owner-title">جای تو در بیرون خالی است</h2>
            <p>اگر صاحب کسب‌وکاری در مشهد هستی، چند خط درباره‌اش بگو تا آن را دقیق و بی‌حاشیه به آدم‌های درست معرفی کنیم.</p>
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-field"><label htmlFor="owner-name">نام کسب‌وکار</label><input id="owner-name" required placeholder="مثلا خانه ترنج" data-testid="input-owner-name" /></div>
                <div className="form-field"><label htmlFor="owner-phone">شماره تماس</label><input id="owner-phone" required type="tel" placeholder="۰۵۱..." data-testid="input-owner-phone" /></div>
                <div className="form-field"><label htmlFor="owner-area">محدوده</label><select id="owner-area" defaultValue="احمدآباد" data-testid="select-owner-area">{areas.slice(1).map((area) => <option key={area}>{area}</option>)}</select></div>
                <div className="form-field"><label htmlFor="owner-category">دسته‌بندی</label><select id="owner-category" defaultValue="کافه" data-testid="select-owner-category">{categories.slice(1).map((category) => <option key={category.name}>{category.name}</option>)}</select></div>
                <div className="form-field full"><label htmlFor="owner-description">یک معرفی کوتاه</label><textarea id="owner-description" placeholder="چه چیزی اینجا را خاص می‌کند؟" data-testid="textarea-owner-description" /></div>
              </div>
              <button type="submit" className="submit-owner" data-testid="button-submit-owner">ارسال برای بررسی <ArrowLeft size={14} style={{ verticalAlign: 'middle' }} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function MobileNav({ savedCount, showingSaved, onDiscover, onSaved, onOwner }: { savedCount: number; showingSaved: boolean; onDiscover: () => void; onSaved: () => void; onOwner: () => void }) {
  return (
    <nav className="mobile-nav" aria-label="ناوبری اصلی">
      <button className={!showingSaved ? 'active' : ''} onClick={onDiscover} data-testid="button-mobile-discover"><HomeIcon size={18} /><span>کشف</span></button>
      <button className={showingSaved ? 'active' : ''} onClick={onSaved} data-testid="button-mobile-saved"><Bookmark size={18} /><span>ذخیره‌ها {savedCount ? `(${savedCount})` : ''}</span></button>
      <button onClick={onOwner} data-testid="button-mobile-owner"><Plus size={18} /><span>کسب‌وکار من</span></button>
    </nav>
  );
}

function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('همه');
  const [area, setArea] = useState<Area>('همه شهر');
  const [saved, setSaved] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);

  const filteredPlaces = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase('fa');
    const result = places.filter((place) => {
      const matchesSearch = !normalized || [place.name, place.category, place.area, place.address, ...place.features].join(' ').toLocaleLowerCase('fa').includes(normalized);
      const matchesCategory = category === 'همه' || place.category === category;
      const matchesArea = area === 'همه شهر' || place.area === area;
      const matchesSaved = !showSaved || saved.includes(place.id);
      return matchesSearch && matchesCategory && matchesArea && matchesSaved;
    });
    return sortByRating ? [...result].sort((a, b) => Number(toLatinDigits(b.rating)) - Number(toLatinDigits(a.rating))) : result;
  }, [area, category, saved, search, showSaved, sortByRating]);

  const toggleSaved = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const resetFilters = () => { setSearch(''); setCategory('همه'); setArea('همه شهر'); setShowSaved(false); };

  return (
    <div className="app-shell" dir="rtl">
      <Header onOwner={() => setOwnerOpen(true)} />
      <main className="main-wrap">
        <section className="hero">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> انتخاب‌های واقعی برای بیرون رفتن</span>
            <h1 className="hero-title">قبل از اینکه<br />از خانه <em>بیرون</em> بزنی.</h1>
            <p className="hero-copy">مکان‌های خوب مشهد را با اطلاعاتی که به درد همین امروز می‌خورد پیدا کن؛ مقایسه کن، مطمئن شو و مستقیم با خودشان در تماس باش.</p>
            <SearchBox value={search} onChange={setSearch} />
            <span className="hero-note"><ShieldCheck size={15} /> اطلاعات مرتب و بررسی‌شده، بدون شلوغی تبلیغات</span>
          </div>
          <div className="hero-art" aria-label="تصویر انتزاعی از شهر مشهد">
            <span className="art-grid" />
            <span className="art-stamp">مشهد<br />از نگاه<br />محلی‌ها</span>
            <span className="art-label"><strong>امروز کجا؟</strong>یک انتخاب خوب، نزدیک تو</span>
          </div>
        </section>

        <section aria-labelledby="explore-heading">
          <div className="section-heading">
            <div><h2 id="explore-heading">امروز دلت کجا می‌خواهد برود؟</h2><p>دسته را انتخاب کن، باقی‌اش را به بیرون بسپار.</p></div>
            <span className="count" data-testid="text-results-count">{filteredPlaces.length} جای پیشنهادی</span>
          </div>
          <div className="category-strip" role="tablist" aria-label="دسته‌بندی مکان‌ها">
            {categories.map(({ name, icon: Icon }) => <button key={name} className={`category-chip ${category === name ? 'active' : ''}`} onClick={() => { setCategory(name); setShowSaved(false); }} role="tab" aria-selected={category === name} data-testid={`button-category-${name}`}><span className="category-icon"><Icon size={15} /></span>{name}</button>)}
          </div>
          <div className="filter-row">
            <div className="area-filters" role="tablist" aria-label="محدوده‌های مشهد">
              {areas.map((item) => <button key={item} className={`area-filter ${area === item ? 'active' : ''}`} onClick={() => { setArea(item); setShowSaved(false); }} role="tab" aria-selected={area === item} data-testid={`button-area-${item}`}>{item}</button>)}
            </div>
            <button className="sort-button" onClick={() => setSortByRating((current) => !current)} data-testid="button-sort-rating"><SlidersHorizontal size={14} /> {sortByRating ? 'بالاترین امتیاز' : 'پیشنهاد بیرون'} <ChevronDown size={13} /></button>
          </div>
        </section>

        <section id="results" aria-live="polite">
          <div className="section-heading" style={{ marginTop: 24 }}>
            <div><h2>{showSaved ? 'جاهای ذخیره‌شده تو' : 'پیشنهادهای نزدیک تو'}</h2><p>{showSaved ? 'برای تصمیم بعدی‌ات نگه داشته‌ای.' : 'جاهایی که ارزش یک بار بیرون رفتن را دارند.'}</p></div>
            {!showSaved && <button className="view-button" onClick={() => setShowSaved(true)} data-testid="button-view-saved"><Bookmark size={14} style={{ verticalAlign: 'middle' }} /> ذخیره‌شده‌ها ({saved.length})</button>}
          </div>
          <div className="places-grid">
            {filteredPlaces.length ? filteredPlaces.map((place, index) => <PlaceCard key={place.id} place={place} saved={saved.includes(place.id)} onSave={() => toggleSaved(place.id)} onOpen={() => setLocation(`/place/${place.id}`)} index={index} />) : (
              <div className="empty-state" data-testid="status-empty-results">
                <div className="empty-state-icon"><Search size={22} /></div>
                <h3>{showSaved ? 'هنوز جایی را ذخیره نکرده‌ای' : 'این بار چیزی پیدا نشد'}</h3>
                <p>{showSaved ? 'روی قلب هر مکان بزن تا بعدا سریع پیدایش کنی.' : 'محدوده یا دسته را عوض کن؛ احتمالا انتخاب بعدی همین نزدیکی است.'}</p>
                <button className="reset-button" onClick={resetFilters} data-testid="button-reset-filters">نمایش همه مکان‌ها</button>
              </div>
            )}
          </div>
        </section>

        <section className="trust-band" id="how-it-works">
          <div className="trust-intro"><h2>کمتر جست‌وجو کن.<br />بیشتر زندگی کن.</h2><p>بیرون برای تصمیم‌های کوچک اما مهم ساخته شده.</p></div>
          <div className="trust-item"><CheckCircle2 size={20} /><strong>اطلاعات قابل اتکا</strong><span>ساعت کاری، محدوده و راه ارتباطی را یک‌جا ببین.</span></div>
          <div className="trust-item"><ListFilter size={20} /><strong>مقایسه‌ی راحت</strong><span>قبل از حرکت، انتخاب‌هایت را کنار هم بسنج.</span></div>
          <div className="trust-item"><Phone size={20} /><strong>مستقیم تماس بگیر</strong><span>واسطه‌ای نیست؛ راه ارتباطی خودشان اینجاست.</span></div>
        </section>
      </main>
      <footer className="footer"><span className="footer-brand">بیرون، راهنمای مشهد</span><span>برای لحظه‌هایی که ارزش بیرون رفتن دارند.</span></footer>
      <MobileNav savedCount={saved.length} showingSaved={showSaved} onDiscover={() => { setShowSaved(false); document.getElementById('explore-heading')?.scrollIntoView({ behavior: 'smooth' }); }} onSaved={() => { setShowSaved(true); document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }); }} onOwner={() => setOwnerOpen(true)} />
      {ownerOpen && <OwnerModal onClose={() => setOwnerOpen(false)} />}
    </div>
  );
}

function DetailRoute() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const [ownerOpen, setOwnerOpen] = useState(false);
  const place = places.find((item) => item.id === id);
  if (!place) return <NotFound />;
  return (
    <div className="app-shell" dir="rtl">
      <Header onOwner={() => setOwnerOpen(true)} />
      <main className="main-wrap" style={{ maxWidth: 820, paddingTop: 30 }}>
        <button className="view-button" onClick={() => setLocation('/')} data-testid="button-back-to-discovery"><ArrowLeft size={15} style={{ verticalAlign: 'middle' }} /> بازگشت به کشف</button>
        <div className="modal" style={{ marginTop: 18 }}><DetailView place={place} onClose={() => setLocation('/')} /></div>
      </main>
      <footer className="footer"><span className="footer-brand">بیرون، راهنمای مشهد</span><span>اطلاعاتی برای تصمیمی بهتر.</span></footer>
      {ownerOpen && <OwnerModal onClose={() => setOwnerOpen(false)} />}
    </div>
  );
}

function Router() {
  return (
    <ErrorBoundary resetKey={window.location.pathname}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/place/:id" component={DetailRoute} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;