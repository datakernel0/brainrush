import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <section className="page-hero">
        <span className="eyebrow">404 · NOT FOUND</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or may have been moved.</p>
        <Link className="primary-btn" href="/games/" style={{ marginTop: 22 }}>
          Explore the games
        </Link>
      </section>
    </div>
  );
}
