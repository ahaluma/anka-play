// Sätze/sentences of the idea "folge", English. Ported from think-lab (welt/lang/en.js) as they were:
// the board (ideas/folge/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1);

export default {
  folge: {
    intro: {
      sehen: "What was first? Look at the pictures.",
      machen: "Put the picture story in the right order.",
      forschen: "What happens next? Think first!",
      anwenden: "Who is first, who is second?",
      pruefen: "The owl laid out a story. Is that right?",
    },
    stories: {
      flower: ["A seed goes into the soil.", "A little shoot grows.", "The flower blooms."],
      chick: ["An egg.", "The chick hatches.", "The chick is here!"],
      rain: ["Clouds come.", "It rains.", "A rainbow!"],
      sleep: ["I brush my teeth.", "I go to bed.", "I am fast asleep."],
      egg: ["A raw egg.", "The egg fries in the pan.", "Yummy!"],
      growup: ["A baby.", "A child.", "A woman.", "A grandma."],
      hen: ["An egg.", "The chick hatches.", "A little chick.", "A big hen."],
      tree: ["A seed goes into the soil.", "A little shoot grows.", "The plant gets bigger.", "A big tree!"],
      cake: ["Eggs and flour.", "We stir the batter.", "The cake is ready.", "We eat a piece."],
      soup: ["We wash the vegetables.", "We cut them small.", "The food is cooking.", "Yummy, we eat!"],
      shoes: ["Bare feet.", "First the socks.", "Then the shoes.", "Off we go!"],
    },
    ends: {
      flower: "The seed has become a flower!",
      chick: "A chick has hatched from the egg!",
      rain: "After the rain comes the rainbow!",
      sleep: "Good night!",
      egg: "The egg has become a fried egg!",
      growup: "That's how we slowly grow up!",
      hen: "The chick has become a hen!",
      tree: "The seed has become a tree!",
      cake: "Yummy, cake!",
      soup: "The vegetables have become a meal!",
      shoes: "Now I can go outside!",
    },
    sehen: {
      ask: "What was first? Tap it.",
      miss: "That comes later. What was before?",
      hint: "What has to be there first, so the other can come?",
    },
    machen: {
      ask: "Lay out the story! Tap the picture that comes first, then always the next one.",
      missFirst: "That does not come first. How does the story begin?",
      miss: "That does not come yet. What happens next?",
      hint: "The picture that wiggles comes next.",
    },
    forschen: {
      ask: "What happens next?",
      askBack: "What was before?",
      missOther: "That belongs to another story.",
      missBefore: "That was already before. What comes next?",
      missAfter: "That only comes later. What was before?",
      hint: "Tell the story from the start. What goes in this place?",
    },
    anwenden: {
      places: ["first", "second", "third", "fourth", "fifth"],
      last: "last",
      ask: (place) => `The animals run to the flag. Who is ${place}?`,
      askLast: "The animals run to the flag. Who is last?",
      miss: (pet, place) => `${big(pet)} is ${place}.`,
      done: (pet, place) => `${big(pet)} is ${place}.`,
      hint: "Count from the flag: one, two, three …",
    },
    pruefen: {
      says: "That is the story!",
      question: "The owl laid out the story. Is the order right?",
      right: "Yes, the order is right.",
      lookAgain: "Tell the story picture by picture. Does it all fit?",
      isRight: "Tell it again: every picture is in the right place.",
      fix: "Well spotted! Lay the story out right.",
      fixMiss: "That does not come yet. How does the story go?",
      fixed: "Now it is right.",
      hint: "What has to happen first? What comes at the end?",
    },
  },
  // the animals and their names, shared with the idea "lage" (the row of animals in anwenden)
  lage: {
    pets: {
      rabbit: ["the rabbit", "the rabbit"], cat: ["the cat", "the cat"], dog: ["the dog", "the dog"],
      bear: ["the bear", "the bear"], fox: ["the fox", "the fox"], frog: ["the frog", "the frog"],
      duck: ["the duck", "the duck"], mouse: ["the mouse", "the mouse"], pig: ["the pig", "the pig"],
      panda: ["the panda", "the panda"], lion: ["the lion", "the lion"],
    },
  },
};
