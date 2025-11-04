# 🚀 DevOpStream

A modern DevOps analytics dashboard that brings **repositories, pipelines, deployments, and logs** together in one elegant interface.

Built with **React + TypeScript + Tailwind + shadcn/ui**, powered by a **Node.js + Prisma + PostgreSQL backend**.

Live Demo → [https://devopstream.vercel.app](https://devopstream.vercel.app/dashboard)

---

## ✨ Features

✅ **Unified DevOps Dashboard** – Monitor builds, deployments, and logs in real-time  
✅ **Repository Integration** – Connect and manage GitHub repositories  
✅ **Pipeline Execution Tracking** – View build history, logs, and metrics  
✅ **Realtime Log Viewer** – Live streaming build logs via WebSockets  
✅ **Analytics & Insights** – Success rates, average build time, run history  
✅ **Responsive Design** – Optimized for all screen sizes  
✅ **Configurable Backend** – Switch between mock or live GitHub/Vercel integrations

---

## 🧱 Tech Stack

### Frontend

- ⚛️ **React + TypeScript**
- 🎨 **Tailwind CSS + shadcn/ui**
- 🔄 **Redux Toolkit**
- 📈 **Recharts** (for analytics visualization)
- 🧩 **Lucide React Icons**
- ⚡ **Vite** for blazing-fast builds

### Backend (Pluggable)

- 🚀 **Express + TypeScript**
- 🧰 **Prisma ORM + PostgreSQL**
- 🔗 **GitHub API** (for repo data)
- ☁️ **Vercel API** (for deployment stats)
- 🔊 **Socket.IO** (for live logs)
- 🧪 Mock fallback (for local testing)

---

## 🛠️ Getting Started (Local Development)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/devopstream.git
cd devopstream
```

### 2️⃣ Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

### 3️⃣ Environment setup

#### Frontend (`frontend/.env`)

```bash
VITE_API_URL=http://localhost:5000
```

#### Backend (`backend/.env`)

```bash
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devopstream"
FRONTEND_URL=http://localhost:5173

# Optional: external integrations
GITHUB_TOKEN=
VERCEL_TOKEN=
JWT_SECRET="supersecretkey"
```

### 4️⃣ Database setup

```bash
cd backend
npx prisma migrate dev --name init
```

### 5️⃣ Run locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

Visit → **http://localhost:5173**

---

## 🐳 Docker Support

The project includes a ready-to-use `docker-compose.yml`:

```bash
docker-compose up --build
```

This starts:

- 🧩 Backend (port 5000)
- ⚛️ Frontend (port 5173)
- 🗄️ PostgreSQL (port 5432)

---

## 🌐 Deployment

### Frontend

- Host via **Vercel** (already live at [devopstream.vercel.app](https://devopstream.vercel.app/dashboard))
- Set `VITE_API_URL` to your backend API URL

### Backend

- Deploy using **Render**, **Railway**, or **Fly.io**
- Add `.env` variables in your host settings
- Connect to a managed PostgreSQL instance (Render, Supabase, or Neon)

---

## 🧩 Project Structure

```
devopstream/
 ├── backend/
 │   ├── src/
 │   │   ├── routes/
 │   │   ├── services/
 │   │   ├── prisma/
 │   │   └── utils/
 │   ├── prisma/schema.prisma
 │   └── package.json
 ├── frontend/
 │   ├── src/
 │   │   ├── components/
 │   │   ├── views/
 │   │   ├── state/
 │   │   └── lib/
 │   ├── .env.example
 │   └── package.json
 ├── docker-compose.yml
 ├── .env.example
 └── README.md
```

---

## 👨‍💻 Author

**Mihir Kasare**  
Building intelligent developer tools and modern full-stack experiences.  
💼 GitHub: [@mihir2004](https://github.com/mihir2004)

---

## 🧠 License

This project is licensed under the **MIT License** – feel free to fork and build on it.

---

> 💡 _DevOpStream: Where DevOps meets design — pipeline visibility, beautifully reimagined._
