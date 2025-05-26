# 🚀 ContestX

**ContestX** is a modern online coding platform where users can register and submit coding questions seamlessly. Designed with a scalable microservices architecture, real-time capabilities, and a clean user interface, ContestX aims to simplify the process of managing and participating in coding contests.

---

## 📦 Repository: [`HariomJoshi/ContestX`](https://github.com/HariomJoshi/ContestX)

---

## 🛠️ Tech Stack

### 🌟 Frontend
- **React.js** – Component-based UI
- **Redux** – State management
- **Tailwind CSS** – Utility-first styling framework

### 🔧 Backend
- **Node.js** with **Express**
- **Microservices Architecture** with a central **Gateway**
- **Prisma ORM** with **PostgreSQL** as the database
- **Redis** – For caching, Queue services and session management
- **WebSockets** – For real-time interaction and updates
- **Facade Pattern** – Used at the gateway for centralized client request handling

---

## 📁 Project Structure

```
ContestX/
├── Frontend/                  # React + Redux + Tailwind frontend
│
└── Backend/
    ├── Gateway/              # Facade pattern API gateway
    │
    └── Services/             # Microservices
        ├── auth-service/     # User registration and login
        ├── user-service/     # Profile and user-related data
        ├── submission-service/ # Code/question submission logic
        └── socket-service/   # WebSocket server for real-time communication
```

---

## 🧪 Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- Redis
- Docker

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HariomJoshi/ContestX.git
cd ContestX
```

2. **Install dependencies**

```bash
# Frontend
cd Frontend
npm install

# Backend services
cd ../Backend
cd Gateway && npm install
cd ../Services/auth-service && npm install
cd ../user-service && npm install
cd ../submission-service && npm install
cd ../socket-service && npm install
```

3. **Set up environment variables**

Create `.env` files in each service directory (examples provided in each service).

4. **Start services**

Run services individually or use Docker (Docker setup coming soon).

---

## 🧩 Features

- 🔐 Secure user registration & login
- 📝 Submit coding questions
- 🔄 Real-time communication via WebSockets
- ⚡ High performance with Redis caching
- 🎯 Modular microservices for scalability

---

## 🛣️ Roadmap

- [ ] Code execution support
- [ ] Contest creation & leaderboard
- [ ] Docker Compose setup
- [ ] Live deployment

---

## 🧑‍💻 Author

Made with 💡 by [Hariom Joshi](https://github.com/HariomJoshi)
