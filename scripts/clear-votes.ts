import { config } from "dotenv";
import { Redis } from "@upstash/redis";
import { VOICES } from "../lib/voices";

config({ path: ".env.local" });

async function main() {
  const redis = Redis.fromEnv();
  const keys = VOICES.map((v) => `vote:${v.id}`);
  const deleted = await redis.del(...keys);
  console.log(`cleared ${deleted} vote keys (${VOICES.length} total)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
