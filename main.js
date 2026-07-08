import { animate, createTimeline, scrambleText } from 'https://esm.sh/animejs';
const scrambleOpts = (text, extra = {}) => ({
  text, duration: 500, settleDuration: 250, perturbation: 0,
  chars: '', cursor: '░▒▓█', revealDelay: 0, revealRate: 50, settleRate: 30,
  ...extra,
});
async function loadChangelog() {
  const res = await fetch('./changelog.md');
  const text = await res.text();
  const entries = text.split(/^## /m).filter(Boolean);
  const container = document.getElementById('changelog-entries');
  container.innerHTML = entries.map(entry => {
    const [date, ...lines] = entry.trim().split('\n');
    const items = lines.filter(l => l.trim()).map(l =>
      `<li class="scramble" data-text="${l.replace(/^[-*]\s*/, '')}">${l.replace(/^[-*]\s*/, '')}</li>`
    ).join('');
    return `<div class="changelog-entry"><p class="changelog-date scramble" data-text="${date.trim()}">${date.trim()}</p><ul>${items}</ul></div>`;
  }).join('');
}
async function loadProjects() {
  const res = await fetch('./projects.md');
  const text = await res.text();
  const entries = text.split(/^## /m).filter(Boolean);
  const container = document.getElementById('project-entries');
  container.innerHTML = entries.map(entry => {
    const lines = entry.trim().split('\n').filter(l => l.trim());
    const name = lines[0].trim();
    const repoLine = lines.find(l => l.trim().toLowerCase().startsWith('repo:'));
    const repo = repoLine ? repoLine.split(/:(.+)/)[1].trim() : null;
    const description = lines.slice(1).filter(l => l !== repoLine).join(' ').trim();
    return `
      <div class="project">
        <span class="project-name scramble" data-text="${name}">${name}</span>
        <span class="project-desc scramble" data-text="${description}">${description}</span>
        ${repo ? `<a href="${repo}" target="_blank" rel="noopener">repo<span class="arrow">↗</span></a>` : ''}
      </div>
    `;
  }).join('');
}
await loadChangelog();
await loadProjects();
const tl = createTimeline({ delay: 100 });
document.querySelectorAll('.scramble').forEach((el, i) => {
  tl.add(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text)) }, i * 40);
  el.addEventListener('pointerenter', () => {
    animate(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text, { perturbation: 0.3 })) });
  });
});
tl.init();
// ===== counter =====
const counterEl = document.getElementById('counter');
function renderCount(count) {
  counterEl.textContent = String(count);
}
async function loadCount() {
  try {
    const res = await fetch('/api/counter');
    const data = await res.json();
    renderCount(data.count);
  } catch {
    counterEl.textContent = 'err';
  }
}
async function incrementCount() {
  try {
    const res = await fetch('/api/click', { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    renderCount(data.count);
  } catch {}
}
counterEl.addEventListener('click', incrementCount);
loadCount();
