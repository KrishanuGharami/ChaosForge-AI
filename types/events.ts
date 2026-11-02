export const eventTypes = ["alert", "explosion", "matrix", "meteor", "boss-countdown", "cinematic", "glitch", "celebration", "screen-shake", "theme-shift"] as const;
export type EventType = typeof eventTypes[number];
export type ChaosEvent = { eventType: EventType; colorHex: string; intensity: number; durationMs: number; title: string; narrativeLabel: string; animationPreset: EventType; username?: string };
export const presets: Record<EventType, { colorHex: string; title: string; narrativeLabel: string }> = {
  alert: { colorHex: "#a78bfa", title: "INCOMING TRANSMISSION", narrativeLabel: "SIGNAL DETECTED" },
  explosion: { colorHex: "#fb7185", title: "CHAT DETONATION", narrativeLabel: "CHAOS UNLEASHED" },
  matrix: { colorHex: "#4ade80", title: "ENTER THE MATRIX", narrativeLabel: "REALITY REWRITTEN" },
  meteor: { colorHex: "#fb923c", title: "METEOR IMPACT", narrativeLabel: "SKYFALL EVENT" },
  "boss-countdown": { colorHex: "#f43f5e", title: "BOSS APPROACHING", narrativeLabel: "PREPARE FOR BATTLE" },
  cinematic: { colorHex: "#facc15", title: "MAIN CHARACTER MOMENT", narrativeLabel: "CINEMATIC MODE" },
  glitch: { colorHex: "#e879f9", title: "REALITY GLITCH", narrativeLabel: "TIMELINE UNSTABLE" },
  celebration: { colorHex: "#c4b5fd", title: "CHAT WENT LEGENDARY", narrativeLabel: "A MOMENT FOR THE AGES" },
  "screen-shake": { colorHex: "#38bdf8", title: "EARTHQUAKE EVENT", narrativeLabel: "HOLD ON TIGHT" },
  "theme-shift": { colorHex: "#818cf8", title: "WORLD SHIFT", narrativeLabel: "A NEW ERA BEGINS" },
};
