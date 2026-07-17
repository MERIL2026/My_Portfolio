# Meril Parmar — Portfolio

Personal portfolio built with **React + Vite + TypeScript**, deployed on **Vercel**.

🌐 **Live Site**: [meril-parmar-portfolio.vercel.app](https://vercel.com/dashboard)
📁 **GitHub Repo**: [github.com/MERIL2026/My_Portfolio](https://github.com/MERIL2026/My_Portfolio)

---

## 🚀 How to Update the Portfolio (GitHub + Vercel)

Every time you make changes to the code, run these 3 commands in the project folder:

```powershell
git add .
git commit -m "describe what you changed"
git push
```

✅ That's it! Vercel will **automatically detect the push** and redeploy the live site in ~20 seconds.

### Example commit messages:
```powershell
git commit -m "Update projects section"
git commit -m "Add new certificate"
git commit -m "Fix navbar styling"
git commit -m "Update contact info"
```

---

## 💻 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```powershell
   npm install
   ```

2. Copy the example env file and fill in your keys:
   ```powershell
   copy .env.example .env
   ```

3. Run the dev server:
   ```powershell
   npm run dev
   ```

---

## 📁 Project Structure

```
meril-parmar-portfolio/
├── public/          # Images, favicon, assets
├── src/
│   ├── components/  # All UI sections (Hero, About, Projects, etc.)
│   ├── pages/       # Admin page
│   ├── lib/         # Supabase, utilities
│   ├── data.ts      # Your portfolio content/data
│   ├── App.tsx      # Main app
│   └── index.css    # Global styles
├── index.html
├── vite.config.ts
└── package.json
```

---

## ⚙️ Environment Variables

Add these in your **Vercel Dashboard → Project → Environment Variables**:

See `.env.example` for the full list of required keys.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **Supabase** (database/backend)
- **EmailJS** (contact form)
- **Vercel** (hosting)
