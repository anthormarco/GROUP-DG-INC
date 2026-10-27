// Scroll header shadow
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 20 ? 'rgba(5,10,20,0.92)' : 'rgba(5,10,20,0.85)';
});

// Burger menu - improved responsive
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  nav.classList.toggle('open');
  burger.textContent = nav.classList.contains('open') ? '✕' : '☰';
});
// Close menu on link click
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.textContent = '☰';
  });
});
// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !burger.contains(e.target)) {
    nav.classList.remove('open');
    burger.textContent = '☰';
  }
});
// Close on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    nav.classList.remove('open');
    burger.textContent = '☰';
  }
});

// To top button
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if(window.scrollY > 400) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// Fade-in on scroll - respect reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.opacity='1';
        e.target.style.transform='translateY(0)';
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('.service-card, .eng, .gallery-item').forEach(el=>{
    el.style.opacity='0';
    el.style.transform='translateY(18px)';
    el.style.transition='all .6s ease';
    observer.observe(el);
  });
}

// === EMAILJS CONFIG - Groupe DG Inc. ===
const EMAILJS_SERVICE_ID = "service_jtkqc8w";
const EMAILJS_TEMPLATE_ID = "template_mayo87h";
const EMAILJS_PUBLIC_KEY = "9mtJYO8n7UjUtLC6Y";

function initEmailJS(){
  if(typeof emailjs !== 'undefined' && emailjs.init){
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized');
    return true;
  }
  return false;
}
if(!initEmailJS()){
  window.addEventListener('load', initEmailJS);
  setTimeout(initEmailJS, 500);
}

// Formulario Contacto con EmailJS
const form = document.getElementById('dgForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = '⏳ Envoi en cours...';
  statusEl.className = 'ok';
  const data = new FormData(form);
  const templateParams = {
    from_name: data.get('nom') || '',
    from_email: data.get('email') || '',
    telephone: data.get('tel') || '',
    service: data.get('service') || '',
    superficie: data.get('superficie') || '',
    frequence: data.get('freq') || '',
    message: data.get('message') || '',
    to_email: 'groupedg01@gmail.com'
  };
  const subject = `Demande soumission - ${templateParams.service} - ${templateParams.from_name}`;
  const body = `Nom: ${templateParams.from_name}%0D%0ATel: ${templateParams.telephone}%0D%0AEmail: ${templateParams.from_email}%0D%0AService: ${templateParams.service}%0D%0ASuperficie: ${templateParams.superficie}%0D%0AFrequence: ${templateParams.frequence}%0D%0AMessage: ${templateParams.message}`;
  if(typeof emailjs === 'undefined' || !emailjs.send){
    statusEl.innerHTML = `⚠ Service email en chargement... <a href="mailto:groupedg01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}" style="color:#2b9bff">Cliquez ici pour envoyer par mail</a>`;
    statusEl.className = 'err';
    window.location.href = `mailto:groupedg01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    return;
  }
  try {
    const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('EmailJS OK', res);
    statusEl.innerHTML = `✅ <b>Merci ${templateParams.from_name}!</b> Votre demande a été envoyée avec succès.<br>Nous vous répondrons en moins de 2h au ${templateParams.from_email} ou ${templateParams.telephone}`;
    form.reset();
  } catch(err){
    console.warn('EmailJS error full:', err);
    const errText = err?.text || err?.message || JSON.stringify(err);
    if(errText.includes('insufficient authentication scopes') || errText.includes('Gmail_API')){
      statusEl.innerHTML = `❌ <b>Error de permisos Gmail</b><br>Ve a EmailJS → Email Services → Tu servicio Gmail → <b>Delete</b> y créalo de nuevo marcando <b>"Send email"</b>.<br><br><a href="mailto:groupedg01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}" style="color:#2b9bff">Enviar por correo mientras tanto</a>`;
      statusEl.className = 'err';
      return;
    }
    statusEl.innerHTML = `❌ Erreur: ${errText}<br>Appelez <b>514 233-3397</b><br><br><a href="mailto:groupedg01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}" style="color:#2b9bff">Envoyer par mail</a>`;
    statusEl.className = 'err';
  }
});
