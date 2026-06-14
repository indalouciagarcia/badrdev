import { useState, useEffect, useRef } from 'react'

function Counter({ count }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const target = Number(count)
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1500
          const startTime = performance.now()

          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            setValue(Math.floor(progress * target))
            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setValue(target)
            }
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      })
    }, { threshold: 0.5 })

    observer.observe(node)
    return () => observer.disconnect()
  }, [count])

  return (
    <span className="odometer" ref={ref} data-count={count}>{value}</span>
  )
}

export default Counter
