# Humblee Trees – Username Creator

A tiny full‑stack app to **create and reserve usernames** for your company.

- **Frontend**: Static HTML/CSS/JS served via **GitHub Pages** from the `/docs` folder.
- **Backend**: **Node.js + Express + SQLite** API (`/api/users`) to validate and store usernames.
- **Domain**: Point your Hostinger domain to GitHub Pages for the frontend (e.g., `www.yourdomain.com`) and to your VPS for the backend (e.g., `api.yourdomain.com`).

---

## 1) Repo layout

```
.
├── README.md
├── .gitignore
├── package.json
├── backend
│   ├── db.js
│   ├── server.js
│   ├── validators.js
│   └── .env.example
├── docs                # ← GitHub Pages publishes from here
│   ├── index.html
│   ├── app.js
│   └── style.css
└── scripts
    └── nginx.conf.example
```

> Tip: GitHub Pages → **Settings → Pages → Build from branch → main /docs**.

---

## 2) Backend (Node.js + Express + SQLite)

**Run locally**

```bash
cp backend/.env.example backend/.env
# edit ORIGIN to your frontend URL (during local dev, http://127.0.0.1:5500 or similar)
npm install
npm run dev   # or: npm start
```

**Environment (.env)**

```
PORT=3000
ORIGIN=https://YOUR-FRONTEND-DOMAIN
```

**API**

- `POST /api/users` body: `{ "username": "your_name" }`  
  - Creates a new username (case‑insensitive unique).  
  - Rules: 3–20 chars, letters/numbers/underscore/hyphen only.
- `GET /api/users`  
  - Returns latest usernames (limit 50).
- `GET /api/health`  
  - Health check.

**Test quickly**

```bash
curl -X POST http://localhost:3000/api/users   -H "Content-Type: application/json"   -d '{"username":"humblee_user"}'
```

The SQLite DB file is created at `data/users.db` on first run.

---

## 3) Frontend (GitHub Pages)

- Files live in `/docs`. After pushing to GitHub, enable Pages to serve from `/docs`.
- In `docs/index.html`, set:
  ```html
  <script>window.API_BASE = "https://api.YOURDOMAIN.com";</script>
  ```
  During local dev (if backend also local), you can set `http://localhost:3000` instead.

Open `docs/index.html` in Live Server (VS Code) or by double‑clicking (CORS might block file://; prefer a dev server).

---

## 4) Hostinger domain setup (summary)

### Frontend (GitHub Pages):
1. In GitHub repo: Settings → Pages → Build from `/docs`.
2. In Hostinger DNS:
   - `A` records for root (`@`) → GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - `CNAME` for `www` → `USERNAME.github.io`

### Backend (VPS: `api.yourdomain.com`):
1. SSH to VPS, install Node 18+ and SQLite.
2. Clone repo, set up `.env`, then:
   ```bash
   npm ci
   npm start  # or pm2 start "npm -- start"
   ```
3. Put `scripts/nginx.conf.example` into `/etc/nginx/sites-available/api.yourdomain.com`
   (adjust `server_name` and proxy target), then enable and reload Nginx.
4. Use Certbot for HTTPS:
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## 5) Nginx reverse proxy (example)

See `scripts/nginx.conf.example`. It maps `https://api.yourdomain.com` → Node app on port 3000.

---

## 6) Customize brand

Edit text in `docs/index.html` (logo/title) to say **Humblee Trees** or your preferred variant.

---

## 7) Common fixes

- **CORS error**: Ensure `.env` `ORIGIN` exactly matches your frontend URL (including https).  
- **409 conflict**: Username already taken (case-insensitive). Choose a different one.  
- **400 validation**: Username must match the allowed pattern (3–20, letters/digits/_/-).

---

## 8) License

MIT
