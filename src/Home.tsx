// web/src/Home.tsx
import { useEffect, useState, useRef } from "react";
import flakkenFlag from "./assets/flakken_logo.png";
import Hls from "hls.js";

const SPLASH_FADE_MS = 400;
const DOT_INTERVAL_MS = 400;

const STREAM_URL = "https://stream.flakken.nyc/cam/index.m3u8";

function Home({ visible }: { visible: boolean }) {
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashMounted, setSplashMounted] = useState(true);
  const [dotCount, setDotCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    let hls: Hls | undefined;

    const tryPlay = () => {
      console.log("Calling tryPlay!");
      video.play().catch((err) => {
        console.warn("Autoplay was blocked:", err);
      });
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: false, // don't chase the live edge aggressively
        liveSyncDurationCount: 4, // sit ~4 segments back for more buffer
        liveMaxLatencyDurationCount: 10,
        maxBufferLength: 30,
        backBufferLength: 30,
        xhrSetup: (xhr) => {
          xhr.withCredentials = true;
        },
      });
      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = STREAM_URL;
      video.addEventListener("loadedmetadata", tryPlay);
    }

    video.addEventListener("playing", () => {
      setReady(true);
      setSplashVisible(false);
    }, { once: true });

    return () => {
      hls?.destroy();
    };
  }, []);

  useEffect(() => {
    if (splashVisible) return;
    const unmountTimer = setTimeout(
      () => setSplashMounted(false),
      SPLASH_FADE_MS,
    );
    return () => clearTimeout(unmountTimer);
  }, [splashVisible]);

  useEffect(() => {
    if (!splashMounted) return;
    const dotTimer = setInterval(() => {
      setDotCount((count) => (count + 1) % 4);
    }, DOT_INTERVAL_MS);
    return () => clearInterval(dotTimer);
  }, [splashMounted]);


  return (
    <div className={visible ? "visible" : "invisible"}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          // Same cover sizing/framing the YouTube iframe used: the box is always at least
          // 16:9-cover of the viewport, shifted per breakpoint. object-cover fills the box
          // even if the stream's aspect ratio isn't exactly 16:9.
          // adjust here when camera moves
          className="absolute top-1/2 sm:left-1/8 md:left-1/2 w-screen h-screen min-w-[177.78vh] min-h-[56.25vw] -translate-x-[58%] -translate-y-1/2 md:-translate-x-1/2 object-cover pointer-events-none bg-black"
          style={{ opacity: ready ? 1 : 0 }}
        />
        {/*Blocks pointer events from reaching the video so native controls/gestures never trigger*/}
        <div className="absolute inset-0 z-1 bg-transparent" />
      </div>

      {/*Vignette dims the livestream toward the edges so the nav/title/logo (z-20) stay legible on top of it*/}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/*Splash overlay hides the stream's flash of unwanted controls while it loads. Mounted once for the app's lifetime so switching pages and back doesn't retrigger it.*/}
      {splashMounted && (
        <div
          className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity ease-out ${splashVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ transitionDuration: `${SPLASH_FADE_MS}ms` }}
        >
          <div className="flex flex-col items-center gap-3">
            <img src={flakkenFlag} alt="Flakken" className="w-24 h-auto" />
            <div className="w-6 h-8 flex items-center text-2xl font-medium tracking-widest text-red-600">
              {".".repeat(dotCount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
