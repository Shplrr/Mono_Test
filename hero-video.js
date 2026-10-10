const video = document.querySelector('.projects-video');
const hotspot = document.querySelector('.video-hotspot');
const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pageReady = false;

video.defaultPlaybackRate = 0.5;
video.playbackRate = 0.5;
video.pause();
video.addEventListener('loadedmetadata', () => { video.playbackRate = 0.5; });

function resumeVideo() {
  if (pageReady && !reduceMotion.matches && document.visibilityState === 'visible' &&
      !hotspot.matches(':hover') && document.activeElement !== hotspot) {
    video.play().catch(() => {});
  }
}

hotspot.addEventListener('pointerenter', () => video.pause());
hotspot.addEventListener('pointerleave', resumeVideo);
hotspot.addEventListener('focus', () => video.pause());
hotspot.addEventListener('blur', resumeVideo);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') video.pause();
  else resumeVideo();
});
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) video.pause();
  else resumeVideo();
});

const videoReady = new Promise(resolve => {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return resolve();
  video.addEventListener('loadeddata', resolve, { once: true });
  video.addEventListener('error', resolve, { once: true });
  setTimeout(resolve, 3200);
});
const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 850));

Promise.all([videoReady, document.fonts.ready, minimumLoadingTime]).then(() => {
  pageReady = true;
  hero.classList.add('is-ready');
  document.documentElement.classList.remove('is-loading');
  resumeVideo();
});
