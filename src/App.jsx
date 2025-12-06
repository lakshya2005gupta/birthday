// src/App.jsx
import React, { useRef, useState, useEffect } from "react";

// ---------- Hook: useInView for autoplay videos ----------
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.4,
        ...options,
      }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [options]);

  return [ref, inView];
}

// ---------- Component: AutoPlayVideo (muted, on scroll) ----------
function AutoPlayVideo({ src, poster }) {
  const videoRef = useRef(null);
  const [containerRef, inView] = useInView();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      const playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <div ref={containerRef} className="video-card">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster={poster}
        className="video-element"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);

  const handleBegin = () => {
    if (!started && audioRef.current) {
      const audio = audioRef.current;
      // Original volume (1.0). Not touching it.
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {
          // If browser blocks it, user can tap again.
        });
      }
      setStarted(true);
    }
    // Scroll to next section
    const nextSection = document.getElementById("story-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ---- Dummy data: replace with your actual content ----
  const storyChapters = [
    {
      id: 1,
      title: "The Day It All Began",
      date: "DD/MM/YYYY",
      location: "Somewhere You Both Know",
      shortLine: "The first time my brain went: oh.",
      detail:
        "Write a detailed memory here. Make it specific: what she wore, what you felt, what was funny, what was awkward. Keep it honest.",
      image: "/images/photo1.jpg",
    },
    {
      id: 2,
      title: "When You Ruined My Peace (Nicely)",
      date: "DD/MM/YYYY",
      location: "Chat / Call / College",
      shortLine: "Suddenly you were the notification I cared about.",
      detail:
        "Another specific story. Don’t write generic ‘you’re perfect’ stuff. Write something only she would understand.",
      image: "/images/photo2.jpg",
    },
    // Add more chapters...
  ];

  const galleryPhotos = [
    {
      id: 1,
      image: "/images/photo3.jpg",
      label: "This day.",
      note: "Tell her what was going on in your head this exact moment.",
    },
    {
      id: 2,
      image: "/images/photo4.jpg",
      label: "You being annoying.",
      note: "A short, cute line about her being annoying but you loving it.",
    },
    // Add more photos...
  ];

  const videos = [
    {
      id: 1,
      src: "/videos/video1.mp4", // Put in public/videos/
      poster: "/images/video1-poster.jpg",
    },
    {
      id: 2,
      src: "/videos/video2.mp4",
      poster: "/images/video2-poster.jpg",
    },
    // Add more videos...
  ];

  const notes = [
    {
      id: 1,
      title: "Things I Don’t Say Enough",
      note: "You being comfortable around me is my favourite flex.",
    },
    {
      id: 2,
      title: "Tiny Truth",
      note: "You make my overthinking slightly less stupid.",
    },
    {
      id: 3,
      title: "Reminder",
      note: "You don’t have to be perfect. I like you in the messy version too.",
    },
    // Add more notes...
  ];

  const futurePlans = [
    {
      id: 1,
      title: "Sunset Date",
      status: "Soon",
      detail: "Pick a real place and time. Don’t be vague.",
    },
    {
      id: 2,
      title: "Cooking Disaster Night",
      status: "Planned",
      detail: "Make something together, even if it goes horribly wrong.",
    },
    {
      id: 3,
      title: "A Proper Chill Day",
      status: "Someday",
      detail: "No plans. Just you, me, food, and whatever we feel like.",
    },
    // Add more plans...
  ];

  return (
    <div className="page-root">
      {/* Hidden audio element – no controls, original volume */}
      <audio ref={audioRef} src="/audio/bgm.mp3" />

      <BackgroundDecor />

      <main className="page-content">
        <HeroSection onBegin={handleBegin} />

        <StorySection id="story-section" chapters={storyChapters} />

        <GallerySection photos={galleryPhotos} />

        <VideoSection videos={videos} />

        <NotesSection notes={notes} />

        <FuturePlansSection plans={futurePlans} />

        <FinalSection />
      </main>
    </div>
  );
}

// ---------- Visual Components ----------

function BackgroundDecor() {
  return (
    <>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
    </>
  );
}

function HeroSection({ onBegin }) {
  return (
    <section className="section hero-section">
      <div className="hero-card">
        <p className="hero-tag">For Ishaani 🎂</p>
        <h1 className="hero-title">Happy Birthday, Ishaani</h1>
        <p className="hero-subtitle">
          Soft chaos, stupid jokes, overthinking and you — I wouldn’t trade it
          for anything.
        </p>

        <button className="primary-btn" onClick={onBegin}>
          Tap to Begin, Ishaani 💖
        </button>

        <p className="hero-hint">Make sure your sound is on 🔊</p>
      </div>
    </section>
  );
}

function StorySection({ id, chapters }) {
  const [openId, setOpenId] = useState(chapters[0]?.id ?? null);

  return (
    <section className="section" id={id}>
      <div className="section-header">
        <h2 className="section-title">Our Story, in Little Tickets</h2>
        <p className="section-subtitle">
          Tiny moments that turned into something way bigger than I expected.
        </p>
      </div>

      <div className="ticket-list">
        {chapters.map((chapter) => {
          const isOpen = openId === chapter.id;
          return (
            <article
              key={chapter.id}
              className={`ticket-card ${isOpen ? "ticket-open" : ""}`}
              onClick={() => setOpenId(chapter.id)}
            >
              <div className="ticket-main">
                <div className="ticket-left">
                  <p className="ticket-label">CHAPTER {chapter.id}</p>
                  <h3 className="ticket-title">{chapter.title}</h3>
                  <p className="ticket-short">{chapter.shortLine}</p>
                  <div className="ticket-meta">
                    <span>{chapter.date}</span>
                    <span>•</span>
                    <span>{chapter.location}</span>
                  </div>
                </div>
                <div className="ticket-right">
                  <span className="ticket-stamp">♥</span>
                  <span className="ticket-stamp-text">Admit One</span>
                </div>
              </div>

              {isOpen && (
                <div className="ticket-polaroid">
                  <div className="polaroid-frame">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="polaroid-image"
                    />
                    <p className="polaroid-caption">{chapter.shortLine}</p>
                  </div>
                  <p className="ticket-detail">{chapter.detail}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GallerySection({ photos }) {
  const [activeId, setActiveId] = useState(photos[0]?.id ?? null);

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Tiny Frames, Big Feelings</h2>
        <p className="section-subtitle">
          Tap a polaroid. I’ll tell you why that moment matters to me.
        </p>
      </div>

      <div className="polaroid-grid">
        {photos.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              className={`polaroid-card ${isActive ? "polaroid-active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              <div className="polaroid-inner">
                <img
                  src={item.image}
                  alt={item.label}
                  className="polaroid-img"
                />
                <p className="polaroid-label">{item.label}</p>
              </div>
              {isActive && (
                <p className="polaroid-note">
                  {item.note || "Write something specific here."}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function VideoSection({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Moments in Motion</h2>
        <p className="section-subtitle">
          Little clips that feel like you. They’ll play quietly as you scroll.
        </p>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <AutoPlayVideo
            key={video.id}
            src={video.src}
            poster={video.poster}
          />
        ))}
      </div>
    </section>
  );
}

function NotesSection({ notes }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Things I Don’t Say Out Loud</h2>
        <p className="section-subtitle">
          Tap a card. Consider this my attempt at being slightly less emotionally
          unavailable.
        </p>
      </div>

      <div className="notes-grid">
        {notes.map((item) => (
          <details key={item.id} className="note-card">
            <summary className="note-summary">{item.title}</summary>
            <p className="note-body">{item.note}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FuturePlansSection({ plans }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Stuff I Still Want To Do With You</h2>
        <p className="section-subtitle">
          Not promises. But things I genuinely want to make happen with you.
        </p>
      </div>

      <div className="plans-list">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <h3 className="plan-title">{plan.title}</h3>
              <span className={`plan-status plan-${plan.status.toLowerCase()}`}>
                {plan.status}
              </span>
            </div>
            <p className="plan-detail">{plan.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section className="section final-section">
      <div className="final-card">
        <p className="final-line-top">If you reached here, that’s already a lot.</p>
        <p className="final-line-main">
          Thanks for being you. That’s my favorite part.
        </p>
        <p className="final-line-bottom">Happy Birthday, Ishaani 💐</p>
      </div>
    </section>
  );
}
