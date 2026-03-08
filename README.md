# WAR ROOM ACADEMY

**AI Discipline Hub — Train operators to run the War Room system without drift under real constraints.**

[**ENTER THE ACADEMY →**](https://gfbtools.github.io/war-room-academy/)

---

## ⚠️ WARNING

This is not a course.  
This is not inspiration.  
This is not theory.

**War Room Academy exists for one reason:**  
To execute the system described in *The AI Modes Manifesto* without drift.

If you are looking for:
- Motivation
- Hacks  
- "Best prompts"
- Passive consumption

**Stop here.**

---

## THE PROBLEM

You've already used AI. Now you need to control it.

**66% of workers rely on AI output without verification.**  
**56% acknowledge making mistakes due to unverified AI assistance.**

This is the knowing-doing gap:  
Awareness of risk does not translate into verification behavior.

You know AI can be wrong.  
You use it anyway without checking.

**Decisions resurface after being settled.**  
**Rules soften over time.**  
**Output sounds good but doesn't hold.**  
**You compensate instead of stopping.**

This is **drift** — gradual loss of alignment between what you think was decided and what the system acts on.

War Room Academy teaches you to **identify drift before it compounds**, **execute without theater**, and **maintain a system under pressure**.

---

## THE SYSTEM

War Room operates on one Prime Directive:

**AI generates. You execute. You document. Reality decides.**

Every violation of this rule produces:
- Drift
- Overconfidence  
- Theater  
- Waste

No exception has ever held.

---

## WHAT YOU LEARN

### **Module 1: Foundation** (4 Lessons)
- System Reality & Drift
- The Prime Directive  
- Framing Density (Mode 1)  
- Memory Stacking (Mode 2)

### **Module 2: Advanced Control Modes** (4 Lessons)  
- Adversarial Stress Test (Mode 3)  
- Ghost Protocol (Mode 4)  
- Temporal Hierarchy (Mode 5)  
- Execution Loop & Failure Signals

### **Module 3: Domain Application** (4 Lessons)  
- High-Stakes Decision Making  
- Professional Use & Ethics  
- Detecting Expertise Simulation  
- Building a Real Memory Stack

### **Module 4: Mastery & Field Operations** (4 Lessons)  
- Understanding AI Limitations (The Four Illusions)  
- Operational Discipline Under Pressure  
- Advanced Troubleshooting: Drift Typology  
- Field Operator Certification

**16 lessons. 4 modules. Sequential completion mandatory.**

---

## HOW IT WORKS

Every lesson follows the same structure:

1. **Concept Sections** — Doctrine from *The War Room Pocket Field Guide*, not invented theory
2. **Interactive Exercise** — Copyable prompts, live AI chat, real execution
3. **Checkpoint** — Proof-of-work requirement. Minimum character count enforced.
4. **Sequential Access** — Complete Lesson N to unlock Lesson N+1. No skipping.

**If you cannot complete a checkpoint with real work, you are not ready for the next lesson.**

---

## WHAT THIS IS NOT

❌ Productivity hacks  
❌ Prompt libraries  
❌ Generic AI tutorials  
❌ Motivational content  
❌ Quick tips

**This is discipline training.**

War Room assumes:
- Stakes are real
- Time is limited  
- Energy fluctuates  
- Failure is expensive

AI is not treated as a collaborator.  
**It is treated as a system component.**

---

## TECH STACK

**Frontend:**  
- Pure HTML/CSS/JavaScript  
- Black, red, and white field manual aesthetic  
- No frameworks, no dependencies  
- Responsive design (mobile + desktop)

**Backend:**  
- Cloudflare Worker (ES modules)  
- Anthropic Claude API (Haiku model)  
- Rate limiting via KV namespace  
- Manual dashboard deployment (no Wrangler CLI)

**Deployment:**  
- GitHub Pages (`gh-pages` branch)  
- Zero-config static hosting  
- Cloudflare Worker at `war-room-academy-chat.smartselleraico.workers.dev`

**Progress Tracking:**  
- LocalStorage-based checkpoint system  
- 4-module, 16-lesson sequential gating  
- Per-lesson character count validation  
- State persistence across sessions

---

## DEPLOYMENT

### **1. Clone & Deploy Frontend**

```bash
# Clone repo
git clone https://github.com/gfbtools/war-room-academy.git
cd war-room-academy

# Deploy to GitHub Pages
git checkout -b gh-pages
git push origin gh-pages
```

Access at: `https://gfbtools.github.io/war-room-academy/`

### **2. Configure Cloudflare Worker**

**Worker Name:** `war-room-academy-chat`  
**Account:** Smartselleraico  

**Required Secrets:**
- `ANTHROPIC_API_KEY` (encrypted environment variable)

**Required KV Namespace:**
- `RATE_LIMIT` (binding name: `RATE_LIMIT`)

**Worker Code:** Deploy via Cloudflare Dashboard (manual)
- Use ES modules format: `export default { async fetch(request, env) {...} }`
- Model: `claude-3-haiku-20240307`
- Rate limit: 100 requests/hour per user

### **3. Update Worker URL**

In `app.js`, set:
```javascript
const CONFIG = {
    WORKER_URL: 'https://war-room-academy-chat.smartselleraico.workers.dev'
};
```

---

## FILE STRUCTURE

```
war-room-academy/
├── index.html              # Homepage with all 4 modules
├── style.css               # War Room field manual aesthetic
├── app.js                  # Progress tracking, AI chat, validation
├── lesson-1.html           # Module 1, Lesson 1
├── lesson-2.html           # Module 1, Lesson 2
├── lesson-3.html           # Module 1, Lesson 3
├── lesson-4.html           # Module 1, Lesson 4
├── lesson-5.html           # Module 2, Lesson 5
├── lesson-6.html           # Module 2, Lesson 6
├── lesson-7.html           # Module 2, Lesson 7
├── lesson-8.html           # Module 2, Lesson 8
├── lesson-9.html           # Module 3, Lesson 9
├── lesson-10.html          # Module 3, Lesson 10
├── lesson-11.html          # Module 3, Lesson 11
├── lesson-12.html          # Module 3, Lesson 12
├── lesson-13.html          # Module 4, Lesson 13
├── lesson-14.html          # Module 4, Lesson 14
├── lesson-15.html          # Module 4, Lesson 15
├── lesson-16.html          # Module 4, Lesson 16 (Final Certification)
└── README.md               # This file
```

---

## CORE MECHANICS

### **Sequential Access Gating**
- Lesson 1 always accessible
- Lessons 2-16 require previous lesson completion
- Access checked via `checkAccess(lessonNumber)` on page load
- Violations redirect to last completed lesson or homepage

### **Checkpoint Validation**
- Each lesson has minimum character requirement (20-200 chars)
- Real-time character counter with validation
- "Continue" button disabled until requirement met
- Progress saved to `localStorage` on completion

### **Memory Stack Format**
Mandatory 4-field structure enforced across all lessons:
```
Session: [Problem name]
Date: [YYYY-MM-DD]
Decision: [What you're executing]
Usage: [When you'll re-inject this]
```

### **Progress Persistence**
```javascript
{
  module1: { lesson1: true, lesson2: true, ... },
  module2: { lesson5: true, lesson6: false, ... },
  module3: { lesson9: false, ... },
  module4: { lesson13: false, ... }
}
```

---

## DESIGN PHILOSOPHY

**Black, Red, and White Field Manual Aesthetic**

- **Background:** Pure black (`#000000`)
- **Text:** Off-white (`#f5f5f5`)  
- **Accent:** Command red (`#dc2626`)  
- **Borders:** Dark gray (`#333333`)
- **Fonts:** System monospace for prompts, sans-serif for body

**No visual noise. No gradients. No shadows.**

War Room is not designed to be pleasant.  
It is designed to be clear.

---

## THE RULES

### **1. Documentation is Non-Negotiable**
If you skip checkpoints, you are not running the system.

### **2. Sequential Completion is Mandatory**
No skipping ahead. No "I'll come back to that later."

### **3. AI Generates, You Execute, You Document, Reality Decides**
Every step matters. Every skip compounds.

### **4. If It Lives Only in Conversation, It Does Not Exist**
Undocumented decisions decay.  
Undocumented rules resurface.  
Undocumented constraints dissolve.

### **5. Stopping is a Skill**
When drift is detected, disengage.  
Pausing is not failure. Continuing blindly is.

---

## WHO THIS IS FOR

War Room Academy is for people who:

✅ Already use AI in real work  
✅ Have noticed drift, unverified reliance, or compensating behavior  
✅ Are responsible for outcomes when AI-assisted work fails  
✅ Operate under real constraints (time, money, stakes)  
✅ Are willing to document, enforce, and intervene

**This is not for beginners.**  
**This is not for curiosity.**  
**This is not for passive consumption.**

If you want AI to reduce responsibility, close this tab.

---

## WHAT CERTIFICATION PROVES

War Room Field Operator Certification does not prove you will never make mistakes.

It proves:
- ✅ You can identify drift before it compounds
- ✅ You know when NOT to use AI  
- ✅ You maintain a memory stack under pressure  
- ✅ You execute the Execution Loop without skipping steps  
- ✅ You can train others in the system

**The system does not prevent failure.**  
**It makes failure visible early.**

---

## SOURCE MATERIAL

War Room Academy is based on:

- **The AI Modes Manifesto** — Tony "GFB_Tito" (2025)  
- **The War Room Pocket Field Guide v1.2** — Operational command manual  
- **Deep Research Report: AI Reliability, User Behavior, and High-Stakes Decision Making** — Empirical evidence on unverified reliance and drift patterns

All doctrine extracted from source documents.  
No invented theory.  
No speculation.

---

## FAILURE MODES

War Room Academy will fail if you:

❌ Skip checkpoints  
❌ Jump ahead without completing prior lessons  
❌ Treat it as a prompt library  
❌ Seek validation instead of correction  
❌ Trust continuity without checking memory  
❌ Stop documenting  

These are not edge cases.  
They are warning lights.

**If you violate the rules, the system will not save you.**

---

## CREDITS

**Built by:** Tony "GFB_Tito" (GFB_Coder)  
**Doctrine:** *The War Room Pocket Field Guide v1.2*  
**Tech Stack:** HTML/CSS/JS + Cloudflare Workers + Anthropic Claude API  
**Deployment:** GitHub Pages + Manual Dashboard (No Wrangler CLI)  
**Aesthetic:** Black, red, white field manual design  

**For operators with real stakes.**

---

## LICENSE

All rights reserved.

No part of this system may be reproduced, distributed, or transmitted in any form or by any means without prior written permission, except for brief quotations in critical reviews and certain noncommercial uses permitted by copyright law.

**War Room Academy © 2026 War Room Press**

---

## ENTER THE ACADEMY

**[START MODULE 1 →](https://gfbtools.github.io/war-room-academy/lesson-1.html)**

If you've read this far and you're still here, you're ready.

**AI generates. You execute. You document. Reality decides.**

Let's begin.
