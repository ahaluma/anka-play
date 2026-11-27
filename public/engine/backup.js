// The backup: everything AnkaPlay keeps on this device (engine/store.js, every key under "anka:") in one file,
// and that file back again, for example on a new phone. The family moves the file; the app sends nothing.
// Only AnkaPlay's own files are taken: think-lab's backup is not imported (docs/DESIGN.md, section 12).
//
// The file:  { app: "AnkaPlay", format: "anka", v: 1, saved: "2026-11-27", data: { "anka:profiles": "…", … } }
// `data` holds every localStorage entry whose key starts with "anka:", exactly as stored (JSON text).
//
// pack() and unpack() are pure (tools/check-engine.mjs checks them); read() and write() touch localStorage.

export const PREFIX = "anka:";
const FORMAT = "anka";

/** The file for these entries ({ key: text }), saved on `day`. */
export const pack = (data, day) => ({ app: "AnkaPlay", format: FORMAT, v: 1, saved: day, data });

/**
 * The entries of a file, or why it does not fit:
 *   { data }                  an AnkaPlay backup
 *   { error: "thinklab" }     a backup of think-lab (the old games): not taken
 *   { error: "bad" }          anything else
 */
export function unpack(file) {
  if (!file || typeof file !== "object" || typeof file.data !== "object" || file.data === null) return { error: "bad" };
  const keys = Object.keys(file.data);
  if (file.format !== FORMAT && keys.some((k) => k.startsWith("thinklab:"))) return { error: "thinklab" };
  if (file.app !== "AnkaPlay" || file.format !== FORMAT || file.v !== 1 || !keys.length) return { error: "bad" };
  for (const [key, value] of Object.entries(file.data)) {
    if (!key.startsWith(PREFIX) || typeof value !== "string") return { error: "bad" };
    try {
      JSON.parse(value);
    } catch {
      return { error: "bad" };
    }
  }
  return { data: file.data };
}

/** Every "anka:" entry of this device. */
export function read(storage = localStorage) {
  const data = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(PREFIX)) data[key] = storage.getItem(key);
  }
  return data;
}

/** Replace every "anka:" entry of this device with these. The language stays when the file has none. */
export function write(data, storage = localStorage) {
  for (const key of Object.keys(read(storage))) if (key !== PREFIX + "lang" || data[key]) storage.removeItem(key);
  for (const [key, value] of Object.entries(data)) storage.setItem(key, value);
}
