import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CalendarDays,
  Smartphone,
  ShieldCheck,
  Zap,
  Grid3x3,
  Target,
  Trophy,
} from "lucide-react";
import GameCard from "@/components/GameCard";
import RecentGames from "@/components/RecentGames";
import { games } from "@/data/games";

export default function Home() {
  const featured = games.filter((g) => g.featured);
  const popular = [games[0], games[1], games[2], games[5], games[6], games[9]];

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero-kicker">MINIMALIST BROWSER ARCADE</span>
          <h1>
            Play smart.<br />
            <span>Beat your best.</span>
          </h1>
          <p>
            Fifteen clean, distraction-free skill and memory games. No downloads, no accounts, zero clutter.
          </p>
          <div className="hero-actions">
            <Link href="/games/" className="primary-btn">
              Explore all games <ArrowRight size={16} />
            </Link>
            <Link href="/daily-challenge/" className="secondary-btn">
              Today&apos;s challenge <CalendarDays size={16} />
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <Brain size={15} /> 15 Skill games
            </span>
            <span>
              <Smartphone size={15} /> Touch & desktop
            </span>
            <span>
              <ShieldCheck size={15} /> Local storage only
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">FEATURED</span>
              <h2>Daily recommended test</h2>
            </div>
            <Link className="plain-link" href="/games/">
              Browse all games <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="game-grid">
            {featured.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">CATEGORIES</span>
              <h2>Choose your challenge</h2>
            </div>
          </div>
          <div className="category-strip">
            <Link href="/games/?category=Speed%20%26%20Reflex" className="category-tile">
              <div className="tile-icon">
                <Zap size={20} />
              </div>
              <h3>Speed & Reflex</h3>
              <p>Reaction timing, rapid tapping, and precision coordination.</p>
            </Link>
            <Link href="/games/?category=Brain%20%26%20Memory" className="category-tile">
              <div className="tile-icon">
                <Grid3x3 size={20} />
              </div>
              <h3>Brain & Memory</h3>
              <p>Recall sequences, memorize grid patterns, and remember digits.</p>
            </Link>
            <Link href="/games/?category=Logic%20%26%20Daily" className="category-tile">
              <div className="tile-icon">
                <CalendarDays size={20} />
              </div>
              <h3>Logic & Daily</h3>
              <p>Mathematical patterns, cognitive Stroop tests, and daily challenges.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="daily-banner">
            <div>
              <span className="eyebrow">GLOBAL DAILY PUZZLE</span>
              <h2>One shared challenge each day.</h2>
              <p>A fresh UTC-synchronized puzzle for players worldwide.</p>
              <Link href="/daily-challenge/" className="plain-link" style={{ marginTop: 12 }}>
                Take today&apos;s challenge <ArrowRight size={15} />
              </Link>
            </div>
            <div className="daily-symbol">
              <CalendarDays size={28} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">POPULAR PICKS</span>
              <h2>Most played tests</h2>
              <p>Fast rounds to measure speed, focus, and memory.</p>
            </div>
            <Link className="plain-link" href="/games/">
              All 15 games <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="game-grid">
            {popular.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} />
            ))}
          </div>
        </div>
      </section>

      <RecentGames />

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ marginTop: 20 }}>
            <div>
              <span className="eyebrow">MINIMALIST BY DESIGN</span>
              <h2>Focus on the test. Nothing else.</h2>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature">
              <span className="feature-icon">
                <Target size={18} />
              </span>
              <h3>Instant access</h3>
              <p>Fast-loading rounds that work right in your browser with zero setup.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <Trophy size={18} />
              </span>
              <h3>Private personal records</h3>
              <p>Your best times and scores remain stored exclusively on your device.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <Smartphone size={18} />
              </span>
              <h3>Responsive controls</h3>
              <p>Optimized for accurate mouse clicks, trackpads, and mobile touchscreen taps.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
