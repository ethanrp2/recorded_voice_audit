export type Provider = "cartesia" | "elevenlabs";
export type Variant = "regular" | "cx";

export interface Voice {
  id: string;
  person: string;
  variant: Variant;
  provider: Provider;
  providerVoiceId: string;
}

const NAMES = [
  "mandi",
  "mandi_cx",
  "jordan",
  "jordan_cx",
  "ryan",
  "ryan_cx",
  "lucas",
  "lucas_cx",
  "lex",
  "lex_cx",
  "james",
  "james_cx",
  "harry",
  "harry_cx",
  "elle",
  "elle_cx",
  "devon",
  "devon_cx",
  "david",
  "david_cx",
  "audra",
  "audra_cx",
  "ethan_cx",
  "ethan",
] as const;

const CARTESIA_IDS = [
  "baa05162-4492-455e-8258-c7562ab46a1f",
  "30f5bfe1-db64-4c9a-83d2-6e72aa3a3c84",
  "5b00ef47-6e48-49b3-ab6b-7ea55ffcb7ce",
  "43e12bc4-2495-4605-90cd-8348e07a2f3c",
  "867c8c79-91a9-4170-a3fe-58a62909be78",
  "31a5cfa8-3300-465e-aeb4-9ecafdec4bde",
  "9d7845e1-6e4f-4ef8-9615-41ac2b55f5f7",
  "c01abc7d-4da9-4d4f-809b-61dcc69638fa",
  "73a946de-a6c1-4f7f-8891-76c88ad383b2",
  "5c73bdc3-0428-4bbc-b4b7-5accc7e0e1c7",
  "a980a257-9b52-4e7d-b646-a8efd905295f",
  "6f09e6ba-9d9e-4f42-afe8-63b80044b730",
  "57d5bdad-b18c-4dc1-ad1d-e6e7729b8be5",
  "7185b773-49c2-43df-b72b-43838c068f52",
  "985dea0e-829a-4a5d-8c6f-83e553a20182",
  "73f34fdb-9f03-486e-b41d-6411fdc5216c",
  "06d8dc9c-ac9d-4140-9bdf-22fee5ab4524",
  "7967f065-caa4-4db9-8c4b-38ae1c9c316e",
  "f395c64b-1b0d-4212-9b4e-56b36c8dead4",
  "beef7ee7-a0c1-4da2-8430-244953abf051",
  "08d8cee2-3169-4c09-ab3d-3d0377268d6e",
  "e9b6c2ee-ac56-44d3-9bf9-8bf6cb6f8423",
  "c5fe3dba-0cd5-4601-a9fe-f82319cf0a13",
  "6dd4b552-9cbf-4992-9abd-3edb4fd95fb4",
] as const;

const ELEVENLABS_IDS = [
  "QPzE4mhWdjtILnYSFWfR",
  "sFacRowovPlDU9CDDej7",
  "NaFoIHM0mngMOebLkkxk",
  "NoaWcPwWLhCDoVaVpx5m",
  "1qPU1RAxurnKH7PMBP83",
  "mxzil2hVujhXoutx6opb",
  "UNuIhtFZzT52ibPiTzJ0",
  "0tCuJ86J4s2cy2WgkDkH",
  "m0fGGquFBDItApi4fOww",
  "RmZJWY10SP0xEHw9blW9",
  "iIhhyqxnRbRfXG6ITuyT",
  "2yR0520X9lmZBRaQZzru",
  "TLtWpSiJZtzZiPOkyvVx",
  "ZqkfcBzbIm12by9U0Rdu",
  "IMLn6UWZQOMop8e9kKyB",
  "ZCtfjsuj7MmHXxMuYxmN",
  "GUxCm4ryTxV7TZqu6flQ",
  "J4hfvAGqT7hWFI2QOupU",
  "9szGSWby7mceULGpA9lh",
  "unwLBGOFWH3Hyecat6D8",
  "LWLF1LSFxDRPlBl8K58c",
  "2KHGuEID9COUl6lXMOJp",
  "Ga33PNX2ELcxSmWFTczi",
  "IgqP4N9kuX1xajOSno43",
] as const;

function deriveFromName(name: string): { person: string; variant: Variant } {
  if (name.endsWith("_cx")) {
    return { person: name.slice(0, -3), variant: "cx" };
  }
  return { person: name, variant: "regular" };
}

function buildVoices(): Voice[] {
  const out: Voice[] = [];
  for (let i = 0; i < NAMES.length; i++) {
    const name = NAMES[i];
    const { person, variant } = deriveFromName(name);
    out.push({
      id: `cartesia-${name}`,
      person,
      variant,
      provider: "cartesia",
      providerVoiceId: CARTESIA_IDS[i],
    });
    out.push({
      id: `elevenlabs-${name}`,
      person,
      variant,
      provider: "elevenlabs",
      providerVoiceId: ELEVENLABS_IDS[i],
    });
  }
  return out;
}

export const VOICES: Voice[] = buildVoices();

export const VOICES_BY_ID: Record<string, Voice> = Object.fromEntries(
  VOICES.map((v) => [v.id, v])
);

export const PEOPLE: string[] = Array.from(new Set(VOICES.map((v) => v.person)));

export const SAMPLE_TEXT =
  "Hey, thanks for listening. This is a voice sample. I'd love your vote if it sounds the most like me.";
