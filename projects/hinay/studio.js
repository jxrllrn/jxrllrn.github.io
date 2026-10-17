(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const scenes = [
    {src:'product-images/01-hero.png',alt:'Front view of the HINAY Daily Reset bottle on warm cream stone.'},
    {src:'product-images/02-evening-ritual.png',alt:'HINAY on a ceramic tray beside a folded towel in a warmly lit tiled bathroom.'},
    {src:'product-images/03-packaging-detail.png',alt:'Close view of the sage pump, ivory bottle and HINAY label, with droplets on the counter.'}
  ];
  $$('[data-scene]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.scene);
    $('#product-photo').src = scenes[index].src;$('#product-photo').alt = scenes[index].alt;
    $('#photo-index').textContent = `0${index + 1} / 03`;
    $$('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  const chapters = [{scene:1,label:'THE EVENING RITUAL'},{scene:2,label:'THE EVERYDAY DETAILS'},{scene:0,label:'A MOMENT FOR YOURSELF'}];
  $$('[data-chapter]').forEach(button => button.addEventListener('click', () => {
    const chapter = chapters[Number(button.dataset.chapter)];
    $('#ritual-photo').src = scenes[chapter.scene].src;$('#ritual-photo').alt = scenes[chapter.scene].alt;
    $('#ritual-scene-label').textContent = chapter.label;
    $$('[data-chapter]').forEach(b => {b.classList.toggle('active', b === button);b.setAttribute('aria-pressed', String(b === button));});
  }));
  const art = {
    ads:[
      {name:'Hinay muna.',src:'ads/01-hinay-muna.png',svg:'editable/ads/01-hinay-muna.svg',description:'The launch message, paired with the master product image.',alt:'HINAY product ad reading Mahaba ang araw. Hinay muna.'},
      {name:'A little pause.',src:'ads/02-little-pause.png',svg:'editable/ads/02-little-pause.svg',description:'The evening ritual, framed by a deep forest-green headline.',alt:'HINAY bathroom photograph with the headline Make room for a little pause.'},
      {name:'Meet Daily Reset.',src:'ads/03-meet-daily-reset.png',svg:'editable/ads/03-meet-daily-reset.svg',description:'A closer look at the packaging and the campaign’s sage accent.',alt:'HINAY bottle detail with the headline Meet Daily Reset.'}
    ],
    carousel:[
      {name:'Mahaba ang araw?',src:'carousel/01-long-day.png',svg:'editable/carousel/01-long-day.svg',description:'Chapter 01: the invitation to pause.',alt:'Cream carousel panel reading Mahaba ang araw? A small pause starts here.'},
      {name:'Put your things down.',src:'carousel/02-put-things-down.png',svg:'editable/carousel/02-put-things-down.svg',description:'Chapter 02: a familiar end-of-day moment.',alt:'Stone-coloured carousel panel reading Put your things down.'},
      {name:'Take a moment.',src:'carousel/03-wash-up.png',svg:'editable/carousel/03-wash-up.svg',description:'Chapter 03: the shift into an evening routine.',alt:'Bathroom product scene with the headline Take a moment to wash up.'},
      {name:'Hinay muna.',src:'carousel/04-hinay-muna.png',svg:'editable/carousel/04-hinay-muna.svg',description:'Chapter 04: the campaign’s central thought.',alt:'Forest-green carousel panel reading Hinay muna. A little pause. A daily reset.'},
      {name:'Your Daily Reset.',src:'carousel/05-product-reveal.png',svg:'editable/carousel/05-product-reveal.svg',description:'Chapter 05: the product reveal.',alt:'HINAY product reveal with the headline Meet Daily Reset.'}
    ],
    product:[
      {name:'The master image.',src:scenes[0].src,description:'The original AI-generated bottle reference, in soft cream light.',alt:scenes[0].alt},
      {name:'The evening ritual.',src:scenes[1].src,description:'A reference-led variation in a warm bathroom setting.',alt:scenes[1].alt},
      {name:'The details.',src:scenes[2].src,description:'A reference-led close view of the packaging.',alt:scenes[2].alt}
    ]
  };
  let currentFilter = 'ads', currentIndex = 0, opener = null;
  const dialog = $('#art-dialog');
  function renderGallery(filter) {
    currentFilter = filter;
    const grid = $('#art-grid');grid.replaceChildren();
    art[filter].forEach((item,index) => {
      const card = document.createElement('article');card.className = 'art-card';card.dataset.type = filter;card.style.animationDelay = `${index * 45}ms`;
      const button = document.createElement('button');button.type = 'button';button.setAttribute('aria-label', `View ${item.name}`);
      const image = document.createElement('img');image.src = item.src;image.alt = item.alt;image.loading = 'lazy';image.width = filter === 'product' ? 1254 : 1080;image.height = filter === 'product' ? 1254 : 1350;
      const icon = document.createElement('span');icon.className = 'art-open';icon.setAttribute('aria-hidden','true');icon.textContent = '↗';button.append(image,icon);
      button.addEventListener('click', () => {opener = button;currentIndex = index;updateViewer();dialog.showModal();document.body.classList.add('viewer-open');});
      const caption = document.createElement('div');caption.className = 'art-caption';
      const heading = document.createElement('h3');heading.textContent = item.name;
      const number = document.createElement('span');number.textContent = `${String(index+1).padStart(2,'0')} / ${String(art[filter].length).padStart(2,'0')}`;
      caption.append(heading,number);card.append(button,caption);grid.append(card);
    });
    $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
  }
  function updateViewer() {
    const item = art[currentFilter][currentIndex];
    $('#viewer-image').src = item.src;$('#viewer-image').alt = item.alt;
    $('#viewer-title').textContent = item.name;$('#viewer-description').textContent = item.description;
    $('#viewer-index').textContent = `${currentFilter === 'product' ? 'PRODUCT IMAGERY' : currentFilter.toUpperCase()} / ${String(currentIndex+1).padStart(2,'0')} OF ${String(art[currentFilter].length).padStart(2,'0')}`;
    $('#viewer-png').href = item.src;$('#viewer-svg').hidden = !item.svg;
    if(item.svg)$('#viewer-svg').href = item.svg;else $('#viewer-svg').removeAttribute('href');
  }
  function moveViewer(direction) {currentIndex = (currentIndex + direction + art[currentFilter].length) % art[currentFilter].length;updateViewer();}
  $('#viewer-prev').addEventListener('click', () => moveViewer(-1));$('#viewer-next').addEventListener('click', () => moveViewer(1));$('#viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {document.body.classList.remove('viewer-open');if(opener?.isConnected)opener.focus();});
  dialog.addEventListener('keydown', event => {if(event.key==='ArrowLeft'){event.preventDefault();moveViewer(-1);}if(event.key==='ArrowRight'){event.preventDefault();moveViewer(1);}});
  dialog.addEventListener('click', event => {if(event.target !== dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => renderGallery(button.dataset.filter)));renderGallery('ads');
  const menuButton = $('.menu-toggle');
  function closeMenu(){menuButton.setAttribute('aria-expanded','false');$('#main-nav').classList.remove('open');}
  menuButton.addEventListener('click', () => {const open = menuButton.getAttribute('aria-expanded') !== 'true';menuButton.setAttribute('aria-expanded',String(open));$('#main-nav').classList.toggle('open',open);});
  $$('#main-nav a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
  document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
  matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  if('IntersectionObserver' in window){
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready');const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(element=>reveal.observe(element));}
    const activeSection=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('#main-nav a[href^="#"]').forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -55% 0px'});
    $$('main>section[id]').forEach(section=>activeSection.observe(section));
  }
})();
