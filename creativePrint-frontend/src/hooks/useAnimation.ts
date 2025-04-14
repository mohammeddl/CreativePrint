import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

export function useAnimation(threshold = 0.1, triggerOnce = true) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [inView, hasAnimated])

  return { ref, inView, hasAnimated }
}
