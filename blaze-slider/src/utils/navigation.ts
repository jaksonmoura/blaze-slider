import { BlazeSlider } from '../slider'

export function handleNavigation(slider: BlazeSlider) {
  const prev = slider.el.querySelector(
    '.blaze-prev'
  ) as HTMLButtonElement | null

  const next = slider.el.querySelector(
    '.blaze-next'
  ) as HTMLButtonElement | null

  if (prev) {
    prev.onclick = () => {
      slider.prev()
    }
  }

  if (next) {
    next.onclick = () => {
      slider.next()
    }
  }

  document.addEventListener('keydown', (e) => {
    // Use arrows to navigate
    if (e.key === 'ArrowRight') {
      slider.next(1)
    }
    if (e.key === 'ArrowLeft') {
      slider.prev(1)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      slider.stopAutoplay()
    }
  })

  // Pause autoplay on mouse hover
  slider.track.addEventListener('mouseenter', () => {
    slider.stopAutoplay()
  })
  slider.track.addEventListener('mouseout', () => {
    slider.play()
  })
}
