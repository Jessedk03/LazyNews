import { useEffect } from "react";
import startLoveWrapped from "./app";
import "./styles.css";

function VibeCodeValentine() {
  useEffect(() => {
    startLoveWrapped();
  }, []);

  return (
    <>
      <div className="background-layers" aria-hidden="true">
        <div className="bg-gradient bg-gradient-1" />
        <div className="bg-gradient bg-gradient-2" />
        <div className="bg-gradient bg-gradient-3" />
        <div className="floating-emojis">
          <span>❤️</span>
          <span>✨</span>
          <span>💫</span>
          <span>🌙</span>
          <span>💖</span>
          <span>⭐️</span>
        </div>
      </div>

      <div className="app-shell">
        <header className="app-header">
          <div className="app-logo">Love Wrapped!</div>
          <button
            className="music-toggle"
            type="button"
            aria-pressed="false"
            aria-label="Toggle background music"
          >
            <span className="music-toggle-icon">🔊</span>
            <span className="music-toggle-label">Music</span>
          </button>
        </header>

        <main
          className="carousel-shell"
          role="region"
          aria-roledescription="carousel"
          aria-label="Love Wrapped story"
        >
          <section className="carousel" aria-live="polite">
            <div className="carousel-viewport">
              <div className="carousel-track" id="carousel-track" />
            </div>

            <button
              className="nav-button nav-prev"
              type="button"
              aria-label="Previous slide"
            >
              <span className="nav-icon">⟵</span>
            </button>
            <button
              className="nav-button nav-next"
              type="button"
              aria-label="Next slide"
            >
              <span className="nav-icon">⟶</span>
            </button>

            <div className="carousel-footer">
              <div className="carousel-progress">
                <div className="progress-bar">
                  <div className="progress-fill" id="progress-fill" />
                </div>
                <div
                  className="slide-counter"
                  id="slide-counter"
                  aria-live="polite"
                />
              </div>
              <div
                className="carousel-dots"
                id="carousel-dots"
                role="tablist"
              />
            </div>
          </section>
        </main>
      </div>

      <audio id="bg-music" loop>
        {/* Replace src with your own soft background track if desired */}
        {/* <source src="media/your-track.mp3" type="audio/mpeg" /> */}
      </audio>
    </>
  );
}

export default VibeCodeValentine;
