import { VOICES_BY_ID } from "@/lib/voices";

export const runtime = "nodejs";

interface TTSBody {
  voiceId: string;
  text: string;
}


export async function POST(request: Request) {
  const body = (await request.json()) as TTSBody;
  const { voiceId, text } = body;

  if (!voiceId || !text) {
    return Response.json({ error: "Missing voiceId or text" }, { status: 400 });
  }

  const voice = VOICES_BY_ID[voiceId];
  if (!voice) {
    return Response.json({ error: "Voice not found" }, { status: 404 });
  }

  let upstream: Response;

  if (voice.provider === "elevenlabs") {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "ELEVENLABS_API_KEY not configured" },
        { status: 500 }
      );
    }
    upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.providerVoiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
        }),
      }
    );
  } else {
    const apiKey = process.env.CARTESIA_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "CARTESIA_API_KEY not configured" },
        { status: 500 }
      );
    }
    upstream = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "Cartesia-Version": "2025-04-16",
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "sonic-3",
        transcript: text,
        voice: {
          mode: "id",
          id: voice.providerVoiceId,
        },
        output_format: {
          container: "wav",
          encoding: "pcm_s16le",
          sample_rate: 24000,
        },
        speed: "normal",
        generation_config: {
          speed: 1,
          volume: 1,
        },
      }),
    });
  }

  if (!upstream.ok) {
    const errorText = await upstream.text();
    return Response.json(
      {
        error: "TTS generation failed",
        details: errorText,
        provider: voice.provider,
      },
      { status: upstream.status }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
