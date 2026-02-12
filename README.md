# War Room Academy - AI Discipline Hub

A strict, field manual-style training platform for learning AI control mechanisms. Built with vanilla JavaScript and deployed via Cloudflare Workers + GitHub Pages.

## 🎯 Overview

War Room Academy teaches users how to control AI systems through disciplined framing. The platform features:

- **Interactive lessons** with live AI chat exercises
- **Progress tracking** via localStorage
- **Sequential learning** - users must complete lessons in order
- **Checkpoint validation** - ensures users document what they learn
- **Field manual aesthetic** - minimal, high-contrast, military-inspired design

## 📁 Project Structure

```
war-room-academy/
├── index.html          # Homepage
├── lesson-1.html       # Lesson 1: Why AI Guesses
├── lesson-2.html       # Placeholder for Lesson 2
├── style.css           # All styles (field manual aesthetic)
├── app.js              # Core functionality (progress, chat, validation)
├── worker.js           # Cloudflare Worker (AI proxy)
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Deploy the Cloudflare Worker

The worker proxies requests to Claude Haiku and handles rate limiting.

**Prerequisites:**
- Cloudflare account
- Anthropic API key ([get one here](https://console.anthropic.com))
- Node.js installed

**Steps:**

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create KV namespace for rate limiting
wrangler kv:namespace create "RATE_LIMIT"
# Note the ID it outputs

# Create wrangler.toml
cat > wrangler.toml << EOF
name = "war-room-ai-proxy"
main = "worker.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "YOUR_KV_NAMESPACE_ID"  # Replace with ID from previous step
EOF

# Set API key as secret
wrangler secret put ANTHROPIC_API_KEY
# Paste your Anthropic API key when prompted

# Deploy worker
wrangler deploy
```

After deployment, you'll get a URL like: `https://war-room-ai-proxy.your-subdomain.workers.dev`

### 2. Update Configuration

Edit `app.js` and update the worker URL:

```javascript
const CONFIG = {
    WORKER_URL: 'https://war-room-ai-proxy.your-subdomain.workers.dev',
    // ...
};
```

### 3. Deploy to GitHub Pages

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/war-room-academy.git
git push -u origin main

# Enable GitHub Pages
# Go to Settings > Pages > Source: main branch > Save
```

Your site will be live at: `https://yourusername.github.io/war-room-academy/`

### 4. Secure the Worker (PRODUCTION)

Edit `worker.js` and update CORS headers:

```javascript
function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://yourusername.github.io', // Your domain
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}
```

Redeploy the worker:
```bash
wrangler deploy
```

## 🎨 Design Philosophy

**Field Manual Aesthetic:**
- Black background (#000000)
- White text (#FFFFFF)  
- Red accents (#D32F2F)
- System fonts (SF Pro, Segoe UI)
- Minimal formatting
- High contrast (WCAG AA+)
- No decorative elements
- Strict, disciplined structure

**Typography:**
- 18px base font size
- Tight line-height (1.5-1.7)
- Bold weights for emphasis
- Uppercase for headings
- Letter-spacing on labels

## 🔧 Features

### Progress Tracking
- Saves completion state to `localStorage`
- Displays progress bar (25%, 50%, 75%, 100%)
- Persists across sessions
- Fallback to `sessionStorage` if localStorage disabled

### Sequential Access Control
- Users must complete lessons in order
- Attempting to skip redirects to last completed lesson
- Lesson 1 is always accessible

### Interactive Chat
- Live AI responses via Cloudflare Worker
- Loading states and error handling
- Rate limiting (10 requests/hour per IP)
- Keyboard shortcuts (Enter to send)

### Checkpoint Validation
- Minimum 20 character answers required
- Real-time character counter
- Continue button disabled until valid
- Answers saved to localStorage

### Export Functionality
- `exportNotes()` downloads all checkpoint answers
- Plain text format
- Filename: `war-room-module1-notes.txt`

## 📊 Technical Details

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- CSS Grid & Flexbox
- localStorage API
- Fetch API

### Performance
- No external dependencies
- Minimal CSS (under 10KB)
- Vanilla JavaScript (under 15KB)
- Static files (fast CDN delivery via GitHub Pages)

### Security
- Rate limiting via Cloudflare KV
- API key stored as Worker secret (never exposed to client)
- CORS protection
- Input validation
- No user accounts (privacy-first)

### Accessibility
- Semantic HTML5
- WCAG AA contrast ratios
- Keyboard navigation
- Focus states
- Screen reader friendly
- 44px minimum tap targets (mobile)

## 🧪 Testing Locally

```bash
# Serve with any static server
python -m http.server 8000
# or
npx serve

# Open browser
open http://localhost:8000
```

**Note:** Chat functionality requires deployed Worker (localhost can't call Worker directly)

## 📝 Environment Variables

### Worker Secrets
Set via Wrangler CLI:
```bash
wrangler secret put ANTHROPIC_API_KEY
```

### Worker KV Namespaces
Defined in `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "your_kv_namespace_id"
```

## 🔒 Rate Limiting

**Current limits:**
- 10 requests per IP per hour
- Tracked via Cloudflare KV
- Automatic reset after 1 hour
- Returns 429 when exceeded

**Adjust in `worker.js`:**
```javascript
const RATE_LIMIT_REQUESTS = 10;     // requests
const RATE_LIMIT_WINDOW = 3600;     // seconds
```

## 🛠️ Customization

### Add More Lessons

1. Create `lesson-N.html` (copy structure from `lesson-1.html`)
2. Update progress percentage
3. Update checkpoint validation
4. Add to progress tracking in `app.js`:

```javascript
module1: {
    lesson1: false,
    lesson2: false,
    lesson3: false,
    lesson4: false,
    lessonN: false  // Add new lesson
}
```

### Change Colors

Edit CSS variables in `style.css`:
```css
:root {
    --color-black: #000000;
    --color-white: #ffffff;
    --color-accent-red: #d32f2f;
    /* ... */
}
```

### Modify AI Model

Edit `worker.js`:
```javascript
const MODEL = 'claude-3-haiku-20240307';  // Change model
const MAX_TOKENS = 500;                    // Adjust token limit
const TEMPERATURE = 0.7;                   // Adjust creativity
```

## 📈 Monitoring

### Worker Logs
```bash
# View real-time logs
wrangler tail

# View analytics
wrangler dashboard
```

### Check Rate Limits
```bash
# List KV keys
wrangler kv:key list --binding=RATE_LIMIT

# Get specific IP data
wrangler kv:key get "ratelimit:1.2.3.4" --binding=RATE_LIMIT
```

## 🐛 Troubleshooting

**Chat not working:**
1. Check worker URL in `app.js` CONFIG
2. Verify ANTHROPIC_API_KEY is set in worker
3. Check browser console for errors
4. Verify CORS headers allow your domain

**Progress not saving:**
1. Check browser localStorage is enabled
2. Open DevTools > Application > Local Storage
3. Look for `warRoomProgress` key
4. Check console for storage errors

**Lesson access denied:**
1. Clear localStorage: `localStorage.clear()`
2. Start from Lesson 1
3. Complete checkpoint to unlock next lesson

**Worker errors:**
1. Check `wrangler tail` for error logs
2. Verify KV namespace is bound
3. Verify API key is valid
4. Check Anthropic API status

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a single-page educational project. To extend:

1. Fork repository
2. Add new lessons
3. Enhance exercises
4. Improve accessibility
5. Submit pull request

## 📞 Support

- GitHub Issues: Report bugs
- Anthropic Docs: [Claude API](https://docs.anthropic.com)
- Cloudflare Docs: [Workers](https://developers.cloudflare.com/workers/)

---

**Built for people with real stakes.**

Based on The War Room Pocket Field Guide v1.0
