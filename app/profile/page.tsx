'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string; age: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 自動取得個人資料
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    fetch('http://localhost:3001/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.replace('/login');
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.replace('/login');
    router.refresh()
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">個人資料</h1>

        {loading ? (
          <p className="text-center text-gray-500">載入中...</p>
        ) : user ? (
          <>
            <div className="space-y-4">
              <p className="text-lg text-gray-800">
                <span className="font-semibold">姓名: </span>{user.name}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">Email: </span>{user.email}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold">年齡: </span>{user.age}
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
              >
                登出
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">無法取得資料</p>
        )}
      </div>
    </div>
  );
}
