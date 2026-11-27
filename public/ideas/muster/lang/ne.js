// Sätze/sentences of the idea "muster", Nepali. Ported from think-lab (welt/lang/ne.js) as they were:
// the board (ideas/muster/board.js) calls them with number words, as there.

export default {
  muster: {
    intro: {
      sehen: "जङ्गलमा एउटा लहर छ। यो कसरी अगाडि बढ्छ?",
      machen: "लहरलाई अगाडि बढाऊ!",
      forschen: "ताली बजाऊ, खुट्टा बजाऊ! अब के आउँछ?",
      anwenden: "मालामा एउटा मोती छैन।",
      pruefen: "लाटोकोसेरोले लहर बनाउँछ। के त्यो ठिक हो?",
    },
    bigger: "तिमीलाई यो राम्ररी आउँछ! अब लहर अलि गाह्रो हुन्छन्।",
    smaller: "अब सजिला लहर लिऔँला।",
    sehen: {
      ask: "अब के आउँछ?",
      miss: "सुरुमा हेर। लहर कसरी जान्छ?",
      done: "लहर यसरी अगाडि बढ्छ।",
      hint: "हेर: बाकसभित्र जे छ, त्यो फेरि-फेरि आउँछ।",
    },
    machen: {
      ask: "लहरलाई अगाडि बढाऊ! तलको एउटा चिजमा थिच।",
      miss: "यो यहाँ मिल्दैन। अघि के आउँछ, हेर।",
      done: "लहर ठिकसँग अगाडि बढ्यो।",
      hint: "हेर: यो टुक्रा फेरि फेरि आउँछ। यसलाई फेरि एक पटक राख।",
    },
    forschen: {
      // Clap and stamp (board.js): the row plays as a rhythm, then the child picks the next move.
      ask: "राम्ररी सुन र हेर। अब के आउँछ?",
      again: "फेरि सुन",
      moves: { "👏": "ताली", "🦶": "खुट्टा बजाऊ", "🦵": "घुँडामा थपथपाऊ" },
      miss: "यो मिल्दैन। फेरि सुन।",
      done: "हो, यसरी नै अघि बढ्छ।",
      hint: "सुन र हेर: बाकसभित्र जे छ, त्यो फेरि-फेरि आउँछ।",
    },
    anwenden: {
      // The necklace (board.js): one bead in the middle is missing.
      ask: "एउटा मोती छैन। खाली ठाउँमा कुन जान्छ?",
      miss: "यो मिल्दैन। खाली ठाउँको अघि र पछि के छ, हेर।",
      done: "अब माला पूरा भयो।",
      hint: "हेर: बाकसभित्र जे छ, त्यो फेरि-फेरि आउँछ।",
    },
    pruefen: {
      ask: "लाटोकोसेरोले एउटा लहर बनायो। के त्यो ठिक हो?",
      lookAgain: "हरेक चीज हेर: के त्यो लहरमा मिल्छ?",
      fix: "हो, त्यो ठिक होइन। गलत चिजमा थिच।",
      fixMiss: "यो मिल्छ। अझै खोज!",
      right: "लहर ठिक छ।",
      fixed: "अब लहर ठिक भयो।",
      hint: "हेर: हरेक टुक्रा उस्तै हुनुपर्छ।",
    },
  },
};
