import { config } from "dotenv";
import { Redis } from "@upstash/redis";
import { VOICES } from "../lib/voices";

config({ path: ".env.local" });

async function main() {
  const redis = Redis.fromEnv();
  const keys = VOICES.map((v) => `vote:${v.id}`);
  const values = await redis.mget<(number | null)[]>(...keys);
  const countByVoice: Record<string, number> = {};
  VOICES.forEach((v, i) => {
    countByVoice[v.id] = values[i] ?? 0;
  });

  const byPerson: Record<string, { voiceId: string; count: number }[]> = {};
  for (const v of VOICES) {
    (byPerson[v.person] ??= []).push({
      voiceId: v.id,
      count: countByVoice[v.id] ?? 0,
    });
  }

  const chosen: Record<string, string> = {};
  for (const [person, voices] of Object.entries(byPerson)) {
    const max = Math.max(...voices.map((v) => v.count));
    if (max <= 0) continue;
    const leaders = voices.filter((v) => v.count === max);
    if (leaders.length === 1) chosen[person] = leaders[0].voiceId;
  }

  if (Object.keys(chosen).length === 0) {
    console.log("no leaders to seed (all counts zero or all tied)");
    return;
  }

  await redis.hset("chosen", chosen);
  console.log(`seeded chosen for ${Object.keys(chosen).length} people:`);
  for (const [person, voiceId] of Object.entries(chosen)) {
    console.log(`  ${person} -> ${voiceId} (${countByVoice[voiceId]} votes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
