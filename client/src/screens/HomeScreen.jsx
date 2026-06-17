import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:1337/api/rooms', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { slug } = await res.json();
      navigate(`/room/${slug}`);
    } catch (e) {
      setError(`Could not reach the server. Is it running? (${e.message})`);
      setLoading(false);
    }
  }

  return (
    <div className="home">
      <div className="boot-card">
        <div className="boot-card__titlebar">
          <div className="app-logo">✦ PlannerNote</div>
          <div className="app-tagline">Your real-time collaborative planner</div>
        </div>
        <div className="boot-card__body">
          <div className="boot-card__line">
            <span className="feature-dot" />
            Plan together in real-time with live sync
          </div>
          <div className="boot-card__line">
            <span className="feature-dot" />
            See everyone's cursor and presence
          </div>
          <div className="boot-card__line">
            <span className="feature-dot" />
            Rooms persist — pick up where you left off
          </div>
          <hr className="boot-card__divider" />
          {error && <div className="boot-card__error">{error}</div>}
          <button className="btn" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating room…' : '+ Create New Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
