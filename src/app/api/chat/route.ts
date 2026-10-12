import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CHATBOT_SYSTEM_PROMPT, getInstantKnowledgeReply } from '@/lib/chatbot-knowledge';

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // Generous 25 requests per minute per IP

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
          error: 'Rate limit exceeded. Please wait a minute before sending more messages, or contact us directly on WhatsApp at +39 333 3444 479.',
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
    if (message.length > 800) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep your question under 800 characters.' },
        { status: 400 }
      );
    }

    // 3. Check API key - if missing, use instant verified knowledge engine immediately
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_')) {
      const offlineReply = getInstantKnowledgeReply(message);
      return NextResponse.json({ reply: offlineReply }, { status: 200 });
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

    // Support all production Google Gemini models with automatic cascading fallback
    const candidateModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-1.5-pro',
    ];

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

        // Add 12s timeout to keep chat snappy
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 12000)
        );

        const resultPromise = chat.sendMessage(message);
        const result: any = await Promise.race([resultPromise, timeoutPromise]);
        const response = await result.response;
        const text = response.text();

        if (text && text.trim().length > 0) {
          replyText = text.trim();
          break; // Successfully generated response!
        }
      } catch (err: any) {
        console.warn(`Gemini model ${modelName} failed, trying next candidate:`, err?.message || err);
        // Continue to next candidate model
      }
    }

    // 6. If AI response is available, return it!
    if (replyText) {
      return NextResponse.json({ reply: replyText }, { status: 200 });
    }

    // 7. Resilient Grounded Knowledge Fallback:
    // If the external AI API is unreachable or rate limited, answer directly from the comprehensive knowledge base!
    const groundedAnswer = getInstantKnowledgeReply(message);
    return NextResponse.json({ reply: groundedAnswer }, { status: 200 });
  } catch (err: any) {
    console.error('Chatbot API route error:', err);
    // Never show an error screen to visitors; provide verified instant answer
    const emergencyReply = getInstantKnowledgeReply('packages and contact');
    return NextResponse.json({ reply: emergencyReply }, { status: 200 });
  }
}
