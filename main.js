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

await loadChangelog();

const tl = createTimeline({ delay: 100 });
document.querySelectorAll('.scramble').forEach((el, i) => {
  tl.add(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text)) }, i * 40);
  el.addEventListener('pointerenter', () => {
    animate(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text, { perturbation: 0.3 })) });
  });
});
tl.init();
