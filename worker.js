/* ============================================
   WAR ROOM ACADEMY - CLOUDFLARE WORKER
   Proxies requests to Claude Haiku API
   ============================================ */

// Worker configuration
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-3-haiku-20240307';
const MAX_TOKENS = 500;
const TEMPERATURE = 0.7;

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 50; // requests per window (increased for testing)
const RATE_LIMIT_WINDOW = 3600; // 1 hour in seconds

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Get client IP for rate limiting
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      
      // Check rate limit (only if KV is bound)
      const rateLimitResult = await checkRateLimit(env, clientIP);
      if (!rateLimitResult.allowed) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { 
            status: 429,
            headers: corsHeaders()
          }
        );
      }

      // Parse request body
      const body = await request.json();
      
      // Validate request format - accept both 'prompt' and 'message' field names
      const promptText = body.prompt || body.message;
      if (!promptText || typeof promptText !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid request: prompt is required' }),
          { 
            status: 400,
            headers: corsHeaders()
          }
        );
      }

      // Get API key from environment variable
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.error('ANTHROPIC_API_KEY not configured');
        return new Response(
          JSON.stringify({ error: 'Service configuration error' }),
          { 
            status: 500,
            headers: corsHeaders()
          }
        );
      }

      // Call Anthropic API
      const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE,
          system: body.system || 'You are a helpful AI assistant.',
          messages: [
            {
              role: 'user',
              content: promptText
            }
          ]
        })
      });

      // Handle API errors
      if (!anthropicResponse.ok) {
        const errorText = await anthropicResponse.text();
        console.error('Anthropic API error:', anthropicResponse.status, errorText);
        
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable' }),
          { 
            status: 503,
            headers: corsHeaders()
          }
        );
      }

      // Parse response
      const data = await anthropicResponse.json();
      
      // Extract text content
      const responseText = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      // Log request (without exposing sensitive data)
      console.log('Request processed:', {
        ip: clientIP,
        promptLength: promptText.length,
        responseLength: responseText.length,
        timestamp: new Date().toISOString()
      });

      // Return formatted response
      return new Response(
        JSON.stringify({ response: responseText }),
        {
          status: 200,
          headers: corsHeaders()
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred' }),
        { 
          status: 500,
          headers: corsHeaders()
        }
      );
    }
  }
};

// ============================================
// RATE LIMITING FUNCTIONS
// ============================================

/**
 * Check if request is within rate limit
 * Uses KV if available, otherwise allows all requests (fail open)
 */
async function checkRateLimit(env, clientIP) {
  // If no KV namespace is bound, allow request (fail open)
  // This handles the case where the KV binding was removed
  if (!env.RATE_LIMIT) {
    console.warn('RATE_LIMIT KV namespace not bound - rate limiting disabled');
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS };
  }

  try {
    const key = `ratelimit:${clientIP}`;
    const now = Math.floor(Date.now() / 1000);
    
    // Get existing rate limit data
    const data = await env.RATE_LIMIT.get(key, { type: 'json' });
    
    if (!data) {
      // First request from this IP
      await env.RATE_LIMIT.put(
        key,
        JSON.stringify({
          count: 1,
          resetAt: now + RATE_LIMIT_WINDOW
        }),
        { expirationTtl: RATE_LIMIT_WINDOW }
      );
      
      return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1 };
    }

    // Check if window has expired
    if (now > data.resetAt) {
      // Reset counter
      await env.RATE_LIMIT.put(
        key,
        JSON.stringify({
          count: 1,
          resetAt: now + RATE_LIMIT_WINDOW
        }),
        { expirationTtl: RATE_LIMIT_WINDOW }
      );
      
      return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1 };
    }

    // Check if limit exceeded
    if (data.count >= RATE_LIMIT_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }

    // Increment counter
    await env.RATE_LIMIT.put(
      key,
      JSON.stringify({
        count: data.count + 1,
        resetAt: data.resetAt
      }),
      { expirationTtl: data.resetAt - now }
    );

    return { 
      allowed: true, 
      remaining: RATE_LIMIT_REQUESTS - (data.count + 1)
    };

  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if rate limiting fails
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS };
  }
}

// ============================================
// CORS HELPERS
// ============================================

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

/* ============================================
   DEPLOYMENT INSTRUCTIONS
   ============================================

   1. Install Wrangler CLI:
      npm install -g wrangler

   2. Login to Cloudflare:
      wrangler login

   3. OPTIONAL: Create KV namespace for rate limiting:
      wrangler kv:namespace create "RATE_LIMIT"
      (Worker works fine without it - rate limiting is just disabled)

   4. Create wrangler.toml in your project:
      
      name = "war-room-ai-proxy"
      main = "worker.js"
      compatibility_date = "2024-01-01"

      # Optional - only needed if you want rate limiting:
      # [[kv_namespaces]]
      # binding = "RATE_LIMIT"
      # id = "YOUR_KV_NAMESPACE_ID"

   5. Set API key secret:
      wrangler secret put ANTHROPIC_API_KEY

   6. Deploy:
      wrangler deploy

   7. Update CONFIG.WORKER_URL in app.js with your worker URL

   ============================================ */
