// web/src/Home.tsx
import placeholderFootage from './assets/placeholder_footage.mov'

function Home() {
  return (
    <main>
      <div className="flex flex-col items-center px-8 pb-8 pt-2">

        {/*Livestream and overlay*/}
        <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
          <video
                  src={placeholderFootage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Livestream iframe, disabled for now in favor of placeholder footage above
          <iframe
                  src="https://www.youtube.com/embed/GQEeK-sExHg?si=P93kqGTDevX9a8bu?&autoplay=1&mute=1&controls=0&disablekb=1&iv_load_policy=3&rel=0&modestbranding=1&fs=0&rel=0&showinfo=0"
                  title="Flagpole Livestream"
                  className="absolute top-1/2 left-1/2 w-screen h-screen min-w-[177.78vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
          />
          Blocks pointer events from reaching the iframe so hovering never triggers YouTube's overlay controls
          <div className="absolute inset-0 z-1 bg-transparent" />
          */}
        </div>
      </div>
    </main>
  )
}

export default Home
