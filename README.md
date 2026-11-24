# Weather Dashboard: your first real deployment

A team built a weather dashboard with a photo carousel. It's almost done: the weather isn't connected, the photos need your Cloudinary account, and it isn't online.

**Your mission:** understand it, configure it, connect it, and deploy it on Vercel. At the end you'll have a public link you can open on your phone.

Built for **Software Dev 101**, IEEE ENSI CS SBC.

---

## Before you start

**Accounts (free):**

- **GitHub**: https://github.com/signup
- **Vercel**, sign up with GitHub: https://vercel.com/signup
- **Cloudinary**: https://cloudinary.com/users/register_free. New accounts come with sample images, so the carousel works right away.

The weather comes from **Open-Meteo** (https://open-meteo.com): free, no account, no key.

**On your laptop:** **Node.js 20.19 or newer** (`node -v`), **Git** (`git --version`) and a code editor (VS Code).
No setup, or something fails? Use **GitHub Codespaces** (step 1, option B): everything runs in the browser.

When you finish a step, post ✅ in your room's chat. Stuck for more than 3 minutes? Post 🆘 with your error.

---

## Step 1: Get the project

1. On this repository, click **Use this template → Create a new repository**.
   Name it `weather-dashboard`, keep it **Public**, create it. It's your own copy, so you can push to it.
2. Then choose one option:

**Option A, on your laptop**

```bash
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
cd weather-dashboard
npm install
```

**Option B, in the browser**
On *your* repository: **Code → Codespaces → Create codespace on main**. `npm install` runs automatically.

## Step 2: Understand the project

```
weather-dashboard/
├── index.html          the page (HTML)
├── src/
│   ├── main.js         search box + display (frontend)
│   ├── weather.js      calls our backend, TODO 2 is here
│   ├── weatherCodes.js turns a weather code into words + emoji
│   ├── photos.js       the carousel (frontend)
│   └── style.css       the look (CSS)
├── api/
│   ├── weather.js      backend: talks to Open-Meteo, TODO 1 is here
│   └── photos.js       backend: talks to Cloudinary with your secret key
├── package.json        dependencies and scripts (npm run dev)
├── .env.example        the configuration the project needs, WITHOUT the real values
└── .gitignore          files Git must never track
```

Remember the restaurant: `src/` is the customer (frontend), `api/` is the waiter (backend). The waiter is the only one who knows the secrets.

## Step 3: Environment variables

```bash
cp .env.example .env
```

On Windows Command Prompt: `copy .env.example .env`

Open `.env` and paste your 3 Cloudinary values. You'll find them in the Cloudinary console (https://console.cloudinary.com) under **Settings → API Keys**:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcDEF...
```

No quotes, no spaces. Then check:

```bash
git status
```

✅ `.env` must **not** appear in the list. It's in `.gitignore`, so Git pretends it doesn't exist. That's security rule 1: never commit secrets.

## Step 4: Connect the weather

Start the app:

```bash
npm run dev
```

Open http://localhost:5173. The carousel should already show your Cloudinary photos. The weather card tells you what's missing. Fix the two TODOs; the page reloads by itself.

**TODO 1, in `api/weather.js`:** build the Open-Meteo forecast URL.
Protocol + domain `https://api.open-meteo.com`, path `/v1/forecast`, query `latitude=...&longitude=...&current=...`. (Block 3: anatomy of a URL!) The geocoding URL just above it is a good example.

**TODO 2, in `src/weather.js`:** pick the right fields from the JSON (country, temperature, humidity, wind, weather).

✅ Search **Tunis**: you see the temperature, an emoji, the humidity and the wind.

> 🔐 **Where is your secret?** Your browser only talks to `/api/photos`. The function talks to Cloudinary with your key and secret, on the server, and sends back only the image links.
> And in Vite, any variable starting with `VITE_` ends up in the browser code, visible to everyone. That's why our variables have no `VITE_` prefix and are only used in `api/`.

## Step 5: Deploy on Vercel

1. Commit and push:

   ```bash
   git add .
   git commit -m "Connect the weather"
   git push
   ```

   Run `git status` once more: `.env` was not committed.
2. On https://vercel.com: **Add New → Project → Import** `weather-dashboard`.
3. ⚠️ **Before clicking Deploy:** open **Environment Variables** and add the 3 variables from your `.env`: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. Click **Deploy**, wait about a minute, open your public URL.

Why add them again? Your `.env` stayed on your laptop (Git ignored it). Vercel is another computer, production: it needs its own copy of the secrets.

## Step 6: Show it off

Open your Vercel link **on your phone**, search a city, swipe the photos, and post the link in the chat. 🎉

---

## Troubleshooting

| You see | Fix |
| --- | --- |
| `Cloudinary keys are missing` (on your laptop) | Create `.env` from `.env.example` (step 3), fill the 3 values, restart `npm run dev`. |
| `Cloudinary keys are missing` (on Vercel) | Settings → Environment Variables → add the 3 values, then **Deployments → ⋯ → Redeploy**. Variables only apply to new deployments. |
| `api_secret mismatch` / `Invalid api_key` (401) | Copy the key and secret again from the Cloudinary console. No spaces, no quotes. |
| A Cloudinary 404 or `Invalid cloud_name` | Check `CLOUDINARY_CLOUD_NAME`: it's the name at the top of your Cloudinary console, not your email. |
| `City not found` | Check the spelling of the city. |
| `TODO 1 is not done yet` | Build the forecast URL in `api/weather.js`. |
| `TODO 2 is not done yet` | Fill in the fields in `src/weather.js`. |
| `git push` asks for a password | Use Codespaces, or log in with `gh auth login`. Last resort: `npx vercel` deploys from your laptop without pushing. |
| `npm run dev` fails with a Node version error | Install Node 20.19+ (https://nodejs.org), or use Codespaces. |

## Finished early?

- Upload your own photos in the Cloudinary Media Library: they appear first in the carousel.
- Change the default city in `src/main.js`, push: Vercel redeploys by itself.
- Show the "feels like" temperature: add `apparent_temperature` to the `current=` list in TODO 1.
- Make it yours in `src/style.css`.
