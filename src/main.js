// Asset imports (Vite will process these)
import heroUrl from '../eyes.jpg';

// Smooth section reveal using IntersectionObserver
const sections = Array.from(document.querySelectorAll('[data-section]'));
const dots = Array.from(document.querySelectorAll('.dotnav__dot'));
const progressBar = document.querySelector('.progress .bar');

const io = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) entry.target.classList.add('visible');
	});
}, { threshold: 0.15 });

sections.forEach((s) => io.observe(s));

// Mark active dot based on scroll
const sectionById = Object.fromEntries(sections.map(s => [`#${s.id}`, s]));

const highlightActive = () => {
	let current = sections[0]?.id;
	for (const s of sections) {
		const rect = s.getBoundingClientRect();
		if (rect.top <= window.innerHeight * 0.35) current = s.id;
	}
	dots.forEach((d) => d.classList.toggle('active', d.dataset.target === `#${current}`));
};
highlightActive();

window.addEventListener('scroll', () => {
	// progress bar
	const doc = document.documentElement;
	const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight);
	if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;
	highlightActive();
}, { passive: true });

// Dot navigation click
dots.forEach((btn) => {
	btn.addEventListener('click', () => {
		const target = sectionById[btn.dataset.target];
		target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

// Project horizontal scroller controls
const scroller = document.querySelector('.h-scroll');
const prevBtn = document.querySelector('.h-scroll__controls .prev');
const nextBtn = document.querySelector('.h-scroll__controls .next');
const scrollByAmount = () => Math.min(480, window.innerWidth * 0.6);

prevBtn?.addEventListener('click', () => scroller?.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
nextBtn?.addEventListener('click', () => scroller?.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));

// Contact form fake handler
const form = document.querySelector('.contact-form');
const formMsg = document.querySelector('.form-msg');
form?.addEventListener('submit', (e) => {
	e.preventDefault();
	const data = new FormData(form);
	const payload = Object.fromEntries(data.entries());
	// Here you could POST to an API/Email service.
	formMsg.textContent = 'Gracias, te responderé pronto.';
	form.reset();
});

// Set hero image
const heroImg = document.querySelector('img[data-hero-img]');
if (heroImg) heroImg.src = heroUrl;

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Respect reduced motion: remove transitions if user prefers
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
if (media.matches) {
	document.querySelectorAll('*').forEach((el) => {
		el.style.scrollBehavior = 'auto';
		el.style.transition = 'none';
		el.style.animation = 'none';
	});
}
