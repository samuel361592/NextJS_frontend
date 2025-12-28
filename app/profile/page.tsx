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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          個人資料
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">載入中...</p>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-semibold w-20">姓名：</span>
              <span>{user.name}</span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-20">Email：</span>
              <span>{user.email}</span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-20">年齡：</span>
              <span>{user.age}</span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-20">身份：</span>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  isAdmin
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isAdmin ? "管理員 (Admin)" : "一般使用者"}
              </span>
            </div>

            <button
              onClick={handleBack}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              返回
            </button>
          </div>
        ) : (
          <p className="text-center text-red-500">無法取得資料</p>
        )}
      </div>
    </div>
  );
}
