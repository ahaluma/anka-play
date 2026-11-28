// Sätze/sentences of the idea "teile", Nepali. Ported from think-lab (welt/lang/ne.js) as they were:
// the board (ideas/teile/board.js) calls them with number words, as there.

export default {
  teile: {
    intro: {
      sehen: "जनावर दुलोभित्र जान्छन्। भित्र कतिवटा छन्?",
      machen: "सबै दुईवटा पातमा राख। धेरै तरिका छन्!",
      forschen: "स्याउको रुख हल्लाऊ! माथि कतिवटा बाँकी रहन्छ?",
      anwenden: "केही जान्छन्। कतिवटा बाँकी रहन्छन्?",
      pruefen: "लाटोकोसेरोले जोडेर गन्छ। ठिक हो?",
    },
    together: (a, b, c) => `${a} र ${b} गर्दा जम्मा ${c}।`,
    sehen: {
      // कथा तीन चरणमा: सबै यहाँ छन्, केही भित्र जान्छन्, प्रश्न।
      all: (total, thing) => `यहाँ ${total}वटा ${thing.many} बस्छन्।`,
      hide: "हेर! केही दुलोभित्र पस्छन्।",
      ask: "अहिले दुलोभित्र कतिवटा छन्?",
      miss: (chosen, outside, sum, total) => `${chosen} र ${outside} गर्दा ${sum} हुन्छ। तर जम्मा ${total} छन्।`,
      hint: "हेर: जम्मा यति छन्। कतिवटा पुगेन?",
      denLabel: "दुलो",
    },
    machen: {
      question: (total, thing) => `${total}वटा ${thing.many} दुईवटा पातमा राख!`,
      another: "अर्को तरिकाले पनि हुन्छ?",
      both: "दुवै पातमा केही राख।",
      had: "यो त गरिसक्यौ। अर्को तरिकाले गर!",
      done: (a, b, c, d, total) => `${a} र ${b}, वा ${c} र ${d}। दुवै जम्मा ${total} हुन्छ!`,
      hint: "औँलाले तानेर पातमा राख।",
      hintMove: "एउटा झिक। अर्को पातमा राख।",
      leaf: "पात",
      basket: "डालो",
      check: "भयो",
    },
    forschen: {
      // Shake the apple tree (board.js): all apples hang in the tree, some fall, the others stay up.
      question: (total) => `रुखमा ${total}वटा स्याउ झुण्डिएका छन्। कतिवटा खसाउने? एउटा सङ्ख्या थिच।`,
      out: (n, m, wn, wm) => `${wn}वटा तल खस्यो। ${wm}वटा माथि बाँकी रह्यो।`,
      more: "अर्को सङ्ख्या पनि थिचेर हेर!",
      know: "मलाई थाहा भयो!",
      ready: "माथि कतिवटा बाँकी रहन्छ, थाहा भयो? अनि बत्तीमा थिच।",
      predict: (x, wx) => `पहिले सोच: ${wx}वटा तल खस्छ। माथि कतिवटा बाँकी रहन्छ?`,
      predictMiss: (y, wy) => `हेर: माथि ${wy}वटा बाँकी रह्यो।`,
      rule: (x, y, total) => `जम्मा सधैँ ${total} हुन्छ: तल ${x}, माथि ${y}।`,
      hint: "एउटा सङ्ख्या थिच। त्यतिवटा स्याउ तल खस्छ।",
      hintPredict: "फिक्का स्याउ अब खस्छन्। अरूलाई गन।",
      tried: "तिमीले यी थिचेर हेर्‍यौ",
    },
    anwenden: {
      frogs: (total, n, known) => [`नर्कटमा ${total}वटा भ्यागुता बसेका छन्।`, `${known}वटा ठूलो पातमा उफ्रन्छन्।`, "नर्कटमा अझै कतिवटा छन्?"],
      eggs: (total, n, known) => [`गुँडमा ${total}वटा अन्डा छन्।`, `${known}वटा चल्ला निस्कन्छन्।`, "अझै कतिवटा अन्डा फुटेका छैनन्?"],
      apples: (total, n, known) => [`रुखमा ${total}वटा स्याउ छन्।`, `${known}वटा घाँसमा झर्छन्।`, "रुखमा अझै कतिवटा छन्?"],
      hint: "हेर: जम्मा यति छन्। कतिवटा पुगेन?",
    },
    pruefen: {
      question: (a, b, said) => `लाटोकोसेरो भन्छ: ${a} र ${b} गर्दा ${said} हुन्छ। ठिक हो?`,
      yes: "ठिक हो",
      no: "ठिक होइन",
      countAgain: "फेरि गन त!",
      fix: "हो, मिलेन! जम्मा कतिवटा छन्?",
      fixMiss: "अझै भएन। सबै जोडेर गन!",
      right: (a, b, c) => `हो! ${a} र ${b} गर्दा ${c} हुन्छ।`,
      fixed: (a, b, c) => `अब ठिक भयो: ${a} र ${b} गर्दा ${c} हुन्छ।`,
      hint: "दुवै समूह जोडेर गन।",
    },
  },
};
