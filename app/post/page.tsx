'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePostSubmit = async () => {
    if (!title || !content) {
      alert('標題和內容不能為空');
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('請先登入');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert('發文成功');
        router.push('/');
        router.refresh();
      } else {
        alert('發文失敗：' + data.message);
      }
      // eslint-disable-next-line
    } catch (error) {
      alert('發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">發表文章</h1>
      <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-600">標題</label>
          <input
            type="text"
            id="title"
            placeholder="請輸入標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-600">內容</label>
          <textarea
            id="content"
            placeholder="請輸入文章內容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          onClick={handlePostSubmit}
          className={`w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded font-semibold transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? '發佈中...' : '發佈'}
        </button>
      </div>
    </div>
  );
}
