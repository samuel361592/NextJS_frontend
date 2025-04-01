'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; name: string; age: number } | null>(null);
    const [loading, setLoading] = useState(true);

    // 自動取得個人資料
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('請先登入');
            router.push('/login');
            return;
        }

        // 呼叫 profile API
        fetch('http://localhost:3001/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
            } else {
                alert('驗證失敗，請重新登入');
                router.push('/login');
            }
        })
        .finally(() => setLoading(false));
    }, []);

    // 登出
    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('已登出');
        router.push('/login');
    };

    return (
        <div>
            <h1>個人資料</h1>
    
            {loading ? (
                <p>載入中...</p>
            ) : user ? (
                <>
                    <p>姓名: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>年齡: {user.age}</p>
                    <button onClick={handleLogout}>登出</button>
                </>
            ) : (
                <p>無法取得資料</p>
            )}
        </div>
    );
}
