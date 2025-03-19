import { BlazeSlider } from '../slider'
import { isTouch } from './drag'
import {
  noLoopScroll,
  wrapPrev,
  wrapNext,
  updateTransform,
  disableTransition,
  enableTransition,
} from './methods'

export function clearActive(slider: BlazeSlider) {
  const slideItems = slider.track.querySelectorAll('li')
  slideItems.forEach((item) => {
    item.classList.remove('active')
  })
}

export function setActiveItems(slider: BlazeSlider, isNext = false) {
  const slideItems = slider.track.querySelectorAll('li')
  // let offset = 0
  // if (isNext) offset = 3
  for (let i = 0; i < slider.config.slidesToShow; i++) {
    slideItems[i].classList.add('active')
  }
}

export function scrollPrev(slider: BlazeSlider, slideCount: number) {
  const rAf = requestAnimationFrame

  if (!slider.config.loop) {
    noLoopScroll(slider)
  } else {
    // shift elements and apply negative transform to make it look like nothing changed

    // disable transition
    disableTransition(slider)
    // apply negative transform
    slider.offset = -1 * slideCount
    updateTransform(slider)
    // and move the elements
    wrapPrev(slider, slideCount)

    const reset = () => {
      rAf(() => {
        enableTransition(slider)
        rAf(() => {
          slider.offset = 0
          updateTransform(slider)
          onSlideEnd(slider)
        })
      })
    }

    // if the scroll was done as part of dragging
    // reset should be done after the dragging is completed
    if (slider.isDragging) {
      if (isTouch()) {
        slider.track.addEventListener('touchend', reset, { once: true })
      } else {
        slider.track.addEventListener('pointerup', reset, { once: true })
      }
    } else {
      rAf(reset)
    }
  }
}

// <--- move slider to left for showing content on right
export function scrollNext(slider: BlazeSlider, slideCount: number) {
  const rAf = requestAnimationFrame

  if (!slider.config.loop) {
    noLoopScroll(slider)
  } else {
    // remove class .active from soon to be last slide
    for (let i = 0; i < slider.config.slidesToShow; i++) {
      slider.slides[i].classList.remove('active')
    }

    // apply offset and let the slider scroll from  <- (right to left)
    slider.offset = -1 * slideCount
    updateTransform(slider)

    // add .active to next slides
    for (let i = 0; i < slider.config.slidesToShow; i++) {
      slider.slides[slideCount + i].classList.add('active')
    }

    // once the transition is done
    setTimeout(() => {
      // remove the elements from start that are no longer visible and put them at the end
      wrapNext(slider, slideCount)

      disableTransition(slider)

      // apply transform where the slider should go
      slider.offset = 0
      updateTransform(slider)

      rAf(() => {
        rAf(() => {
          enableTransition(slider)
          onSlideEnd(slider)
        })
      })
    }, slider.config.transitionDuration)
  }
}

export function onSlideEnd(slider: BlazeSlider) {
  if (slider.onSlideCbs) {
    const state = slider.states[slider.stateIndex]
    const [firstSlideIndex, lastSlideIndex] = state.page
    slider.onSlideCbs.forEach((cb) =>
      cb(slider.stateIndex, firstSlideIndex, lastSlideIndex)
    )

    // Focus on the first element on the current slide
    setTimeout(() => {
      const element: HTMLElement | null =
        slider.track.querySelector('li:first-of-type')
      if (element) element.focus()
    }, slider.config.transitionDuration)
  }
}
