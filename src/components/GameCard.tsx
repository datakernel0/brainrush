import Link from "next/link";
import type { GameInfo } from "@/data/games";
import { ArrowUpRight } from "lucide-react";
import GameIcon from "@/components/GameIcon";

export default function GameCard({
  game,
  index = 0,
}: {
  game: GameInfo;
  index?: number;
}) {
  return (
    <Link href={`/games/${game.slug}/`} className="game-card">
      <div className="game-card-top">
        <span className="game-icon">
          <GameIcon id={game.id} size={20} />
        </span>
        <span className="game-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="game-card-content">
        <span className="eyebrow">{game.category}</span>
        <h3>{game.title}</h3>
        <p>{game.short}</p>
      </div>
      <div className="game-card-bottom">
        <span className="difficulty">{game.difficulty}</span>
        <span className="card-arrow">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
