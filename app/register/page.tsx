'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');

    const handleRegister = async () => {
        if (!email || !password || !name || !age) {
            alert('請填寫完整資訊');
            return;
        }

        const res = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, age: Number(age) }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('註冊成功，請重新登入');
            router.push('/login');
        } else {
            alert(data.message || '註冊失敗');
        }
    };

    return (
        <div>
            <h1>註冊</h1>

            <input
                type="text"
                placeholder="姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
            /><br/>

            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br/>

            <input
                type="number"
                placeholder="年齡"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || '')}
            /><br/>

            <input
                type="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br/>

            <button onClick={handleRegister}>註冊</button>
            <br/>
            <p>已有帳號？<Link href="/login">去登入</Link></p>
        </div>
    );
}
