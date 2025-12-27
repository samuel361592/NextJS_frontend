import { Suspense } from "react";
import HomeClient from "./home-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">載入中...</div>}>
      <HomeClient />
    </Suspense>
  );
}
