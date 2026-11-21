export const metadata = {
  title: "Terms of Use",
  description: "Terms of use for the BrainRush browser arcade.",
  alternates: { canonical: "/terms/" },
};

export default function Terms() {
  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">LEGAL</span>
        <h1>Terms of use</h1>
        <p>Last updated: November 20, 2026</p>
      </div>
      <section className="content-card">
        <h2>Using BrainRush</h2>
        <p>
          BrainRush provides browser-based games for personal focus, speed testing, and entertainment. You agree to use the site lawfully.
        </p>
        <h2>Scores and records</h2>
        <p>
          Scores and personal bests are calculated and stored locally on your device. They are not independently verified or synchronized to a global leaderboard.
        </p>
        <h2>Disclaimer</h2>
        <p>
          The games are intended for general mental exercise and recreational fun. They do not constitute formal medical or cognitive assessments.
        </p>
      </section>
    </div>
  );
}
