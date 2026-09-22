import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';
type AppointmentType = 'Shop' | 'Mobile';
type ServiceStep = {
    id: string;
    label: string;
    kind: 'included' | 'optional';
    availableFor?: AppointmentType[];
};
type Service = {
    name: string;
    note: string;
    shape: string;
    description: string;
    steps: ServiceStep[];
    optionalExtras?: ServiceStep[];
    duration: string;
    price: string;
    appointmentTypes: AppointmentType[];
    image?: string;
    imagePosition?: string;
};
const services: Service[] = [
    { name: 'Haircut', note: 'Your style. Refined.', shape: 'cut', description: 'Clean tailored cut with shape, finish and styling.', steps: [{ id: 'consultation', label: 'Consultation', kind: 'included' }, { id: 'wash-1', label: 'Wash 1', kind: 'optional', availableFor: ['Shop'] }, { id: 'cut', label: 'Cut', kind: 'included' }, { id: 'wash-2', label: 'Wash 2', kind: 'optional', availableFor: ['Shop'] }, { id: 'hot-towel', label: 'Hot towel', kind: 'optional', availableFor: ['Shop'] }, { id: 'style', label: 'Style', kind: 'included' }], duration: '45 mins', price: '£TBC', appointmentTypes: ['Shop', 'Mobile'], image: '/services/haircut.png', imagePosition: '52% 50%' },
    { name: 'Skin Fade', note: 'Seamless from every angle.', shape: 'fade', description: 'Sharp skin fade blended cleanly through the sides and back.', steps: [{ id: 'consultation', label: 'Consultation', kind: 'included' }, { id: 'skin-fade', label: 'Skin fade', kind: 'included' }, { id: 'detail-work', label: 'Line-up/detail work', kind: 'included' }, { id: 'styling', label: 'Styling', kind: 'included' }], optionalExtras: [{ id: 'wash', label: 'Wash', kind: 'optional', availableFor: ['Shop'] }, { id: 'hot-towel', label: 'Hot towel', kind: 'optional', availableFor: ['Shop'] }], duration: '50 mins', price: '£TBC', appointmentTypes: ['Shop', 'Mobile'] },
    { name: 'Hair + Beard', note: 'The complete reset.', shape: 'complete', description: 'Full haircut and beard tidy-up finished as one complete look.', steps: [{ id: 'haircut', label: 'Haircut', kind: 'included' }, { id: 'beard-shape', label: 'Beard shape', kind: 'included' }, { id: 'detail-work', label: 'Line-up/detail work', kind: 'included' }, { id: 'styling', label: 'Styling', kind: 'included' }], optionalExtras: [{ id: 'wash', label: 'Wash', kind: 'optional', availableFor: ['Shop'] }, { id: 'hot-towel', label: 'Hot towel', kind: 'optional', availableFor: ['Shop'] }], duration: '60 mins', price: '£TBC', appointmentTypes: ['Shop', 'Mobile'], image: '/services/hair-and-beard.png', imagePosition: '43% 50%' },
    { name: 'Beard', note: 'Shape. Define. Finish.', shape: 'beard', description: 'Beard shape and detail work for a cleaner, sharper finish.', steps: [{ id: 'beard-trim', label: 'Beard trim', kind: 'included' }, { id: 'shape', label: 'Shape', kind: 'included' }, { id: 'detail-work', label: 'Line-up/detail work', kind: 'included' }], optionalExtras: [{ id: 'wash', label: 'Wash', kind: 'optional', availableFor: ['Shop'] }, { id: 'hot-towel', label: 'Hot towel', kind: 'optional', availableFor: ['Shop'] }], duration: '30 mins', price: '£TBC', appointmentTypes: ['Shop', 'Mobile'] },
    { name: 'Kids Cut', note: 'Fresh starts here.', shape: 'kids', description: 'Clean age-appropriate haircut finished with the same attention to detail.', steps: [{ id: 'haircut', label: 'Haircut', kind: 'included' }, { id: 'detail-work', label: 'Neckline/detail work', kind: 'included' }, { id: 'styling', label: 'Styling', kind: 'included' }], optionalExtras: [{ id: 'wash', label: 'Wash', kind: 'optional', availableFor: ['Shop'] }, { id: 'hot-towel', label: 'Hot towel', kind: 'optional', availableFor: ['Shop'] }], duration: '35 mins', price: '£TBC', appointmentTypes: ['Shop', 'Mobile'], image: '/services/kids-cut.png', imagePosition: '50% 50%' },
];

const stepIsAvailable = (step: ServiceStep, appointmentType: AppointmentType) => !step.availableFor || step.availableFor.includes(appointmentType);
const getAvailableExtras = (service: Service, appointmentType: AppointmentType) => [...service.steps.filter(step => step.kind === 'optional'), ...(service.optionalExtras ?? [])].filter(step => stepIsAvailable(step, appointmentType));
const Arrow = () => <span aria-hidden="true">↗</span>;
const tickerItems = ['RJW BARBERING', 'SHARP FADES', 'CLEAN CUTS', 'MOBILE BARBERING', 'PRECISION', 'PERSONAL STYLE', 'BOOK YOUR APPOINTMENT'];
const contactStripImages = Array.from({ length: 8 }, (_, index) => `/contact-strip/${index + 1}.png`);

function HeroTicker() {
    return <div className="ticker"><div className="ticker-track" aria-hidden="true">{[0, 1].map(group => <div className="ticker-group" key={group}>{tickerItems.map(item => <span className="ticker-item" key={`${group}-${item}`}><span>{item}</span><i>•</i></span>)}</div>)}</div></div>;
}
function RecentWorkStrip() {
    return <section className="recent-work" aria-labelledby="recent-work-title"><h2 className="recent-work-label" id="recent-work-title"><span/>RECENT WORK</h2><div className="recent-work-viewport"><div className="recent-work-track">{[0, 1].map(group => <div className="recent-work-group" aria-hidden={group === 1} key={group}>{contactStripImages.map((image, index) => <img src={image} alt={group === 0 ? `Recent RjW barbering work ${index + 1}` : ''} loading="lazy" decoding="async" draggable="false" key={`${group}-${image}`}/>)}</div>)}</div></div></section>;
}
const galleryImages = [1, 2, 3, 4, 5].map(number => `/gallery/${number}.png`);

function GalleryCarousel() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (paused)
            return;
        const interval = window.setInterval(() => {
            setCurrent(index => (index + 1) % galleryImages.length);
        }, 6500);
        return () => window.clearInterval(interval);
    }, [paused]);
    const move = (direction: number) => {
        setCurrent(index => (index + direction + galleryImages.length) % galleryImages.length);
    };
    return <div className="gallery-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>{galleryImages.map((image, index) => <img className={index === current ? 'gallery-slide is-active' : 'gallery-slide'} src={image} alt={`RjW barbering gallery ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} key={image}/>)}<div className="carousel-controls"><button type="button" aria-label="Previous gallery image" onClick={() => move(-1)}>←</button><span>{String(current + 1).padStart(2, '0')} / 05</span><button type="button" aria-label="Next gallery image" onClick={() => move(1)}>→</button></div></div>;
}
function Brand() {
    return <a className="brand" href="#home" aria-label="RjW Barbering home"><span className="brand-mark">RjW<span className="brand-dot">.</span></span><span className="brand-label">BARBERING</span></a>;
}
function Navigation() {
    const [open, setOpen] = useState(false);
    return <header className="navigation"><Brand /><nav id="mobile-menu" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">{['Home', 'Services', 'Gallery', 'Booking', 'Contact'].map(link => <a href={`#${link.toLowerCase()}`} key={link} onClick={() => setOpen(false)}>{link}</a>)}</nav><a className="button button-small" href="#booking">Book Now <Arrow /></a><button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span>{open ? '✕' : '☰'}</span></button></header>;
}
function AbstractArt({ variant, className = '' }: {
    variant: string;
    className?: string;
}) {
    return <div className={`abstract-art art-${variant} ${className}`} aria-hidden={variant === 'gallery-one' ? undefined : true}><div className="art-orbit"/>{variant === 'hero' && <img className="hero-cutout" src="/rjw-hero-cutout.png" alt=""/>}{variant === 'gallery-one' && <GalleryCarousel/>}{variant === 'gallery-two' && <video className="gallery-video" src="/gallery/ksi-test.MP4" autoPlay muted loop playsInline preload="metadata"/>}<div className="art-blade"/><div className="art-line"/></div>;
}
function ServiceDetailModal({ service, isOpen, appointmentType, selectedExtraIds, onToggleExtra, onClose, onBook }: {
    service: Service | null;
    isOpen: boolean;
    appointmentType: AppointmentType;
    selectedExtraIds: string[];
    onToggleExtra: (stepId: string) => void;
    onClose: () => void;
    onBook: (service: Service) => void;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!isOpen)
            return;
        const previousFocus = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }
            if (event.key !== 'Tab' || !panelRef.current)
                return;
            const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
            if (!focusable.length)
                return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            window.cancelAnimationFrame(focusFrame);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [isOpen, onClose]);
    if (!service)
        return null;
    const visibleSteps = service.steps.filter(step => step.kind === 'included' || stepIsAvailable(step, appointmentType));
    const optionalExtras = (service.optionalExtras ?? []).filter(step => stepIsAvailable(step, appointmentType));
    return <div className={isOpen ? 'service-modal is-open' : 'service-modal'} onMouseDown={event => {
        if (event.target === event.currentTarget)
            onClose();
    }}><div className="service-modal-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="service-modal-title"><div className="service-modal-top"><span>Service details</span><button type="button" ref={closeButtonRef} onClick={onClose} aria-label="Close service details">×</button></div><div className="service-modal-body"><div className="service-modal-intro"><h2 id="service-modal-title">{service.name}<span>.</span></h2><p>{service.description}</p><dl className="service-meta"><div><dt>Duration</dt><dd>{service.duration}</dd></div><div><dt>Price</dt><dd>{service.price}</dd></div><div><dt>Available</dt><dd>{service.appointmentTypes.join(' / ')}</dd></div></dl></div><div className="service-included"><h3>Service sequence</h3><ol className="service-sequence">{visibleSteps.map((step, index) => <li key={step.id}>{step.kind === 'optional' ? <button type="button" className={selectedExtraIds.includes(step.id) ? 'sequence-step optional selected' : 'sequence-step optional'} aria-pressed={selectedExtraIds.includes(step.id)} onClick={() => onToggleExtra(step.id)}><span className="step-number">{String(index + 1).padStart(2, '0')}</span><span className="step-selector" aria-hidden="true"/><span className="step-label">{step.label}</span><small>{step.availableFor ? `Optional · ${step.availableFor.join(' / ')} only` : 'Optional'}</small></button> : <div className="sequence-step included"><span className="step-number">{String(index + 1).padStart(2, '0')}</span><span className="step-label">{step.label}</span><small>Included</small></div>}</li>)}</ol>{optionalExtras.length > 0 && <div className="service-extra-group"><h4>Optional extras</h4><div className="service-extra-options">{optionalExtras.map(step => <button type="button" key={step.id} className={selectedExtraIds.includes(step.id) ? 'service-extra-option selected' : 'service-extra-option'} aria-pressed={selectedExtraIds.includes(step.id)} onClick={() => onToggleExtra(step.id)}><span className="step-selector" aria-hidden="true"/><span>{step.label}</span></button>)}</div><small>Available for shop appointments.</small></div>}<a className="button service-modal-cta" href="#booking" onClick={() => onBook(service)}>Book this service</a></div></div></div></div>;
}
function ServicesSection({ service, appointmentType, selectedExtras, onServiceChange, onAppointmentTypeChange, onToggleExtra }: {
    service: string;
    appointmentType: AppointmentType;
    selectedExtras: Record<string, string[]>;
    onServiceChange: (value: string) => void;
    onAppointmentTypeChange: (value: AppointmentType) => void;
    onToggleExtra: (serviceName: string, stepId: string) => void;
}) {
    const [activeServiceName, setActiveServiceName] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const selectedService = services.find(item => item.name === service) ?? services[0];
    const activeService = services.find(item => item.name === activeServiceName) ?? null;
    const openDetails = (item: Service) => {
        onServiceChange(item.name);
        if (!item.appointmentTypes.includes(appointmentType))
            onAppointmentTypeChange(item.appointmentTypes[0] ?? 'Shop');
        setActiveServiceName(item.name);
        setIsModalOpen(true);
    };
    const bookService = (item: Service) => {
        onServiceChange(item.name);
        setIsModalOpen(false);
    };
    const closeDetails = useCallback(() => setIsModalOpen(false), []);
    return <><section className="section services-section" id="services"><div className="section-heading"><div><p className="eyebrow"><span>01</span> THE SERVICES</p><h2>Find your finish<span className="orange">.</span></h2></div><p>From a subtle refresh to a complete new look.<br/>Select your service. We’ll take care of the detail.</p></div><div className="service-cards" role="group" aria-label="Choose a service">{services.map((item, index) => <div key={item.name} className={`service-card ${service === item.name ? 'is-selected' : ''}`}><button type="button" className="service-card-open" aria-label={`View ${item.name} details`} onClick={() => openDetails(item)}>{item.image ? <img className="service-card-image" src={item.image} style={{ objectPosition: item.imagePosition }} alt=""/> : <AbstractArt variant={item.shape}/>}<span className="card-top"><span>0{index + 1}</span></span><span className="service-info"><strong>{item.name}</strong><span>{item.note}</span></span></button><div className="appointment-mode-selectors" role="group" aria-label={`${item.name} appointment type`}>{(['Shop', 'Mobile'] as AppointmentType[]).map(type => <button type="button" key={type} className={service === item.name && appointmentType === type ? 'selected' : ''} disabled={!item.appointmentTypes.includes(type)} aria-label={`Select ${item.name} for a ${type.toLowerCase()} appointment`} aria-pressed={service === item.name && appointmentType === type} onClick={() => { onServiceChange(item.name); onAppointmentTypeChange(type); }}>{type === 'Shop' ? 'S' : 'M'}</button>)}</div></div>)}</div><div className="service-bottom"><p><span className="status-dot"/> <strong>{service}</strong> selected <span className="muted-divider">/</span> Made for you.</p><button className="text-link" type="button" onClick={() => openDetails(selectedService)}>View service details <Arrow /></button></div></section><ServiceDetailModal service={activeService} isOpen={isModalOpen} appointmentType={appointmentType} selectedExtraIds={activeService ? selectedExtras[activeService.name] ?? [] : []} onToggleExtra={stepId => activeService && onToggleExtra(activeService.name, stepId)} onClose={closeDetails} onBook={bookService}/></>;
}
function BookingArtwork() {
    return <div className="booking-art"><p className="eyebrow"><span>03</span> TAKE YOUR SEAT</p><h2>Your next<br/>fresh start<span className="orange">.</span></h2><p className="booking-art-copy">A little time for yourself.<br/>A look that feels like you.</p><div className="booking-art-orbit"/><img className="booking-art-cutout" src="/rjw-hero-cutout.png" alt=""/><div className="booking-art-blade"/><div className="booking-art-beam"/><div className="booking-art-line"/></div>;
}
function Booking({ service, appointmentType, selectedExtraIds, onServiceChange, onAppointmentTypeChange, onToggleExtra }: {
    service: string;
    appointmentType: AppointmentType;
    selectedExtraIds: string[];
    onServiceChange: (value: string) => void;
    onAppointmentTypeChange: (value: AppointmentType) => void;
    onToggleExtra: (serviceName: string, stepId: string) => void;
}) {
    const [submitted, setSubmitted] = useState(false);
    const today = new Date();
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const selectedService = services.find(item => item.name === service) ?? services[0];
    const availableExtras = getAvailableExtras(selectedService, appointmentType);
    const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
    return <section className="section booking-section" id="booking"><div className="booking-intro"><BookingArtwork/></div><form className="booking-form" onSubmit={submit} onChange={() => setSubmitted(false)}><div className="form-heading"><h3>Make it yours</h3><span className="preview-badge">BOOKING PREVIEW</span></div><div className="form-grid"><label>Service<select name="service" value={service} onChange={e => onServiceChange(e.target.value)}>{services.map(item => <option key={item.name}>{item.name}</option>)}</select></label><label>Barber<select name="barber" defaultValue="Any available barber"><option>Any available barber</option><option>RjW — Lead barber</option></select></label><fieldset className="full-width"><legend>Appointment type</legend><div className="type-options">{(['Shop', 'Mobile'] as AppointmentType[]).map(type => <label className={appointmentType === type ? 'type-option selected' : 'type-option'} key={type}><input type="radio" name="appointmentType" value={type} checked={appointmentType === type} onChange={() => onAppointmentTypeChange(type)}/><span>{type === 'Shop' ? '⌂' : '↗'}</span>{type}<span className="radio-indicator"/></label>)}</div></fieldset>{availableExtras.length > 0 && <fieldset className="full-width booking-extras-fieldset"><legend>Optional extras</legend><div className="booking-extras">{availableExtras.map(step => <label className={selectedExtraIds.includes(step.id) ? 'booking-extra selected' : 'booking-extra'} key={step.id}><input type="checkbox" checked={selectedExtraIds.includes(step.id)} onChange={() => onToggleExtra(selectedService.name, step.id)}/><span className="extra-selector" aria-hidden="true"/><span>{step.label}</span></label>)}</div><span className="field-help">Available for shop appointments.</span></fieldset>}{appointmentType === 'Mobile' && <label className="full-width">Location / postcode<input name="postcode" autoComplete="postal-code" placeholder="Enter your postcode" required/><span className="field-help">Check mobile availability in your area. Coverage to be confirmed.</span></label>}<label>Date<input type="date" name="date" min={minDate} required/></label><label>Time<select name="time" defaultValue="" required><option value="" disabled>Select a time</option>{['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => <option key={time}>{time}</option>)}</select></label><label className="full-width">Full name<input name="name" autoComplete="name" placeholder="Your name" required/></label><label>Phone<input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" required/></label><label>Email<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required/></label></div><button className="button booking-submit" type="submit">Preview Appointment <Arrow /></button><p className="form-disclaimer">Just a preview for now. Times are illustrative; no booking is sent.</p><p role="status" className={submitted ? 'form-status visible' : 'form-status'}>{submitted ? 'This is a booking preview. Online booking is coming soon — no appointment has been reserved.' : ''}</p></form></section>;
}
function ContactSocials() {
    return <div className="social-placeholders"><a className="social-link" href="https://www.instagram.com/rocky.rjw_f4fade/" target="_blank" rel="noopener noreferrer" aria-label="RjW Barbering on Instagram"><img src="/instagram.png" alt=""/></a><a className="social-link" href="https://www.tiktok.com/@rocky_rjw" target="_blank" rel="noopener noreferrer" aria-label="RjW Barbering on TikTok"><img src="/tiktok.png" alt=""/></a></div>;
}
function App() {
    const [service, setService] = useState('Skin Fade');
    const [appointmentType, setAppointmentType] = useState<AppointmentType>('Shop');
    const [selectedExtras, setSelectedExtras] = useState<Record<string, string[]>>({});
    const [galleryExpanded, setGalleryExpanded] = useState(false);
    const toggleExtra = useCallback((serviceName: string, stepId: string) => {
        setSelectedExtras(current => {
            const serviceExtras = current[serviceName] ?? [];
            const nextExtras = serviceExtras.includes(stepId) ? serviceExtras.filter(id => id !== stepId) : [...serviceExtras, stepId];
            return { ...current, [serviceName]: nextExtras };
        });
    }, []);
    const changeAppointmentType = useCallback((type: AppointmentType) => {
        setAppointmentType(type);
        setSelectedExtras(current => Object.fromEntries(Object.entries(current).map(([serviceName, stepIds]) => {
            const serviceConfig = services.find(item => item.name === serviceName);
            const availableIds = new Set(serviceConfig ? getAvailableExtras(serviceConfig, type).map(step => step.id) : []);
            return [serviceName, stepIds.filter(id => availableIds.has(id))];
        })));
    }, []);
    return <><a className="skip-link" href="#main">Skip to content</a><Navigation /><main id="main"><section className="hero" id="home"><h1><span>RjW</span> BARBERING<span className="title-dot">.</span></h1><div className="hero-stage"><AbstractArt variant="hero"/><div className="hero-content"><p className="eyebrow">MORE THAN A HAIRCUT</p><h2>A sharper look.<br />A different energy.</h2><p>Clean cuts, sharp fades and a finish built around you.</p><div className="hero-actions"><a className="button" href="#booking">Book Appointment</a><a className="text-link" href="#services">View Services</a></div></div></div></section><HeroTicker/><ServicesSection service={service} appointmentType={appointmentType} selectedExtras={selectedExtras} onServiceChange={setService} onAppointmentTypeChange={changeAppointmentType} onToggleExtra={toggleExtra}/><section className="section gallery-section" id="gallery"><div className="section-heading"><div><p className="eyebrow"><span>02</span> IN THE DETAILS</p><h2>Good from every angle<span className="orange">.</span></h2></div><p>A feel for the craft. A glimpse of the energy.<br />Our work, coming into focus.</p></div><div className="gallery-grid"><div className="gallery-panel gallery-main"><AbstractArt variant="gallery-one"/><span className="panel-tag">01 — PRECISION</span><div className="gallery-caption"><span>IT’S ALL IN<br />THE DETAILS.</span><span className="outlined-arrow">↗</span></div></div><div className="gallery-panel gallery-secondary"><AbstractArt variant="gallery-two"/><span className="panel-tag">02 — FORM & TEXTURE</span><span className="panel-bottom">A DIFFERENT PERSPECTIVE.</span></div><div className="gallery-panel gallery-quote"><span className="spark">✳</span><p>Not just a cut.<br />A signature.</p><span>THE RJW APPROACH</span></div></div><div className="gallery-expanded" id="full-gallery" hidden={!galleryExpanded}><div className="gallery-panel"><AbstractArt variant="complete"/><span className="panel-tag">03 — THE FINISH</span></div><div className="gallery-panel"><AbstractArt variant="fade"/><span className="panel-tag">04 — THE ENERGY</span></div><p>Space for the real work. The full photography collection is coming soon.</p></div><div className="gallery-bottom"><span>VISUAL STUDIES / PHOTOGRAPHY COMING SOON</span><button className="text-link" aria-expanded={galleryExpanded} aria-controls="full-gallery" onClick={() => setGalleryExpanded(!galleryExpanded)}>{galleryExpanded ? 'Close Gallery' : 'View Full Gallery'} <Arrow /></button></div></section><Booking service={service} appointmentType={appointmentType} selectedExtraIds={selectedExtras[service] ?? []} onServiceChange={setService} onAppointmentTypeChange={changeAppointmentType} onToggleExtra={toggleExtra}/><RecentWorkStrip/><section className="contact-section" id="contact"><div><p className="eyebrow">LET’S KEEP IN TOUCH</p><h2>Good hair.<br />Better energy<span className="orange">.</span></h2></div><div className="contact-info"><div><span>FIND US</span><p>Shop location coming soon</p><p>Mobile service area to be confirmed</p></div><div><span>SAY HELLO</span><p className="contact-links"><a href="mailto:rocks14rjw@gmail.com">rocks14rjw@gmail.com</a><a href="tel:07344184570">07344 184570</a></p></div><ContactSocials/></div></section></main><footer><Brand /><p>© {new Date().getFullYear()} RjW Barbering. All rights reserved.</p><a href="#home">BACK TO TOP ↑</a></footer></>;
}
export default App;
