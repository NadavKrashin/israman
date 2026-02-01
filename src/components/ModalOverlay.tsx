type ModalOverlayProps = {
  onReplay: () => void;
};

export default function ModalOverlay({ onReplay }: ModalOverlayProps) {
  return (
    <div className="modal" dir="rtl">
      <div className="modal-card" role="dialog" aria-live="polite">
        <h2>יש כאלה שלא לומדים מטעויות...</h2>
        <img className="modal-image" src="/gal.JPG" alt="Gal" />

        <button className="replay" onClick={onReplay} aria-label="Replay celebration">
         שוב
        </button>
      </div>
    </div>
  );
}
