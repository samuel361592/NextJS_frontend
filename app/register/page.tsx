"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const isValidEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleRegister = async () => {
    if (!email || !password || !name || !age) {
      alert("請填寫完整資訊");
      return;
    }

    if (password.length < 8 || password.length > 60) {
      console.log("密碼長度不符");
      setError("密碼長度需介於 8～60 字元");
      return;
    }

    if (!isValidEmail(email)) {
      alert("請輸入正確的 Email 格式");
      return;
    }

    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, age: Number(age) }),
    });

    const data = await res.json();
    console.log("register result", data);
    if (res.ok) {
      alert("註冊成功，請重新登入");
      router.push("/login");
    } else {
      alert(data.message || "註冊失敗");
    }
  };

  const evaluatePasswordStrength = (pwd: string): string => {
    if (pwd.length < 8) return "太短";
    if (pwd.length > 60) return "太長";
    if (/^[a-zA-Z]+$/.test(pwd)) return "弱";
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pwd)) return "中";
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd)
    )
      return "強";
    return "弱";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 justify-center items-center">
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
          註冊帳號
        </h1>

        <div className="mb-4">
          <label className="block text-sm text-gray-700">姓名</label>
          <input
            type="text"
            placeholder="請輸入姓名"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700">Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {email.length > 0 && !isValidEmail(email) && (
            <p className="text-red-600 text-sm mt-1">請輸入正確的 Email 格式</p>
          )}

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700">年齡</label>
          <input
            type="number"
            placeholder="請輸入年齡"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value) || "")}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-700">密碼</label>
          <input
            type="password"
            placeholder="密碼"
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => {
              const newPwd = e.target.value;
              setPassword(newPwd);

              // 密碼長度錯誤提示
              if (newPwd.length < 8) {
                setPasswordError("密碼太短，至少需要 8 個字元");
              } else if (newPwd.length > 60) {
                setPasswordError("密碼太長，不能超過 60 個字元");
              } else {
                setPasswordError("");
              }

              // 即時計算強度
              setPasswordStrength(evaluatePasswordStrength(newPwd));
            }}
          />

          {passwordError && (
            <p className="text-red-600 text-sm mt-1">{passwordError}</p>
          )}

          {/* 密碼強度條顯示 */}
          {password && (
            <div className="mt-2">
              <p className="text-xs text-gray-600">
                密碼強度：{passwordStrength}
              </p>
              <div className="w-full h-2 bg-gray-200 rounded mt-1">
                <div
                  className={`
                                        h-full rounded transition-all duration-300
                                        ${
                                          passwordStrength === "強"
                                            ? "w-full bg-green-500"
                                            : passwordStrength === "中"
                                              ? "w-2/3 bg-orange-400"
                                              : "w-1/3 bg-red-500"
                                        }
                                            `}
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleRegister}
          disabled={
            !isValidEmail(email) || password.length < 8 || password.length > 60
          }
          className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded font-semibold transition"
        >
          註冊
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          已有帳號？{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            去登入
          </Link>
        </p>
      </div>
    </div>
  );
}
