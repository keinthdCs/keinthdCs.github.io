// No asset imports needed for hero; served from public/images.

// Enable progressive enhancement marker so CSS animations only apply when JS is active
document.documentElement.classList.add('enhanced');

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

// Dynamically populate Projects with credible examples (can be edited later)
const projectsData = [
	{
		name: 'Analytics Dashboard',
		tech: ['React', 'Node', 'PostgreSQL', 'Chart.js'],
		desc: 'SPA con routing, estado global y gráficos en tiempo real. BFF en Node para agregaciones SQL y cacheo selectivo.',
		highlight: 'Paginación en servidor + índices compuestos + caché LRU. 4× de mejora en tiempos de consulta.',
		img: '/images/analytics.svg'
	},
	{
		name: 'Headless E‑commerce',
		tech: ['Vue', 'Express', 'Redis', 'SSR'],
		desc: 'Tiendas modulares con SSR para LCP bajo y catálogos grandes. Integraciones de pago y CMS headless.',
		highlight: 'Imágenes responsive, políticas de caché y streaming SSR. LCP < 2.0s en 4G.',
		img: '/images/commerce.svg'
	},
	{
		name: 'Interactive Microsite',
		tech: ['HTML', 'CSS', 'JavaScript'],
		desc: 'Narrativa de marca con scroll‑snap y micro‑interacciones accesibles. Sin dependencias pesadas.',
		highlight: 'Soporte de prefers‑reduced‑motion y foco visible. Bundle < 10KB gzip.',
		img: '/images/microsite.svg'
	},
	{
		name: 'Content API',
		tech: ['Node', 'Express', 'MongoDB', 'Rate limiting'],
		desc: 'API REST para contenidos con autenticación JWT, validación y registro estructurado.',
		highlight: 'Rate‑limit, cacheo por rutas y colas asíncronas. Uptime > 99.9%.',
		img: '/images/api.svg'
	},
	{
		name: 'Open Source CLI',
		tech: ['Node', 'ESM', 'CI/CD'],
		desc: 'Herramienta CLI para scaffolding de proyectos y pipelines de CI con plantillas seguras.',
		highlight: 'Tests E2E + cobertura > 90% y versiones semánticas con changelog automático.',
		img: '/images/cli.svg'
	},
	{
		name: 'Automation & Scraper',
		tech: ['Node', 'Playwright', 'Queue'],
		desc: 'Automatización de extracción y normalización de datos con workers y reintentos exponenciales.',
		highlight: 'Control de concurrencia, rotación de agentes, backoff y trazas para depuración.',
		img: '/images/automation.svg'
	}
];

const renderProjects = () => {
	if (!scroller) return;
	scroller.innerHTML = projectsData.map(p => `
		<article class="project card reveal">
			<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'" />
			<header>
				<h3>${p.name}</h3>
				<span class="tags">${p.tech.join(' • ')}</span>
			</header>
			<p>${p.desc}</p>
			<p><strong>${p.highlight}</strong></p>
		</article>
	`).join('');
	// observe new cards
	scroller.querySelectorAll('.reveal').forEach(el => io.observe(el));
};
renderProjects();

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

// Project images are already lazy; hero is eager for better LCP

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
