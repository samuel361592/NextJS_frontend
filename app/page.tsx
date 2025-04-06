// page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-3xl font-bold">零食商城</h1>
      </header>

      <main className="container mx-auto p-4">
        <h2 className="text-2xl mb-4">熱門零食</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* 假設這些是商品卡片 */}
          <div className="bg-white p-4 rounded shadow-md">
            <img src="https://via.placeholder.com/150" alt="Snack 1" className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg mt-2">美味零食 1</h3>
            <p className="text-sm text-gray-600">NT$ 100</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <img src="https://via.placeholder.com/150" alt="Snack 2" className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg mt-2">美味零食 2</h3>
            <p className="text-sm text-gray-600">NT$ 150</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <img src="https://via.placeholder.com/150" alt="Snack 3" className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg mt-2">美味零食 3</h3>
            <p className="text-sm text-gray-600">NT$ 120</p>
          </div>
        </div>
      </main>

      <footer className="bg-blue-600 text-white text-center p-4">
        <p>© 2025 零食商城 | All rights reserved</p>
      </footer>
    </div>
  );
}
