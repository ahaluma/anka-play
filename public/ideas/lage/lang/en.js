// Sätze/sentences of the idea "lage", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/lage/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  lage: {
    intro: {
      sehen: "Who is where? Tap the right animal.",
      machen: "Put the animal in the right place.",
      forschen: "Where is the animal? Find the right word.",
      anwenden: "The animals are sitting on the bench.",
      pruefen: "The owl says where the animal is. Is that right?",
    },
    pets: {
      rabbit: ["the rabbit", "the rabbit"], cat: ["the cat", "the cat"], dog: ["the dog", "the dog"],
      bear: ["the bear", "the bear"], fox: ["the fox", "the fox"], frog: ["the frog", "the frog"],
      duck: ["the duck", "the duck"], mouse: ["the mouse", "the mouse"], pig: ["the pig", "the pig"],
      panda: ["the panda", "the panda"], lion: ["the lion", "the lion"],
    },
    words: { auf: "on", unter: "under", neben: "next to", vor: "in front", hinter: "behind", links: "left", rechts: "right" },
    where: {
      auf: "on the table", unter: "under the table", neben: "next to the table", links: "to the left of the table",
      rechts: "to the right of the table", vor: "in front of the table", hinter: "behind the table",
    },
    to: {
      auf: "on the table", unter: "under the table", neben: "next to the table", links: "to the left of the table",
      rechts: "to the right of the table", vor: "in front of the table", hinter: "behind the table",
    },
    sehen: {
      ask: (where) => `Who is ${where}?`,
      miss: (pet, where) => `${big(pet)} is ${where}.`,
      done: (pet, where) => `${big(pet)} is ${where}.`,
      hint: (where) => `Look, here is ${where}.`,
    },
    machen: {
      ask: (pet, to) => `Put ${pet} ${to}!`,
      miss: (where) => `That is ${where}.`,
      done: (pet, where) => `${big(pet)} is sitting ${where} now.`,
      hint: (where) => `Look, here is ${where}.`,
    },
    forschen: {
      ask: (pet) => `Where is ${pet}?`,
      miss: (pet, where) => `Is ${pet} really ${where}? Look closely.`,
      done: (pet, where) => `${big(pet)} is ${where}.`,
      hint: "Look at the glowing animal. Where is it, seen from the table?",
    },
    anwenden: {
      between: (a, b) => `Who is sitting between ${a} and ${b}?`,
      leftOf: (a) => `Who is sitting just left of ${a}?`,
      rightOf: (a) => `Who is sitting just right of ${a}?`,
      isBetween: (pet, a, b) => `${big(pet)} is sitting between ${a} and ${b}.`,
      isLeftOf: (pet, a) => `${big(pet)} is sitting just left of ${a}.`,
      isRightOf: (pet, a) => `${big(pet)} is sitting just right of ${a}.`,
      missNamed: (pet) => `That is ${pet} from the question. We are looking for another animal.`,
      miss: "Look again at who is sitting there.",
      hintBetween: "Find the two glowing animals. Who is sitting in the middle?",
      hintSide: "Find the glowing animal. Left is where your left hand is: thumb and finger make an L.",
    },
    pruefen: {
      question: (pet, where) => `The owl says: ${pet} is ${where}. Is that right?`,
      right: (pet, where) => `Yes, ${pet} is ${where}.`,
      lookAgain: "Look again closely where the animal is.",
      fix: (pet) => `Right, that is not true. Where is ${pet} really?`,
      fixMiss: (pet, where) => `Is ${pet} really ${where}?`,
      fixed: (pet, where) => `Now it is right: ${pet} is ${where}.`,
      hint: "Look at the glowing animal, then at the table.",
    },
  },
};
