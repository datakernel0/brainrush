import type { GameInfo } from "@/data/games";
import { Crosshair, Circle, Square } from "lucide-react";

export type GameViewProps = {
  game: GameInfo;
  round: number;
  score: number;
  misses: number;
  timeLeft: number;
  instruction: string;
  reactionWait: boolean;
  onReaction: () => void;
  clicks: number;
  onClick: () => void;
  targetPos: { x: number; y: number };
  onTarget: () => void;
  onTargetMiss: () => void;
  typed: string;
  passage: string;
  onTyped: (value: string) => void;
  completedWords: number;
  showPattern: boolean;
  options: number[];
  selected: number[];
  gridCells: number;
  onCell: (index: number) => void;
  onPatternSubmit: () => void;
  prompt: string;
  answer: string;
  onAnswerChange: (value: string) => void;
  onAnswerSubmit: () => void;
  sequence: number[];
  active: number;
  sequenceReady: boolean;
  onSequence: (index: number) => void;
  onOdd: (index: number) => void;
  onColor: (index: number) => void;
  onMathSubmit: () => void;
  today: string;
};

export function ReactionTimeView(p: GameViewProps) {
  return (
    <button
      className={`reaction-pad ${p.reactionWait ? "go" : "wait"}`}
      onClick={p.onReaction}
      aria-label={p.reactionWait ? "Click now" : "Wait for signal"}
    >
      <span>{p.reactionWait ? "TAP NOW!" : "WAIT..."}</span>
      <small>{p.reactionWait ? "Click or tap immediately" : "Stay ready for green"}</small>
    </button>
  );
}

export function ClickSpeedView(p: GameViewProps) {
  return (
    <>
      <div className="play-stats">
        <b>{p.timeLeft}s left</b>
        <span>{p.clicks} clicks</span>
      </div>
      <button className="click-pad" onClick={p.onClick} aria-label="Click button">
        <span>CLICK</span>
        <small>Tap as fast as you can</small>
      </button>
    </>
  );
}

export function AimTrainerView(p: GameViewProps) {
  const scale = Math.max(0.65, 1 - p.round * 0.018);
  return (
    <>
      <div className="play-stats">
        <b>{p.round} / 20</b>
        <span>Targets hit</span>
      </div>
      <div className="aim-board" onClick={p.onTargetMiss}>
        <button
          className="aim-target"
          style={{
            left: `${p.targetPos.x}%`,
            top: `${p.targetPos.y}%`,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            p.onTarget();
          }}
          aria-label="Target"
        >
          <Crosshair size={22} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

export function FastTapView(p: GameViewProps) {
  const scale = Math.max(0.65, 1 - p.round * 0.018);
  return (
    <>
      <div className="play-stats">
        <b>{p.round} / 20</b>
        <span>Targets tapped</span>
      </div>
      <div className="aim-board" onClick={p.onTargetMiss}>
        <button
          className="aim-target"
          style={{
            left: `${p.targetPos.x}%`,
            top: `${p.targetPos.y}%`,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            p.onTarget();
          }}
          aria-label="Target"
        >
          <Crosshair size={22} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

export function TypingSpeedView(p: GameViewProps) {
  return (
    <>
      <div className="play-stats">
        <b>{p.timeLeft}s left</b>
        <span>{p.completedWords} words completed</span>
      </div>
      <p className="typing-passage">{p.passage}</p>
      <textarea
        className="typing-input"
        value={p.typed}
        onChange={(e) => p.onTyped(e.target.value)}
        placeholder="Start typing the text above…"
        autoFocus
        aria-label="Typing passage input"
      />
    </>
  );
}

export function MemoryGridView(p: GameViewProps) {
  return (
    <>
      <div className="play-stats">
        <b>Level {p.round + 1}</b>
        <span>{p.showPattern ? "Memorize the pattern" : "Recreate the pattern"}</span>
      </div>
      <div
        className={`memory-board ${
          p.game.id === "pattern-memory" ? "four-grid" : p.gridCells > 9 ? "five-grid" : "three-grid"
        }`}
      >
        {Array.from({ length: p.gridCells }, (_, i) => (
          <button
            key={i}
            className={`memory-cell ${p.showPattern && p.options.includes(i) ? "lit" : ""} ${
              p.selected.includes(i) ? "picked" : ""
            }`}
            onClick={() => !p.showPattern && p.onCell(i)}
            aria-label={`Cell ${i + 1}`}
            disabled={p.showPattern}
          />
        ))}
      </div>
      {!p.showPattern && (
        <button className="primary-btn" onClick={p.onPatternSubmit}>
          Check pattern
        </button>
      )}
    </>
  );
}

export function NumberMemoryView(p: GameViewProps) {
  return (
    <>
      <div className="play-stats">
        <b>Level {p.round + 1}</b>
        <span>{p.showPattern ? "Memorize this number" : "Type the number"}</span>
      </div>
      <div className="number-display">
        {p.showPattern ? p.prompt.split("").join(" ") : "• • • •"}
      </div>
      {!p.showPattern && (
        <form
          className="answer-row"
          onSubmit={(e) => {
            e.preventDefault();
            p.onAnswerSubmit();
          }}
        >
          <input
            value={p.answer}
            onChange={(e) => p.onAnswerChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
            inputMode="numeric"
            placeholder="Type remembered digits…"
            autoFocus
          />
          <button className="primary-btn">Submit</button>
        </form>
      )}
    </>
  );
}

export function SequenceRecallView(p: GameViewProps) {
  const colors = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b"];
  return (
    <>
      <div className="play-stats">
        <b>Level {p.sequence.length}</b>
        <span>{p.instruction}</span>
      </div>
      <div className="sequence-pads">
        {colors.map((c, i) => (
          <button
            key={c}
            style={{ background: c }}
            className={p.active === i ? "flash" : ""}
            onClick={() => p.onSequence(i)}
            disabled={!p.sequenceReady}
            aria-label={`Color tile ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

export function OddOneOutView(p: GameViewProps) {
  const count = p.round < 3 ? 9 : p.round < 7 ? 16 : 25;
  return (
    <>
      <div className="play-stats">
        <b>Round {p.round} / 10</b>
        <span>{p.instruction}</span>
      </div>
      <div className="odd-grid">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            onClick={() => p.onOdd(i)}
            className="odd-cell"
            aria-label={`Option ${i + 1}`}
          >
            {i === p.options[0] ? <Square size={20} /> : <Circle size={20} />}
          </button>
        ))}
      </div>
    </>
  );
}

export function ColorMatchView(p: GameViewProps) {
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#eab308"];
  return (
    <>
      <div className="play-stats">
        <b>{p.score} correct</b>
        <span>{p.instruction}</span>
      </div>
      <div className="color-word" style={{ color: colors[p.active] }}>
        {p.prompt}
      </div>
      <div className="choice-row">
        {["RED", "BLUE", "GREEN", "YELLOW"].map((v, i) => (
          <button key={v} onClick={() => p.onColor(i)}>
            {v}
          </button>
        ))}
      </div>
    </>
  );
}

export function NumberSequenceView(p: GameViewProps) {
  return (
    <>
      <div className="play-stats">
        <b>{p.game.id === "daily-brain-challenge" ? p.today : "Sequence Puzzle"}</b>
        <span>{p.instruction}</span>
      </div>
      <div className="number-sequence">
        {p.options.map((v, i) => (
          <span key={i}>{v}</span>
        ))}
        <span className="missing">?</span>
      </div>
      <form
        className="answer-row"
        onSubmit={(e) => {
          e.preventDefault();
          p.onAnswerSubmit();
        }}
      >
        <input
          value={p.answer}
          onChange={(e) => p.onAnswerChange(e.target.value.replace(/[^0-9-]/g, ""))}
          inputMode="numeric"
          placeholder="Next number…"
          autoFocus
        />
        <button className="primary-btn">Check</button>
      </form>
    </>
  );
}

export function QuickMathView(p: GameViewProps) {
  return (
    <>
      <div className="play-stats">
        <b>{p.timeLeft}s left</b>
        <span>{p.score} correct · {p.misses} misses</span>
      </div>
      <div className="math-question">{p.prompt} = ?</div>
      <form
        className="answer-row"
        onSubmit={(e) => {
          e.preventDefault();
          p.onMathSubmit();
        }}
      >
        <input
          value={p.answer}
          onChange={(e) => p.onAnswerChange(e.target.value.replace(/[^0-9-]/g, ""))}
          inputMode="numeric"
          placeholder="Answer…"
          autoFocus
        />
        <button className="primary-btn">Submit</button>
      </form>
    </>
  );
}
