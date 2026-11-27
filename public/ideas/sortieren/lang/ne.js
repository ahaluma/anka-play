// Sätze/sentences of the idea "sortieren", Nepali. Ported from think-lab (welt/lang/ne.js) as they were:
// the board (ideas/sortieren/board.js) calls them with number words, as there.

export default {
  sortieren: {
    intro: {
      sehen: "यो कहाँ जान्छ? सही टोकरी थिच।",
      machen: "सबैलाई टोकरीमा छुट्याऊ।",
      forschen: "तीनवटा एउटै समूहका हुन्। एउटा मिल्दैन।",
      anwenden: "टोकरीमा चिन्ह छैन। नियम पत्ता लगाऊ।",
      pruefen: "उल्लुले छुट्यायो। सबै ठिक छ?",
    },
    groups: { animal: "जनावर", fruit: "फलफूल", vehicle: "सवारी", flower: "फूल", red: "रातो", yellow: "पहेँलो", green: "हरियो", big: "ठूला जनावर", small: "साना जनावर" },
    is: { animal: "यो जनावर हो।", fruit: "यो फलफूल हो।", vehicle: "यो सवारी हो।", flower: "यो फूल हो।", red: "यो रातो छ।", yellow: "यो पहेँलो छ।", green: "यो हरियो छ।", big: "यो ठूलो जनावर हो।", small: "यो सानो जनावर हो।" },
    are: { animal: "जनावर", fruit: "फलफूल", vehicle: "सवारी", flower: "फूल", red: "राता चीज", yellow: "पहेँला चीज", green: "हरिया चीज", big: "ठूला जनावर", small: "साना जनावर" },
    rules: { tierObst: "जनावर वा फलफूल", tierFahrzeug: "जनावर वा सवारी", obstBlume: "फलफूल वा फूल", rotGelb: "रातो वा पहेँलो", rotGruen: "रातो वा हरियो", grossKlein: "ठूलो वा सानो जनावर", dreiArten: "जनावर, फलफूल वा सवारी", dreiFarben: "रातो, पहेँलो वा हरियो" },
    hints: { k: "यो जनावर हो, फलफूल, सवारी वा फूल?", c: "रङ मात्र हेर।", s: "यो जनावर साँच्चै ठूलो हो कि सानो?" },
    sehen: {
      ask: (rule) => `यो कहाँ जान्छ: ${rule}?`,
      miss: (is) => `राम्ररी हेर: ${is}`,
    },
    machen: {
      ask: (rule) => `छुट्याऊ: ${rule}! पहिलो चीज कहाँ जान्छ?`,
      miss: (is) => `राम्ररी हेर: ${is}`,
      done: "सबै छुट्याइयो!",
    },
    forschen: {
      ask: "तीनवटा एउटै समूहका हुन्। कुन मिल्दैन?",
      miss: "त्यो अरूसँग मिल्छ। के फरक छ?",
      done: (are, is) => `अरू ${are} हुन्। ${is}`,
    },
    anwenden: {
      ask: "टोकरीमा चिन्ह छैन। भित्र के छ, हेर। नयाँ चीज कहाँ जान्छ?",
      miss: "टोकरीमा के छ, हेर। एउटा टोकरीमा के मिल्दोजुल्दो छ?",
      done: (are) => `हो! यो टोकरीमा ${are} छन्।`,
      hint: "एउटा टोकरीमा सबै एकै किसिमका छन्? कि सबै एकै रङका?",
    },
    pruefen: {
      says: "छुट्याइसकेँ!",
      question: (rule) => `उल्लुले छुट्यायो: ${rule}। सबै ठिक छ?`,
      right: "हो, सबै ठिकसँग छुट्याइएको छ।",
      lookAgain: "हरेक चीज फेरि हेर। चिन्हसँग मिल्छ?",
      isRight: "फेरि हेर: हरेक चीज आफ्नो टोकरीसँग मिल्छ।",
      fix: "राम्रो ध्यान दियौ! गलत टोकरीमा भएको चीज थिच।",
      fixMiss: "त्यो आफ्नो टोकरीमा मिल्छ।",
      fixed: (is) => `ठिक, त्यो अर्को टोकरीमा जान्छ। ${is}`,
    },
  },
};
