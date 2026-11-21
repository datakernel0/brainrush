"use client";

import Link from "next/link";
import { useState } from "react";
import { Brain, Menu, X, ArrowUpRight } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "/"],
    ["Games", "/games/"],
    ["Daily Challenge", "/daily-challenge/"],
    ["About", "/about/"],
  ];

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Brain size={18} />
          </span>
          <span>
            BRAIN<span className="brand-accent">RUSH</span>
          </span>
        </Link>
        <nav className="desktop-nav">
          {links.map(([t, h]) => (
            <Link key={h} href={h}>
              {t}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/games/">
          Browse games <ArrowUpRight size={15} />
        </Link>
        <button
          className="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav">
          {links.map(([t, h]) => (
            <Link key={h} href={h} onClick={() => setOpen(false)}>
              {t}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Link href="/" className="brand">
            <span className="brand-mark">
              <Brain size={18} />
            </span>
            <span>
              BRAIN<span className="brand-accent">RUSH</span>
            </span>
          </Link>
          <p className="muted footer-tag">Minimalist browser games for focus and speed.</p>
        </div>
        <div className="footer-links">
          <Link href="/about/">About</Link>
          <Link href="/contact/">Contact</Link>
          <Link href="/privacy-policy/">Privacy</Link>
          <Link href="/terms/">Terms</Link>
          <Link href="/cookie-policy/">Cookies</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BrainRush. Free browser arcade.</span>
        <span>Clean, distraction-free games.</span>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
