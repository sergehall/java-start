import Link from "next/link";
import { Code2, Coffee, LockKeyhole, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Next.js + Java Spring Boot</p>
          <h1>Java Start</h1>
          <p className="lead">
            A learning dashboard where frontend and backend work as a pair: Next.js keeps the web interface fast,
            while Java owns security, data, and a clear API.
          </p>
          <div className="actions">
            <Link className="button button-primary" href="/register">
              Get started
            </Link>
            <Link className="button button-ghost" href="/login">
              Sign in
            </Link>
          </div>
        </div>

        <div className="stack-board" aria-label="Application stack preview">
          <div className="stack-card stack-card-next">
            <Code2 size={24} />
            <span>Next.js</span>
            <strong>UI, routes, BFF</strong>
          </div>
          <div className="stack-rail" />
          <div className="stack-card stack-card-java">
            <Coffee size={24} />
            <span>Spring Boot</span>
            <strong>Auth, API, domain</strong>
          </div>
          <div className="signal-card">
            <LockKeyhole size={18} />
            <span>httpOnly session cookie</span>
          </div>
          <div className="signal-card">
            <Sparkles size={18} />
            <span>Learning state cabinet</span>
          </div>
        </div>
      </section>
    </main>
  );
}
