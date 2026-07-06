// ============================================================
// CURSOR CUSTOM con física simple (lerp)
// ============================================================
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const isTouchDevice = window.matchMedia('(max-width: 860px)').matches;

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;

if (!isTouchDevice && dot && ring) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    const xRatio = (e.clientX / window.innerWidth) - 0.5;
    const yRatio = (e.clientY / window.innerHeight) - 0.5;
    const g1 = document.getElementById('glow1');
    const g2 = document.getElementById('glow2');
    if (g1) g1.style.transform = `translate(${xRatio * 50}px, ${yRatio * 50}px)`;
    if (g2) g2.style.transform = `translate(${xRatio * -36}px, ${yRatio * -36}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, .proc-card, .skill-card, .mini-card, .edu-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '54px';
      ring.style.height = '54px';
      ring.style.borderColor = 'var(--cyan)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '30px';
      ring.style.height = '30px';
      ring.style.borderColor = 'var(--violet)';
    });
  });
}

// ============================================================
// SCROLL REVEAL orquestado
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

// ============================================================
// CONTADORES animados al entrar en viewport
// ============================================================
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const customText = el.dataset.text;

  if (customText) {
    // Para métricas no numéricas (ej: "Diaria → Auto")
    el.textContent = customText;
    return;
  }

  if (isNaN(target)) return;

  let current = 0;
  const duration = 1100;
  const stepTime = 22;
  const steps = duration / stepTime;
  const increment = target / steps;

  const iv = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(iv);
    }
    el.textContent = Math.round(current);
  }, stepTime);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.metric-num').forEach((el) => counterObserver.observe(el));

// ============================================================
// Fallback de imagen de perfil (si no carga, mostrar iniciales)
// ============================================================
const profileImg = document.getElementById('profile-img');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    const frame = profileImg.parentElement;
    profileImg.remove();
    const initials = document.createElement('div');
    initials.style.cssText = `
      width:88%; height:88%; border-radius:50%; display:flex; align-items:center; justify-content:center;
      font-family:'Space Grotesk', sans-serif; font-size:3rem; font-weight:700;
      background: linear-gradient(135deg, rgba(124,92,255,.18), rgba(34,211,238,.1));
      color: var(--cyan); position:relative; z-index:1;
    `;
    initials.textContent = 'JE';
    frame.prepend(initials);
  });
}
