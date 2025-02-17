import { useTransform, useScroll, type MotionValue } from "framer-motion"
import { useEffect, useState } from "react"

export function useParallax(distance: number, direction: "up" | "down" = "down"): MotionValue<number> {
  const { scrollY } = useScroll()
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  useEffect(() => {
    const element = document.documentElement
    setElementTop(element.offsetTop)
    setClientHeight(window.innerHeight)
  }, [])

  return useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    direction === "down" ? [0, distance] : [distance, 0],
  )
}

