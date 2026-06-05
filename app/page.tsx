import { Suspense } from "react";
import HomeClient from "./home-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <div className="hero-card">
            <div className="accent-line mb-4" />
            <p className="muted">載入中...</p>
          </div>
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
