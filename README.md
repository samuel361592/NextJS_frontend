# Frontend - Next.js + TailwindCSS

本資料夾為 Fullstack 專案的前端部分，採用 Next.js App Router 架構，整合 TailwindCSS 做 UI 樣式設計，目前支援基本的使用者註冊與登入功能，並與 NestJS 後端 API 串接。

---

## 環境變數設定

請在 `frontend/` 根目錄中建立 `.env.local` 檔案，填入：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```
此設定讓前端可以透過 process.env.NEXT_PUBLIC_API_BASE_URL 呼叫 NestJS 後端 API。

安裝與啟動
```bash
npm install         # 安裝套件
npm run dev         # 啟動本地開發伺服器（http://localhost:3000）
```

已完成功能
使用者註冊

使用者登入

串接後端 API 驗證 JWT Token

待開發功能（Feature 1.1）
使用者角色管理

帖文 CRUD 功能

使用者列表與角色切換介面

前端權限控管

作者
由 Samuel 製作，用於練習 Fullstack 技術整合（NestJS + Next.js + TypeORM + MySQL）。
