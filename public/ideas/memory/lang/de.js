// Sätze von "Zahlen-Memory", Deutsch. v = die Werte, h = Helfer (h.w(3) = "drei", h.thing(id).many = "Äpfel").
export default {
  memory: {
    intro: { spielen: "Zahlen-Memory! Finde, was zusammengehört." },
    spielen: {
      ask: "Finde die Zahl und die Bilder, die zusammengehören!",
      card: (v, h) => (v.kind === "number" ? h.w(v.n) : v.n === 1 ? h.thing(v.thing).one : `${h.w(v.n)} ${h.thing(v.thing).many}`),
      match: (v, h) => `Das passt! ${h.big(h.w(v.n))}.`,
      miss: "Das passt nicht.",
      right: "Alle Paare gefunden!",
      hint: "Tipp auf eine Zahl. Dann such die Karte mit so vielen Bildern.",
    },
  },
};
