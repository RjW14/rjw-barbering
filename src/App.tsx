import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

type Service = {
    name: string;
    note: string;
    shape: string;
    description: string;
    steps: string[];
    duration: string;
    price: string;
    image?: string;
    imagePosition?: string;
};

const services: Service[] = [
    { name: 'Haircut', note: 'Your style. Refined.', shape: 'cut', description: 'A clean, tailored cut shaped around your hair, style and finish.', steps: ['Consultation', 'Cut', 'Finish and style'], duration: '45 mins', price: '£TBC', image: '/services/haircut.png', imagePosition: '52% 50%' },
    { name: 'Skin Fade', note: 'Seamless from every angle.', shape: 'fade', description: 'A sharp skin fade blended cleanly through the sides and back.', steps: ['Consultation', 'Skin fade', 'Finish and style'], duration: '50 mins', price: '£TBC' },
    { name: 'Hair + Beard', note: 'The complete reset.', shape: 'complete', description: 'A full hair service and beard tidy-up finished as one complete look.', steps: ['Consultation', 'Haircut or fade', 'Beard shape', 'Finish and style'], duration: '60 mins', price: '£TBC', image: '/services/hair-and-beard.png', imagePosition: '43% 50%' },
    { name: 'Beard', note: 'Shape. Define. Finish.', shape: 'beard', description: 'Beard shaping and detail work for a cleaner, sharper finish.', steps: ['Consultation', 'Beard trim and shape', 'Finish'], duration: '30 mins', price: '£TBC' },
    { name: 'Kids Cut', note: 'Fresh starts here.', shape: 'kids', description: 'A clean, age-appropriate cut finished with the same attention to detail.', steps: ['Consultation', 'Cut', 'Finish and style'], duration: '35 mins', price: '£TBC', image: '/services/kids-cut.png', imagePosition: '50% 50%' },
];

const contentTiles = [
    'STYLES',
    'FADES',
    'BRAIDS',
    'HAIR EDUCATION',
    'BARBER CULTURE',
];

type RjwCoverItem = {
    id: number;
    image: string | null;
    tiktokUrl: string | null;
};

const rjwCoverItems: RjwCoverItem[] = [
    { id: 1, image: '/rjw-content/covers/next-cut.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7699411968343543062' },
    { id: 2, image: '/rjw-content/covers/next-cut-styles.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7699805284063038742' },
    { id: 3, image: '/rjw-content/covers/know-your-fade.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7702049448880246018' },
    { id: 4, image: '/rjw-content/covers/fade-length-guide.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7702818210290208022' },
    { id: 5, image: '/rjw-content/covers/whats-your-style.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7700168184652958998' },
    { id: 6, image: '/rjw-content/covers/braid-styles.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7700543860799212822' },
    { id: 7, image: '/rjw-content/covers/next-style-braids.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7701297949640379670' },
    { id: 8, image: '/rjw-content/covers/kid-styles.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7703503151021804822' },
    { id: 9, image: '/rjw-content/covers/cornrow-styles.png', tiktokUrl: 'https://www.tiktok.com/@rocky_rjw/photo/7705694245746740502' },
];

const tickerItems = ['RJW BARBERING', 'BARBER CULTURE', 'HAIR & STYLE', 'CUTS & TRENDS', 'INSPIRATION', 'HAIR EDUCATION', 'PERSONAL STYLE'];
const clientTickerItems = ['GET A CUT', 'SKIN FADES', 'HAIR + BEARD', 'MOBILE BARBERING', 'CLEAN FINISH', 'CLIENT WORK', 'RJW BARBERING'];
const recentWorkImages = [
    '/contact-strip/1.png',
    '/contact-strip/2.png',
    '/contact-strip/3.png',
    '/contact-strip/4.png',
    '/gallery/2.png',
    '/contact-strip/5.png',
    '/gallery/4.png',
    '/contact-strip/6.png',
    '/contact-strip/7.png',
    '/gallery/5.png',
    '/contact-strip/8.png',
];
const Arrow = () => <span aria-hidden="true">↗</span>;

function HeroTicker() {
    return <div className="ticker"><div className="ticker-track" aria-hidden="true">{[0, 1].map(group => <div className="ticker-group" key={group}>{tickerItems.map(item => <span className="ticker-item" key={`${group}-${item}`}><span>{item}</span><i>•</i></span>)}</div>)}</div></div>;
}

function ClientTicker() {
    return <div className="client-ticker"><div className="client-ticker-track" aria-hidden="true">{[0, 1].map(group => <div className="client-ticker-group" key={group}>{clientTickerItems.map(item => <span className="client-ticker-item" key={`${group}-${item}`}><span>{item}</span><i>•</i></span>)}</div>)}</div></div>;
}

function RecentWorkStrip() {
    return <section className="recent-work" id="gallery" aria-labelledby="recent-work-title"><div className="recent-work-showcase"><h2 className="recent-work-label" id="recent-work-title"><span />RECENT WORK</h2><div className="recent-work-viewport"><div className="recent-work-track">{[0, 1].map(group => <div className="recent-work-group" aria-hidden={group === 1} key={group}>{recentWorkImages.map((image, index) => <img className={image.startsWith('/gallery/') ? 'recent-work-ksi' : undefined} src={image} alt={group === 0 ? `Recent RjW barbering work ${index + 1}` : ''} loading="lazy" decoding="async" draggable="false" key={`${group}-${image}`} />)}</div>)}</div></div></div></section>;
}

function Brand() {
    return <a className="brand" href="#home" aria-label="RjW Barbering home"><span className="brand-mark">RjW<span className="brand-dot">.</span></span><span className="brand-label">BARBERING</span></a>;
}

function Navigation() {
    const [open, setOpen] = useState(false);
    const links = [{ label: 'Home', href: '#home' }, { label: 'RjW', href: '#rjw' }, { label: 'Gallery', href: '#gallery' }, { label: 'Get a Cut', href: '#get-a-cut' }, { label: 'Contact', href: '#contact' }];
    return <header className="navigation"><Brand /><nav id="mobile-menu" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">{links.map(link => <a href={link.href} key={link.label} onClick={() => setOpen(false)}>{link.label}</a>)}</nav><a className="button button-small" href="#rjw">Explore RjW <Arrow /></a><button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span>{open ? '✕' : '☰'}</span></button></header>;
}

function AbstractArt({ variant, className = '' }: { variant: string; className?: string }) {
    return <div className={`abstract-art art-${variant} ${className}`} aria-hidden="true"><div className="art-orbit" />{variant === 'hero' && <img className="hero-cutout" src="/rjw-hero-cutout.png" alt="" />}<div className="art-blade" /><div className="art-line" /></div>;
}

function RjwCoverShowcase() {
    const cloneCount = rjwCoverItems.length;
    const covers = [...rjwCoverItems.slice(-cloneCount), ...rjwCoverItems, ...rjwCoverItems.slice(0, cloneCount)];
    const [position, setPosition] = useState(cloneCount);
    const [step, setStep] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(false);
    const [paused, setPaused] = useState(false);
    const [dragging, setDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const pointerStartRef = useRef<number | null>(null);

    const move = useCallback((direction: number) => {
        setTransitionEnabled(true);
        setPosition(current => current + direction);
    }, []);

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;
        const measure = () => {
            const cover = track.querySelector<HTMLElement>('.rjw-cover-card');
            if (!cover) return;
            const styles = window.getComputedStyle(track);
            const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
            setStep(cover.getBoundingClientRect().width + gap);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(viewport);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (paused || dragging) return;
        const autoplay = window.setInterval(() => move(1), 4500);
        return () => window.clearInterval(autoplay);
    }, [dragging, move, paused]);

    const finishTransition = () => {
        if (position >= cloneCount + rjwCoverItems.length || position < cloneCount) {
            setTransitionEnabled(false);
            setPosition(current => current >= cloneCount + rjwCoverItems.length ? current - rjwCoverItems.length : current + rjwCoverItems.length);
            window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)));
        }
    };

    const finishDrag = (clientX: number) => {
        const start = pointerStartRef.current;
        if (start !== null && Math.abs(clientX - start) > 42) move(clientX > start ? -1 : 1);
        pointerStartRef.current = null;
        setDragging(false);
    };

    const renderCover = (item: RjwCoverItem, renderedIndex: number) => {
        const isClone = renderedIndex < cloneCount || renderedIndex >= cloneCount + rjwCoverItems.length;
        const label = `COVER ${String(item.id).padStart(2, '0')}`;
        const contents = item.image ? <img src={item.image} alt={`RjW TikTok cover ${String(item.id).padStart(2, '0')}`} draggable="false" /> : <span className="rjw-cover-placeholder"><span>{label}</span></span>;
        return item.tiktokUrl ? <a className="rjw-cover-card" href={item.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${label} on TikTok`} aria-hidden={isClone || undefined} tabIndex={isClone ? -1 : 0} key={`${renderedIndex}-${item.id}`}>{contents}</a> : <article className="rjw-cover-card" aria-label={`${label} image placeholder`} aria-hidden={isClone || undefined} key={`${renderedIndex}-${item.id}`}>{contents}</article>;
    };

    return <section className="rjw-cover-showcase" aria-labelledby="rjw-cover-heading" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false); }}><div className="rjw-cover-heading"><h3 id="rjw-cover-heading">LATEST FROM RJW</h3><div className="rjw-cover-controls"><button type="button" aria-label="Previous RjW cover" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next RjW cover" onClick={() => move(1)}>→</button></div></div><div className={dragging ? 'rjw-cover-viewport is-dragging' : 'rjw-cover-viewport'} ref={viewportRef} onPointerDown={event => { pointerStartRef.current = event.clientX; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={event => finishDrag(event.clientX)} onPointerCancel={() => { pointerStartRef.current = null; setDragging(false); }}><div className="rjw-cover-track" ref={trackRef} onTransitionEnd={event => { if (event.currentTarget === event.target) finishTransition(); }} style={{ transform: `translate3d(${-position * step}px, 0, 0)`, transition: transitionEnabled ? 'transform .6s cubic-bezier(.22,.7,.2,1)' : 'none' }}>{covers.map(renderCover)}</div></div></section>;
}

function RjwSection() {
    const categoryPanels = contentTiles.flatMap((label, index) => {
        const panelNumber = index < 3 ? index + 1 : index + 2;
        const panel = <article className="rjw-content-tile" key={label}><span className="rjw-tile-number">0{panelNumber}</span><strong>{label}</strong><span className="rjw-tile-slash" aria-hidden="true" /></article>;
        return index === 3 ? [<div className="rjw-brand-break" key="rjw-brand-break"><img src="/vector-logo.png" alt="RjW." /></div>, panel] : [panel];
    });
    return <section className="rjw-section" id="rjw" aria-labelledby="rjw-title"><div className="rjw-texture" aria-hidden="true" /><div className="rjw-streaks" aria-hidden="true"><i /><i /><i /></div><div className="rjw-intro"><div className="rjw-title-block"><p className="eyebrow">RJW BARBERING / CONTENT</p><h2 id="rjw-title"><span>CUTS.</span><span>STYLES.</span><span>CULTURE.</span></h2><span className="rjw-title-brush" aria-hidden="true" /></div><div className="rjw-copy"><p>Trends, inspiration, education and everything barbering.</p><a className="rjw-social-link" href="https://www.tiktok.com/@rocky_rjw" target="_blank" rel="noopener noreferrer"><img src="/tiktok.png" alt="" /><span>Explore RjW on TikTok</span><Arrow /></a></div></div><div className="rjw-content-rail"><div className="rjw-content-grid" aria-label="RjW content categories">{categoryPanels}</div></div><RjwCoverShowcase /></section>;
}

function ServiceDetailModal({ service, isOpen, onClose }: { service: Service | null; isOpen: boolean; onClose: () => void }) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
            if (event.key !== 'Tab' || !panelRef.current) return;
            const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => { window.cancelAnimationFrame(focusFrame); document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
    }, [isOpen, onClose]);
    if (!service) return null;
    return <div className={isOpen ? 'service-modal is-open' : 'service-modal'} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className="service-modal-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="service-modal-title"><div className="service-modal-top"><span>Service details</span><button type="button" ref={closeButtonRef} onClick={onClose} aria-label="Close service details">×</button></div><div className="service-modal-body"><div className="service-modal-intro"><h2 id="service-modal-title">{service.name}<span>.</span></h2><p>{service.description}</p><dl className="service-meta"><div><dt>Duration</dt><dd>{service.duration}</dd></div><div><dt>Price</dt><dd>{service.price}</dd></div></dl></div><div className="service-included"><h3>What’s included</h3><ol className="service-sequence">{service.steps.map((step, index) => <li key={step}><div className="sequence-step included"><span className="step-number">{String(index + 1).padStart(2, '0')}</span><span className="step-label">{step}</span><small>Included</small></div></li>)}</ol></div></div></div></div>;
}

function ServicesSection() {
    const [activeServiceName, setActiveServiceName] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const activeService = services.find(item => item.name === activeServiceName) ?? null;
    const openDetails = (item: Service) => { setActiveServiceName(item.name); setIsModalOpen(true); };
    const closeDetails = useCallback(() => setIsModalOpen(false), []);
    return <><section className="section services-section" id="get-a-cut"><div className="barber-intro"><div><p className="eyebrow">ROCKY / BARBERING</p><h2><span>CUT CLEAN.</span><span>LOOK SHARP.</span></h2></div><div className="barber-intro-copy"><p>Cuts, fades and finishes built around you.</p><small>Shop or mobile. Same attention to detail.</small><a className="button instagram-work-link" href="https://www.instagram.com/rocky.rjw_f4fade/" target="_blank" rel="noopener noreferrer"><img src="/instagram.png" alt="" /><span className="instagram-cta-label">VIEW MY WORK ON INSTAGRAM</span><Arrow /></a></div></div><div className="service-cards" role="list">{services.map((item, index) => <article key={item.name} className="service-card" role="listitem"><button type="button" className="service-card-open" aria-label={`View ${item.name} details`} onClick={() => openDetails(item)}>{item.image ? <img className="service-card-image" src={item.image} style={{ objectPosition: item.imagePosition }} alt="" /> : <AbstractArt variant={item.shape} />}<span className="card-top"><span>0{index + 1}</span></span><span className="service-info"><strong>{item.name}</strong><span>{item.note}</span></span></button></article>)}</div></section><ServiceDetailModal service={activeService} isOpen={isModalOpen} onClose={closeDetails} /></>;
}

function ContactSocials() {
    return <div className="social-placeholders"><a className="social-link" href="https://www.instagram.com/rocky.rjw_f4fade/" target="_blank" rel="noopener noreferrer" aria-label="RjW Barbering on Instagram"><img src="/instagram.png" alt="" /></a><a className="social-link" href="https://www.tiktok.com/@rocky_rjw" target="_blank" rel="noopener noreferrer" aria-label="RjW Barbering on TikTok"><img src="/tiktok.png" alt="" /></a></div>;
}

function App() {
    return <><a className="skip-link" href="#main">Skip to content</a><Navigation /><main id="main"><section className="hero" id="home"><h1><span>RjW</span> BARBERING<span className="title-dot">.</span></h1><div className="hero-stage"><AbstractArt variant="hero" /><div className="hero-content"><p className="eyebrow">MORE THAN A HAIRCUT</p><h2>A sharper look.<br />A different energy.</h2><p>Barber culture, hair, style and work built around you.</p><div className="hero-actions"><a className="button" href="#rjw">Explore RjW</a><a className="text-link" href="#get-a-cut">Get a Cut</a></div></div></div></section><ClientTicker /><div className="barber-world"><ServicesSection /><RecentWorkStrip /></div><HeroTicker /><RjwSection /><section className="contact-section" id="contact"><div><p className="eyebrow">LET’S KEEP IN TOUCH</p><h2>Good hair.<br />Better energy<span className="orange">.</span></h2></div><div className="contact-info"><div><span>FIND US</span><p>Shop location coming soon</p><p>Mobile service area to be confirmed</p></div><div><span>SAY HELLO</span><p className="contact-links"><a href="mailto:rocks14rjw@gmail.com">rocks14rjw@gmail.com</a><a href="tel:07344184570">07344 184570</a></p></div><ContactSocials /></div></section></main><footer><Brand /><p>© {new Date().getFullYear()} RjW Barbering. All rights reserved.</p><a href="#home">BACK TO TOP ↑</a></footer></>;
}

export default App;
