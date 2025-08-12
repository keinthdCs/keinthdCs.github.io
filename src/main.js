// Main client script: interactions, motion and UX enhancements
// - Theme toggle with localStorage
// - Mobile nav toggle
// - Scroll progress bar
// - Reveal on scroll via IntersectionObserver
// - Project carousel controls (prev/next)
// - Modals open/close with accessibility
// - Small perf helpers: passive listeners, requestIdleCallback shim

import './style.css'
import heroImg from '../eyes.jpg?url'

// Utils
const $ = (q, ctx = document) => ctx.querySelector(q)
const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q))

// requestIdleCallback polyfill
window.requestIdleCallback ||= (cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1)

// Theme
const themeKey = 'pref-theme'
function applyTheme(v) {
	document.documentElement.setAttribute('data-theme', v)
}
function initTheme() {
	const saved = localStorage.getItem(themeKey)
	if (saved) applyTheme(saved)
}
function toggleTheme() {
	const current = document.documentElement.getAttribute('data-theme')
	const next = current === 'light' ? 'dark' : 'light'
	applyTheme(next)
	localStorage.setItem(themeKey, next)
}

// Nav toggle
function initNav() {
	const toggle = $('#navToggle')
	const menu = $('#navMenu')
	if (!toggle || !menu) return
	toggle.addEventListener('click', () => {
		const open = menu.classList.toggle('is-open')
		toggle.setAttribute('aria-expanded', String(open))
	})
	// Close on link click (mobile)
	menu.addEventListener('click', (e) => {
		if (e.target.closest('a')) {
			menu.classList.remove('is-open')
			toggle.setAttribute('aria-expanded', 'false')
		}
	})
}

// Scroll progress
function initScrollProgress() {
	const bar = $('#scrollProgress')
	if (!bar) return
	const onScroll = () => {
		const el = document.documentElement
		const max = el.scrollHeight - el.clientHeight
		const p = max > 0 ? Math.min(1, el.scrollTop / max) : 0
		bar.style.width = `${p * 100}%`
	}
	document.addEventListener('scroll', onScroll, { passive: true })
	onScroll()
}

// Reveal on scroll
function initReveal() {
	const nodes = $$('.reveal')
	if (!nodes.length) return
	const io = new IntersectionObserver((entries, obs) => {
		for (const e of entries) {
			if (e.isIntersecting) {
				e.target.classList.add('is-visible')
				obs.unobserve(e.target)
			}
		}
	}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
	nodes.forEach(n => io.observe(n))
}

// Carousel controls
function initCarousel() {
	const track = $('#projectCarousel')
	if (!track) return
	const prev = $('#prevProject')
	const next = $('#nextProject')
	const slideW = () => track.firstElementChild?.getBoundingClientRect().width || 320
	const scrollBy = (dir) => {
		track.scrollBy({ left: dir * (slideW() + 16), behavior: 'smooth' })
	}
	prev?.addEventListener('click', () => scrollBy(-1))
	next?.addEventListener('click', () => scrollBy(1))
}

// Modals
function initModals() {
	const openers = $$('[data-modal-target]')
	if (!openers.length) return
	openers.forEach(btn => {
		btn.addEventListener('click', () => {
			const sel = btn.getAttribute('data-modal-target')
			const dialog = sel ? $(sel) : null
			if (!dialog) return
			dialog.showModal()
			const close = () => dialog.close()
			// Close btns
			dialog.querySelectorAll('[data-close]').forEach(c => c.addEventListener('click', close, { once: true }))
			// Backdrop click
			dialog.addEventListener('click', (e) => { if (e.target === dialog) close() }, { once: true })
			// ESC key (dialog handles this by default, but ensure)
			dialog.addEventListener('cancel', (e) => { e.preventDefault(); close() }, { once: true })
		})
	})
}

// Attach handlers and init progressive features
function main() {
	initTheme()
	initNav()
	initScrollProgress()
	// Bind hero background via Vite asset pipeline
	document.documentElement.style.setProperty('--hero', `url(${heroImg})`)
	requestIdleCallback(() => {
		initReveal()
		initCarousel()
		initModals()
	})
	$('#themeToggle')?.addEventListener('click', toggleTheme)
}

// DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main, { once: true })
} else {
	main()
}

