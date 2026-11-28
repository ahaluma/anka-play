// Sentences of the idea "geld", नेपाली. Written as Nepali, not translated: in Nepali the game counts in rupees and
// paisa (रुपैयाँ, पैसा), with a point between them as on a Nepali price tag: रु २.५०.

export default {
  geld: {
    sep: ".", // between rupees and paisa: २.५० रुपैयाँ
    cent: "पैसा", // on a small coin: ५० पैसा
    money: (x) => `${x} रुपैयाँ`, // an amount in a sentence or on a button
    face: (x) => `रु ${x}`, // what is written on a rupee coin or note
    intro: {
      sehen: "कति पैसा छ?",
      machen: "ठ्याक्कै तिर।",
      forschen: "दुई फरक तरिकाले तिर।",
      anwenden: "किनमेल: जम्मा कति, फिर्ता कति, पुग्छ कि पुग्दैन?",
      pruefen: "लाटोकोसेरोले पैसा गन्छ। ठिक हो?",
    },
    sehen: {
      ask: "टेबलमा कति पैसा छ?",
      miss: "सबैभन्दा ठूलो नोटबाट गन्न थाल।",
      pieces: "त्यो त सिक्का र नोटको गन्ती भयो। २ रुपैयाँको सिक्का २ रुपैयाँ हो!",
      done: (e) => `${e} भयो।`,
      hint: "ठूलोबाट सुरु गर, अनि एक-एक गर्दै थप्दै जाऊ।",
      missCent: "पहिले रुपैयाँ गन, अनि पैसा। १०० पैसा = १ रुपैयाँ।",
      hintCent: "पहिले रुपैयाँका सिक्का, अनि पैसा, ठूलोबाट सानोतिर। थोप्लोपछि पैसा लेखिन्छ, सधैँ दुई अङ्क।",
    },
    machen: {
      question: (e) => `दाम ${e}। ठ्याक्कै त्यति राख!`,
      check: "तिर",
      tooMuch: (s, p) => `यो ${s} भयो। दाम त ${p} मात्र।`,
      tooLittle: (s, p) => `यो ${s} मात्र भयो। दाम ${p}।`,
      done: (p) => `${p}। तिरियो!`,
      doneFew: (p) => `${p}, सकेसम्म थोरै सिक्का र नोटमा।`,
      hint: "अब कति राखियो, देखिन्छ। पहिले ठूला लेऊ।",
    },
    forschen: {
      question: (e) => `दाम ${e}। दुई फरक तरिकाले तिर!`,
      check: "तिर",
      tooMuch: "धेरै भयो।",
      tooLittle: "अझै कम छ।",
      same: "यसरी त तिरिसक्यौ। अर्को तरिका!",
      again: "ठिक! अब अरू सिक्का वा नोटले।",
      done: (e) => `${e} तिर्ने दुई तरिका। प्रायः अझ धेरै हुन्छन्!`,
      hint: "एउटा ठूलोबाट सुरु गर, अनि सानाले पुर्‍याऊ।",
      hintAgain: "एउटालाई साना सिक्कामा साट: २ रुपैयाँ भनेको १ रुपैयाँका दुईवटा।",
    },
    anwenden: {
      things: { bread: "पाउरोटी", cheese: "चिज", honey: "मह", melon: "खरबुजा", pumpkin: "फर्सी", cake: "केक", ball: "बल", book: "किताब" },
      yes: "पुग्छ",
      no: "पुग्दैन",
      enoughAsk: (thing) => `${thing}: पैसा पुग्छ?`,
      enoughMiss: "आफ्नो पैसा गन, अनि दामसँग दाँज।",
      enoughYes: (have, price) => `तिमीसँग ${have}, दाम ${price}। पुग्छ!`,
      enoughNo: (have, price) => `तिमीसँग ${have}, दाम ${price}। पुग्दैन।`,
      enoughHint: "पहिले आफ्नो पैसा गन। दामजति छ कि छैन?",
      paidWith: "तिरेको",
      totalAsk: (a, b) => `${a} र ${b}: दुवैको जम्मा कति?`,
      totalMiss: "दुवैको दाम जोड।",
      totalDone: (e) => `जम्मा ${e}।`,
      totalHint: "एउटाको दाम लेऊ, अनि अर्को थपेर गन।",
      changeAsk: (thing, price, paid) => `${thing}: दाम ${price}। तिमी ${paid} दिन्छौ। कति फिर्ता पाउँछौ?`,
      changePlus: "फिर्ता त नोटभन्दा कम हुन्छ। दामदेखि नोटसम्म कति पुग्छ?",
      changeMiss: "दामदेखि नोटसम्म माथि गन।",
      changeDone: (e) => `${e} फिर्ता।`,
      changeHint: "पसलेले जस्तै: दामदेखि नोटसम्म माथि गन।",
    },
    pruefen: {
      question: (e) => `लाटोकोसेरो भन्छ: ${e}। ठिक हो?`,
      lookAgain: "आफैँ एक-एक गरेर गन।",
      fix: "हो, मिलेन! साँच्चै कति हो?",
      fixPieces: "हो, मिलेन! लाटोकोसेरोले सिक्का र नोट मात्र गन्यो। पैसा कति हो?",
      fixMiss: "सबैभन्दा ठूलोबाट गन्न थाल।",
      right: (e) => `हो, ${e}।`,
      fixed: (e) => `अब मिल्यो: ${e}।`,
      hint: "लाटोकोसेरोले एउटा बिर्स्यो, वा एउटालाई दुईपटक गन्यो।",
      hintPieces: "हरेकको आफ्नै दाम हुन्छ। ५ रुपैयाँको नोट ५ रुपैयाँ हो, १ होइन।",
      fixComma: (said, e, c) => `हो, मिलेन! ${said} भनेको ${e} रुपैयाँ ${c}० पैसा। यहाँ ${e} रुपैयाँ ${c} पैसा छ। कसरी लेख्ने?`,
      hintComma: "थोप्लोपछि पैसाका लागि सधैँ दुई अङ्क। ५ पैसा लेख्दा: ०.०५ रुपैयाँ।",
    },
  },
};
