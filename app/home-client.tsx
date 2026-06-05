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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
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
    <div className="min-h-screen">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">S</div>
            <div className="brand-copy">
              <span>社群平台</span>
              <small>貼文、帳號與權限管理</small>
            </div>
          </div>

          <div className="toolbar">
            {user ? (
              <>
                <button onClick={() => router.push("/profile")} className="button-ghost">
                  個人檔案
                </button>
                {user.roles?.includes("admin") && (
                  <button onClick={() => router.push("/admin")} className="button-secondary">
                    管理後台
                  </button>
                )}
                <button onClick={handleLogout} className="button-danger">
                  登出
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginRedirect} className="button-primary">
                  登入
                </button>
                <button onClick={handleRegisterRedirect} className="button-ghost">
                  註冊
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="product-shell">
        <section className="product-hero">
          <div className="product-hero-main">
            <div className="workspace-meta">
              <span className="eyebrow">Workspace</span>
              <span className="status-pill">
                <span className="status-dot" />
                {loading ? "同步中" : "服務正常"}
              </span>
            </div>

            <div className="product-heading">
              <h1 className="product-title">
                {user ? "動態總覽" : "公開動態"}
              </h1>
              {user ? (
                <p className="product-copy">
                  歡迎回來，{user.name}。你可以在這裡發布內容、管理自己的貼文，並查看帳號狀態。
                </p>
              ) : (
                <p className="product-copy">瀏覽公開貼文。登入後即可發布內容、編輯自己的貼文，並使用個人資料功能。</p>
              )}
            </div>

            <div
              className="quick-composer"
              onClick={handlePostRedirect}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") handlePostRedirect();
              }}
              role="button"
              tabIndex={0}
            >
              <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "S"}</div>
              <div>
                <strong>{user ? "新增一則貼文" : "登入後發布貼文"}</strong>
                <p>{user ? "分享近況、公告或想法" : "登入帳號後即可開始建立內容"}</p>
              </div>
            </div>

            <div className="hero-actions">
              <button onClick={handlePostRedirect} className="button-primary">
                新增貼文
              </button>
              <button onClick={() => router.push("/profile")} className="button-secondary">
                個人資料
              </button>
            </div>
          </div>

          <aside className="product-side">
            <div className="status-card">
              <span>Session</span>
              <strong>{loading ? "同步中" : user ? "已登入" : "訪客"}</strong>
              <p>{user ? "個人化操作已啟用" : "目前只能瀏覽公開內容"}</p>
            </div>
            <div className="status-card">
              <span>Posts</span>
              <strong>{posts.length}</strong>
              <p>目前動態牆內容數</p>
            </div>
            <div className="status-card status-card-wide">
              <span>Access</span>
              <strong>{user?.roles?.includes("admin") ? "管理員" : user ? "一般成員" : "未登入"}</strong>
              <p>
                {user?.roles?.includes("admin")
                  ? "可從導覽列進入管理後台"
                  : user
                    ? "可發布貼文並維護自己的內容"
                    : "登入後可解鎖發文與個人資料"}
              </p>
            </div>
          </aside>
        </section>

        <section className="feed-panel">
          <div className="feed-header">
            <div>
              <span className="eyebrow">Live feed</span>
              <h2 className="section-title">動態牆</h2>
            </div>
            <button onClick={handlePostRedirect} className="button-primary feed-action">
              新增
            </button>
          </div>

          {loading ? (
            <div className="empty-state">載入中...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">目前沒有任何動態</div>
          ) : (
            <div className="list-grid">
              {posts.map((post, index) => (
                <article className="post-card" key={index}>
                  <div className="post-card-header">
                    <div className="avatar avatar-small">{post.user?.name?.charAt(0).toUpperCase() || "?"}</div>
                    <div className="post-card-copy">
                      <h3 className="post-title">{post.title || "（無標題）"}</h3>
                      <p className="meta" style={{ margin: 0 }}>
                        發表者：{post.user?.name || "匿名"}（{post.user?.email || "無信箱"}）
                      </p>
                    </div>
                    {user?.email === post.user?.email && <span className="badge">可編輯</span>}
                  </div>

                  <p className="post-content">{post.content || "（無內容）"}</p>

                  {user?.email === post.user?.email && (
                    <div className="inline-actions">
                      <button
                        onClick={() => router.push(`/post/edit/${post.id}`)}
                        className="button-secondary"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="button-danger"
                      >
                        刪除
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
