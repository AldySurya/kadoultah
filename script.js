const welcomeScreen = document.querySelector('.welcome-screen');
const giftScreen = document.querySelector('.gift-screen');
const memoriesScreen = document.querySelector('.memories-screen');
const receiveButton = document.querySelector('[data-receive]');
const giftButton = document.querySelector('[data-gift]');
const restartButton = document.querySelector('[data-restart]');
const localVideo = document.getElementById('local-video');
const videoEmpty = document.getElementById('video-empty');

// Inject CONFIG ke DOM
(function applyConfig() {
  if (typeof CONFIG === 'undefined') return;

  document.querySelectorAll('[data-recipient]').forEach(el => el.textContent = CONFIG.recipient);

  // Foto: kosong => tetap placeholder "foto kamu"
  if (Array.isArray(CONFIG.photos)) {
    CONFIG.photos.forEach((photo, i) => {
      const cap = document.querySelector(`[data-caption-${i}]`);
      if (cap) cap.textContent = photo.caption || '"foto kamu"';
      if (photo.src) {
        const frame = document.querySelector(`.photo-card:nth-child(${i + 1}) .photo-frame`);
        if (frame) {
          frame.classList.remove('is-empty');
          frame.innerHTML = `<img src="${photo.src}" alt="Kenangan ${i + 1}" loading="lazy" /><span class="photo-placeholder">foto kamu<br><small>kosong</small></span>`;
          const img = frame.querySelector('img');
          if (img) img.addEventListener('error', () => {
            frame.classList.add('is-empty');
            frame.innerHTML = `<span class="photo-placeholder is-visible">foto kamu<br><small>kosong</small></span>`;
          });
        }
      }
    });
  }

  // Note kertas
  const titleEl = document.querySelector('[data-note-title]');
  const msgEl = document.querySelector('[data-note-message]');
  const footerEl = document.querySelector('[data-note-footer]');
  const dateEl = document.querySelector('[data-note-date]');
  if (titleEl && CONFIG.note) titleEl.textContent = CONFIG.note.title;
  if (msgEl && CONFIG.note) msgEl.innerHTML = CONFIG.note.message;
  if (footerEl && CONFIG.note) footerEl.textContent = CONFIG.note.footer;
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Video title
  const vTitleEl = document.querySelector('[data-video-title]');
  if (vTitleEl && CONFIG.videoTitle) vTitleEl.textContent = CONFIG.videoTitle;
  else if (vTitleEl && CONFIG.youtubeTitle) vTitleEl.textContent = CONFIG.youtubeTitle;

  if (CONFIG.buttonText) {
    const btnText = document.querySelector('[data-button-text]');
    if (btnText) btnText.textContent = CONFIG.buttonText;
  }
})();

// Video lokal - setup
function setupLocalVideo() {
  if (!localVideo) return;
  const rawSrc = (typeof CONFIG !== 'undefined' && (CONFIG.video || CONFIG.youtube)) ? String(CONFIG.video || CONFIG.youtube).trim() : 'lagu-kita.mp4';
  let src = rawSrc;
  if (/youtu\.?be|youtube\.com/.test(src)) {
    console.warn('[video] CONFIG.video berisi link YouTube, ganti ke file mp4 lokal seperti "lagu-kita.mp4"');
    src = 'lagu-kita.mp4';
  }
  if (!src) src = 'lagu-kita.mp4';
  const encoded = encodeURI(src);
  localVideo.src = encoded;
  localVideo.load();
  localVideo.addEventListener('loadeddata', () => {
    if (videoEmpty) videoEmpty.classList.add('is-hidden');
    localVideo.classList.add('has-video');
  });
  localVideo.addEventListener('error', () => {
    if (videoEmpty) {
      videoEmpty.classList.remove('is-hidden');
      videoEmpty.innerHTML = `<span class="yt-empty-icon">⚠️</span><span class="yt-empty-text">video tidak ditemukan<br><small>${encoded} tidak ada — cek nama file</small></span>`;
    }
    localVideo.classList.remove('has-video');
    console.warn('[video] gagal load:', encoded);
  });
  if (localVideo.readyState >= 2) {
    if (videoEmpty) videoEmpty.classList.add('is-hidden');
    localVideo.classList.add('has-video');
  }
}
setupLocalVideo();

function tryPlayVideo() {
  if (!localVideo) return;
  if (!localVideo.src || localVideo.src.endsWith('/')) setupLocalVideo();
  const p = localVideo.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {});
  }
}

// Partikel & hati beterbangan
document.querySelectorAll('.particles').forEach((container) => {
  const symbols = ['✦', '·', '♡', '✧', '•'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    p.textContent = symbols[i % symbols.length];
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * -10}s`;
    p.style.animationDuration = `${8 + Math.random() * 6}s`;
    p.style.fontSize = `${8 + Math.random() * 9}px`;
    container.appendChild(p);
  }
});
document.querySelectorAll('.hearts').forEach((container) => {
  for (let i = 0; i < 10; i++) {
    const h = document.createElement('span');
    h.textContent = '❤';
    h.style.left = `${Math.random() * 100}%`;
    h.style.animationDelay = `${Math.random() * -12}s`;
    h.style.animationDuration = `${10 + Math.random() * 8}s`;
    h.style.fontSize = `${10 + Math.random() * 12}px`;
    container.appendChild(h);
  }
});

// Flow: Welcome -> Gift (fix Android/iOS: support both click & touchend, debounce)
function goToGift() {
  tryPlayVideo();
  if (welcomeScreen.classList.contains('is-leaving')) return;
  welcomeScreen.classList.add('is-leaving');
  window.setTimeout(() => {
    welcomeScreen.style.display = 'none';
    welcomeScreen.classList.remove('is-active');
    giftScreen.classList.add('is-active');
    giftScreen.style.display = 'grid';
  }, 700);
}
function bindTap(el, handler) {
  let touchFired = false;
  el.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchFired = true;
    handler(e);
    setTimeout(() => { touchFired = false; }, 600);
  }, { passive: false });
  el.addEventListener('click', (e) => {
    if (touchFired) return;
    handler(e);
  });
}
if (receiveButton) bindTap(receiveButton, goToGift);

// Flow: Gift -> Memories
let giftTapped = false;
function openGift() {
  if (giftScreen.classList.contains('opening') || giftTapped) return;
  giftTapped = true;
  giftScreen.classList.add('opening');
  giftButton.setAttribute('aria-label', 'Kado sedang dibuka');
  if (navigator.vibrate) navigator.vibrate(80);
  if (window.navigator && 'vibrate' in navigator) {
    try { navigator.vibrate(60); } catch(e) {}
  }
  tryPlayVideo();
  window.setTimeout(() => {
    giftScreen.classList.add('opened');
    spawnHeartsBurst();
    window.setTimeout(() => {
      giftScreen.style.display = 'none';
      giftScreen.classList.remove('is-active');
      memoriesScreen.style.display = 'grid';
      void memoriesScreen.offsetWidth;
      memoriesScreen.classList.add('is-active');
      window.setTimeout(() => memoriesScreen.classList.add('visible'), 80);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      spawnHeartsBurst();
      if (localVideo && !localVideo.src) setupLocalVideo();
    }, 1100);
  }, 1800);
}
if (giftButton) bindTap(giftButton, openGift);

// Restart + reset gift lock
if (restartButton) {
  const doRestart = () => {
    memoriesScreen.classList.remove('is-active', 'visible');
    memoriesScreen.style.display = 'none';
    giftScreen.classList.remove('opening', 'opened');
    giftScreen.style.display = 'none';
    welcomeScreen.style.display = 'grid';
    void welcomeScreen.offsetWidth;
    welcomeScreen.classList.remove('is-leaving');
    welcomeScreen.classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    giftButton.setAttribute('aria-label', 'Buka kado');
    giftTapped = false;
    if (localVideo) {
      localVideo.pause();
      localVideo.currentTime = 0;
    }
  };
  bindTap(restartButton, doRestart);
}

// iOS/Android viewport height fix
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  if (window.visualViewport) {
    document.documentElement.style.setProperty('--vv-height', `${window.visualViewport.height}px`);
  }
}
setVH();
window.addEventListener('resize', setVH);
if (window.visualViewport) window.visualViewport.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 300));

// Prevent double-tap zoom: handled per-button via bindTap (global prevent removed - was breaking iOS/Android click)

// Cegah scroll bounce di welcome/gift screen (iOS)
let startY = 0;
document.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchmove', (e) => {
  const inMemories = memoriesScreen.classList.contains('is-active');
  if (!inMemories) {
    const curY = e.touches[0].clientY;
    const diff = curY - startY;
    if (Math.abs(diff) > 10) e.preventDefault();
  }
}, { passive: false });

function spawnHeartsBurst() {
  const container = document.querySelector('.hearts');
  if (!container) return;
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = ['❤️','💕','💖','✨'][i % 4];
    s.style.left = `${45 + Math.random()*10}%`;
    s.style.top = `45%`;
    s.style.position = 'absolute';
    s.style.fontSize = `${16 + Math.random()*10}px`;
    s.style.animation = `driftHeart ${2 + Math.random()*2}s ease-out forwards`;
    s.style.animationDelay = `${i*0.08}s`;
    container.appendChild(s);
    setTimeout(() => s.remove(), 4000);
  }
}
