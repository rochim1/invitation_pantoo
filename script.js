const invitation = document.querySelector('#invitation');
const opening = document.querySelector('#opening');
const content = document.querySelector('#content');
const openButton = document.querySelector('#open-invitation');
const guestName = document.querySelector('#guest-name');
const musicButton = document.querySelector('#music');
const song = document.querySelector('#song');

const params = new URLSearchParams(location.search);
guestName.textContent = params.get('to') || 'Tamu Undangan';

openButton.addEventListener('click', () => {
  document.body.classList.remove('locked');
  document.body.classList.add('invitation-open');
  content.classList.add('revealed');
  content.setAttribute('aria-hidden', 'false');
  opening.classList.add('cover-closing');
  song.play().then(() => {
    musicButton.classList.add('playing');
    musicButton.textContent = '♪';
  }).catch(() => {});
  setTimeout(() => {
    opening.style.display = 'none';
    invitation.scrollTo({ top: 0, behavior: 'instant' });
    activateVisibleAnimations();
  }, 500);
});

musicButton.addEventListener('click', () => {
  const shouldPlay = !musicButton.classList.contains('playing');
  musicButton.classList.toggle('playing', shouldPlay);
  musicButton.textContent = shouldPlay ? '♪' : '♫';
  if (shouldPlay) song.play().catch(() => {}); else song.pause();
});

const weddingDate = new Date('2026-12-19T07:00:00+07:00').getTime();
function tick() {
  const distance = Math.max(0, weddingDate - Date.now());
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
  Object.entries(values).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(2, '0');
  });
}
tick();
setInterval(tick, 1000);

const animationPlan = [
  ['.hero .arch', 'fadeInDown', 100, true],
  ['.hero .eyebrow', 'zoomIn', 9000, true],
  ['.hero h2', 'zoomIn', 9000, true],
  ['.couple .script, .couple article, .couple .ampersand', 'fadeInDown', 300],
  ['.quote > *', 'fadeInUp', 300],
  ['.event .script, .event h3', 'zoomIn', 200],
  ['.countdown, .event-card', 'fadeInUp', 300],
  ['.gallery .script, .gallery h3', 'zoomIn', 200],
  ['.gallery-item', 'fadeInDown', 100],
  ['.rsvp .script, .rsvp h3', 'zoomIn', 200],
  ['.rsvp form, .wishes', 'fadeInUp', 300],
  ['footer > *', 'fadeInUp', 300]
];
const animatedSections = [];
animationPlan.forEach(([selector, animation, delay, slow]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add('animated', 'is-waiting');
    if (slow) element.classList.add('animated-slow');
    element.dataset.animation = animation;
    element.style.animationDelay = `${delay + index * 70}ms`;
    animatedSections.push(element);
  });
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.classList.contains('is-animated')) return;
    entry.target.classList.remove('is-waiting');
    entry.target.classList.add('is-animated', entry.target.dataset.animation);
    observer.unobserve(entry.target);
  });
}, { root: invitation, threshold: 0.12 });
animatedSections.forEach((section) => observer.observe(section));
function activateVisibleAnimations() {
  animatedSections.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0 && !element.classList.contains('is-animated')) {
      element.classList.remove('is-waiting');
      element.classList.add('is-animated', element.dataset.animation);
    }
  });
}

document.querySelector('#wish-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const message = document.querySelector('#message').value.trim();
  const attendance = document.querySelector('#attendance').value;
  if (!name || !message) return;
  const card = document.createElement('div');
  card.className = 'wish';
  const author = document.createElement('b');
  author.textContent = `${name} · ${attendance}`;
  const copy = document.createElement('span');
  copy.textContent = message;
  card.append(author, copy);
  document.querySelector('#wishes').prepend(card);
  event.target.reset();
});
