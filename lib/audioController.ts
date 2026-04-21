type Listener = () => void;

const listeners = new Set<Listener>();
const urlCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;
let currentVoiceId: string | null = null;

function notify() {
  for (const l of listeners) l();
}

function clearCurrent(audio: HTMLAudioElement) {
  if (currentAudio === audio) {
    currentAudio = null;
    currentVoiceId = null;
    notify();
  }
}

export function getPlayingVoiceId(): string | null {
  return currentVoiceId;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function stopPlaying() {
  if (currentAudio) {
    currentAudio.pause();
    const a = currentAudio;
    currentAudio = null;
    currentVoiceId = null;
    notify();
    a.currentTime = 0;
  }
}

export async function playVoice(voiceId: string, text: string): Promise<void> {
  const key = `${voiceId}:${text}`;
  let url = urlCache.get(key);
  if (!url) {
    const resp = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceId, text }),
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      throw new Error(detail || `TTS failed (${resp.status})`);
    }
    const blob = await resp.blob();
    url = URL.createObjectURL(blob);
    urlCache.set(key, url);
  }

  stopPlaying();

  const audio = new Audio(url);
  currentAudio = audio;
  currentVoiceId = voiceId;
  notify();

  audio.addEventListener("ended", () => clearCurrent(audio));
  audio.addEventListener("pause", () => {
    if (audio.ended) return;
    if (audio.currentTime > 0 && audio.currentTime < audio.duration) return;
    clearCurrent(audio);
  });

  try {
    await audio.play();
  } catch (e) {
    clearCurrent(audio);
    throw e;
  }
}
