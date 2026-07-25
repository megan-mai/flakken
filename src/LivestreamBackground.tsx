// web/src/LivestreamBackground.tsx
import { useEffect, useState } from 'react'

const SPLASH_DURATION_MS = 5000
const SPLASH_FADE_MS = 400

function LivestreamBackground({
  visible,
  nowFlying,
}: {
  visible: boolean
  nowFlying?: string | null
}) {
  const [splashVisible, setSplashVisible] = useState(true)
  const [splashMounted, setSplashMounted] = useState(true)

  useEffect(() => {
    const hideTimer = setTimeout(() => setSplashVisible(false), SPLASH_DURATION_MS)
    return () => clearTimeout(hideTimer)
  }, [])

  useEffect(() => {
    if (splashVisible) return
    const unmountTimer = setTimeout(() => setSplashMounted(false), SPLASH_FADE_MS)
    return () => clearTimeout(unmountTimer)
  }, [splashVisible])

  return (
    <div className={visible ? 'visible' : 'invisible'}>
      {/*Livestream and overlay*/}
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 z-0">
        <div className="relative w-[500px] aspect-video">
          <iframe
                  src="https://www.youtube.com/embed/GQEeK-sExHg?si=P93kqGTDevX9a8bu?&autoplay=1&mute=1&controls=0&disablekb=1&iv_load_policy=3&rel=0&modestbranding=1&fs=0&rel=0&showinfo=0"
                  title="Flagpole Livestream"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
          />
          {/*Blocks pointer events from reaching the iframe so hovering never triggers YouTube's overlay controls*/}
          <div className="absolute inset-0 z-1 bg-transparent" />
        </div>
        <div className="text-sm text-center text-red-500">
          {nowFlying && <div className="text-xs md:text-sm">{nowFlying}</div>}
          <div >Chinatown, Manhattan</div>
          <Clock />
        </div>
      </div>

      {/*Splash overlay hides the stream's flash of unwanted controls while it loads. Mounted once for the app's lifetime so switching pages and back doesn't retrigger it.*/}
      {splashMounted && (
        <div
          className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity ease-out ${splashVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ transitionDuration: `${SPLASH_FADE_MS}ms` }}
        >
          <div className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-h)' }}>
            flagpole
          </div>
        </div>
      )}
    </div>
  )
}

export default LivestreamBackground
