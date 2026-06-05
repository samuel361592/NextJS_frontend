"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    name: string;
    age: number;
    roles?: string[]; // 增加 roles 欄位
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const isAdmin = user?.roles?.includes("admin");

  return (
    <main className="profile-shell">
      <section className="profile-card">
        <div className="profile-cover">
          <button onClick={handleBack} className="button-ghost profile-back">
            返回
          </button>
          <div className="profile-cover-copy">
            <span className="eyebrow">Account</span>
            <h1>帳號資料</h1>
          </div>
        </div>

        {loading ? (
          <div className="profile-body">
            <div className="empty-state">載入中...</div>
          </div>
        ) : user ? (
          <>
            <div className="profile-summary">
              <div className="avatar profile-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
              <div>
                <h1 className="profile-title">{user.name}</h1>
                <p className="profile-subtitle">{user.email}</p>
              </div>
              <span
                className="badge profile-role"
                style={{ background: isAdmin ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)", color: isAdmin ? "var(--danger)" : "var(--primary-strong)" }}
              >
                {isAdmin ? "管理員 (Admin)" : "一般使用者"}
              </span>
            </div>

            <div className="profile-body">
              <div className="profile-grid">
                <div className="profile-field">
                  <span>姓名</span>
                  <strong>{user.name}</strong>
                </div>
                <div className="profile-field">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>
                <div className="profile-field">
                  <span>年齡</span>
                  <strong>{user.age}</strong>
                </div>
                <div className="profile-field">
                  <span>帳號身份</span>
                  <strong>{isAdmin ? "Admin" : "Member"}</strong>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="profile-body">
            <div className="empty-state" style={{ color: "var(--danger)" }}>無法取得資料</div>
          </div>
        )}
      </section>
    </main>
  );
}
