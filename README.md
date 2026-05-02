# DocSort

AI-powered document classification and organiser. Upload PDFs, DOCX, or images — files are automatically sorted into categories (Invoices, Finance, Medical Reports, Legal, Academic, Personal, Others).

Supports two modes:
- **Online** — MongoDB Atlas + Cloudinary storage + Groq API
- **Offline** — local MongoDB + filesystem storage + Ollama

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 18+ |
| pnpm | 8+ (`npm i -g pnpm`) |
| MongoDB | Atlas cluster **or** local `mongod` |
| (Online) Cloudinary account | free tier works |
| (Online) Groq API key | [console.groq.com](https://console.groq.com) |
| (Offline) Ollama | [ollama.com/download](https://ollama.com/download) |

---

## 1 — Clone & install

```bash
git clone <repo-url> docsort
cd docsort
pnpm install
```

---

## 2 — Environment

Create `.env.local` in the project root.

### Online (MongoDB Atlas + Cloudinary + Groq)

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/docsort

STORAGE_MODE=cloud
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_STORAGE_MODE=cloud

AI_PROVIDER=groq
GROQ_API_KEY=gsk_...

JWT_SECRET=<random-32-char-string>
```

> **MongoDB Atlas**: add your machine's IP to the Atlas allowlist (Network Access tab).

### Offline (local MongoDB + filesystem + Ollama)

```env
MONGODB_URI=mongodb://127.0.0.1:27017/docsort

STORAGE_MODE=local
NEXT_PUBLIC_STORAGE_MODE=local

AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

JWT_SECRET=<random-32-char-string>
```

---

## 3 — Start dependencies (offline mode only)

**MongoDB**

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS (Homebrew)
brew services start mongodb-community
```

**Ollama**

```bash
ollama serve            # start the server
ollama pull llama3      # one-time download (~4 GB)
```

---

## 4 — Run

```bash
pnpm dev                        # development → http://localhost:3000
pnpm build && pnpm start        # production
```

---

## Switching modes

Edit `STORAGE_MODE`, `NEXT_PUBLIC_STORAGE_MODE`, and `AI_PROVIDER` in `.env.local`, then restart.

| Env var | Values |
|---------|--------|
| `STORAGE_MODE` | `local` \| `cloud` |
| `NEXT_PUBLIC_STORAGE_MODE` | same as above |
| `AI_PROVIDER` | `groq` \| `ollama` \| `auto` |

`auto` tries Groq (when `GROQ_API_KEY` is set), falls back to Ollama, then to rule-based classification.
