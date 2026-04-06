import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const dot = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return

    let ringX = 0, ringY = 0
    let dotX = 0, dotY = 0
    let raf

    const onMove = (e) => {
      dotX = e.clientX
      dotY = e.clientY
    }

    const animate = () => {
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12
      dot.style.left = dotX + 'px'
      dot.style.top  = dotY + 'px'
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)

    const links = document.querySelectorAll('a, button, [data-cursor]')
    const onEnter = () => {
      dot.style.width = '18px'
      dot.style.height = '18px'
      ring.style.width = '50px'
      ring.style.height = '50px'
      ring.style.opacity = '0.3'
    }
    const onLeave = () => {
      dot.style.width = '10px'
      dot.style.height = '10px'
      ring.style.width = '32px'
      ring.style.height = '32px'
      ring.style.opacity = '0.55'
    }

    links.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />
    </>
  )
}
