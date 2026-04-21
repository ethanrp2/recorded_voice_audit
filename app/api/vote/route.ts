import { incrementVote } from "@/lib/db";
import { VOICES_BY_ID } from "@/lib/voices";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    voiceId?: string;
  } | null;

  const voiceId = body?.voiceId;
  if (!voiceId) {
    return Response.json({ error: "Missing voiceId" }, { status: 400 });
  }
  if (!VOICES_BY_ID[voiceId]) {
    return Response.json({ error: "Voice not found" }, { status: 404 });
  }

  const count = incrementVote(voiceId);
  return Response.json({ voiceId, count });
}
