import { Redis } from "@upstash/redis";
import { VOICES } from "./voices";

const redis = Redis.fromEnv();

const key = (voiceId: string) => `vote:${voiceId}`;

export async function getAllVotes(): Promise<Record<string, number>> {
  const ids = VOICES.map((v) => v.id);
  if (ids.length === 0) return {};
  const values = await redis.mget<(number | null)[]>(
    ...ids.map((id) => key(id))
  );
  const out: Record<string, number> = {};
  ids.forEach((id, i) => {
    out[id] = values[i] ?? 0;
  });
  return out;
}

export async function incrementVote(
  voiceId: string,
  delta: number = 1
): Promise<number> {
  const k = key(voiceId);
  if (delta >= 0) {
    return await redis.incr(k);
  }
  const next = await redis.decr(k);
  if (next < 0) {
    await redis.set(k, 0);
    return 0;
  }
  return next;
}
