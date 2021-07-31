import { useEffect, useState } from 'react'

/**
 * How to use:
 * create ref const ref = React.useRef(); const isVisible = isElementVisible(ref)
 * then you put the ref inside an HTML Element or React Element </ div ref={ref}>
 *
 * @param {React.RefObject<HTMLElement | Element>} elm Create a ref on component file and pass through to see visibility
 */

interface IOptions {
  root?: HTMLElement | Element
  rootMargin?: string
  threshold?: number
}

export function isElementVisible(
  elm: React.RefObject<HTMLElement | Element>,
  options?: IOptions,
): boolean {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: options?.threshold || 0.01,
        root: options?.root,
        rootMargin: options?.rootMargin,
      }
    )

    if (elm.current) {
      observer.observe(elm.current)
    }
    return () => {
      observer.unobserve(elm.current)
    }
  }, [])

  return isVisible
}