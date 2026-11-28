// The children on this device: name, age, animal. Nothing leaves the phone. Each place keeps its own
// record per child (the pond: key "offen:<id>"). Without any child, a guest plays (no age: the Tal).
//
// Stored under "anka:profiles":
//   { v: 1, current: "k1", kids: [{ id, name, age, ageSince: "2026-11-27", animal: "🐰", created, readAloud?, typeAnswers? }] }
// The age counts up by itself one year after the day it was entered (no birthday needed).

import { store } from "./store.js";

/** Today as "2026-11-28" (local time). */
export function today(date = new Date()) {
  const z = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(date.getDate())}`;
}

const KEY = "profiles";
export const MIN_AGE = 3;
export const MAX_AGE = 12;
/** Up to this age every sentence is read aloud by itself; later only tasks with numbers up to 20 and on 🔊. */
export const READ_ALOUD_UNTIL = 8;

export const ANIMALS = ["🐰", "🦊", "🐼", "🐨", "🦁", "🐯", "🐸", "🐢", "🦄", "🐬", "🦒", "🐘", "🦘", "🐧", "🦉", "🐙", "🦖", "🐝", "🦋", "🐞"];

function read() {
  const p = store.get(KEY, null);
  return p && p.v === 1 && Array.isArray(p.kids) ? p : { v: 1, current: null, kids: [] };
}
const write = (p) => store.set(KEY, p);

/** Age in whole years today, or null. */
export function age(kid, now = new Date()) {
  if (!kid?.age) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(kid.ageSince || "");
  if (!m) return kid.age;
  const [y, mo, d] = m.slice(1).map(Number);
  const before = now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d);
  return kid.age + Math.max(0, now.getFullYear() - y - (before ? 1 : 0));
}

export const all = () => read().kids;
export const get = (id) => all().find((k) => k.id === id) ?? null;

/** The child playing now, or null (a guest). */
export function current() {
  const p = read();
  return p.kids.find((k) => k.id === p.current) ?? null;
}

export function choose(id) {
  const p = read();
  p.current = id && p.kids.some((k) => k.id === id) ? id : null;
  write(p);
}

const clean = ({ name, age: a, animal }) => ({
  name: String(name || "").trim().slice(0, 20),
  age: Math.min(MAX_AGE, Math.max(MIN_AGE, Math.round(Number(a) || MIN_AGE))),
  animal: ANIMALS.includes(animal) ? animal : ANIMALS[0],
});

export function add(kid) {
  const p = read();
  let id;
  do id = "k" + Math.random().toString(36).slice(2, 8);
  while (p.kids.some((k) => k.id === id));
  p.kids.push({ id, ...clean(kid), ageSince: today(), created: today() });
  p.current = id;
  write(p);
  return id;
}

export function update(id, changes) {
  const p = read();
  const kid = p.kids.find((k) => k.id === id);
  if (!kid) return;
  const newAge = changes.age !== undefined && Number(changes.age) !== age(kid);
  Object.assign(kid, clean({ ...kid, ...changes, age: newAge ? changes.age : kid.age }));
  if (newAge) kid.ageSince = today();
  write(p);
}

export function remove(id) {
  const p = read();
  p.kids = p.kids.filter((k) => k.id !== id);
  if (p.current === id) p.current = null;
  write(p);
  store.remove(`learner:${id}`);
}

/** Does every sentence read itself aloud for this child, on a map of this band? Who plays decides: the preschool
 *  maps (the Tal) read everything aloud, the school maps (Fluss, Feld, Berg) only on a tap on 🔊. The parents can
 *  switch it on everywhere (or, from earlier, off everywhere). Without a band (Home): by age. A guest: yes. */
export function readAloud(kid, band) {
  if (typeof kid?.readAloud === "boolean") return kid.readAloud;
  if (band) return band === "vorschule";
  const a = age(kid);
  return a === null || a < READ_ALOUD_UNTIL;
}

/** The parents' choice for reading aloud: true, false, or null (by age again). */
export function setReadAloud(id, value) {
  const p = read();
  const kid = p.kids.find((k) => k.id === id);
  if (!kid) return;
  if (typeof value === "boolean") kid.readAloud = value;
  else delete kid.readAloud;
  write(p);
}
