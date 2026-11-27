// Speaking and showing. Every sentence is shown, so a child or a parent can read it when the phone has no
// voice for the language. The question of a task goes into a box that stays until the next task; what comes
// later (a miss, the hint, praise) goes into the caption under it. See docs/DESIGN.md, section 2:
//
//   - tasks whose numbers are all up to 20 are read aloud; up to 8 years every sentence is (profiles.readAloud);
//   - while the voice reads the question, the board takes no taps (body.listening), at most LONGEST ms:
//     a phone whose voice never says "end" cannot lock a child out.
//
//   voice.mount({ caption, question })   once per screen
//   voice.aloud = true / false           does the voice read by itself now?
//   await voice.tell(text)               the caption
//   await voice.ask(text)                a part of the question
//   await voice.ask(text, true, true)    a new question in the middle of a task: it takes the old one's place
//   voice.tell(text, false), voice.ask(text, false)   read aloud only: the board shows the words itself (the Berg)
//   voice.newTask() / voice.clear()      a new task: the box empties / leave the round
//   voice.again()                        the 🔊 button: the whole question, or the last sentence

import { LANGS, lang } from "../i18n.js";

const LONGEST = 10000;
const wanted = [LANGS[lang].voice, ...(LANGS[lang].fallbackVoices ?? [])];
let chosen = null;

function pickVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = speechSynthesis.getVoices();
  chosen = null;
  for (const code of wanted) {
    chosen =
      voices.find((v) => v.lang.replace("_", "-") === code && v.localService) ||
      voices.find((v) => v.lang.replace("_", "-") === code) ||
      voices.find((v) => v.lang.startsWith(code.slice(0, 2))) ||
      null;
    if (chosen) return;
  }
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.addEventListener("voiceschanged", pickVoice);
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** Time to read a sentence by oneself. */
const readTime = (text) => Math.min(2500, 600 + text.length * 25);

/** Reads a sentence aloud now. Resolves when the voice is done (or could be). */
export function speak(text) {
  if (!text || !("speechSynthesis" in window)) return pause(text ? 1200 : 0);
  if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = chosen ? chosen.lang : wanted[0];
  if (chosen) u.voice = chosen;
  u.rate = 0.9; // a little slower for small children
  u.pitch = 1.1;
  const ended = new Promise((resolve) => {
    u.onend = resolve;
    u.onerror = resolve;
  });
  speechSynthesis.speak(u);
  return Promise.race([ended, pause(1500 + text.length * 90)]);
}

export function hush() {
  if ("speechSynthesis" in window && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
}

let caption = null;
let box = null;
let parts = [];
let task = 0;
let open = 0;
let last = "";

const lock = (on) => document.body.classList.toggle("listening", on);
const draw = () => {
  if (!box) return;
  box.textContent = parts.join(" ");
  box.hidden = !parts.length;
};

export const voice = {
  aloud: true,

  mount({ caption: c = null, question = null }) {
    caption = c;
    box = question;
    parts = [];
    open = 0;
    task++;
    lock(false);
    draw();
  },

  /** A sentence in the caption. */
  tell(text, show = true) {
    last = text;
    if (caption && show) caption.textContent = text;
    const said = this.aloud ? speak(text) : null;
    return said ? Promise.all([said, pause(Math.min(900, readTime(text)))]) : pause(readTime(text));
  },

  /** A part of the question: into the box, read aloud with the board locked. */
  ask(text, show = true, fresh = false) {
    if (!text) return Promise.resolve();
    if (fresh) parts = []; // a new question in the middle of a task takes the place of the old one
    if (caption) caption.textContent = "";
    if (show) {
      parts.push(text);
      draw();
      last = parts.join(" ");
    } else last = text;
    if (!this.aloud) return pause(readTime(text));
    const said = speak(text);
    const mine = task;
    open++;
    lock(true);
    const free = () => {
      if (mine !== task) return;
      open = Math.max(0, open - 1);
      if (!open) lock(false);
    };
    Promise.race([said, pause(LONGEST)]).then(free, free);
    return said;
  },

  newTask() {
    task++;
    parts = [];
    open = 0;
    lock(false);
    draw();
    if (caption) caption.textContent = "";
  },

  clear() {
    this.newTask();
    hush();
  },

  again() {
    return speak(parts.length ? parts.join(" ") : last);
  },
};
