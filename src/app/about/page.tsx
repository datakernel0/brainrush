export const metadata = {
  title: "About BrainRush",
  description: "Learn about BrainRush, a free browser arcade for quick skill, memory and logic games.",
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">ABOUT US</span>
        <h1>A little play goes a long way.</h1>
        <p>BrainRush is a lightweight, minimalist browser arcade designed for focused, satisfying challenges.</p>
      </div>
      <section className="content-card">
        <h2>Our mission</h2>
        <p>
          We believe mental breaks should be simple, focused, and immediately accessible. BrainRush combines reflex tests, memory challenges, and logic puzzles into clean, responsive browser games.
        </p>
        <h2>Zero clutter & privacy-first</h2>
        <p>
          No logins, subscriptions, or downloads. All scores and personal records are kept strictly in your local browser storage.
        </p>
        <h2>Play smart. Beat your best.</h2>
        <p>
          Select a challenge, test your speed and memory, and track your progress over time.
        </p>
      </section>
    </div>
  );
}
