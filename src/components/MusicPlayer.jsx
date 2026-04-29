import { useState } from 'react'

const tracks = ['Birthday anthem', 'Cake-cutting queue', 'Late-night replay']

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="music-panel panel" id="music">
      <div className="section-header">
        <p className="section-label">Soundtrack</p>
        <h2 className="section-title">A playlist card for the birthday mood.</h2>
      </div>

      <button
        className="music-toggle"
        type="button"
        aria-pressed={isPlaying}
        onClick={() => setIsPlaying((current) => !current)}
      >
        <span className="music-toggle-dot" />
        {isPlaying ? 'Playlist is glowing' : 'Tap to start the vibe'}
      </button>

      <div className="equalizer" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <ul className="track-list">
        {tracks.map((track, index) => (
          <li key={track}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {track}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MusicPlayer