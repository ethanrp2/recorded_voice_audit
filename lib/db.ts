import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "votes.db");

declare global {
  // eslint-disable-next-line no-var
  var __recordedVoiceAuditDb: Database.Database | undefined;
}

function openDb(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      voice_id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}

function getDb(): Database.Database {
  if (!global.__recordedVoiceAuditDb) {
    global.__recordedVoiceAuditDb = openDb();
  }
  return global.__recordedVoiceAuditDb;
}

export function getAllVotes(): Record<string, number> {
  const rows = getDb()
    .prepare("SELECT voice_id, count FROM votes")
    .all() as { voice_id: string; count: number }[];
  return Object.fromEntries(rows.map((r) => [r.voice_id, r.count]));
}

export function getVote(voiceId: string): number {
  const row = getDb()
    .prepare("SELECT count FROM votes WHERE voice_id = ?")
    .get(voiceId) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function incrementVote(voiceId: string): number {
  const stmt = getDb().prepare(`
    INSERT INTO votes (voice_id, count) VALUES (?, 1)
    ON CONFLICT(voice_id) DO UPDATE SET count = count + 1
    RETURNING count
  `);
  const row = stmt.get(voiceId) as { count: number };
  return row.count;
}
