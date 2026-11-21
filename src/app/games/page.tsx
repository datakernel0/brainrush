"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import GameCard from "@/components/GameCard";
import { games, categories } from "@/data/games";
import { resetRecords } from "@/lib/storage";

export default function GamesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [sort, setSort] = useState("popular");
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("category");
    if (value && categories.includes(value as (typeof categories)[number])) setCat(value);
  }, []);

  const filtered = useMemo(() => {
    const list = games.filter(
      (g) =>
        (cat === "All" || g.category === cat) &&
        `${g.title} ${g.description}`.toLowerCase().includes(q.toLowerCase())
    );
    return sort === "category"
      ? [...list].sort(
          (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
        )
      : list;
  }, [q, cat, sort]);

  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">ARCADE CATALOG</span>
        <h1>Find your next challenge.</h1>
        <p>Fifteen ways to test your reflexes, train your memory, and sharpen your focus.</p>
      </div>

      <div className="directory-tools">
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search games…"
          aria-label="Search games"
        />
        <select
          className="filter-chip"
          aria-label="Sort games"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="popular">Sort: Featured</option>
          <option value="category">Sort: Category</option>
        </select>
        <div className="filter-row">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`filter-chip ${cat === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="directory-status">
        <p className="muted" style={{ fontSize: 13, marginBottom: 15 }}>
          {filtered.length} {filtered.length === 1 ? "game" : "games"} available
        </p>
        <button
          className="text-btn"
          style={{ marginTop: 0 }}
          onClick={() => {
            if (
              window.confirm(
                "Clear all BrainRush personal records and recently played games on this device?"
              )
            ) {
              resetRecords();
              setReset(true);
            }
          }}
        >
          {reset ? "Records cleared" : "Reset personal records"}
        </button>
      </div>

      {filtered.length ? (
        <div className="game-grid">
          {filtered.map((g, i) => (
            <GameCard key={g.id} game={g} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={24} style={{ margin: "0 auto 8px" }} />
          <h3>No games found</h3>
          <p>Try searching for a different keyword or category.</p>
        </div>
      )}
    </div>
  );
}
