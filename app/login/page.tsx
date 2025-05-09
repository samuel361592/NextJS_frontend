"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const profileRes = await fetch("http://localhost:3001/auth/profile", {
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
    <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
      {/* NavBar */}
      <nav
        style={{
          backgroundColor: "#4C8BF5",
          padding: "10px",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
        >
          首頁
        </Link>
      </nav>

      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          登入
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">
            密碼
          </label>
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold transition"
        >
          登入
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          還沒有帳號？{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            去註冊
          </Link>
        </p>
      </div>
    </div>
  );
}
