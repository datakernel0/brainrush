"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Play, Share2, Copy, Clock3, Trophy, Download } from "lucide-react";
import type { GameInfo } from "@/data/games";
import { dailySeed, seededRandom, shuffle } from "@/lib/random";
import { readRecord, saveRecord, addRecent, markDaily, hasDaily } from "@/lib/storage";
import { shareResult, copyText } from "@/lib/sharing";
import { trackEvent } from "@/lib/analytics";
import GameIcon from "@/components/GameIcon";
import ReactionTimeGame from "@/games/reaction-time/Game";
import ClickSpeedGame from "@/games/click-speed/Game";
import AimTrainerGame from "@/games/aim-trainer/Game";
import FastTapGame from "@/games/fast-tap/Game";
import TypingSpeedGame from "@/games/typing-speed/Game";
import MemoryGridGame from "@/games/memory-grid/Game";
import NumberMemoryGame from "@/games/number-memory/Game";
import SequenceRecallGame from "@/games/sequence-recall/Game";
import PatternMemoryGame from "@/games/pattern-memory/Game";
import OddOneOutGame from "@/games/odd-one-out/Game";
import ColorMatchGame from "@/games/color-match/Game";
import NumberSequenceGame from "@/games/number-sequence/Game";
import QuickMathGame from "@/games/quick-math/Game";
import DailyBrainGame from "@/games/daily-brain-challenge/Game";
import DailyReactionGame from "@/games/daily-reaction/Game";
import type { GameViewProps } from "@/games/shared/GameViews";

type Props = { game: GameInfo };
type Phase = "intro" | "playing" | "result";

const PASSAGES = [
  "Small steps every day can build remarkable skills. Stay curious, keep practicing, and enjoy the progress you make along the way.",
  "A quick break can refresh your focus. Challenge your memory, sharpen your reflexes, and return to your day with fresh energy.",
  "Great results come from patience and practice. Take a breath, trust your instincts, and give this challenge your best effort.",
];

export default function GameClient({ game }: Props) {
  const [phase, setPhase] = useState<Phase>("intro"),
    [score, setScore] = useState(0),
    [best, setBest] = useState<number | null>(null),
    [isNewBest, setIsNewBest] = useState(false),
    [message, setMessage] = useState(""),
    [copied, setCopied] = useState(false),
    [round, setRound] = useState(0),
    [timeLeft, setTimeLeft] = useState(10),
    [misses, setMisses] = useState(0),
    [answer, setAnswer] = useState(""),
    [prompt, setPrompt] = useState(""),
    [options, setOptions] = useState<number[]>([]),
    [selected, setSelected] = useState<number[]>([]),
    [sequence, setSequence] = useState<number[]>([]),
    [showPattern, setShowPattern] = useState(true),
    [active, setActive] = useState(-1),
    [instruction, setInstruction] = useState(""),
    [duration, setDuration] = useState(game.id === "typing-speed" ? 30 : 10);
  const [dailyDone, setDailyDone] = useState(false),
    [gridCells, setGridCells] = useState(9);
  const startAt = useRef(0);
  const clickCount = useRef(0);
  const typedRef = useRef("");
  const passageRef = useRef(PASSAGES[0]);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const dailyRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rngRef = useRef<() => number>(Math.random);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [typed, setTyped] = useState("");
  const [passage, setPassage] = useState(PASSAGES[0]);
  const [reactionWait, setReactionWait] = useState(false);
  const [reactionStart, setReactionStart] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [sequenceReady, setSequenceReady] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const recordKey = game.id;
  const isDailyGame = game.id === "daily-brain-challenge" || game.id === "daily-reaction";

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
    return id;
  };

  const stopTimers = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    timer.current = null;
  }, []);

  useEffect(() => {
    const storedKey = isDailyGame
      ? `${game.id}:${hasDaily(game.id, today) ? "daily" : "practice"}`
      : recordKey;
    const r = readRecord(storedKey);
    setBest(r?.value ?? null);
    addRecent(game.slug);
    setDailyDone(hasDaily(game.id, today));
    trackEvent("game_open", { game: game.id });
    return stopTimers;
  }, [recordKey, game.slug, game.id, today, stopTimers, isDailyGame]);

  useEffect(() => () => stopTimers(), [stopTimers]);

  const finish = useCallback(
    (value: number, label: string, lower = false) => {
      stopTimers();
      setPhase("result");
      setScore(value);
      const storageKey = isDailyGame
        ? `${game.id}:${dailyRef.current ? "daily" : "practice"}`
        : recordKey;
      const previous = readRecord(storageKey);
      const improved = !previous || (lower ? value < previous.value : value > previous.value);
      const r = saveRecord(storageKey, value, label, lower);
      setIsNewBest(Boolean(r) && improved);
      setBest(r?.value ?? value);
      setMessage(label);
      trackEvent("game_complete", { game: game.id, score: value });
      if (dailyRef.current) {
        markDaily(game.id, today);
        trackEvent("daily_challenge_complete", { game: game.id });
      }
      setDailyDone(dailyRef.current || dailyDone);
    },
    [stopTimers, recordKey, game.id, today, dailyDone, isDailyGame]
  );

  const finishClick = () => {
    const count = clickCount.current;
    finish(
      count,
      `${count} clicks · ${(count / (duration || 10)).toFixed(1)} clicks/s`
    );
  };

  const finishTyping = () => {
    const value = typedRef.current;
    const words = completedWords(value, passageRef.current);
    const mins = Math.max((Date.now() - startAt.current) / 60000, 0.01);
    const wpm = Math.round(words / mins);
    const correct = value.split("").filter((c, i) => c === passageRef.current[i]).length;
    const acc = value.length ? Math.round((correct / value.length) * 100) : 0;
    finish(wpm, `${wpm} WPM · ${acc}% accuracy`);
  };

  const begin = useCallback(
    (isDaily = false) => {
      stopTimers();
      trackEvent(phase === "result" ? "game_restart" : "game_start", {
        game: game.id,
        daily: isDaily,
      });
      setPhase("playing");
      setIsNewBest(false);
      setScore(0);
      setRound(0);
      setMisses(0);
      setAnswer("");
      setTyped("");
      setSelected([]);
      setReactionTimes([]);
      dailyRef.current = isDaily;
      clickCount.current = 0;
      typedRef.current = "";
      scoreRef.current = 0;
      missesRef.current = 0;
      startAt.current = Date.now();
      setTimeLeft(
        game.id === "click-speed"
          ? duration
          : game.id === "typing-speed"
          ? duration
          : game.id === "quick-math"
          ? 60
          : 10
      );

      const rnd = isDaily ? seededRandom(dailySeed(game.id)) : Math.random;
      rngRef.current = rnd;

      if (game.id === "reaction-time" || game.id === "daily-reaction") {
        setInstruction("Wait for green…");
        setReactionWait(false);
        const next = () => {
          setReactionWait(false);
          setInstruction("Wait for green…");
          schedule(() => {
            setReactionWait(true);
            setInstruction("TAP NOW!");
            setReactionStart(Date.now());
          }, 900 + rnd() * 2600);
        };
        next();
      }

      if (game.id === "click-speed") {
        timer.current = setInterval(() => {
          setTimeLeft((t) => Math.max(0, t - 1));
          if (Date.now() - startAt.current >= duration * 1000) finishClick();
        }, 1000);
      }

      if (game.id === "quick-math") {
        timer.current = setInterval(() => {
          setTimeLeft((t) => Math.max(0, t - 1));
          if (Date.now() - startAt.current >= 60000)
            finish(
              scoreRef.current,
              `${scoreRef.current} correct · ${missesRef.current} misses`
            );
        }, 1000);
      }

      if (game.id === "typing-speed") {
        const chosen = PASSAGES[Math.floor(rnd() * PASSAGES.length)];
        setPassage(chosen);
        passageRef.current = chosen;
        timer.current = setInterval(() => {
          setTimeLeft((t) => Math.max(0, t - 1));
          if (Date.now() - startAt.current >= duration * 1000) finishTyping();
        }, 1000);
      }

      if (game.id === "aim-trainer" || game.id === "fast-tap") {
        setRound(0);
        setTargetPos({ x: 15 + rnd() * 70, y: 15 + rnd() * 70 });
      }

      if (game.id === "memory-grid" || game.id === "pattern-memory") {
        const n = game.id === "memory-grid" ? 9 : 16;
        setGridCells(n);
        const count = game.id === "memory-grid" ? 3 : 4;
        const pat = shuffle(Array.from({ length: n }, (_, i) => i), rnd).slice(0, count);
        setOptions(pat);
        setSelected([]);
        setShowPattern(true);
        schedule(() => setShowPattern(false), 1700);
      }

      if (game.id === "number-memory") {
        const num = String(Math.floor(1000 + rnd() * 9000));
        setPrompt(num);
        setShowPattern(true);
        schedule(() => setShowPattern(false), 1800);
      }

      if (game.id === "sequence-recall") {
        const seq = [Math.floor(rnd() * 4)];
        setSequence(seq);
        playSequence(seq);
      }

      if (game.id === "odd-one-out") {
        makeOddRound(0, rnd);
      }

      if (game.id === "color-match") {
        makeColorRound(rnd);
      }

      if (game.id === "number-sequence" || game.id === "daily-brain-challenge") {
        makeNumberPuzzle(rnd, 0);
      }

      if (game.id === "quick-math") {
        makeMath(rnd);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopTimers, game.id, duration, finish]
  );

  const completedWords = (v: string, p: string) => {
    if (!v.trim()) return 0;
    const words = v.trim().split(/\s+/);
    const completed = v.endsWith(" ") ? words.length : Math.max(0, words.length - 1);
    return Math.min(completed, p.split(/\s+/).length);
  };

  const makeOddRound = (level: number, rnd = Math.random) => {
    const n = Math.min(9 + Math.floor(level / 2) * 4, 25);
    const odd = Math.floor(rnd() * n);
    setOptions([odd]);
    setPrompt(String.fromCharCode(65 + Math.floor(rnd() * 20)));
    setInstruction("Find the one different shape");
  };

  const makeColorRound = (rnd = Math.random) => {
    const names = ["RED", "BLUE", "GREEN", "YELLOW"];
    const word = Math.floor(rnd() * 4),
      ink = Math.floor(rnd() * 4);
    setPrompt(names[word]);
    setOptions([word, ink]);
    setInstruction(rnd() > 0.5 ? "MATCH THE WORD" : "MATCH THE INK COLOR");
    setActive(ink);
  };

  const makeNumberPuzzle = (rnd = Math.random, level = 0) => {
    const a = Math.floor(rnd() * (8 + level * 2)) + 2,
      d = Math.floor(rnd() * (5 + level)) + 2;
    setOptions([a, a + d, a + 2 * d, a + 3 * d]);
    setPrompt(String(a + 4 * d));
    setInstruction("What number comes next?");
  };

  const makeMath = (rnd = Math.random) => {
    const ops = ["+", "−", "×", "÷"];
    const op = ops[Math.floor(rnd() * ops.length)];
    let a = Math.floor(rnd() * 12) + 1;
    const b = Math.floor(rnd() * 12) + 1;
    if (op === "÷") {
      a = a * b;
    }
    setPrompt(`${a} ${op} ${b}`);
    setOptions([op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b]);
    setInstruction("Solve before time expires");
  };

  const playSequence = (seq: number[]) => {
    setSequenceReady(false);
    setActive(-1);
    seq.forEach((v, i) => {
      schedule(() => setActive(v), 500 + i * 650);
      schedule(() => setActive(-1), 850 + i * 650);
    });
    schedule(() => {
      setInstruction("Repeat the sequence");
      setSequenceReady(true);
    }, 500 + seq.length * 650);
  };

  const tapReaction = () => {
    if (!reactionWait) {
      missesRef.current += 1;
      setMisses((m) => m + 1);
      setInstruction("Too soon! Wait for green.");
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
      schedule(() => {
        setInstruction("Wait for green…");
        schedule(() => {
          setReactionWait(true);
          setInstruction("TAP NOW!");
          setReactionStart(Date.now());
        }, 1000 + rngRef.current() * 2000);
      }, 700);
      return;
    }
    const ms = Date.now() - reactionStart;
    const times = [...reactionTimes, ms];
    setReactionTimes(times);
    setReactionWait(false);
    if (times.length >= 5) {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const adjusted = avg + misses * 100;
      finish(
        adjusted,
        `${avg} ms average · ${misses} false starts · ${adjusted} ms adjusted`,
        true
      );
    } else {
      setInstruction(`Recorded: ${ms} ms · Round ${times.length + 1} / 5`);
      schedule(() => {
        setInstruction("Wait for green…");
        schedule(() => {
          setReactionWait(true);
          setInstruction("TAP NOW!");
          setReactionStart(Date.now());
        }, 1000 + rngRef.current() * 2200);
      }, 900);
    }
  };

  const onTarget = () => {
    const next = round + 1;
    setRound(next);
    if (next >= 20) {
      const ms = Date.now() - startAt.current;
      finish(
        Math.round(ms),
        `${(ms / 1000).toFixed(1)}s · ${Math.round((20 / (20 + misses)) * 100)}% accuracy`,
        true
      );
    } else {
      setTargetPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
      if (game.id === "aim-trainer") setInstruction(`Target ${next + 1} of 20`);
    }
  };

  const submitAnswer = () => {
    const val = Number(answer);
    if (game.id === "number-memory") {
      if (answer === prompt) {
        const next = round + 1;
        setRound(next);
        setScore(prompt.length);
        setPrompt(
          String(Math.floor(10 ** (prompt.length + 1) + Math.random() * (9 * 10 ** prompt.length)))
        );
        setAnswer("");
        setShowPattern(true);
        schedule(() => setShowPattern(false), 1500);
      } else finish(score, `${score} digits recalled`);
    } else if (game.id === "number-sequence" || game.id === "daily-brain-challenge") {
      if (val === Number(prompt)) {
        if (game.id === "daily-brain-challenge") {
          finish(1, "Daily puzzle solved!");
        } else {
          const next = round + 1;
          setRound(next);
          setScore(next);
          if (next >= 10) finish(next, `${next} number sequences completed`);
          else {
            setAnswer("");
            makeNumberPuzzle(rngRef.current, next);
          }
        }
      } else {
        setInstruction("Incorrect. Try another number.");
        setMisses((m) => m + 1);
      }
    }
  };

  const chooseCell = (i: number) => {
    if (game.id === "memory-grid" || game.id === "pattern-memory") {
      setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
    } else if (game.id === "odd-one-out") {
      if (i === options[0]) {
        const n = round + 1;
        setRound(n);
        setScore(n);
        if (n >= 10)
          finish(
            n,
            `${n} rounds · ${((Date.now() - startAt.current) / 1000).toFixed(1)}s · ${Math.round(
              (n / (n + misses)) * 100
            )}% accuracy`
          );
        else makeOddRound(n);
      } else {
        setMisses((m) => m + 1);
        setInstruction("Not that one — look again");
      }
    }
  };

  const submitPattern = () => {
    const ok = options.length === selected.length && options.every((x) => selected.includes(x));
    if (ok) {
      const n = round + 1;
      setRound(n);
      setScore(n);
      if (n >= 8) finish(n, `Level ${n} completed`);
      else {
        const total = game.id === "memory-grid" ? Math.min(9 + n, 25) : 16;
        setGridCells(total);
        const count = Math.min((game.id === "memory-grid" ? 3 : 4) + n, 10);
        const pat = shuffle(Array.from({ length: total }, (_, i) => i)).slice(0, count);
        setOptions(pat);
        setSelected([]);
        setShowPattern(true);
        schedule(() => setShowPattern(false), 1400);
      }
    } else {
      setMisses((m) => m + 1);
      finish(round, `${round} levels · ${Math.round((round / (round + 1)) * 100)}% accuracy`);
    }
  };

  const tapSequence = (i: number) => {
    if (!sequenceReady) return;
    if (i === sequence[selected.length]) {
      const next = [...selected, i];
      setSelected(next);
      if (next.length === sequence.length) {
        setSelected([]);
        setSequenceReady(false);
        setRound((r) => r + 1);
        if (sequence.length >= 10) finish(sequence.length, `Level ${sequence.length} completed`);
        else {
          const seq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(seq);
          playSequence(seq);
        }
      }
    } else finish(Math.max(0, sequence.length - 1), `Sequence ended at level ${sequence.length}`);
  };

  const submitMath = (v: number) => {
    if (v === options[0]) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      makeMath();
    } else {
      missesRef.current += 1;
      setMisses((m) => m + 1);
    }
  };

  const chooseColor = (i: number) => {
    const correct = instruction.includes("WORD") ? i === options[0] : i === options[1];
    if (correct) {
      const next = score + 1;
      setScore(next);
      if (next >= 20) {
        const ms = Date.now() - startAt.current;
        finish(next, `${next} correct · ${(ms / 1000).toFixed(1)}s`);
      } else makeColorRound();
    } else setMisses((m) => m + 1);
  };

  const resultText = `I ${
    dailyRef.current ? "completed the daily challenge" : "scored"
  } ${message} on BrainRush ${game.title}.`;

  const share = async () => {
    trackEvent("result_share", { game: game.id });
    const r = await shareResult(
      resultText,
      typeof location !== "undefined" ? location.href : undefined
    );
    setCopied(r === "copied");
  };

  const copy = async () => {
    const ok = await copyText(resultText);
    setCopied(ok);
  };

  const copyLink = async () => {
    const ok = await copyText(typeof location !== "undefined" ? location.href : "");
    setCopied(ok);
  };

  const downloadCard = () => {
    const safe = (v: string) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      };
      return v.replace(/[&<>"]/g, (c) => entities[c] || c);
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420"><rect width="800" height="420" rx="16" fill="#0b0f19"/><rect x="2" y="2" width="796" height="416" rx="14" fill="none" stroke="#1e293b" stroke-width="2"/><text x="48" y="70" fill="#94a3b8" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="16" font-weight="600" letter-spacing="1">BRAINRUSH</text><text x="48" y="140" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="34" font-weight="700">${safe(
      game.title
    )}</text><text x="48" y="220" fill="#38bdf8" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="36" font-weight="800">${safe(
      message
    )}</text><text x="48" y="340" fill="#64748b" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="15">Play smart. Beat your best. · brainrush</text></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brainrush-${game.slug}-result.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const viewProps: GameViewProps = {
    game,
    round,
    score,
    misses,
    timeLeft,
    instruction,
    reactionWait,
    onReaction: tapReaction,
    clicks: clickCount.current,
    onClick: () => {
      clickCount.current += 1;
      setScore(clickCount.current);
    },
    targetPos,
    onTarget,
    onTargetMiss: () => {
      missesRef.current += 1;
      setMisses((m) => m + 1);
    },
    typed,
    passage,
    onTyped: (value) => {
      typedRef.current = value;
      setTyped(value);
    },
    completedWords: completedWords(typed, passage),
    showPattern,
    options,
    selected,
    gridCells,
    onCell: chooseCell,
    onPatternSubmit: submitPattern,
    prompt,
    answer,
    onAnswerChange: setAnswer,
    onAnswerSubmit: submitAnswer,
    sequence,
    active,
    sequenceReady,
    onSequence: tapSequence,
    onOdd: chooseCell,
    onColor: chooseColor,
    onMathSubmit: () => {
      submitMath(Number(answer));
      setAnswer("");
    },
    today,
  };

  const gameView = (() => {
    switch (game.id) {
      case "reaction-time":
        return <ReactionTimeGame {...viewProps} />;
      case "click-speed":
        return <ClickSpeedGame {...viewProps} />;
      case "aim-trainer":
        return <AimTrainerGame {...viewProps} />;
      case "fast-tap":
        return <FastTapGame {...viewProps} />;
      case "typing-speed":
        return <TypingSpeedGame {...viewProps} />;
      case "memory-grid":
        return <MemoryGridGame {...viewProps} />;
      case "number-memory":
        return <NumberMemoryGame {...viewProps} />;
      case "sequence-recall":
        return <SequenceRecallGame {...viewProps} />;
      case "pattern-memory":
        return <PatternMemoryGame {...viewProps} />;
      case "odd-one-out":
        return <OddOneOutGame {...viewProps} />;
      case "color-match":
        return <ColorMatchGame {...viewProps} />;
      case "number-sequence":
        return <NumberSequenceGame {...viewProps} />;
      case "quick-math":
        return <QuickMathGame {...viewProps} />;
      case "daily-brain-challenge":
        return <DailyBrainGame {...viewProps} />;
      case "daily-reaction":
        return <DailyReactionGame {...viewProps} />;
      default:
        return null;
    }
  })();

  return (
    <section className="game-console">
      <div className="game-console-head">
        <div>
          <span className="eyebrow">{dailyRef.current ? "DAILY ATTEMPT" : game.category}</span>
          <h2>
            {phase === "result"
              ? "Challenge complete"
              : phase === "playing"
              ? "Round in progress"
              : "Ready"}
          </h2>
          <p>
            {phase === "intro"
              ? "Stay focused and aim for your personal best."
              : phase === "playing"
              ? instruction
              : "Results saved to local storage."}
          </p>
        </div>
        <div className="best-pill">
          <Trophy size={14} />
          <span>
            Best{" "}
            <b>
              {best === null
                ? "—"
                : game.id.includes("reaction")
                ? `${Math.round(best)} ms`
                : game.id === "aim-trainer" || game.id === "fast-tap"
                ? `${(best / 1000).toFixed(2)}s`
                : best}
            </b>
          </span>
        </div>
      </div>

      {phase === "intro" && (
        <div className="game-stage intro-stage">
          <div className="stage-orb">
            <GameIcon id={game.id} size={30} />
          </div>
          <h3>{game.title}</h3>
          <p>{game.description}</p>
          {(game.id === "click-speed" || game.id === "typing-speed") && (
            <div className="duration-select">
              <span>Duration:</span>
              {(game.id === "typing-speed" ? [30, 60] : [5, 10, 15]).map((n) => (
                <button
                  key={n}
                  className={duration === n ? "selected" : ""}
                  onClick={() => setDuration(n)}
                >
                  {n}s
                </button>
              ))}
            </div>
          )}
          <button
            className="primary-btn"
            onClick={() => {
              clickCount.current = 0;
              begin(false);
            }}
          >
            <Play size={15} fill="currentColor" /> Start game
          </button>
          {game.id === "daily-brain-challenge" || game.id === "daily-reaction" ? (
            <button
              className="text-btn"
              onClick={() => {
                clickCount.current = 0;
                begin(!dailyDone);
              }}
            >
              {dailyDone ? "Play practice mode" : "Start daily challenge attempt"}
            </button>
          ) : null}
        </div>
      )}

      {phase === "playing" && <div className="game-stage play-stage">{gameView}</div>}

      {phase === "result" && (
        <div className="game-stage result-stage">
          <div className="result-icon">
            <Trophy size={28} />
          </div>
          <span className="eyebrow">YOUR RESULT</span>
          <div className="result-score">
            {game.id.includes("reaction")
              ? `${Math.round(score)} ms`
              : game.id === "typing-speed"
              ? `${score} WPM`
              : game.id === "aim-trainer" || game.id === "fast-tap"
              ? `${(score / 1000).toFixed(2)}s`
              : score}
          </div>
          <h3>{message}</h3>
          <p>
            {isNewBest
              ? "New personal best recorded!"
              : "Round recorded. Keep practicing to beat your record."}
          </p>
          <div className="result-actions">
            <button
              className="primary-btn"
              onClick={() => {
                clickCount.current = 0;
                begin(false);
              }}
            >
              <RotateCcw size={15} /> Play again
            </button>
            <button className="secondary-btn" onClick={share}>
              <Share2 size={15} /> Share
            </button>
            <button className="secondary-btn" onClick={copyLink}>
              <Copy size={15} /> {copied ? "Copied" : "Copy link"}
            </button>
            <button className="secondary-btn" onClick={copy}>
              <Copy size={15} /> Copy score
            </button>
            <button className="secondary-btn" onClick={downloadCard}>
              <Download size={15} /> Save card
            </button>
          </div>
          <p className="privacy-note">
            Scores are stored locally on this device and are not uploaded to servers.
          </p>
        </div>
      )}

      <div className="console-foot">
        <span>
          <Clock3 size={13} /> Quick rounds · No login required
        </span>
        <span>
          <Trophy size={13} /> Records saved locally
        </span>
      </div>
    </section>
  );
}
