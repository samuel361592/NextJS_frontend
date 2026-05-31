"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);

      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (profileRes.ok) {
        const profile = await profileRes.json();
        localStorage.setItem("user", JSON.stringify(profile.user));
        router.push("/");
      } else {
        alert("登入成功但取得使用者資料失敗");
      }
    } else {
      alert(data.message || "登入失敗");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card-compact">
        <div className="auth-topline">
          <Link href="/" className="auth-back">
            回到主頁
          </Link>
          <span className="auth-kicker">Welcome back</span>
        </div>

        <div className="auth-heading">
          <h1 className="auth-title">登入</h1>
          <p className="auth-copy">登入後即可查看動態牆、發文與管理自己的內容。</p>
        </div>

        <div className="form-grid">
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">密碼</label>
            <input
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button onClick={handleLogin} className="button-primary auth-submit">
            登入
          </button>

        </div>

        <p className="auth-alt">
          還沒有帳號？ <Link href="/register" className="auth-alt-link">去註冊</Link>
        </p>
      </div>
    </div>
  );
}
