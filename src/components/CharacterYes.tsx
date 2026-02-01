type CharacterYesProps = {
  center: { x: number; y: number };
  onClick: () => void;
};

export default function CharacterYes({ center, onClick }: CharacterYesProps) {
  return (
    <div className="character yes beach-chill" style={{ left: center.x, top: center.y }}>
      <div className="beach-umbrella" />
      <div className="towel" />
      <div className="body person laying">
        <div className="head">
          <div className="hair beach" />
          <div className="face happy">
            <span className="eye" />
            <span className="eye" />
            <span className="mouth" />
          </div>
          <div className="sunglasses">
            <span />
            <span />
          </div>
        </div>
        <div className="torso beach">
          <div className="arms relax">
            <span />
            <span />
          </div>
          <div className="drink">
            <div className="cup" />
            <div className="umbrella" />
          </div>
        </div>
        <div className="legs relax">
          <span className="leg" />
          <span className="leg" />
        </div>
      </div>
      <button className="sign yes-sign" aria-label="Happy yes button" onClick={onClick}>
        כן 😍
      </button>
    </div>
  );
}
