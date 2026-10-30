/** A decorative board in progress; real game controls are rendered only by GameBoard. */
export function GameArtwork({ compact = false }: { compact?: boolean }) {
  const cells = ["X", "O", null, null, "X", "O", "O", null, null];
  return (
    <div className={"game-artwork" + (compact ? " artwork-compact" : "")} aria-hidden="true">
      <div className="artwork-board" dir="ltr">
        {cells.map((mark, index) => (
          <span
            className={"artwork-cell" + (mark ? " artwork-" + mark.toLowerCase() : "")}
            key={index}
          >
            {mark && (
              <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="butt"
              >
                {mark === "X" ? (
                  <path d="m28 28 44 44m0-44L28 72" />
                ) : (
                  <circle cx="50" cy="50" r="28" />
                )}
              </svg>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
