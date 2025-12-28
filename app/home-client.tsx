"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Post } from "@/types/post";
import { User } from "@/types/user";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("${process.env.NEXT_PUBLIC_API_URL}/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }

    fetchPosts();
  }, [shouldRefresh]);

  const fetchPosts = () => {
    fetch("${process.env.NEXT_PUBLIC_API_URL}/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      })
      .catch(() => setPosts([]));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("已登出");
    window.location.href = "/";
  };

  const handleLoginRedirect = () => router.push("/login");
  const handleRegisterRedirect = () => router.push("/register");
  const handlePostRedirect = () => {
    if (user) router.push("/post");
    else router.push("/login");
  };

  const handleDelete = async (postId: number) => {
    const confirmed = window.confirm("確定要刪除這篇貼文嗎？");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("刪除成功");
        fetchPosts();
      } else {
        alert("刪除失敗");
      }
    } catch (err) {
      console.error("刪除時出錯:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <nav className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-4 shadow-lg rounded-b-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">社群平台</h2>
          <div className="flex space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => router.push("/profile")}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                  個人檔案
                </button>
                {user.roles?.includes("admin") && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    管理後台
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginRedirect}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                >
                  登入
                </button>
                <button
                  onClick={handleRegisterRedirect}
                  className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  註冊
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 主頁內容 */}
      <div className="container mx-auto p-6">
        {loading ? (
          <p>載入中...</p>
        ) : (
          <>
            {user && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold">歡迎回來, {user.name}</h1>
              </div>
            )}

            <div className="flex justify-end mb-4">
              <button
                onClick={handlePostRedirect}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                發文
              </button>
            </div>

            <div className="posts">
              <h2 className="text-xl font-semibold mb-4">動態牆</h2>
              {posts.length === 0 ? (
                <p>目前沒有任何動態</p>
              ) : (
                posts.map((post, index) => (
                  <div
                    className="post p-4 mb-4 bg-white rounded shadow"
                    key={index}
                  >
                    <h3 className="text-lg font-medium">
                      {post.title || "（無標題）"}
                    </h3>
                    <p className="mb-2">{post.content || "（無內容）"}</p>
                    <small className="text-gray-500">
                      發表者：{post.user?.name || "匿名"}（
                      {post.user?.email || "無信箱"}）
                    </small>

                    {/* 編輯 & 刪除按鈕 */}
                    {user?.email === post.user?.email && (
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => router.push(`/post/edit/${post.id}`)}
                          className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          刪除
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
