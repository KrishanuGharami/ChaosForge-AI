import OpenAI from "openai";
import { z } from "zod";
import { eventTypes, presets, type EventType } from "@/types/events";

export const runtime = "nodejs";
export const maxDuration = 15;

const requestSchema = z.object({ message: z.string().trim().min(1).max(300), context: z.string().trim().max(120).optional(), username: z.string().trim().max(25).optional(), intensity: z.number().int().min(1).max(10).optional() });
const eventSchema = z.object({ eventType: z.enum(eventTypes), colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/), intensity: z.number().int().min(1).max(10), durationMs: z.number().int().min(1200).max(12000), title: z.string().trim().min(2).max(48), narrativeLabel: z.string().trim().min(2).max(48), animationPreset: z.enum(eventTypes) });
const recentRequests = new Map<string, number>();
function fallback(message: string, intensity = 6) {
  const m = message.toLowerCase(); let eventType: EventType = "alert";
  if (/meteor|rain|sky|fall/.test(m)) eventType="meteor"; else if (/explos|explod|boom|blast|detonat/.test(m)) eventType="explosion"; else if (/matrix|code|hacker|green/.test(m)) eventType="matrix"; else if (/boss|countdown|battle/.test(m)) eventType="boss-countdown"; else if (/cinematic|movie|main character/.test(m)) eventType="cinematic"; else if (/glitch|break|corrupt/.test(m)) eventType="glitch"; else if (/celebrat|party|win|clutch|hype/.test(m)) eventType="celebration"; else if (/shake|earthquake/.test(m)) eventType="screen-shake"; else if (/theme|shift|change/.test(m)) eventType="theme-shift";
  return { eventType, ...presets[eventType], intensity: Math.min(10, Math.max(1, intensity)), durationMs: 5000, animationPreset: eventType };
}
export async function POST(req: Request) {
  try {
    const body = requestSchema.parse(await req.json());
    const now = Date.now();
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateKey = `${forwarded}:${(body.username || "anonymous").toLowerCase()}`;
    if (now - (recentRequests.get(rateKey) || 0) < 3000) return Response.json({ error: "Give the chaos a moment to land." }, { status: 429 });
    recentRequests.set(rateKey, now);
    if (recentRequests.size > 1000) for (const [key, stamp] of recentRequests) if (now - stamp > 60_000) recentRequests.delete(key);
    if (process.env.OPENAI_API_KEY) {
      try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 10_000, maxRetries: 0 });
        const completion = await client.chat.completions.create({ model: "gpt-4o-mini", temperature: 0.5, response_format: { type: "json_object" }, messages: [
          { role: "system", content: `Translate a Twitch viewer request into one safe event JSON. No extra keys. Allowed eventType/animationPreset only: ${eventTypes.join(", ")}. Return {eventType,colorHex,intensity,durationMs,title,narrativeLabel,animationPreset}. Intensity integer 1-10; durationMs 1200-12000. Use hex color. Keep title and narrativeLabel short, streamer-safe, and do not repeat slurs or abusive content. Never produce code.` },
          { role: "user", content: `Context: ${body.context ?? "live stream"}\nViewer request: ${body.message}` }
        ] });
        const raw = completion.choices[0]?.message.content ?? "{}";
        const parsed = eventSchema.parse(JSON.parse(raw));
        return Response.json({ ...parsed, username: body.username, mode: "ai" });
      } catch (error) { console.error("Chaos AI fallback:", error); }
    }
    return Response.json({ ...fallback(body.message, body.intensity), username: body.username, mode: "fallback" });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Message must be 1–300 characters and intensity must be 1–10." }, { status: 400 });
    return Response.json({ error: "Could not process that chaos request." }, { status: 500 });
  }
}
