import Link from "next/link";
import { games } from "@/data/games";
import { CalendarDays, ArrowRight } from "lucide-react";
import DailyDate from "@/components/DailyDate";
import GameIcon from "@/components/GameIcon";

export const metadata = {
  title: "Daily Brain Challenge — BrainRush",
  description: "Take today's UTC-synchronized daily brain and reaction challenges on BrainRush.",
  alternates: { canonical: "/daily-challenge/" },
};

export default function DailyPage() {
  const brain = games.find((g) => g.id === "daily-brain-challenge")!;
  const reaction = games.find((g) => g.id === "daily-reaction")!;

  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">DAILY CHALLENGE</span>
        <h1>
          A fresh test, <span>every day.</span>
        </h1>
        <p>
          Daily challenges are generated deterministically from the UTC date, so every player receives the exact same puzzle sequence.
        </p>
      </div>

      <div className="daily-hero">
        <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <CalendarDays size={13} /> TODAY · <DailyDate />
        </span>
        <h2>Two daily tests available now</h2>
        <p>
          Unlimited practice runs are supported. Your official daily attempt and practice scores are tracked separately.
        </p>
      </div>

      <div className="game-grid" style={{ marginTop: 20 }}>
        {[brain, reaction].map((g) => (
          <Link key={g.id} href={`/games/${g.slug}/`} className="game-card">
            <div className="game-card-top">
              <span className="game-icon">
                <GameIcon id={g.id} size={20} />
              </span>
              <span className="game-number">TODAY</span>
            </div>
            <div className="game-card-content">
              <span className="eyebrow">{g.category}</span>
              <h3>{g.title}</h3>
              <p>{g.description}</p>
            </div>
            <div className="game-card-bottom">
              <span className="difficulty">Start test</span>
              <span className="card-arrow">
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <section className="content-card" style={{ marginTop: 24 }}>
        <h2>Deterministic daily seeds</h2>
        <p>
          BrainRush derives a deterministic seed from the game identifier, UTC calendar date, and challenge version. All attempts are verified and scored locally within your browser.
        </p>
      </section>
    </div>
  );
}
