"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostSubmit = async () => {
    if (!title || !content) {
      alert("標題和內容不能為空");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("請先登入");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("發文成功");
        router.push("/");
        router.refresh();
      } else {
        alert("發文失敗：" + data.message);
      }
      // eslint-disable-next-line
    } catch (error) {
      alert("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="hero-card" style={{ width: "min(100%, 720px)" }}>
        <div className="stack" style={{ marginBottom: "1.5rem" }}>
          <span className="eyebrow">Compose</span>
          <h1 className="hero-title" style={{ fontSize: "2.2rem" }}>發表文章</h1>
          <p className="hero-copy">輸入標題與內容後送出，原本的發文流程沒有變動。</p>
        </div>

        <div className="form-grid">
          <div>
            <label htmlFor="title" className="input-label">標題</label>
            <input
              type="text"
              id="title"
              placeholder="請輸入標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="content" className="input-label">內容</label>
            <textarea
              id="content"
              placeholder="請輸入文章內容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>

          <button
            onClick={handlePostSubmit}
            className="button-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "發佈中..." : "發佈"}
          </button>
        </div>
      </div>
    </div>
  );
}
