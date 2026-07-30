// web/src/Home.tsx
import { useEffect, useState } from 'react'
import flakkenFlag from './assets/flakken_logo.png'

const SPLASH_DURATION_MS = 5000
const SPLASH_FADE_MS = 400
const DOT_INTERVAL_MS = 400

// TEMP: disabled for testing the perimeter-crop fix — restore to true/true when done
function Home({ visible }: { visible: boolean }) {
  const [splashVisible, setSplashVisible] = useState(false)
  const [splashMounted, setSplashMounted] = useState(false)
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    const hideTimer = setTimeout(() => setSplashVisible(false), SPLASH_DURATION_MS)
    return () => clearTimeout(hideTimer)
  }, [])

  useEffect(() => {
    if (splashVisible) return
    const unmountTimer = setTimeout(() => setSplashMounted(false), SPLASH_FADE_MS)
    return () => clearTimeout(unmountTimer)
  }, [splashVisible])

  useEffect(() => {
    if (!splashMounted) return
    const dotTimer = setInterval(() => {
      setDotCount((count) => (count + 1) % 4)
    }, DOT_INTERVAL_MS)
    return () => clearInterval(dotTimer)
  }, [splashMounted])

  return (
    <div className={visible ? 'visible' : 'invisible'}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
        <iframe
                src="https://www.youtube.com/embed/27FewYH2mQk?si=I0ArYRJzPYvo3vZi?&autoplay=1&mute=1&controls=0&disablekb=1&iv_load_policy=3&rel=0&modestbranding=1&fs=0&rel=0&showinfo=0"
                title="Flagpole Livestream"
                className="absolute top-1/2 left-1/2 w-screen h-screen min-w-[177.78vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 scale-[1.15] pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
        />
        {/*Blocks pointer events from reaching the iframe so hovering never triggers YouTube's overlay controls*/}
        <div className="absolute inset-0 z-1 bg-transparent" />
      </div>

      {/*Dims the livestream so the nav/title/logo (z-20) stay legible on top of it*/}
      <div className="fixed inset-0 z-10 bg-black/20 pointer-events-none" />

      {/*Splash overlay hides the stream's flash of unwanted controls while it loads. Mounted once for the app's lifetime so switching pages and back doesn't retrigger it.*/}
      {splashMounted && (
        <div
          className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity ease-out ${splashVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ transitionDuration: `${SPLASH_FADE_MS}ms` }}
        >
          <div className="flex flex-col items-center gap-3">
            <img src={flakkenFlag} alt="Flakken" className="w-24 h-auto" />
            <div className="w-6 h-8 flex items-center text-2xl font-medium tracking-widest text-red-600">
              {'.'.repeat(dotCount)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
