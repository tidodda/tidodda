import { animate, createTimeline, scrambleText } from 'https://esm.sh/animejs';

const scrambleOpts = (text, extra = {}) => ({
  text,
  duration: 500,
  settleDuration: 250,
  perturbation: 0,
  chars: '',
  cursor: '░▒▓█',
  revealDelay: 0,
  revealRate: 50,
  settleRate: 30,
  ...extra,
});

const tl = createTimeline({ delay: 100 });
document.querySelectorAll('.scramble').forEach((el, i) => {
  tl.add(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text)) }, i * 40);
  el.addEventListener('pointerenter', () => {
    animate(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text, { perturbation: 0.3 })) });
  });
});
tl.init();
