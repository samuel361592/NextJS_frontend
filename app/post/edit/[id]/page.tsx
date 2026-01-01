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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">編輯貼文</h1>
      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="標題"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-4 p-2 border rounded"
        placeholder="內容"
        value={content}
        rows={6}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="border px-4 py-2 rounded hover:bg-gray-50"
        >
          返回
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          更新貼文
        </button>
      </div>
    </div>
  );
}