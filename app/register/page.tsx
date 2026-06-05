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

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, age: Number(age) }),
      });

      const data = await res.json();
      console.error("register result", data);
      if (res.ok) {
        alert("註冊成功，請重新登入");
        router.push("/login");
      } else {
        // 暫時在頁面上顯示後端回傳完整錯誤，方便除錯
        setError(typeof data === "object" ? JSON.stringify(data, null, 2) : String(data));
        // 也在 alert 中顯示簡短提示
        alert(data.message || "註冊失敗（檢查 console 與畫面上的錯誤資訊）");
      }
    } catch (err) {
      console.error("register fetch error", err);
      setError(String(err));
      alert("網路或其他錯誤，請檢查 console 與後端服務是否運作");
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
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-topline">
          <Link href="/" className="auth-back">
            回到主頁
          </Link>
          <span className="auth-kicker">Create account</span>
        </div>

        <div className="auth-heading">
          <h1 className="auth-title">註冊帳號</h1>
          <p className="auth-copy">建立資料後即可登入，功能流程維持原樣，只有視覺重新整理。</p>
        </div>

        <div className="form-grid">
          <div>
            <label className="input-label">姓名</label>
            <input
              type="text"
              placeholder="請輸入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email.length > 0 && !isValidEmail(email) && (
              <p className="helper" style={{ color: "var(--danger)", marginTop: "0.5rem" }}>
                請輸入正確的 Email 格式
              </p>
            )}
            {error && <p className="helper" style={{ color: "var(--danger)", marginTop: "0.5rem" }}>{error}</p>}
          </div>

          <div>
            <label className="input-label">年齡</label>
            <input
              type="number"
              placeholder="請輸入年齡"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || "")}
            />
          </div>

          <div>
            <label className="input-label">密碼</label>
            <input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => {
                const newPwd = e.target.value;
                setPassword(newPwd);

                if (newPwd.length < 8) {
                  setPasswordError("密碼太短，至少需要 8 個字元");
                } else if (newPwd.length > 60) {
                  setPasswordError("密碼太長，不能超過 60 個字元");
                } else {
                  setPasswordError("");
                }

                setPasswordStrength(evaluatePasswordStrength(newPwd));
              }}
            />

            {passwordError && (
              <p className="helper" style={{ color: "var(--danger)", marginTop: "0.5rem" }}>
                {passwordError}
              </p>
            )}

            {password && (
              <div className="stack" style={{ gap: "0.5rem", marginTop: "0.75rem" }}>
                <p className="form-note">密碼強度：{passwordStrength}</p>
                <div style={{ width: "100%", height: "0.65rem", background: "rgba(148, 163, 184, 0.18)", borderRadius: "999px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "999px",
                      transition: "width 300ms ease",
                      width:
                        passwordStrength === "強"
                          ? "100%"
                          : passwordStrength === "中"
                            ? "66%"
                            : "33%",
                      background:
                        passwordStrength === "強"
                          ? "linear-gradient(90deg, #16a34a, #22c55e)"
                          : passwordStrength === "中"
                            ? "linear-gradient(90deg, #f59e0b, #fb923c)"
                            : "linear-gradient(90deg, #ef4444, #f97316)",
                    }}
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
            className="button-primary auth-submit"
          >
            註冊
          </button>

        </div>

        <p className="auth-alt">
          已有帳號？ <Link href="/login" className="auth-alt-link">去登入</Link>
        </p>
      </div>
    </div>
  );
}
