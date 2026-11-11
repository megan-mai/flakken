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

    let hls: Hls | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let attempts = 0;

    const start = () => {
      if (disposed) return;
      clearTimeout(startupTimer);
      hls?.destroy();

      if (Hls.isSupported()) {
        hls = new Hls({
          lowLatencyMode: false,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          xhrSetup: (xhr) => {
            xhr.withCredentials = true;
          },
        });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal) return;
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR && attempts < 3) {
            attempts++;
            hls?.recoverMediaError();
          } else {
            scheduleRestart();
          }
        });
      } else {
        video.src = STREAM_URL;
        video.addEventListener("loadedmetadata", () => video.play(), { once: true });
      }

      // Startup watchdog: if nothing is playing after 12s, rebuild
      startupTimer = setTimeout(() => {
        if (video.readyState < 3) scheduleRestart();
      }, 12000);
    };

    const scheduleRestart = () => {
      if (disposed) return;
      clearTimeout(retryTimer);
      attempts = 0;
      retryTimer = setTimeout(start, 3000);
    };

    const onPlaying = () => {
      clearTimeout(startupTimer);
      attempts = 0;
      setReady(true);
      setSplashVisible(false);
    };
    video.addEventListener("playing", onPlaying);

    // Existing stall watchdog: rebuild if frozen for 15s, not just seek
    let lastTime = -1;
    let lastChange = Date.now();
    const watchdog = setInterval(() => {
      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        lastChange = Date.now();
      } else if (!video.paused && Date.now() - lastChange > 15000) {
        lastChange = Date.now();
        scheduleRestart();
      }
    }, 3000);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        if (video.paused || video.readyState < 3) scheduleRestart();
        else if (hls?.liveSyncPosition)
          video.currentTime = hls.liveSyncPosition;
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    start();

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      clearTimeout(startupTimer);
      clearInterval(watchdog);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisible);
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
          className="absolute top-1/2 sm:left-1/8 md:left-1/2 w-screen h-screen min-w-[177.78vh] min-h-[56.25vw] translate-x-[-58%] -translate-y-1/2 md:-translate-x-1/2 object-cover pointer-events-none bg-black"
          style={{ opacity: ready ? 1 : 0 }}
        />
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
