import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// --- small hook: autoplay muted videos when in view ---
function useAutoPlayOnView(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function AutoPlayVideo({ src, poster, caption, onClick }) {
  const ref = useRef(null);
  useAutoPlayOnView(ref);
  return (
    <div className="moment-card" onClick={onClick}>
      <div className="moment-video-wrap">
        <video
          ref={ref}
          src={src}
          poster={poster}
          playsInline
          muted
          loop
          className="moment-video"
        />
      </div>
      <p className="moment-caption">{caption}</p>
    </div>
  );
}

function Lightbox({ item, onClose, onPrev, onNext }) {
  if (!item) return null;
  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-media">
          {item.type === "image" ? (
            <img src={item.src} alt={item.caption} />
          ) : (
            <video
              src={item.src}
              controls
              autoPlay
              muted
              className="lightbox-video"
            />
          )}
        </div>
        <div className="lightbox-caption">{item.caption}</div>
        <div className="lightbox-actions">
          <button onClick={onPrev}>⟵ Prev</button>
          <button onClick={onNext}>Next ⟶</button>
          <button onClick={onClose}>Close ✕</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- YOUR MEDIA (adjust paths if needed) ---------- */

const photos = [
  {
    src: "/images/photo1.jpg",
    thumb: "/images/photo1.jpg",
    caption: "You, being effortlessly pretty without even trying.",
  },
  {
    src: "/images/photo2.jpg",
    thumb: "/images/photo2.jpg",
    caption: "We look dumb here. I’m still obsessed.",
  },
  {
    src: "/images/photo3.jpg",
    thumb: "/images/photo3.jpg",
    caption: "One of those 'I could stay here forever' moments.",
  },
  {
    src: "/images/photo4.jpg",
    thumb: "/images/photo4.jpg",
    caption: "Saving this one as a core memory.",
  },
];

const videoMoments = [
  {
    src: "/videos/video1.mp4",
    poster: "/videos/video1-thumb.jpg",
    caption: "Your chaos on loop. Still my favourite view.",
  },
];

const letterParagraphs = [
  "Dear Ishaani,",
  "I don’t know the exact moment when 'you’re fun to talk to' quietly turned into 'I can’t imagine my days without you', but somewhere between the late-night chats, your rants, your dumb jokes, and the way you say the most random things with full confidence — something in me just decided, 'Yeah, this is home now.'",
  "You make ordinary days feel less heavy. You make stupid things feel special. You make me want to try harder — with myself, with us, with everything.",
  "I know I’m not perfect. I overthink, say the wrong things, and sometimes don’t say what I should. But even in all that mess, one thing is stupidly clear: I want you in my life. Not just on the good days — especially on the bad ones.",
  "Thank you for every laugh, every fight we came back from, every 'are you okay?', every 'I’m here.' You have no idea how much that has meant to me.",
  "Happy Birthday, love. I’m ridiculously, unapologetically grateful that you exist — and even more grateful that somehow, out of everyone, I get to be the one who calls you mine.",
  "With all my love,\nLakshya",
];

export default function App() {
  // "animation" -> only Ayush page visible
  useEffect(() => {
  function onMessage(e) {
    if (!e.data) return;
    if (e.data && e.data.type === 'animation-done') {
      // move to main stage
      setStage('main');
    }
  }
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}, []);

  // "main" -> your React birthday site
  const [stage, setStage] = useState("animation");
  const [heroPhraseIndex, setHeroPhraseIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const bgmRef = useRef(null);

  const heroPhrases = [
    "The safest kind of chaos.",
    "The calm in my overthinking.",
    "My favourite notification.",
    "The person I’d still choose, again.",
  ];

  const allItems = [
    ...photos.map((p) => ({ ...p, type: "image" })),
    ...videoMoments.map((v) => ({ ...v, type: "video" })),
  ];

  // rotate hero subtitle
  useEffect(() => {
    const id = setInterval(
      () => setHeroPhraseIndex((i) => (i + 1) % heroPhrases.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  // control soft BGM based on stage: ONLY play when stage === "main"
  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    if (stage === "main") {
      audio.currentTime = 0;
      audio
        .play()
        .catch(() => {
          /* autoplay blocked, fine */
        });
    } else {
      audio.pause();
    }
  }, [stage]);

  const openLightboxPhoto = (idx) => setLightboxIndex(idx);
  const openLightboxVideo = (idx) => setLightboxIndex(photos.length + idx);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) =>
      i == null ? null : (i - 1 + allItems.length) % allItems.length
    );
  const showNext = () =>
    setLightboxIndex((i) =>
      i == null ? null : (i + 1) % allItems.length
    );

  return (
    <div className="app-root">
      <div className="bg-particles" />

      {/* your soft romantic bgm for MAIN stage only */}
      <audio ref={bgmRef} src="/audio/bgm-main.mp3" loop />

      <header className="top-nav">
        <div className="brand">
          <span className="brand-heart">💗</span>
          <div>
            <div className="brand-title">Ishaani’s Birthday</div>
            <div className="brand-sub">Written in code by Lakshya</div>
          </div>
        </div>
      </header>

      <main className="main">
        {/* -------------------------------------------------
           STAGE 1 – Ayush animation full-page
        -------------------------------------------------- */}
        {stage === "animation" && (
          <section className="section section-animation" id="lights">
            <p className="section-tag">Step 1</p>
            <h2 className="section-title">Turn on the lights ✨</h2>
            <p className="section-sub">
              This is the dramatic part — lights, music, balloons, cake, story.
              Play through everything inside this frame. When you’re done and
              ready for the personal part, hit the button below.
            </p>

            <div className="animation-frame-wrap">
              {/* IMPORTANT: folder is /animation, NOT /animations */}
              <iframe
                title="animation"
                src="/animation/index.html"
                className="animation-iframe"
                style={{ width: '100%', height: '100vh', border: 'none' }}
              />
            </div>

            <p className="animation-hint">
              If something looks stuck, click once inside the frame or reload
              the page.
            </p>

            <div className="stage-button-row">
              <button
                className="primary-pill"
                onClick={() => setStage("main")}
              >
                I’m done here, show me the rest ↓
              </button>
            </div>
          </section>
        )}

        {/* -------------------------------------------------
           STAGE 2 – Your main React birthday page
        -------------------------------------------------- */}
        {stage === "main" && (
          <>
            {/* hero */}
            <section className="section hero-main" id="main-hero">
              <div className="hero-text">
                <p className="section-tag">For: Ishaani</p>
                <h2 className="hero-title">
                  Happy Birthday, Ishaani <span>🎂</span>
                </h2>
                <p className="hero-sub">{heroPhrases[heroPhraseIndex]}</p>
                <p className="hero-body">
                  This is the softer part — just us, the memories, and all the
                  things I usually keep in my head instead of saying out loud.
                </p>
                <p className="hero-body small">
                  Take your time and scroll slowly. None of this is going
                  anywhere.
                </p>
              </div>

              <div className="hero-replay">
                <button
                  className="ghost-pill"
                  onClick={() => setStage("animation")}
                >
                  Replay the balloons & cake 🎈
                </button>
              </div>
            </section>

            {/* photos */}
            <section className="section" id="memories">
              <p className="section-tag">Memories</p>
              <h2 className="section-title">Screenshots of us</h2>
              <p className="section-sub">
                Random frames where you probably had no idea how badly I was
                falling for you in the background.
              </p>

              <div className="gallery-grid">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    className="gallery-item"
                    onClick={() => openLightboxPhoto(idx)}
                  >
                    <img src={p.thumb} alt={p.caption} />
                    <span className="gallery-tag">memory</span>
                  </button>
                ))}
              </div>
            </section>

            {/* videos */}
            <section className="section" id="videos">
              <p className="section-tag">Moments in motion</p>
              <h2 className="section-title">Your chaos on loop</h2>
              <p className="section-sub">
                These play quietly as you scroll. No sound here — just you
                moving around the way my brain replays you.
              </p>

              <div className="moments-grid">
                {videoMoments.map((v, idx) => (
                  <AutoPlayVideo
                    key={idx}
                    src={v.src}
                    poster={v.poster}
                    caption={v.caption}
                    onClick={() => openLightboxVideo(idx)}
                  />
                ))}
              </div>
            </section>

            {/* letter */}
            <section className="section" id="letter">
              <p className="section-tag">From Lakshya</p>
              <h2 className="section-title">Things I don’t say enough</h2>
              <p className="section-sub">
                Read this again on some random bad day. It’s not just a birthday
                thing; I mean it on every normal, boring, stressful day too.
              </p>

              <div className="letter">
                {letterParagraphs.map((para, idx) => (
                  <p key={idx} className="letter-line">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <span>Made with mildly concerning levels of love by Lakshya.</span>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox
          item={allItems[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </div>
  );
}
