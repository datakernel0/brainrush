export const metadata = {
  title: "Cookie Policy",
  description: "Learn how BrainRush uses browser storage, cookies and optional advertising technologies.",
  alternates: { canonical: "/cookie-policy/" },
};

export default function Cookies() {
  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">LEGAL</span>
        <h1>Cookie policy</h1>
        <p>Last updated: November 20, 2026</p>
      </div>
      <section className="content-card">
        <h2>Browser storage</h2>
        <p>
          BrainRush uses local storage to remember game records, recently played games, and daily challenge completion on your current device. No login cookies are used.
        </p>
        <h2>Managing preferences</h2>
        <p>
          You can block or clear local storage using your browser settings at any time.
        </p>
      </section>
    </div>
  );
}
