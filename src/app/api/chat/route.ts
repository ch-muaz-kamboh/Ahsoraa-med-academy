import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/chatbot-knowledge';

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 2000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.every(t => now - t > RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(k);
      }
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               'anonymous-client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a minute before sending more messages, or contact us directly at admissions@ahsorameds.com.',
        },
        { status: 429 }
      );
    }

    // 2. Body parsing & validation
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const rawMessage = body.message;
    if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
      return NextResponse.json({ error: 'Please enter a valid message.' }, { status: 400 });
    }

    const message = rawMessage.trim();
    if (message.length > 600) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep your question under 600 characters.' },
        { status: 400 }
      );
    }

    // 3. Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_')) {
      return NextResponse.json(
        {
          reply:
            "Hello! Our AI customer support assistant is currently being set up. In the meantime, you can review our packages on our website or get instant answers directly from our admissions team at [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com) or WhatsApp at **+39 333 3444 479**.",
        },
        { status: 200 }
      );
    }

    // 4. Sanitize history (last 8 turns max to control context size)
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const formattedHistory = rawHistory
      .slice(-8)
      .filter((h: any) => h && (h.role === 'user' || h.role === 'model') && typeof h.content === 'string')
      .map((h: any) => ({
        role: h.role,
        parts: [{ text: h.content.slice(0, 800) }],
      }));

    // 5. Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use active supported models for this Gemini API account
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let replyText = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: CHATBOT_SYSTEM_PROMPT,
          generationConfig: {
            temperature: 0.3, // Low temperature for high factual accuracy
            maxOutputTokens: 1000,
          },
        });

        const chat = model.startChat({
          history: formattedHistory,
        });

        // Add timeout controller (15s)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 15000)
        );

        const resultPromise = chat.sendMessage(message);
        const result: any = await Promise.race([resultPromise, timeoutPromise]);
        const response = await result.response;
        replyText = response.text();

        if (replyText) {
          break; // Successfully generated response
        }
      } catch (err: any) {
        lastError = err;
        // If it's a model-not-found error, loop to next candidate
        const errMsg = String(err?.message || '');
        if (errMsg.includes('not found') || errMsg.includes('404')) {
          continue;
        }
        // If quota or authentication, break early to handle
        break;
      }
    }

    if (!replyText) {
      const errString = String(lastError?.message || '');
      if (errString.includes('quota') || errString.includes('429') || errString.includes('RESOURCE_EXHAUSTED')) {
        return NextResponse.json(
          {
            reply:
              "We are experiencing high chat volume at the moment! All our package details and admissions guides are available on our website. You can also contact our team directly at [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com) or WhatsApp **+39 333 3444 479**.",
          },
          { status: 200 }
        );
      }

      if (errString.includes('API_KEY_INVALID') || errString.includes('invalid') || errString.includes('401') || errString.includes('403')) {
        return NextResponse.json(
          {
            reply:
              "Welcome to Ahsora Med Academy! For any questions about our **Ahsora IMAT Ascend (€299)**, **Ahsora IMAT Mastery (€499)**, or **Ahsora Path Elite (€799)** packages, registration is open at [Register Now](/register). You can also speak with an advisor on WhatsApp at **+39 333 3444 479**.",
          },
          { status: 200 }
        );
      }

      // General fallback
      return NextResponse.json(
        {
          reply:
            "I apologize, but I am momentarily unable to reach the knowledge service. Please explore our [Packages & Pricing](/register) or contact admissions at [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com) / WhatsApp at **+39 333 3444 479**.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ reply: replyText }, { status: 200 });
  } catch (err: any) {
    console.error('Chatbot API route error:', err);
    return NextResponse.json(
      {
        reply:
          "Something went wrong while processing your request. Please reach out directly to [admissions@ahsorameds.com](mailto:admissions@ahsorameds.com) or WhatsApp at **+39 333 3444 479** for immediate help.",
      },
      { status: 200 }
    );
  }
}
