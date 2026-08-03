// web/src/Home.tsx
import { useEffect, useRef, useState } from 'react'
import flakkenFlag from './assets/flakken_logo.png'

const SPLASH_DURATION_MS = 2000
const SPLASH_FADE_MS = 400
const DOT_INTERVAL_MS = 400
const HEALTH_CHECK_INTERVAL_MS = 5000
const LIVESTREAM_IFRAME_ID = 'flakken-livestream-player'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady?: () => void
  }
}

function Home({ visible }: { visible: boolean }) {
  const [splashVisible, setSplashVisible] = useState(true)
  const [splashMounted, setSplashMounted] = useState(true)
  const [dotCount, setDotCount] = useState(0)
  const playerRef = useRef<any>(null)

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

  // YouTube's embedded autoplay is a heuristic that silently fails on some
  // devices/networks, and the overlay below blocks clicks (so a user can
  // never manually hit play). Drive playback via the IFrame API instead so
  // we can force-resume it whenever it pauses, the tab regains focus, or a
  // periodic health check finds it stalled.
  useEffect(() => {
    function forcePlay(player: any) {
      player.mute()
      player.playVideo()
    }

    function createPlayer() {
      playerRef.current = new window.YT.Player(LIVESTREAM_IFRAME_ID, {
        events: {
          onReady: (event: any) => forcePlay(event.target),
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.CUED) {
              forcePlay(event.target)
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        createPlayer()
      }
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(script)
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        playerRef.current?.playVideo?.()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const healthCheck = setInterval(() => {
      const player = playerRef.current
      if (!player?.getPlayerState) return
      const state = player.getPlayerState()
      if (state !== window.YT.PlayerState.PLAYING && state !== window.YT.PlayerState.BUFFERING) {
        forcePlay(player)
      }
    }, HEALTH_CHECK_INTERVAL_MS)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(healthCheck)
    }
  }, [])

  return (
    <div className={visible ? 'visible' : 'invisible'}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
        <iframe
                id={LIVESTREAM_IFRAME_ID}
                src={`https://www.youtube.com/embed/live_stream?channel=UCVXUY_TWKD_kPH5zm9d7CTg&autoplay=1&mute=1&playsinline=1&controls=0&disablekb=1&iv_load_policy=3&rel=0&modestbranding=1&fs=0&enablejsapi=1&origin=${window.location.origin}`}
                title="Flagpole Livestream"
                className="absolute top-1/2 left-1/2 w-screen h-screen min-w-[177.78vh] min-h-[56.25vw] -translate-x-[58%] -translate-y-1/2 md:-translate-x-1/2 scale-[1.15] pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
        />
        {/*Blocks pointer events from reaching the iframe so hovering never triggers YouTube's overlay controls*/}
        <div className="absolute inset-0 z-1 bg-transparent" />
      </div>

      {/*Vignette dims the livestream toward the edges so the nav/title/logo (z-20) stay legible on top of it*/}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)' }}
      />

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
