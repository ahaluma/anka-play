// Sätze/sentences of the idea "lage", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/lage/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  lage: {
    intro: {
      sehen: "Wer ist wo? Tipp auf das richtige Tier.",
      machen: "Setz das Tier an den richtigen Platz.",
      forschen: "Wo ist das Tier? Such das richtige Wort.",
      anwenden: "Die Tiere sitzen auf der Bank.",
      pruefen: "Die Eule sagt, wo das Tier ist. Stimmt das?",
    },
    // [wer?, wem?]
    pets: {
      rabbit: ["der Hase", "dem Hasen"], cat: ["die Katze", "der Katze"], dog: ["der Hund", "dem Hund"],
      bear: ["der Bär", "dem Bären"], fox: ["der Fuchs", "dem Fuchs"], frog: ["der Frosch", "dem Frosch"],
      duck: ["die Ente", "der Ente"], mouse: ["die Maus", "der Maus"], pig: ["das Schwein", "dem Schwein"],
      panda: ["der Panda", "dem Panda"], lion: ["der Löwe", "dem Löwen"],
    },
    words: { auf: "auf", unter: "unter", neben: "neben", vor: "vor", hinter: "hinter", links: "links", rechts: "rechts" },
    where: {
      auf: "auf dem Tisch", unter: "unter dem Tisch", neben: "neben dem Tisch", links: "links neben dem Tisch",
      rechts: "rechts neben dem Tisch", vor: "vor dem Tisch", hinter: "hinter dem Tisch",
    },
    to: {
      auf: "auf den Tisch", unter: "unter den Tisch", neben: "neben den Tisch", links: "links neben den Tisch",
      rechts: "rechts neben den Tisch", vor: "vor den Tisch", hinter: "hinter den Tisch",
    },
    sehen: {
      ask: (where) => `Wer ist ${where}?`,
      miss: (pet, where) => `${big(pet)} ist ${where}.`,
      done: (pet, where) => `${big(pet)} ist ${where}.`,
      hint: (where) => `Schau, hier ist ${where}.`,
    },
    machen: {
      ask: (pet, to) => `Setz ${pet} ${to}!`,
      miss: (where) => `Das ist ${where}.`,
      done: (pet, where) => `${big(pet)} sitzt jetzt ${where}.`,
      hint: (where) => `Schau, hier ist ${where}.`,
    },
    forschen: {
      ask: (pet) => `Wo ist ${pet}?`,
      miss: (pet, where) => `Ist ${pet} wirklich ${where}? Schau genau hin.`,
      done: (pet, where) => `${big(pet)} ist ${where}.`,
      hint: "Schau auf das leuchtende Tier. Wo ist es, vom Tisch aus?",
    },
    anwenden: {
      between: (a, b) => `Wer sitzt zwischen ${a} und ${b}?`,
      leftOf: (a) => `Wer sitzt links neben ${a}?`,
      rightOf: (a) => `Wer sitzt rechts neben ${a}?`,
      isBetween: (pet, a, b) => `${big(pet)} sitzt zwischen ${a} und ${b}.`,
      isLeftOf: (pet, a) => `${big(pet)} sitzt links neben ${a}.`,
      isRightOf: (pet, a) => `${big(pet)} sitzt rechts neben ${a}.`,
      missNamed: (pet) => `Das ist ${pet} aus der Frage. Gesucht ist ein anderes Tier.`,
      miss: "Schau noch einmal, wer genau da sitzt.",
      hintBetween: "Such die beiden Tiere, die leuchten. Wer sitzt in der Mitte?",
      hintSide: "Such das Tier, das leuchtet. Links ist da, wo deine linke Hand ist: Daumen und Zeigefinger machen ein L.",
    },
    pruefen: {
      question: (pet, where) => `Die Eule sagt: ${big(pet)} ist ${where}. Stimmt das?`,
      right: (pet, where) => `Ja, ${pet} ist ${where}.`,
      lookAgain: "Schau noch einmal genau, wo das Tier ist.",
      fix: (pet) => `Richtig, das stimmt nicht. Wo ist ${pet} wirklich?`,
      fixMiss: (pet, where) => `Ist ${pet} wirklich ${where}?`,
      fixed: (pet, where) => `Jetzt stimmt es: ${big(pet)} ist ${where}.`,
      hint: "Schau auf das leuchtende Tier und dann auf den Tisch.",
    },
  },
};
