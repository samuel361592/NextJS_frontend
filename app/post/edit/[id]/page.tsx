"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      });
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      alert("更新成功");
      router.push("/?refresh=true");
    } else {
      alert("更新失敗");
    }
  };

  const handleBack = () => {
    router.push("/");
  }

  return (
    <div className="page-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="hero-card" style={{ width: "min(100%, 720px)" }}>
        <div className="stack" style={{ marginBottom: "1.5rem" }}>
          <span className="eyebrow">Edit post</span>
          <h1 className="hero-title" style={{ fontSize: "2.2rem" }}>編輯貼文</h1>
          <p className="hero-copy">修改標題與內容後更新，原本的資料流程維持不變。</p>
        </div>

        <div className="form-grid">
          <div>
            <label className="input-label">標題</label>
            <input
              placeholder="標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">內容</label>
            <textarea
              placeholder="內容"
              value={content}
              rows={8}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="inline-actions">
            <button onClick={handleBack} className="button-ghost">
              返回
            </button>
            <button onClick={handleSubmit} className="button-primary">
              更新貼文
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}