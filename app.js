const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' })
  : null;

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('in-view');
});

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  mobileMenu.classList.toggle('open', !open);
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 40
    ? '0 18px 50px rgba(0,0,0,.38)'
    : '0 18px 50px rgba(0,0,0,.2)';
}, { passive: true });

const dialog = document.querySelector('#project-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogMedia = document.querySelector('#dialog-media');
const dialogDescription = document.querySelector('#dialog-description');
const dialogFull = document.querySelector('#dialog-full');
let lastTrigger = null;

function openProject(card) {
  lastTrigger = card;
  dialogTitle.textContent = card.dataset.title || 'Selected project';
  dialogDescription.textContent = card.dataset.description || '';
  dialogMedia.replaceChildren();

  if (card.dataset.video) {
    const iframe = document.createElement('iframe');
    iframe.src = card.dataset.video;
    iframe.title = card.dataset.title || 'Project video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    dialogMedia.appendChild(iframe);
    dialogFull.hidden = true;
  } else {
    const image = document.createElement('img');
    image.src = card.dataset.media;
    image.alt = card.dataset.title || 'Project preview';
    dialogMedia.appendChild(image);
    dialogFull.href = card.dataset.full || card.dataset.media;
    dialogFull.hidden = false;
  }

  dialog.showModal();
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  dialog.close();
  dialogMedia.replaceChildren();
  document.body.style.overflow = '';
  lastTrigger?.focus();
}

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => openProject(card));
});

document.querySelector('.dialog-close').addEventListener('click', closeProject);
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) closeProject();
});
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProject();
});

if (!reduceMotion) {
  document.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    document.querySelector('.ambient-one').style.transform = `translate(${x}px, ${y}px)`;
    document.querySelector('.ambient-two').style.transform = `translate(${-x}px, ${-y}px)`;
  }, { passive: true });
}
