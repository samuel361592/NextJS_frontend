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

  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [postList, setPostList] = useState<Post[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    if (!parsed.roles || !parsed.roles.includes("admin")) {
      alert("非管理員無法進入");
      router.push("/");
      return;
    }

    setUser(parsed);
    fetchPosts();
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
    if (Array.isArray(data.users)) {
      setUserList(data.users);
    } else if (Array.isArray(data)) {
      setUserList(data);
    } else {
      alert("取得的 user 資料不是陣列！");
      setUserList([]);
    }
    setShowUsers(true);
  };

  const changeRole = async (userId: number, role: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${postId}`, {
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
    <main className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Header + 返回主頁 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">管理員後台</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow"
        >
          返回主頁
        </button>
      </div>

      {user && (
        <p className="text-gray-700 mb-8">
          您好，<span className="font-semibold">{user.name}</span>（{user.email}
          ）
        </p>
      )}

      {/* 用戶管理區塊 */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">用戶管理</h2>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
        >
          {showUsers ? "收起用戶列表" : "查詢所有用戶"}
        </button>

        {showUsers && (
          <div className="mt-6 border-t pt-4 space-y-4">
            <h3 className="text-lg font-bold">用戶列表</h3>
            <ul className="space-y-3">
              {userList.map((u) => (
                <li
                  key={u.id}
                  className="p-4 border bg-gray-100 rounded flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-medium">{u.name}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    <p className="text-sm">
                      年齡：{u.age} ｜ 角色：{u.roles.join(", ")}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0 flex gap-2">
                    {u.id === user?.id ? (
                      <span className="text-gray-400 text-sm">
                        （無法更改自己）
                      </span>
                    ) : u.roles.includes("admin") ? (
                      <button
                        onClick={() =>
                          confirm(`確定降級 ${u.name}？`) &&
                          changeRole(u.id, "user")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        降級為一般使用者
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          confirm(`確定升級 ${u.name}？`) &&
                          changeRole(u.id, "admin")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        升級為管理員
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 貼文管理區塊 */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">貼文管理</h2>
        <button
          onClick={() => setShowPosts((prev) => !prev)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
        >
          {showPosts ? "收起貼文列表" : "顯示所有貼文"}
        </button>

        {showPosts && (
          <div className="mt-6 border-t pt-4 space-y-4">
            <h3 className="text-lg font-bold mb-2">全部貼文列表</h3>
            {postList.map((post) => (
              <div
                key={post.id}
                className="p-4 border bg-gray-100 rounded shadow-sm"
              >
                <h4 className="text-lg font-semibold">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  作者：{post.user?.name}（{post.user?.email}）
                </p>
                <button
                  onClick={() => deletePost(post.id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  刪除貼文
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
