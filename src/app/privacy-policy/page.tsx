export const metadata = {
  title: "Privacy Policy",
  description: "BrainRush privacy policy describing local game records, advertising and analytics.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function Privacy() {
  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">LEGAL</span>
        <h1>Privacy policy</h1>
        <p>Last updated: November 20, 2026</p>
      </div>
      <section className="content-card">
        <h2>Overview</h2>
        <p>
          BrainRush is designed to work without user accounts or custom backend tracking. This policy explains how local data is handled when you use the website.
        </p>
        <h2>Local storage</h2>
        <p>
          Game personal bests, recently played games, and daily completion flags are stored exclusively in your browser&apos;s local storage. This information remains on your device and is not synchronized to an external account. You can clear it anytime through your browser settings.
        </p>
        <h2>Advertising & analytics</h2>
        <p>
          No external ad scripts or tracking cookies are enabled by default. If enabled in future deployments, details will be documented here according to applicable privacy regulations.
        </p>
        <h2>Your choices</h2>
        <p>
          You can disable cookies or clear local storage through your browser settings at any time.
        </p>
      </section>
    </div>
  );
}
