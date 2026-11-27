// Sätze/sentences of the idea "form", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/form/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  form: {
    intro: {
      sehen: "Do you know the shapes? Tap the right one.",
      machen: "Build the picture from shapes.",
      forschen: "Find all shapes of one kind.",
      anwenden: "Shapes are everywhere. Which shape is it?",
      pruefen: "The owl says what the shape is called. Is that right?",
    },
    names: {
      kreis: { name: "circle", the: "the circle", a: "a circle", many: "circles" },
      dreieck: { name: "triangle", the: "the triangle", a: "a triangle", many: "triangles" },
      quadrat: { name: "square", the: "the square", a: "a square", many: "squares" },
      rechteck: { name: "rectangle", the: "the rectangle", a: "a rectangle", many: "rectangles" },
    },
    facts: {
      kreis: "A circle is all round and has no corners.",
      dreieck: "A triangle has three corners and three sides.",
      quadrat: "A square has four corners and four sides of the same length, even when it is tilted.",
      rechteck: "A rectangle has four corners: two long and two short sides.",
    },
    pictures: { haus: "the house", schneemann: "the snowman", baum: "the tree", eis: "the ice cream", auto: "the car", boot: "the boat", rakete: "the rocket", roboter: "the robot", zug: "the train" },
    things: { uhr: "the clock", keks: "the cookie", donut: "the doughnut", muenze: "the coin", pizza: "the slice of pizza", kaese: "the piece of cheese", sandwich: "the sandwich", segel: "the sail", fenster: "the window", waffel: "the waffle", wuerfel: "the side of the dice", tuer: "the door", buch: "the book", brief: "the letter", handy: "the phone" },
    sehen: {
      ask: (the) => `Tap ${the}!`,
      miss: (a, fact) => `That is ${a}. ${fact}`,
      done: (a, fact) => `That is ${a}. ${fact}`,
    },
    machen: {
      ask: (picture) => `Build ${picture}! Which shape fits the glowing part?`,
      next: "And now the next part.",
      miss: (a, fact) => `${big(a)} does not fit here. ${fact}`,
      done: (picture) => `Done! You built ${picture}.`,
      hint: (fact) => `Look at the glowing part. ${fact}`,
    },
    forschen: {
      ask: (many) => `Find all the ${many}!`,
      miss: (a, fact) => `That is ${a}. ${fact}`,
      done: (n, many) => `You found them all: ${n} ${many}.`,
      hint: "Some are small or turned.",
    },
    anwenden: {
      ask: (thing) => `Which shape is ${thing}?`,
      miss: (fact) => `${fact} Does that fit?`,
      done: (thing, a) => `${big(thing)} is like ${a}.`,
      hint: "Run your finger along the edge. Are there corners? How many?",
    },
    pruefen: {
      question: (a) => `The owl says: That is ${a}. Is that right?`,
      right: (a, fact) => `Yes, that is ${a}. ${fact}`,
      lookAgain: (fact) => `${fact} Is it like that here?`,
      isRight: (fact) => `Look again. ${fact}`,
      fix: "Right, that is not true. What is the shape called?",
      fixMiss: (fact) => `${fact} Does that fit?`,
      fixed: (a) => `Now it is right: That is ${a}.`,
      hint: "Count the corners. Are all sides the same length?",
    },
  },
};
