import { useNavigate } from 'react-router-dom';

export default function ErrorScreen({ roomId }) {
  const navigate = useNavigate();

  return (
    <div className="error-screen">
      <div className="error-card">
        <div className="error-card__titlebar">
          <div className="error-card__title-main">Room Not Found</div>
          <div className="error-card__title-sub">We couldn't find this planning space</div>
        </div>
        <div className="error-card__body">
          <div className="error-card__msg">
            The room ID you're looking for doesn't exist or has been removed.
          </div>
          <div className="error-card__code">
            <div>Room ID: {roomId ?? 'unknown'}</div>
            <div>Status: 404 — document does not exist</div>
            <div>Tip: double-check the link or create a new room</div>
          </div>
          <hr className="error-card__divider" />
          <button className="btn btn--red" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
