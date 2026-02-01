import type { CSSProperties } from "react";

export type ConfettiPiece = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  size: number;
  color: string;
};

type ConfettiLayerProps = {
  pieces: ConfettiPiece[];
};

export default function ConfettiLayer({ pieces }: ConfettiLayerProps) {
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={
            {
              left: piece.x,
              top: piece.y,
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              "--dx": `${piece.dx}px`,
              "--dy": `${piece.dy}px`,
              "--rot": `${piece.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
