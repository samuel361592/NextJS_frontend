'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const router = useRouter();

    // 登入
    const handleLogin = async () => {
        const res = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    
        const data = await res.json();
    
        if (res.ok) {
            setToken(data.token);
            localStorage.setItem('token', data.token);
    
            // 登入成功直接去拿 user profile
            const profileRes = await fetch('http://localhost:3001/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                },
            });
    
            const profile = await profileRes.json();
    
            if (res.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
            
                // 這裡直接跳轉就好
                router.push('/profile');
            }
    
        } else {
            alert(data.message || '登入失敗');
        }
    };


    return (
        <div>
            <h1>登入</h1>
            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>登入</button>
            <br />
            <p>還沒有帳號？<Link href="/register">去註冊</Link></p>
        </div>
    );
}
