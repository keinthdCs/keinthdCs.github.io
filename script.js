// Utilidades de UI: progreso de scroll, revelar secciones, navegación móvil,
// smooth scrolling y pequeñas interacciones

const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

// Año en footer
qs('#year').textContent = new Date().getFullYear();

// Smooth scroll para anclas
qsa('a[href^="#"]').forEach((a) => {
	a.addEventListener('click', (e) => {
		const href = a.getAttribute('href');
		if (href && href.startsWith('#')) {
			e.preventDefault();
			const section = qs(href);
			if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});

// Progreso de scroll
const progress = qs('.scroll-progress');
const setProgress = () => {
	const h = document.documentElement;
	const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
	progress.style.transform = `scaleX(${Math.max(0, Math.min(1, scrolled))})`;
};
setProgress();
addEventListener('scroll', setProgress, { passive: true });
addEventListener('resize', setProgress);

// IntersectionObserver para revelar
const revealEls = qsa('.reveal');
const io = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('is-visible');
			io.unobserve(entry.target);
		}
	});
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// Animación de números (stats)
const animateCount = (el) => {
	const raw = el.dataset.count;
	if (!raw) return;
	const target = parseInt(raw, 10) || 0;
	let start = 0;
	const duration = 1000;
	const t0 = performance.now();
	const step = (t) => {
		const p = Math.min(1, (t - t0) / duration);
		const val = Math.floor(p * target);
		el.textContent = `${val}+`;
		if (p < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
};

qsa('.stats__num').forEach((el) => {
	const obs = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) { animateCount(el); obs.unobserve(el); }
		});
	});
	obs.observe(el);
});

// Menú móvil
const toggle = qs('.nav__toggle');
const menu = qs('#menu');
toggle.addEventListener('click', () => {
	const open = toggle.getAttribute('aria-expanded') === 'true';
	toggle.setAttribute('aria-expanded', String(!open));
	menu.classList.toggle('is-open');
});
qsa('#menu a').forEach((link) => link.addEventListener('click', () => {
	menu.classList.remove('is-open');
	toggle.setAttribute('aria-expanded', 'false');
}));

// Copiar email
const copyBtn = qs('#copy-email');
copyBtn.addEventListener('click', async () => {
	const email = copyBtn.dataset.email;
	try {
		await navigator.clipboard.writeText(email);
		copyBtn.textContent = 'Copiado';
		setTimeout(() => (copyBtn.textContent = 'Copiar email'), 1500);
	} catch {
		prompt('Copia el correo:', email);
	}
});


