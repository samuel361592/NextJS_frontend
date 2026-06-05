"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    roles: string[];
  };

  type Post = {
    id: number;
    title: string;
    content: string;
    user?: {
      name: string;
      email: string;
    };
  };

  type ApiRole = string | { name?: string };

  type ApiUser = Omit<User, "roles"> & {
    roles?: ApiRole[];
  };

  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [postList, setPostList] = useState<Post[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyAdmin = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("請重新登入");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      const data = await res.json();
      const currentUser = data.user;

      if (!currentUser?.roles?.includes("admin")) {
        alert("非管理員無法進入");
        router.push("/");
        return;
      }

      localStorage.setItem("user", JSON.stringify(currentUser));
      setUser(currentUser);
      fetchPosts();
    };

    verifyAdmin();
  }, [router]);

  const fetchUsers = async () => {
    if (showUsers) {
      setShowUsers(false);
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "取得用戶資料失敗！");
      setUserList([]);
      return;
    }

    const users = Array.isArray(data.users)
      ? data.users
      : Array.isArray(data)
        ? data
        : null;

    if (users) {
      setUserList(
        users.map((u: ApiUser) => ({
          ...u,
          roles: (u.roles ?? []).map((role) =>
            typeof role === "string" ? role : role.name ?? "",
          ),
        })),
      );
    } else {
      alert("取得的 user 資料不是陣列！");
      setUserList([]);
      return;
    }
    setShowUsers(true);
  };

  const changeRole = async (userId: number, role: string) => {
    const token = localStorage.getItem("token");
    const roleIds = role === "admin" ? [1] : [2];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/roles`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleIds }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`成功變更角色為 ${role}`);
      fetchUsers();
    } else {
      alert(data.message || "變更失敗");
    }
  };

  const fetchPosts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setPostList(data);
    } else {
      alert("取得貼文失敗！");
    }
  };

  const deletePost = async (postId: number) => {
    const confirmed = confirm("確定要刪除這篇貼文嗎？");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("刪除成功！");
      fetchPosts();
    } else {
      alert("刪除失敗！");
    }
  };

  return (
    <main className="page-shell stack">
      <section className="hero-card">
        <div className="hero-layout">
          <div className="stack">
            <span className="eyebrow">Admin Console</span>
            <h1 className="hero-title">管理員後台</h1>
            {user && (
              <p className="hero-copy">
                您好，{user.name}（{user.email}）。這裡保留原本的管理流程，只把操作區整理得更清楚。
              </p>
            )}
            <div className="hero-actions">
              <button onClick={() => router.push("/")} className="button-ghost">
                返回主頁
              </button>
            </div>
          </div>

          <div className="stack">
            <div className="stat-grid">
              <div className="stat-card">
                <span>用戶數</span>
                <strong>{userList.length}</strong>
              </div>
              <div className="stat-card">
                <span>貼文數</span>
                <strong>{postList.length}</strong>
              </div>
            </div>
            <div className="info-card section-card">
              <div className="badge">權限中心</div>
              <p className="form-note" style={{ marginTop: "0.75rem" }}>
                查詢、升降權與刪文操作維持原有行為。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div className="stack" style={{ gap: "0.35rem" }}>
            <span className="eyebrow">User Management</span>
            <h2 className="section-title">用戶管理</h2>
          </div>
          <button onClick={fetchUsers} className="button-primary">
            {showUsers ? "收起用戶列表" : "查詢所有用戶"}
          </button>
        </div>

        {showUsers ? (
          <div className="stack">
            {userList.map((u) => (
              <article key={u.id} className="post-card">
                <div className="section-header" style={{ marginBottom: "0.7rem" }}>
                  <div>
                    <h3 className="post-title" style={{ marginBottom: "0.25rem" }}>{u.name}</h3>
                    <p className="meta" style={{ margin: 0 }}>{u.email}</p>
                  </div>
                  <div className="badge">年齡 {u.age}</div>
                </div>

                <div className="stack" style={{ gap: "0.75rem" }}>
                  <p className="form-note" style={{ margin: 0 }}>
                    角色：{u.roles.join(", ")}
                  </p>
                  <div className="inline-actions">
                    {u.id === user?.id ? (
                      <span className="badge">無法更改自己</span>
                    ) : u.roles.includes("admin") ? (
                      <button
                        onClick={() =>
                          confirm(`確定降級 ${u.name}？`) &&
                          changeRole(u.id, "user")
                        }
                        className="button-danger"
                      >
                        降級為一般使用者
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          confirm(`確定升級 ${u.name}？`) &&
                          changeRole(u.id, "admin")
                        }
                        className="button-secondary"
                      >
                        升級為管理員
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">尚未載入用戶列表</div>
        )}
      </section>

      <section className="section-card">
        <div className="section-header">
          <div className="stack" style={{ gap: "0.35rem" }}>
            <span className="eyebrow">Post Management</span>
            <h2 className="section-title">貼文管理</h2>
          </div>
          <button onClick={() => setShowPosts((prev) => !prev)} className="button-primary">
            {showPosts ? "收起貼文列表" : "顯示所有貼文"}
          </button>
        </div>

        {showPosts ? (
          <div className="stack">
            {postList.map((post) => (
              <article key={post.id} className="post-card">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
                <p className="meta" style={{ marginTop: 0 }}>
                  作者：{post.user?.name}（{post.user?.email}）
                </p>
                <button onClick={() => deletePost(post.id)} className="button-danger">
                  刪除貼文
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">尚未載入貼文列表</div>
        )}
      </section>
    </main>
  );
}
