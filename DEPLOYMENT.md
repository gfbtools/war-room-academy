# War Room Academy - Deployment Checklist

## ☐ Pre-Deployment

- [ ] Get Anthropic API key from https://console.anthropic.com
- [ ] Create Cloudflare account at https://dash.cloudflare.com
- [ ] Install Node.js (v16 or later)
- [ ] Install Wrangler CLI: `npm install -g wrangler`

## ☐ Worker Setup (5-10 minutes)

- [ ] Login to Cloudflare: `wrangler login`
- [ ] Create KV namespace: `wrangler kv:namespace create "RATE_LIMIT"`
- [ ] Copy KV namespace ID from output
- [ ] Edit `wrangler.toml` - replace `YOUR_KV_NAMESPACE_ID` with your ID
- [ ] Set API key secret: `wrangler secret put ANTHROPIC_API_KEY`
- [ ] Deploy worker: `wrangler deploy`
- [ ] Copy worker URL from deployment output

## ☐ Frontend Configuration (2 minutes)

- [ ] Edit `app.js`
- [ ] Find `CONFIG.WORKER_URL` (line 13)
- [ ] Replace with your worker URL
- [ ] Save file

## ☐ GitHub Pages Setup (5 minutes)

- [ ] Create new GitHub repository
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Add remote: `git remote add origin https://github.com/USERNAME/REPO.git`
- [ ] Push: `git push -u origin main`
- [ ] Go to repo Settings → Pages
- [ ] Source: main branch → Save
- [ ] Wait 2-3 minutes for deployment
- [ ] Copy your GitHub Pages URL

## ☐ Security Hardening (IMPORTANT)

- [ ] Edit `worker.js`
- [ ] Find `corsHeaders()` function (line 174)
- [ ] Replace `'*'` with your GitHub Pages URL
- [ ] Example: `'Access-Control-Allow-Origin': 'https://username.github.io'`
- [ ] Redeploy worker: `wrangler deploy`

## ☐ Testing (5 minutes)

- [ ] Visit your GitHub Pages URL
- [ ] Click "Start Module 1: Framing Density"
- [ ] Copy the example prompt
- [ ] Click "Send to AI"
- [ ] Verify response appears
- [ ] Type checkpoint answer (20+ characters)
- [ ] Verify "Continue" button enables
- [ ] Click "Continue to Lesson 2"
- [ ] Verify you're redirected to Lesson 2
- [ ] Check progress bar shows "25% Complete"

## ☐ Monitoring Setup (Optional)

- [ ] View worker analytics: `wrangler dashboard`
- [ ] Monitor logs: `wrangler tail`
- [ ] Check rate limits: `wrangler kv:key list --binding=RATE_LIMIT`

## 🎯 Quick Commands Reference

```bash
# Deploy worker
wrangler deploy

# View logs
wrangler tail

# Check KV data
wrangler kv:key list --binding=RATE_LIMIT

# Update secret
wrangler secret put ANTHROPIC_API_KEY

# Test locally (frontend only, worker must be deployed)
python -m http.server 8000
```

## 🚨 Troubleshooting

**Chat returns error:**
→ Check worker logs: `wrangler tail`
→ Verify API key: `wrangler secret list`
→ Check CORS headers in worker.js

**Progress not saving:**
→ Open browser DevTools → Console
→ Check for localStorage errors
→ Try incognito/private mode

**Can't access Lesson 2:**
→ Complete Lesson 1 checkpoint (20+ characters)
→ Clear localStorage: `localStorage.clear()` in console
→ Refresh and start over

## ✅ Success Criteria

- [ ] Homepage loads without errors
- [ ] Chat sends message and receives response
- [ ] Checkpoint validates and enables continue button
- [ ] Progress persists across page refreshes
- [ ] Lesson 2 is only accessible after completing Lesson 1

## 📞 Need Help?

- Anthropic API Docs: https://docs.anthropic.com
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- GitHub Pages Docs: https://docs.github.com/pages

---

**Total deployment time: ~20-30 minutes**
