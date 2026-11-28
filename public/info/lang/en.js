// The info page for parents (/info/), English: every world, every station, what children learn there, and why it
// is built this way. Names of worlds, stations and ways come from the shared words (lang/en.js), order and icons
// from content/universe.js. Only what is not there is written here.
// tools/check-engine.mjs checks that every station has a text here, shaped like the German one.
export default {
  title: "What your child learns",
  intro: [
    "AnkaPlay is a maths and thinking game for children from 3 to 12. It has four worlds. Each world is a landscape with stations. Each station trains one idea from mathematics, some of them two.",
    "This page says what your child does at each station and what they learn there. At the end it says why the game is built this way.",
  ],
  contents: "Contents",
  back: "Back to the parents' area",
  ageOf: { tal: "ages 3 to 6", fluss: "from age 6", feld: "from age 6", berg: "ages 9 to 12" },

  // ---------- How the game works
  basics: {
    h: "How your child plays",
    p: [
      "Your child picks a station on the map. There they play a round: 5 tasks, 3 in the valley. Each idea has up to five ways to play. Each way shows the same idea from another side:",
    ],
    after: [
      "A round with 4 of 5 tasks right at the first try earns a star ⭐ for that way. Once a station has enough stars, bigger numbers or harder tasks come. After two weak rounds it goes one level back. After three mistakes in a row an easier task comes.",
      "The owl guides your child. She stays at a station until every way there has been tried and has its star. Only then does she show the way to the next station that is related to it.",
      "There are no points, no clock and no streaks of days. A mistake is explained, not punished.",
    ],
  },

  // The five ways, as they are called in the valley, at the river and at the field. Their names come from lang/en.js.
  ways: {
    sehen: "A picture shows the idea. Your child looks and answers.",
    machen: "Your child lays, drags or builds it themselves.",
    forschen: "Something changes. Your child first thinks about what will happen, then looks.",
    anwenden: "The idea comes up in a new situation.",
    pruefen: "The owl has given an answer. Is it right? Often she makes a typical mistake.",
  },

  // ---------- The worlds
  maps: {
    tal: [
      "The valley is for children who cannot read or calculate yet. There are no signs like + or −, and no task goes above 20. Most stations stay with numbers up to 10.",
      "Everything is read aloud. While the voice speaks, the game waits before taps count (10 seconds at most). Your child answers by tapping pictures and things; they never have to write. Almost every task has a picture. For every round played, a flower grows at the station.",
    ],
    fluss: [
      "The river is for school children: the number line and rounding, tens and ones up to a million, shapes and solids, measures and units, area and plans, buildings of cubes, data and chance, clock and calendar. It opens at 6, or earlier once the meadow and the pond in the valley are mastered.",
      "Here your child reads by themselves; things are read aloud only when they tap 🔊 (or when you switch on “Read aloud everywhere” in the parents' area). Up to 10 they tap the answer, from 20 on they type it on a number pad. After the second mistake a hint shows where to look, after that a picture helps.",
    ],
    feld: [
      "At the field your child calculates: plus, minus, times, divide, money, word problems and written calculation. Like the river it opens at 6; the bridge from the footbridge leads across.",
      "The first time across the bridge, the game asks three short tasks, for example 3 + 6, 8 + 5 and 23 + 40. The answers only decide where your child starts; the way is always open.",
      "The four calculating stations all have the same five ways:",
    ],
    feldWays: {
      sehen: "A picture shows the whole task. Your child reads the result from it.",
      machen: "Your child lays out the task themselves, with dots, rods and plates, rows or little bags, and then checks.",
      forschen: "Several tasks in a row that change only a little. How does it go on? Or the same numbers the other way round (8 + 5 = 13, so 13 − 5 = 8).",
      anwenden: "Just numbers, sometimes with a gap (3 + ? = 7).",
      pruefen: "The owl has calculated. Is it right? Her mistakes are the ones children often make.",
    },
    feldAfter: [
      "Each operation has four number ranges: up to 10, up to 20, up to 100, up to 1000. Each range has small sub-steps (listed below at each station). A good round moves one sub-step on. The stars come on the top sub-step, when everything comes mixed.",
      "One of the five tasks of a round comes from the range below. In “Use”, the last task comes back the other way round (first 8 + 5, then 13 − 5). Basic facts (like 8 + 5) go into a learning box: what still wobbles or takes long comes back soon, what is secure comes back only after days or weeks.",
      "After a mistake the game says what to look at (for example: “Look at the ten”). After the second mistake the picture comes, after the third the way in small steps. If your child makes the same mistake more often, the next round starts with three practice tasks on exactly that.",
    ],
    berg: [
      "The mountain is for children from 9 to 12 who like puzzles. The tasks are like those of maths competitions for this age. The mountain opens at 9. It opens earlier once the basics at the river and the field are mastered (footbridge, flower field, apple tree, berries), or when you open it in the parents' area.",
      "The mountain has twelve camps and the top. Each camp trains one thinking strategy. A camp comes out of the fog once the camps below it are mastered. Each camp has four levels (listed below at each camp), and every child starts at level 1. The pages look like a squared notebook, and the text is the diary of an expedition.",
      "Here the five ways have other names:",
    ],
    bergWays: {
      sehen: "A task with a picture. Your child works out what it is about.",
      machen: "Your child lays out, builds or plays through the task themselves.",
      forschen: "First small cases, then bigger ones. In a table the rule becomes visible.",
      anwenden: "The same strategy in a completely different story.",
      pruefen: "The owl answers quickly and confidently. Is she right? If not: why was she wrong?",
    },
    bergAfter: [
      "After each solved task the mountain shows which other strategies work here too. Once your child has mastered a camp, every round has one task from there, so nothing is forgotten. On the higher levels some tasks join the strategy with the one of an earlier camp. After each round the mountain asks: “How was that for you?” A weak round that felt hard leads one level back.",
    ],
  },

  // ---------- The stations
  // idea: what it is about · ways: what each way shows (only valley and river, the farm stand and the barn) ·
  // steps: the levels · learns: what your child learns there
  labels: { ways: "How it is played", steps: "Levels", learns: "What your child learns" },
  stations: {
    // Valley
    wiese: {
      idea: "A number says how many there are. More, fewer, the same.",
      ways: {
        sehen: "Flowers on the meadow: how many are there? From the second round on they are shown only briefly. So your child learns to see small amounts at a glance.",
        machen: "Pick a given number of flowers into the basket. Two counters show how many are still on the meadow and how many are in the basket.",
        forschen: "Stepping stones in the stream with numbers, one is missing. Sometimes the frog hops backwards. Or the stones are mixed up and your child lays the way, smallest number first.",
        anwenden: "Where are there more, where fewer? One comes or goes: how many are there now? Make both sides the same.",
        pruefen: "The owl has counted. Is she right, or off by one?",
      },
      steps: "Numbers up to 5, then up to 10.",
      learns: "Counting reliably, seeing small amounts at a glance, numbers in the right order, forwards and backwards, comparing amounts.",
    },
    bau: {
      idea: "Numbers are made of numbers: 5 is 3 and 2, or 4 and 1.",
      ways: {
        sehen: "Animals go into the burrow. Some can be seen outside: how many are inside?",
        machen: "Share things out onto two leaves, in two different ways.",
        forschen: "Shake the apple tree: some apples fall down. How many stay up?",
        anwenden: "A small scene: the whole and one part are known, the other part is missing.",
        pruefen: "The owl says: “3 and 2 make 6.” Is that right?",
      },
      steps: "Numbers from 3 to 5, then from 6 to 10.",
      learns: "Splitting a number into two parts, in different ways. This is the ground for plus and minus, before there are any signs.",
    },
    baumstumpf: {
      idea: "Number memory: a card with a number and a card with that many things belong together.",
      ways: {
        spielen: "At first all cards lie face up, and your child only looks for the pairs. Later they lie face down, as in real memory. A round without a mistake moves on.",
      },
      steps: "With 3 to 6 pairs and numbers up to 20 at most. Where it starts depends on age. It is a game: always open, without stars.",
      learns: "Linking a number and an amount, remembering things.",
    },
    teich: {
      idea: "Two numbers fill it up together: first the hand (5), then the ten frame (10).",
      ways: {
        sehen: "Frogs sit on water lily leaves. How many leaves are still free?",
        machen: "There are already some nuts in the nut box. Fill it right up.",
        forschen: "A staircase of pairs: one more here, one fewer there. Which number is missing?",
        anwenden: "Which number fills it up?",
        pruefen: "The owl names two numbers. Do they fill it up together?",
      },
      steps: "Friends of five, then friends of ten.",
      learns: "The pairs that make 5 and 10, by heart and with a picture. With them your child will later calculate across 10 (8 + 5 = 8 + 2 + 3).",
    },
    obstbaum: {
      idea: "Sharing fairly: everyone gets the same number.",
      ways: {
        sehen: "Each nest has the same number of eggs. A hen sits on one nest: how many eggs are under her?",
        machen: "Share food out to the animals so that each gets the same.",
        forschen: "Think first: does it share out fairly, or is something left over?",
        anwenden: "Cherries in the grass, each bird gets so many. For how many birds is there enough?",
        pruefen: "The owl has shared. Is it fair?",
      },
      steps: "Up to 6 things to share, then up to 10.",
      learns: "Seeing and making groups of the same size, sharing fairly, the rest. This is the idea behind times and divide.",
    },
    wald: {
      idea: "A row always goes on in the same way, because one piece keeps coming back.",
      ways: {
        sehen: "A row stops. What comes next?",
        machen: "Lay the row on yourself.",
        forschen: "The row is a rhythm of clapping, stamping and patting the knees. Listen, join in: what comes next?",
        anwenden: "A bead is missing in the middle of a necklace. Which one belongs there?",
        pruefen: "The owl lays a row. One thing may be wrong: which one?",
      },
      steps: "Level 1: two things taking turns. Level 2: a piece of three things. Level 3: longer pieces.",
      learns: "Finding the rule in a pattern and continuing it. Working with number sequences later builds on this.",
    },
    himmel: {
      idea: "First and then: picture stories in the right order, first, second, third.",
      ways: {
        sehen: "Two pictures from a story. Which came first?",
        machen: "Tap the pictures of a story in order.",
        forschen: "What happens next? Later also: what came before?",
        anwenden: "Animals stand in a line. Who is first, second, last?",
        pruefen: "The owl has laid out a story. Is the order right?",
      },
      steps: "Level 1: stories of three pictures, first and last. Level 2: four pictures and the course of a day, up to the third. Level 3: up to the fifth, and what came before.",
      learns: "Putting events in order, ordinal numbers (the first, the second), before and after.",
    },
    nester: {
      idea: "What belongs together? Sorting by a rule.",
      ways: {
        sehen: "One thing: which basket does it go in?",
        machen: "Sort six things one by one into the baskets.",
        forschen: "Four things, three belong together. Which one does not fit?",
        anwenden: "The baskets have no label. Your child finds the rule and puts the new thing in the right one.",
        pruefen: "The owl has sorted. One thing may be in the wrong basket.",
      },
      steps: "Level 1: by kind (animal, fruit, vehicle). Level 2: also by colour. Level 3: also by size, with three baskets.",
      learns: "Noticing features, ordering by a rule, finding a rule.",
    },
    pfuetze: {
      idea: "Looking closely: finding differences, copying, remembering.",
      ways: {
        sehen: "Two pictures. What is different?",
        machen: "Copy a pattern on a grid exactly.",
        forschen: "The pattern is shown only briefly. Then copy it from memory.",
        anwenden: "Which picture is exactly the same as the model?",
        pruefen: "The owl says: “The pictures are the same.” Is that right?",
      },
      steps: "Level 1: 2 × 2 squares, one difference. Level 2: 3 × 3 squares. Level 3: two differences, with pictures that look alike.",
      learns: "Comparing exactly, position on a grid, remembering a picture.",
    },
    huegel: {
      idea: "Where is it? On, under, next to, in front of, behind, left, right, between.",
      ways: {
        sehen: "Animals around a table. Who is under the table?",
        machen: "Put an animal in the right place.",
        forschen: "Where is the hare? Find the right word.",
        anwenden: "Animals on a bench: who sits between, on the left, on the right?",
        pruefen: "The owl says where the animal is. Is that right?",
      },
      steps: "Level 1: on, under, next to. Level 2: also in front of and behind. Level 3: left and right instead of next to, a bench with five animals.",
      learns: "Understanding and using the words for position in space.",
    },
    kiesel: {
      idea: "Circle, triangle, square, rectangle.",
      ways: {
        sehen: "Several shapes: tap the circle.",
        machen: "Build a picture from shapes: the right shape into each outline.",
        forschen: "Find all the triangles among other shapes.",
        anwenden: "Things from everyday life: what shape is the clock?",
        pruefen: "The owl says what the shape is called. Is that right?",
      },
      steps: "Level 1: circle, triangle, square, standing straight. Level 2: also the rectangle, different sizes and colours. Level 3: turned and stretched (a square standing on its corner is still a square).",
      learns: "Recognising and naming shapes, even when they are turned, big or small.",
    },
    ufer: {
      idea: "Longer, taller, heavier, in order of size.",
      ways: {
        sehen: "Which is longer, which is taller, where is more water?",
        machen: "Tap things from the smallest to the biggest.",
        forschen: "The balance: which is heavier? Think first, then weigh. Big is not always heavy.",
        anwenden: "What fits the baby, what the child, what the mum?",
        pruefen: "The owl compares. Is that right?",
      },
      steps: "Level 1: two things, very different. Level 2: three things, also shorter and lower. Level 3: things that are more alike and do not start at one line.",
      learns: "Comparing and ordering by length, height, amount and weight. This prepares measuring.",
    },

    // River
    steg: {
      idea: "Every number has its place. The planks of the footbridge are the number line.",
      ways: {
        sehen: "The frog sits on the footbridge. At which number?",
        machen: "Make the frog hop to a given number.",
        forschen: "Ducklings carry numbers in a row, in steps forwards or backwards. One number is missing.",
        anwenden: "Bigger or smaller? What comes before, what after? Which place is it?",
        pruefen: "The owl compares two numbers. Her mistake: she looks at the last digit first (38 > 52, because 8 > 2).",
      },
      steps: "Numbers up to 20, up to 100, up to 1000.",
      learns: "Finding and placing numbers on the number line, comparing numbers, the number before and after, counting in steps.",
      second: {
        idea: "Rounding means: which round neighbour is nearer? Exactly in the middle you round up. With rounded numbers you calculate quickly about how much, and see whether a result can be right.",
        ways: {
          sehen: "The frog sits at 37. Is 30 or 40 nearer?",
          machen: "Make the frog hop to the nearest round neighbour.",
          forschen: "3☐ is rounded to 40: which digits fit in the box?",
          anwenden: "Estimating: 38 + 47 is about 40 + 50.",
          pruefen: "The owl rounds or has calculated. Her mistakes: rounded down in the middle, rounded to tens instead of hundreds, a result far away from the estimate.",
        },
        steps: "Level 1: two-digit numbers to the ten. Level 2: three-digit numbers to the ten or the hundred. Level 3: estimating with plus, minus and times, checking results.",
        learns: "Rounding, estimating, and checking whether a result makes sense.",
      },
    },
    blumenfeld: {
      idea: "Ten ones make a ten, ten tens make a hundred. Ten flowers become a bunch, ten bunches go into a basket.",
      ways: {
        sehen: "Bunches and single flowers. How many flowers are there?",
        machen: "Lay a number with bunches and flowers.",
        forschen: "One flower more, one bunch more, one fewer: what happens to the number? Say it first, then see.",
        anwenden: "Only numbers in a place-value table: 3 tens and 4 ones. Also turned round (“4 ones and 3 tens”) and with more than nine ones (“2 tens and 13 ones”).",
        pruefen: "The owl has counted. Her typical mistakes: tens and ones swapped (43 instead of 34), one ten too many, the zero forgotten (35 instead of 305).",
      },
      steps: "Up to 20 (3 becomes 13: a ten is added), up to 100, up to 1000 (now with hundreds).",
      learns: "Understanding place value: what a digit means in which place, and why the zero matters.",
      second: {
        idea: "Big numbers in the place-value table, as at school: ten hundreds make a thousand, ten thousands make ten thousand. An empty place is written as 0.",
        ways: {
          sehen: "Counters in the place-value table. Which number is it?",
          machen: "Lay a number with counters. Ten counters in one column become one in the next.",
          forschen: "A counter is added to a column or taken away. Which number comes out? Also across a full column (2 950 and one hundred more).",
          anwenden: "Only numbers: what comes after 9 999? What is 45 300 + 1 000? Which number is bigger?",
          pruefen: "The owl reads the table. Her mistake: she forgets the empty column (35 instead of 3 050) or swaps two digits.",
        },
        steps: "Up to 10 000 (the thousand is new), up to 1 000 000 (ten thousands and hundred thousands).",
        learns: "Carrying place value over to big numbers, reading, writing and comparing big numbers.",
      },
    },
    kiesbank: {
      idea: "Shapes and solids, mirroring, measuring.",
      ways: {
        sehen: "Which shape is this?",
        machen: "The mirror in the water: one half is painted, your child paints the other half exactly the same.",
        forschen: "Count the corners; for solids also the faces and edges.",
        anwenden: "Measure with the ruler: how long is it? Later: how much longer is one than the other?",
        pruefen: "The owl names a shape. Is that right?",
      },
      steps: "Level 1: simple shapes lying straight; the ruler starts at 0. Level 2: shapes with five and six corners, turned shapes; the thing does not lie at 0. Level 3: solids (cube, cuboid, sphere, cylinder, cone, pyramid) and comparing lengths.",
      learns: "Telling shapes and solids apart, symmetry, measuring correctly with a ruler.",
    },
    sonnenfels: {
      idea: "Clock and calendar. The short hand shows the hour, the long hand the minutes.",
      ways: {
        sehen: "What time is it on the clock?",
        machen: "Set the clock to a time.",
        forschen: "Time spans: two clocks, start and end. How long does it take, in hours or minutes?",
        anwenden: "What time is it in 3 hours? Which day is it in 4 days? Which month in 5 months? How many days does April have?",
        pruefen: "The owl reads the clock. Her mistake: she swaps the hands.",
      },
      steps: "Level 1: full hours, days of the week. Level 2: half and quarter hours, months. Level 3: every five minutes, spans across the full hour, days in a month.",
      learns: "Reading and setting the clock, working out time spans, calculating with days and months.",
    },
    muehle: {
      idea: "Measures and units: you measure with equal pieces, the units. A big unit is made of many small ones: 1 m = 100 cm, 1 kg = 1 000 g, 1 l = 1 000 ml. Every thing has a unit that fits it best.",
      ways: {
        sehen: "Which unit fits? A pencil is 15 … cm or m long?",
        machen: "Put pieces together until it is exactly so much.",
        forschen: "Continue a conversion table: 1 m = 100 cm, 2 m = 200 cm, 3 m 40 cm = ? cm.",
        anwenden: "Estimating with known sizes (How heavy is an apple? 15 g, 150 g or 1 500 g?) and short word problems with two units.",
        pruefen: "The owl converts. Her mistakes: the wrong number (1 kg = 100 g), numbers just written side by side (3 m 5 cm = 35 cm), simply added together.",
      },
      steps: "Level 1: length (cm, m). Level 2: weight (g, kg) and volume (ml, l). Level 3: all of them, also mm and km, halves and quarters (½ kg = 500 g).",
      learns: "Building a feel for sizes, choosing the unit that fits, converting.",
    },
    garten: {
      idea: "Area and perimeter: the area is how many slabs lie in the bed. The perimeter is how long the fence all round is. The same number of slabs does not need the same amount of fence.",
      ways: {
        sehen: "How many slabs does the bed have? How many pieces of fence?",
        machen: "Lay a bed: so many slabs (later also so much fence, or a rectangle).",
        forschen: "Two beds: which has more slabs, which needs more fence? Or the same?",
        anwenden: "Rectangles: length times width instead of counting, first still with squares, then only with measures.",
        pruefen: "The owl has counted. Her mistakes: slabs and fence mixed up, only one piece of fence counted at a corner, a slab counted twice.",
      },
      steps: "Level 1: area by counting. Level 2: also counting the fence, and both. Level 3: rectangles with measures, area = length times width.",
      learns: "Telling area and perimeter apart and working them out.",
      second: {
        idea: "Plans: a plan shows from above where things are. A square has a name made of a letter and a number (B3: column B, row 3). A way is a row of steps (→ → ↑). On the plan one square stands for a real length.",
        ways: {
          sehen: "Where is the duck? In which square?",
          machen: "Build a way of arrows from the duck to the nest, round the stones.",
          forschen: "A way of arrows: where does the duck end up? Tap first, then she walks.",
          anwenden: "The scale: one square is 10 m. How far is it from the tree to the house? And back: how many squares are 50 m?",
          pruefen: "The owl names a square. Her mistake: she swaps column and row, or takes the square next to it.",
        },
        steps: "Level 1: naming squares, short ways. Level 2: longer ways round stones, 1 square = 10 m. Level 3: 1 square = 5 m or 100 m, from metres back to squares.",
        learns: "Finding the way on plans, describing ways, calculating with the scale.",
      },
    },
    kisten: {
      idea: "Buildings of cubes: boxes stand on top of each other. A plan from above says in each square how many boxes stand there. The boxes you cannot see carry the ones on top. A net of the cube is six squares that fold into a cube.",
      ways: {
        sehen: "How many boxes are there?",
        machen: "Write the plan: tap each square until the number is right. Next to it the building grows.",
        forschen: "Six squares: do they fold into a cube? Afterwards the game shows which faces are opposite, or where it gets stuck.",
        anwenden: "Which plan from above belongs to the building?",
        pruefen: "The owl counts boxes. Her mistake: she counts only what she sees, or only the top ones.",
      },
      steps: "Level 1: one row, up to 6 boxes. Level 2: two rows, up to 2 high. Level 3: up to 3 rows and 3 high, harder nets.",
      learns: "Picturing space: reading buildings of cubes, turning them into plans, recognising nets of the cube.",
    },
    weide: {
      idea: "Data and chance. You count with tally marks, five in a bundle. A chart shows the counts as bars. With chance you do not know what comes out, but you know what is certain, possible or impossible.",
      ways: {
        sehen: "A tally list: how many birds were there?",
        machen: "Build a chart from a tally list: make each bar as long as there are marks.",
        forschen: "Balls in a bag: which colour will probably come most often? Certain, possible, impossible?",
        anwenden: "Read a chart: how often? How many more? Later with the dice: what is more likely?",
        pruefen: "The owl reads a chart. Her mistake: she reads the bar next to it, or counts the squares wrongly.",
      },
      steps: "Level 1: pictures and tally marks up to 10. Level 2: bars with a scale up to 20. Level 3: a scale in steps of two, up to 30, and the dice.",
      learns: "Collecting and showing data, reading charts, comparing chances.",
    },

    // Field: the ways are given once above, with the world
    apfelbaum: {
      idea: "Plus: adding up apples on the tree.",
      steps: "Up to 10: with pictures, with a gap. Up to 20: doubling, across the ten, with a gap. Up to 100: with tens, tens and ones across the ten, two numbers of tens. Up to 1000: with hundreds, without crossing, with crossing.",
      learns: "Adding with strategies instead of counting on: doubling, across the ten with the friends of ten, tens and ones apart.",
    },
    beeren: {
      idea: "Minus: taking away and finding the difference.",
      steps: "Up to 10: with pictures, with a gap. Up to 20: halving, across the ten, with a gap. Up to 100: with tens, tens and ones across the ten, two numbers of tens. Up to 1000: with hundreds, without crossing, with crossing.",
      learns: "Subtracting as taking away and as distance. Minus as the reverse of plus.",
    },
    huehner: {
      idea: "Times: equal groups, eggs in rows.",
      steps: "Up to 10: equal groups. Up to 20: doubling, the twos to the fives. Up to 100: 1, 2, 5 and 10 times, then the tables of 3, 4, 6, 8, then all. Up to 1000: tens times ones, a number of tens times ones, up to 1000.",
      learns: "Understanding times as equal groups, building the times tables from the easy core facts.",
    },
    nussbaum: {
      idea: "Divide: sharing nuts fairly and packing them into little bags.",
      steps: "Up to 10: sharing fairly. Up to 20: calculating the other way round. Up to 100: by 1, 2, 5 and 10, then all the times tables, then with a rest. Up to 1000: dividing tens, up to 1000.",
      learns: "Dividing as sharing out and as packing into groups, divide as the reverse of times, the rest.",
    },
    lichtung: {
      idea: "Short word problems in which everything comes together. The clearing opens once plus and minus up to 10 have all their stars.",
      ways: {
        anwenden: "Listen to a story and solve it. The stories use only operations and number ranges your child has already mastered.",
      },
      steps: "Level 1: one step. Level 2: which operation fits? Level 3: two steps. Level 4: two steps and a number you do not need. Level 5: thinking backwards.",
      learns: "Finding the calculation in a text, planning several steps, leaving out what does not matter.",
    },
    scheune: {
      idea: "Written calculation: the numbers stand exactly under each other, ones under ones. You calculate place by place from the right. Ten in one place become a carry; if there is too little, you trade a ten for ten ones. The barn opens at 8 or once plus and minus up to 100 are mastered.",
      ways: {
        sehen: "One column is next: what do you write below, what moves on? Or: which of three sums is written correctly under each other?",
        machen: "Calculate yourself, column by column from the right. If there is too little on top in a minus, your child taps “Trade” themselves.",
        forschen: "In a finished sum one digit is missing. Which one? For that you calculate backwards.",
        anwenden: "A short story from the farm (apples, potatoes, flour). The sum is already written under each other, your child works it out.",
        pruefen: "The owl has calculated in writing. Her mistakes: the carry forgotten, the numbers shifted, in a minus the smaller digit taken from the bigger one instead of trading, a zero or the rest of a place forgotten.",
      },
      steps: "Level 1: plus. Level 2: minus. For both first two digits, then three digits, then several carries. Level 3: times, a two- or three-digit number times one digit. Level 4: divided by one digit, without a rest, then with a rest. Like the other calculating stations, each level has sub-steps; the stars come when everything comes mixed.",
      learns: "Understanding the written methods instead of only carrying them out: why the carry, why trading a ten, why the places stand under each other.",
    },
    hofstand: {
      idea: "Money: counting euro coins and notes, paying, change.",
      ways: {
        sehen: "Coins and notes are on the counter. How much money is it?",
        machen: "Pay a price exactly.",
        forschen: "Pay the same price in two different ways.",
        anwenden: "Shopping: what do both cost together? How much change is there? Is the money enough?",
        pruefen: "The owl counts the money. Her typical mistake: she counts the coins instead of their value.",
      },
      steps: "Up to 10 € (1 and 2 euro coins, the 5 euro note), up to 20 € (also 10 €), up to 100 € (also 20 € and 50 €). Then cents: all coins up to 5 €, written with a point. The owl writes 2 € and 5 c as 2.5 € instead of 2.05 €.",
      learns: "Handling money, counting in steps of different sizes, change as adding on.",
    },

    // Mountain: the ways are given once above, with the world
    zaun: {
      idea: "Count the gaps, not the things. Between two posts hangs one board. How many posts a fence needs depends on its ends.",
      example: "A fence is 36 m long, with a post every 4 m. How many posts? The same idea: how often do you saw a log? How long does a bell take to strike?",
      steps: "Level 1: short fences, counting posts and boards. Level 2: with metres (36 m, a post every 4 m), trees along a path, a striking bell, the floors of a tower. Level 3: backwards (from the posts to the length) and with time (each cut takes the same time), bigger numbers. Level 4: a field with four sides and corners, time backwards.",
      learns: "Looking carefully at what is being counted, and avoiding the classic off-by-one mistake.",
    },
    haken: {
      idea: "Counting every possibility, missing none and counting none twice.",
      example: "4 flavours and 3 kinds of cone: how many ice creams? How many games if everyone plays everyone? How many ways through a grid of streets?",
      steps: "Level 1: combining two things. Level 2: three things, numbers from digit cards, number locks. Level 3: everyone against everyone, ways through the street grid, seats on a bus. Level 4: ways round a building site, two who must not sit side by side, digit sums, home and away games.",
      learns: "Counting systematically with a tree, a table and a list; taking away the cases that do not work.",
    },
    huetten: {
      idea: "Logic puzzles: ruling out until only one possibility is left.",
      example: "Five children, five huts and a few clues: who lives where? Later also: who is lying?",
      steps: "Level 1: two or three children, one to three clues. Level 2: four children, only clues with “not”. Level 3: two kinds of things at once; counting what is still possible after the clues. Level 4: seats in a row, liars, five children.",
      learns: "Reasoning with tables and by ruling out, linking clues, checking statements.",
    },
    vorrat: {
      idea: "Thinking backwards: the end is known, the start is not. Undo each step, the last one first.",
      example: "In the end there are 12 nuts in the cave. Before that, first half were eaten, then 3 were added. How many were there at the start?",
      steps: "Level 1: one step. Level 2: three steps, one of them halving. Level 3: “half and 3 more”, a water lily that doubles every day, stairs between floors. Level 4: a third, a quarter, long chains, bigger numbers.",
      learns: "Reversing steps of a calculation: plus becomes minus, doubling becomes halving.",
    },
    ameisen: {
      idea: "Finding the rule, and then jumping far ahead without writing everything down.",
      example: "An ant road grows by a rule. How many ants are at place 100? Which day of the week is it in 50 days?",
      steps: "Level 1: the same amount is added every time, not far. Level 2: further ahead, two jumps taking turns, a pattern that comes back. Level 3: figures made of matches, days of the week, long sums. Level 4: digits in a long band of numbers, square numbers, bigger figures.",
      learns: "Recognising rules in sequences, working with tables, adding cleverly.",
    },
    waage: {
      idea: "Replacing: what weighs the same may swap.",
      example: "A pumpkin weighs as much as 3 apples. A pumpkin and 2 apples weigh 10 kg. How heavy is an apple?",
      steps: "Level 1: one big thing weighs as much as 2 or 3 small ones. Level 2: two balances one after the other, a basket that stands on both sides. Level 3: sum and difference, three things weighed in pairs. Level 4: balances like “2 big ones weigh as much as 3 small ones”, weights on both sides.",
      learns: "Understanding equations without letters: taking the same away on both sides, replacing until one kind is left.",
    },
    stall: {
      idea: "Assume and improve: first all the same, then swap.",
      example: "In the stable there are hens and cows, 10 heads and 28 legs together. How many cows? Suppose they are all hens …",
      steps: "Level 1: a few animals, hens and cows, or boats. Level 2: up to 30 heads, also tables and bicycles. Level 3: spiders and bicycles, a third kind that changes nothing. Level 4: a quiz with points added and taken away, coins, bigger numbers.",
      learns: "Starting with an assumption and improving it step by step; seeing how much one swap changes.",
    },
    tanz: {
      idea: "Making pairs: even, odd and the rest.",
      example: "Is anyone left over at the pair dance? A light switch is pressed 15 times: is the light on or off afterwards? Today is Monday: which day is it in 100 days?",
      steps: "Level 1: a few children at the pair dance, a light switch, an even or odd sum. Level 2: groups with a rest (teams, carriages of a train), bigger numbers. Level 3: dominoes on a board, turning coins over, the last digit of a power. Level 4: the same rest for 2, 3 and 4, the last digit of very big powers.",
      learns: "Even and odd, dividing with a rest, things that come round in a circle.",
    },
    fels: {
      idea: "Counting in order and turning things in your head.",
      example: "How many triangles hide in the figure? What does the clock show in the mirror? Which face is opposite when the cube is folded?",
      steps: "Level 1: triangles in a small figure, squares in a small grid. Level 2: bigger figures, the clock in the mirror. Level 3: nets of the cube, even bigger figures. Level 4: a painted cube is cut up, folded paper with a hole, rectangles in a grid.",
      learns: "Order when counting, picturing space: mirroring, folding, turning.",
    },
    socken: {
      idea: "The worst case: what is certain is what works even with bad luck.",
      example: "Taking socks from a box in the dark: how many to be sure of two the same?",
      steps: "Level 1: two or three colours, two the same. Level 2: more colours, up to four the same. Level 3: one of each colour, a particular colour. Level 4: birthdays in the same month, dots in a square (more things than boxes).",
      learns: "Thinking of the least favourable case; the pigeonhole principle (more things than boxes).",
    },
    steine: {
      idea: "From the end: games against the owl. Whoever takes the last stone wins.",
      example: "Each takes 1 to 3 stones. How many must you take so that the owl is sure to lose?",
      steps: "Level 1: take 1 or 2 stones, few stones. Level 2: take up to 5 stones, up to 30 stones. Level 3: whoever takes the last one loses; a counting game up to a number. Level 4: two heaps, breaking a bar of chocolate.",
      learns: "Planning backwards from the goal, recognising winning positions, explaining strategies.",
    },
    mauer: {
      idea: "Narrowing down: clue by clue, until only one number is left. And number walls: each brick is the sum of the two below it.",
      example: "A brick is missing at the bottom of the wall, the top says 30. Which number is missing? Magic squares, locks with clues.",
      steps: "Level 1: three bricks at the bottom with small numbers, working out the top. Level 2: a brick at the bottom is missing. Level 3: narrowing down with clues, magic squares. Level 4: digit puzzles, counting all walls that have the same number on top.",
      learns: "Narrowing down possible answers step by step, seeing how the bricks of a number wall hang together.",
    },
    gipfel: {
      idea: "Competition rounds from the whole mountain. The top opens once all twelve camps are mastered.",
      ways: {
        anwenden: "Four tasks from the camps at their highest level and one that needs two strategies at once. Before each task your child chooses which tool to start with. No clock and no points.",
      },
      learns: "Recognising which strategy fits a new task, and joining strategies.",
    },
  },

  // ---------- Why it works
  why: {
    h: "Why it is built this way",
    items: [
      {
        h: "First the idea, then the calculating",
        p: "A child who understands that 8 is made of 5 and 3 does not need to learn 8 − 3 by heart. That is why the valley trains ideas (amount, splitting, friends of ten, sharing) without a single + or − sign. The signs come only at the field, when the ideas behind them are already there.",
      },
      {
        h: "Each idea starts at the smallest number where it exists",
        p: "Amounts start at 1 to 5. Tens and ones start at 20, because they only exist in two-digit numbers; hundreds come with three-digit numbers. So your child sees the idea in its simplest form and does not have to fight with big numbers at the same time. An older child, too, starts a new idea at the bottom. With enough stars it moves on quickly.",
      },
      {
        h: "Number ranges are real levels only in calculating",
        p: "In calculating, a new number range means a new way to calculate: up to 20 you go across the 10 with the friends of ten, above that you take tens and ones apart. That is why plus, minus, times and divide are stepped by number ranges, and there age or a short test decides where your child starts. With the other ideas a new level brings harder questions about the same idea, not just bigger numbers.",
      },
      {
        h: "One idea from five sides",
        p: "Someone who knows a task in only one way has often learned only the procedure. The five ways show the same idea as a picture, with the hands, as a prediction, in a new situation, and as someone else's answer to check. When checking, your child has to be able to say why something is wrong, and that is more than answering correctly. That is why the owl stays at a station until every way has been tried.",
      },
      {
        h: "From the thing to the picture to the number",
        p: "In the valley your child counts flowers, frogs and nuts that they see and tap. At the river these become bunches and baskets for tens and hundreds, at the field dots and rows next to the sum. The picture is a help that goes away once it is no longer needed: in “Use” at the field only the sum is left, and the picture comes back only after a mistake.",
      },
      {
        h: "Mistakes say where to look",
        p: "Many mistakes have a reason: miscounted by one, the ten forgotten, digits swapped. The game recognises such mistakes and says a sentence about exactly that. The owl makes the same mistakes on purpose, so your child sees them from the outside. There are no points and no clock, so your child thinks instead of guessing.",
      },
      {
        h: "Repeating before it is forgotten",
        p: "At the field, basic facts come back when they wobble, and less often when they are secure. Every round has one task from the number range below. On the mountain every round has one task from an earlier camp. So what has been learned stays in use.",
      },
      {
        h: "The difficulty adapts",
        p: "After good rounds it gets harder, after weak ones easier, without your child having to set anything. Children up to 10 are not asked how hard it was; the game sees it in the answers.",
      },
    ],
  },

  // Written in English, so no note that the page is in another language.
  note: "",
};
