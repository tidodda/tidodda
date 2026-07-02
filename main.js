import { animate, createTimeline, scrambleText } from 'https://esm.sh/animejs';

const scrambleOpts = (text, extra = {}) => ({
  text,
  duration: 600,
  settleDuration: 200,
  perturbation: 0.2,
  chars: 'lowercase',
  cursor: '░',
  ...extra,
});

// staggered reveal on load
const tl = createTimeline({ delay: 100 });
document.querySelectorAll('.scramble').forEach((el, i) => {
  tl.add(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text)) }, i * 40);
});
tl.init();

// re-scramble h1 and subtitle on hover
const onHover = (sel) => {
  const el = document.querySelector(sel);
  el.addEventListener('pointerenter', () => {
    animate(el, { innerHTML: scrambleText(scrambleOpts(el.dataset.text, { perturbation: 0.3 })) });
  });
};

onHover('h1');
onHover('.sub');