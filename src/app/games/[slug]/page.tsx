import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GameClient from "@/components/GameClient";
import AdSlot from "@/components/AdSlot";
import GameIcon from "@/components/GameIcon";
import { games, getGame } from "@/data/games";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGame(slug);
  if (!g) return {};
  return {
    title: `${g.title} Online — Free Browser Game`,
    description: g.description,
    alternates: { canonical: `/games/${g.slug}/` },
    openGraph: {
      title: `${g.title} | BrainRush`,
      description: g.description,
      type: "website",
      images: ["/images/brainrush-social.svg"],
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const related = games
    .filter((g) => g.category === game.category && g.id !== game.id)
    .slice(0, 3);

  return (
    <div className="container">
      <div style={{ paddingTop: 20 }}>
        <Link href="/games/" className="plain-link">
          <ArrowLeft size={15} /> All games
        </Link>
      </div>

      <div className="game-title-row">
        <div className="game-title-icon">
          <GameIcon id={game.id} size={26} />
        </div>
        <div>
          <span className="eyebrow">{game.category}</span>
          <h1>{game.title}</h1>
          <p>{game.short}</p>
        </div>
      </div>

      <div className="game-layout">
        <div>
          <GameClient game={game} />
          <section className="content-card">
            <h2>How to play</h2>
            <p>{game.description}</p>
            <ol>
              {game.instructions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <h3>Scoring & records</h3>
            <p>
              Your score is calculated locally in your browser. Personal bests are saved on your
              current device and are never transmitted to external servers.
            </p>
          </section>
          <AdSlot placement={`${game.id}-below-instructions`} />
          <section className="content-card">
            <h2>Frequently asked questions</h2>
            {game.faq.map((f, i) => (
              <div className="faq-item" key={i}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="game-sidebar">
          <div className="side-panel">
            <h3>Overview</h3>
            <ul>
              <li>Free to play in your browser</li>
              <li>No account or download needed</li>
              <li>Personal best saved locally</li>
              <li>Supports touch & mouse input</li>
            </ul>
          </div>
          <AdSlot placement={`${game.id}-sidebar`} />
          <div className="side-panel">
            <h3>More in {game.category}</h3>
            <div className="related-list">
              {related.map((g) => (
                <Link key={g.id} href={`/games/${g.slug}/`}>
                  <GameIcon id={g.id} size={15} />
                  <span>{g.title}</span>
                  <ArrowUpRight size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
