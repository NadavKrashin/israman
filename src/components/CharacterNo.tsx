type CharacterNoProps = {
  position: { x: number; y: number };
  onClick: () => void;
};

export default function CharacterNo({ position, onClick }: CharacterNoProps) {
  return (
    <div className="character no runner" style={{ left: position.x, top: position.y }}>
      <div className="sweat-drops">
        <span className="drop d1" />
        <span className="drop d2" />
        <span className="drop d3" />
      </div>
      <div className="body person sprinting">
        <div className="head">
          <div className="headband" />
          <div className="hair messy" />
          <div className="face strained">
            <span className="eye" />
            <span className="eye" />
            <span className="mouth" />
          </div>
        </div>
        <div className="torso athletic">
          <div className="tank-top" />
          <div className="arms sprinting">
            <span />
            <span />
          </div>
        </div>
        <div className="legs sprinting">
          <span className="leg" />
          <span className="leg" />
        </div>
      </div>
      <button className="sign no-sign" aria-label="Sad no button" onClick={onClick}>
        לא 😢
      </button>
    </div>
  );
}
