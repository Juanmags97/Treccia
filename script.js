document.addEventListener('DOMContentLoaded', () => {
  // Configuración comercial
  const PHONE_NUMBER = '5493874461513';

  /* ---------- 1. CALCULADORA DE MEMBRESÍAS ---------- */
  const empSlider = document.getElementById('empSlider');
  const empInput = document.getElementById('empInput');

  const priceBronce = document.getElementById('priceBronce');
  const pricePlata = document.getElementById('pricePlata');
  const priceOro = document.getElementById('priceOro');

  const subBronce = document.getElementById('subBronce');
  const subPlata = document.getElementById('subPlata');
  const subOro = document.getElementById('subOro');

  const btnBronce = document.getElementById('btnBronce');
  const btnPlata = document.getElementById('btnPlata');
  const btnOro = document.getElementById('btnOro');
  const waFloat = document.getElementById('waFloat');

  // Parámetros de fijación de precio (Fijo + Variable por colaborador)
  const PRICING = {
    bronce: { fixed: 8000, perEmp: 400 },
    plata:  { fixed: 18000, perEmp: 800 },
    oro:    { fixed: 95000, perEmp: 6000 }
  };

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('es-AR');
  }

  function updatePricing(employees) {
    const qty = parseInt(employees, 10) || 5;

    // Cálculo proporcional
    const totalBronce = PRICING.bronce.fixed + (qty * PRICING.bronce.perEmp);
    const totalPlata  = PRICING.plata.fixed  + (qty * PRICING.plata.perEmp);
    const totalOro    = PRICING.oro.fixed    + (qty * PRICING.oro.perEmp);

    // Actualización visual de precios
    priceBronce.innerHTML = `${formatCurrency(totalBronce)}<span> /mes</span>`;
    pricePlata.innerHTML  = `${formatCurrency(totalPlata)}<span> /mes</span>`;
    priceOro.innerHTML    = `${formatCurrency(totalOro)}<span> /mes</span>`;

    subBronce.textContent = `Para ${qty} colaboradores`;
    subPlata.textContent  = `Para ${qty} colaboradores`;
    subOro.textContent    = `Para ${qty} colaboradores`;

    // Generación de links dinámicos para WhatsApp
    const msgBronce = encodeURIComponent(`Hola TRECCIA, quiero cotizar la membresía *Plan Bronce* para un equipo de *${qty} colaboradores*.`);
    const msgPlata  = encodeURIComponent(`Hola TRECCIA, quiero cotizar la membresía *Plan Plata* para un equipo de *${qty} colaboradores*.`);
    const msgOro    = encodeURIComponent(`Hola TRECCIA, quiero cotizar la membresía *Plan Oro* para un equipo de *${qty} colaboradores*.`);
    const msgFloat  = encodeURIComponent(`Hola TRECCIA, quiero hacer una consulta sobre los regalos corporativos para *${qty} colaboradores*.`);

    btnBronce.href = `https://wa.me/${PHONE_NUMBER}?text=${msgBronce}`;
    btnPlata.href  = `https://wa.me/${PHONE_NUMBER}?text=${msgPlata}`;
    btnOro.href    = `https://wa.me/${PHONE_NUMBER}?text=${msgOro}`;
    waFloat.href   = `https://wa.me/${PHONE_NUMBER}?text=${msgFloat}`;
  }

  if (empSlider && empInput) {
    empSlider.addEventListener('input', (e) => {
      empInput.value = e.target.value;
      updatePricing(e.target.value);
    });

    empInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (val > 500) val = 500;
      if (val < 1) val = 1;
      empSlider.value = val;
      updatePricing(val);
    });

    // Inicialización
    updatePricing(empSlider.value);
  }

  /* ---------- 2. ANIMACIÓN DEL HERO (LETRAS) ---------- */
  const lineEls = document.querySelectorAll('#heroTitle .hero-line');
  const letters = [];

  lineEls.forEach((lineEl) => {
    const text = lineEl.getAttribute('data-text');
    if (!text) return;
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      lineEl.appendChild(span);
      letters.push(span);
    });
  });

  const hero = document.getElementById('hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && hero && letters.length) {
    let mouseX = -9999;
    let mouseY = -9999;
    let active = false;

    hero.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
    });

    hero.addEventListener('mouseleave', () => {
      active = false;
    });

    function animateLetters() {
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 130;
        const strength = active ? Math.max(0, 1 - distance / radius) : 0;
        const pushX = -dx * strength * 0.22;
        const pushY = -dy * strength * 0.22;
        const scale = 1 + strength * 0.1;
        letter.style.transform = `translate(${pushX}px, ${pushY}px) scale(${scale})`;
      });
      requestAnimationFrame(animateLetters);
    }
    animateLetters();
  }

  /* ---------- 3. MENÚ MOBILE ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 4. ENVÍO DE FORMULARIO (NETLIFY / AJAX) ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
      .then(() => {
        form.classList.add('hide-on-success');
        success.classList.add('show');
        form.reset();
      })
      .catch((err) => {
        console.error('Error al enviar formulario:', err);
        alert('Hubo un problema al enviar el mensaje. Por favor, escribinos por WhatsApp.');
      });
    });
  }

  /* ---------- 5. REVEAL ANIMATIONS ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }
});