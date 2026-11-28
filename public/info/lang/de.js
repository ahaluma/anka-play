// Die Info-Seite für Eltern (/info/), Deutsch: jede Welt, jede Station, was Kinder dort lernen, und warum es so
// aufgebaut ist. Namen von Welten, Stationen und Spielarten kommen aus den gemeinsamen Wörtern (lang/de.js),
// Reihenfolge und Symbole aus content/universe.js. Hier steht nur, was dort nicht steht.
// tools/check-engine.mjs prüft, dass jede Station hier einen Text hat.
export default {
  title: "Was Ihr Kind lernt",
  intro: [
    "AnkaPlay ist ein Mathe- und Denkspiel für Kinder von 3 bis 12 Jahren. Es hat vier Welten. Jede Welt ist eine Landschaft mit Stationen. Jede Station übt eine Idee aus der Mathematik, manche zwei.",
    "Auf dieser Seite steht, was Ihr Kind an jeder Station tut und was es dabei lernt. Am Ende steht, warum das Spiel so aufgebaut ist.",
  ],
  contents: "Inhalt",
  back: "Zurück zum Elternbereich",
  ageOf: { tal: "3 bis 6 Jahre", fluss: "ab 6 Jahren", feld: "ab 6 Jahren", berg: "9 bis 12 Jahre" },

  // ---------- Wie das Spiel aufgebaut ist
  basics: {
    h: "So spielt Ihr Kind",
    p: [
      "Ihr Kind wählt auf der Karte eine Station. Dort spielt es eine Runde: 5 Aufgaben, im Tal 3. Jede Idee hat bis zu fünf Spielarten. Jede Spielart zeigt dieselbe Idee von einer anderen Seite:",
    ],
    after: [
      "Eine Runde mit 4 von 5 Aufgaben auf Anhieb richtig bringt einen Stern ⭐ für diese Spielart. Hat eine Station genug Sterne, kommen größere Zahlen oder schwerere Aufgaben. Nach zwei schwachen Runden geht es eine Stufe zurück. Nach drei Fehlern hintereinander kommt eine leichtere Aufgabe.",
      "An jeder Station ist zuerst nur die erste Spielart offen. Die anderen haben ein Schloss 🔒. Hat Ihr Kind eine Spielart gespielt, öffnet sich die nächste. Was einmal offen ist, bleibt offen.",
      "Die Reihenfolge folgt der Idee. Kann Ihr Kind die Idee selbst herstellen, wie beim Zählen, Zerlegen, Teilen oder Sortieren, beginnt es mit Machen. Muss es sie erkennen, wie bei Formen, der Uhr oder beim Rechnen, beginnt es mit Sehen. Am Berg beginnt es immer mit Verstehen.",
      "Die Eule führt Ihr Kind der Reihe nach. Sie bleibt an einer Station, bis jede Spielart dort ausprobiert ist und ihren Stern hat. Erst dann zeigt sie den Weg zur nächsten Station, die damit verwandt ist.",
      "Es gibt keine Punkte, keine Uhr und keine Tage-in-Folge. Ein Fehler wird erklärt, nicht bestraft.",
    ],
  },

  // Die fünf Spielarten, so wie sie im Tal, am Fluss und am Feld heißen. Die Namen kommen aus lang/de.js.
  ways: {
    sehen: "Ein Bild zeigt die Idee. Das Kind schaut und antwortet.",
    machen: "Das Kind legt, zieht oder baut selbst.",
    forschen: "Etwas ändert sich. Das Kind überlegt erst, was passiert, dann sieht es nach.",
    anwenden: "Die Idee kommt in einer neuen Lage vor.",
    pruefen: "Die Eule hat eine Antwort gegeben. Stimmt sie? Oft macht sie einen typischen Fehler.",
  },

  // ---------- Die Welten
  maps: {
    tal: [
      "Das Tal ist für Kinder, die noch nicht lesen und noch nicht rechnen. Es gibt keine Rechenzeichen, und keine Aufgabe geht über 20 hinaus. Die meisten Stationen bleiben bei Zahlen bis 10.",
      "Alles wird vorgelesen. Solange die Stimme spricht, wartet das Spiel mit dem Tippen (höchstens 10 Sekunden). Ihr Kind antwortet, indem es auf Bilder und Dinge tippt; es muss nichts schreiben. Fast jede Aufgabe hat ein Bild. Für jede gespielte Runde wächst an der Station eine Blume.",
    ],
    fluss: [
      "Der Fluss ist für Schulkinder: der Zahlenstrahl und das Runden, Zehner und Einer bis zur Million, Formen und Körper, Größen und Einheiten, Fläche und Pläne, Würfelgebäude, Daten und Zufall, Uhr und Kalender. Er öffnet sich mit 6 Jahren, oder früher, wenn die Wiese und der Teich im Tal geschafft sind.",
      "Hier liest Ihr Kind selbst; vorgelesen wird nur, wenn es auf 🔊 tippt (oder wenn Sie im Elternbereich „Überall vorlesen“ einschalten). Bis 10 tippt es die Antwort an, ab 20 tippt es sie auf einem Zahlenfeld ein. Nach dem zweiten Fehler zeigt ein Tipp, wo es hinschauen soll, danach hilft ein Bild.",
    ],
    feld: [
      "Am Feld wird gerechnet: Plus, Minus, Mal, Geteilt, Geld, Rechengeschichten und schriftliches Rechnen. Es öffnet sich wie der Fluss mit 6 Jahren; über die Brücke vom Steg kommt man hinüber.",
      "Beim ersten Weg über die Brücke stellt das Spiel drei kurze Aufgaben, zum Beispiel 3 + 6, 8 + 5 und 23 + 40. Die Antworten legen nur fest, wo Ihr Kind anfängt; der Weg ist immer offen.",
      "An allen vier Rechen-Stationen gibt es dieselben fünf Spielarten:",
    ],
    feldWays: {
      sehen: "Ein Bild zeigt die ganze Aufgabe. Das Kind liest das Ergebnis daraus ab.",
      machen: "Das Kind legt die Aufgabe selbst, mit Punkten, Stäben und Tellern, Reihen oder Säckchen, und prüft dann.",
      forschen: "Mehrere Aufgaben hintereinander, die sich nur wenig ändern. Wie geht es weiter? Oder dieselben Zahlen andersherum (8 + 5 = 13, also 13 − 5 = 8).",
      anwenden: "Nur Zahlen, manchmal mit einer Lücke (3 + ? = 7).",
      pruefen: "Die Eule hat gerechnet. Stimmt das? Ihre Fehler sind die, die Kinder oft machen.",
    },
    feldAfter: [
      "Jede Rechenart hat vier Zahlenräume: bis 10, bis 20, bis 100, bis 1000. In jedem Zahlenraum gibt es kleine Teilstufen (unten bei jeder Station). Eine gute Runde führt eine Teilstufe weiter. Die Sterne gibt es auf der obersten Teilstufe, wenn alles gemischt kommt.",
      "Eine von fünf Aufgaben einer Runde kommt aus dem Zahlenraum darunter. Beim Anwenden kommt die letzte Aufgabe andersherum wieder (erst 8 + 5, dann 13 − 5). Grundaufgaben (wie 8 + 5) kommen in eine Lernkartei: Was noch wackelt oder lange dauert, kommt bald wieder, was sitzt, erst nach Tagen oder Wochen.",
      "Bei einem Fehler sagt das Spiel, worauf das Kind achten soll (zum Beispiel: „Schau auf den Zehner“). Beim zweiten Fehler kommt das Bild, beim dritten der Weg in kleinen Schritten. Macht Ihr Kind denselben Fehler öfter, beginnt die nächste Runde mit drei Übungsaufgaben genau dazu.",
    ],
    berg: [
      "Der Berg ist für Kinder von 9 bis 12 Jahren, die gern knobeln. Die Aufgaben sind wie bei Mathe-Wettbewerben für dieses Alter. Der Berg öffnet sich mit 9 Jahren. Früher öffnet er sich, wenn die Grundlagen am Fluss und am Feld geschafft sind (Steg, Blumenfeld, Apfelbaum, Beeren), oder wenn Sie ihn im Elternbereich öffnen.",
      "Der Berg hat zwölf Lager und den Gipfel. Jedes Lager übt eine Denkstrategie. Ein Lager kommt aus dem Nebel, wenn die Lager darunter geschafft sind. Jedes Lager hat vier Stufen (unten bei jedem Lager), und jedes Kind beginnt bei Stufe 1. Die Seiten sehen aus wie ein kariertes Heft, und der Text ist das Tagebuch einer Expedition.",
      "Die fünf Spielarten heißen hier anders:",
    ],
    bergWays: {
      sehen: "Eine Aufgabe mit Bild. Das Kind erkennt, worum es geht.",
      machen: "Das Kind legt, baut oder spielt die Aufgabe selbst durch.",
      forschen: "Erst kleine Fälle, dann größere. In einer Tabelle wird die Regel sichtbar.",
      anwenden: "Dieselbe Strategie in einer ganz anderen Geschichte.",
      pruefen: "Die Eule antwortet schnell und sicher. Stimmt es? Wenn nicht: Warum war sie falsch?",
    },
    bergAfter: [
      "Nach jeder gelösten Aufgabe zeigt der Berg, welche anderen Strategien hier auch funktionieren. Hat Ihr Kind schon ein Lager geschafft, kommt in jeder Runde eine Aufgabe von dort, damit nichts vergessen wird. Auf den höheren Stufen verbinden manche Aufgaben die Strategie mit der eines früheren Lagers. Nach jeder Runde fragt der Berg: „Wie war das für dich?“ Eine schwache Runde, die sich schwer anfühlte, führt eine Stufe zurück.",
    ],
  },

  // ---------- Die Stationen
  // idea: worum es geht · ways: was jede Spielart zeigt (nur Tal und Fluss, und der Hofstand) ·
  // steps: die Stufen · learns: was Ihr Kind dort lernt
  labels: { ways: "So wird gespielt", steps: "Stufen", learns: "Das lernt Ihr Kind" },
  stations: {
    // Tal
    wiese: {
      idea: "Eine Zahl sagt, wie viele es sind. Mehr, weniger, gleich viele.",
      ways: {
        machen: "Eine bestimmte Zahl Blumen in den Korb pflücken. Zwei Zähler zeigen, wie viele noch auf der Wiese und wie viele im Korb sind.",
        sehen: "Blumen auf der Wiese: Wie viele sind es? Ab der zweiten Runde sind sie nur kurz zu sehen. So lernt Ihr Kind, kleine Mengen auf einen Blick zu erkennen.",
        forschen: "Steine im Bach mit Zahlen, einer fehlt. Manchmal hüpft der Frosch rückwärts. Oder die Steine liegen durcheinander und das Kind legt den Weg, die kleinste Zahl zuerst.",
        anwenden: "Wo sind mehr, wo weniger? Eins kommt dazu oder geht weg: Wie viele sind es jetzt? Beide Seiten gleich machen.",
        pruefen: "Die Eule hat gezählt. Stimmt es, oder ist sie um eins daneben?",
      },
      steps: "Zahlen bis 5, dann bis 10.",
      learns: "Sicher zählen, kleine Mengen auf einen Blick erkennen, Zahlen in der richtigen Reihenfolge, vorwärts und rückwärts, Mengen vergleichen.",
    },
    bau: {
      idea: "Zahlen bestehen aus Zahlen: 5 sind 3 und 2, oder 4 und 1.",
      ways: {
        machen: "Dinge auf zwei Blätter verteilen, auf zwei verschiedene Arten.",
        sehen: "Tiere gehen in den Bau. Einige sind draußen zu sehen, wie viele sind drinnen?",
        forschen: "Den Apfelbaum schütteln: Einige Äpfel fallen herunter. Wie viele bleiben oben?",
        anwenden: "Eine kleine Szene: Das Ganze und ein Teil sind bekannt, der andere Teil fehlt.",
        pruefen: "Die Eule sagt: „3 und 2 sind 6.“ Stimmt das?",
      },
      steps: "Zahlen von 3 bis 5, dann von 6 bis 10.",
      learns: "Eine Zahl in zwei Teile zerlegen, auf verschiedene Arten. Das ist die Grundlage für Plus und Minus, bevor es Rechenzeichen gibt.",
    },
    baumstumpf: {
      idea: "Zahlen-Memory: eine Karte mit einer Zahl und eine Karte mit so vielen Dingen gehören zusammen.",
      ways: {
        spielen: "Am Anfang liegen alle Karten offen, das Kind sucht nur die Paare. Später liegen sie verdeckt, wie beim echten Memory. Eine Runde ohne Fehler führt weiter.",
      },
      steps: "Mit 3 bis 6 Paaren und Zahlen bis höchstens 20. Es beginnt nach dem Alter. Es ist ein Spiel: immer offen, ohne Sterne.",
      learns: "Zahl und Menge verbinden, sich Dinge merken.",
    },
    teich: {
      idea: "Eine Zahl besteht aus zwei Teilen. Wie man sie auch aufteilt, zusammen bleibt es gleich. Ein Bild für alles: Frösche auf zwei Seerosen.",
      ways: {
        machen: "Ihr Kind lässt Frösche von einer Seerose zur anderen hüpfen: bis links drei sitzen, oder auf alle Arten, die es gibt.",
        sehen: "Alle Frösche sind zu sehen, dann tauchen ein paar unter ein Blatt. Wie viele sind versteckt?",
        forschen: "Ein Frosch hüpft hinüber. Wie viele sitzen dann auf einer Seerose? Erst vorhersagen, dann zusehen.",
        anwenden: "Ohne Frösche: „drei und ? sind fünf“, erst mit Punkten, dann mit Ziffern.",
        pruefen: "Die Eule hat Frösche verteilt und sagt, es sind alle. Stimmt das? Wenn nicht, macht Ihr Kind es richtig.",
      },
      steps: "Drei und vier Frösche, dann fünf (eine Hand), dann zehn (zwei Reihen zu fünf). Die Spielarten gehen vom Tun über das Bild zur Zahl.",
      learns: "Die Zahlenpaare zu 5 und zu 10, mit Bild und auswendig, und dass das Ganze gleich bleibt, wenn ein Teil wächst und der andere schrumpft. Mit diesen Paaren rechnet Ihr Kind später über die 10 (8 + 5 = 8 + 2 + 3).",
    },
    obstbaum: {
      idea: "Gerecht teilen: Jeder bekommt gleich viele.",
      ways: {
        machen: "Futter an die Tiere verteilen, sodass jedes gleich viel bekommt.",
        sehen: "In jedem Nest liegen gleich viele Eier. Eine Henne setzt sich auf ein Nest: Wie viele Eier liegen darunter?",
        forschen: "Erst überlegen: Geht es gerecht auf, oder bleibt etwas übrig?",
        anwenden: "Kirschen im Gras, jeder Vogel bekommt so viele. Für wie viele Vögel reicht es?",
        pruefen: "Die Eule hat geteilt. Ist das gerecht?",
      },
      steps: "Bis 6 Dinge zum Teilen, dann bis 10.",
      learns: "Gleich große Gruppen erkennen und bilden, gerecht verteilen, Rest. Das ist die Idee hinter Mal und Geteilt.",
    },
    wald: {
      idea: "Eine Reihe geht immer gleich weiter, weil ein Stück immer wiederkommt.",
      ways: {
        machen: "Die Reihe selbst weiterlegen.",
        sehen: "Eine Reihe hört auf. Was kommt jetzt?",
        forschen: "Die Reihe ist ein Rhythmus aus Klatschen, Stampfen und Auf-die-Knie-Klopfen. Zuhören, mitmachen: Was kommt jetzt?",
        anwenden: "In einer Perlenkette fehlt in der Mitte eine Perle. Welche gehört hinein?",
        pruefen: "Die Eule legt eine Reihe. Ein Ding kann falsch sein: Welches?",
      },
      steps: "Stufe 1: zwei Dinge im Wechsel. Stufe 2: ein Stück aus drei Dingen. Stufe 3: längere Stücke.",
      learns: "Regeln in Mustern finden und fortsetzen. Darauf baut später das Rechnen mit Zahlenfolgen auf.",
    },
    himmel: {
      idea: "Zuerst und dann: Bildergeschichten in der richtigen Reihenfolge, Erster, Zweiter, Dritter.",
      ways: {
        machen: "Die Bilder einer Geschichte der Reihe nach antippen.",
        sehen: "Zwei Bilder aus einer Geschichte. Was war zuerst?",
        forschen: "Was passiert als Nächstes? Später auch: Was war davor?",
        anwenden: "Tiere stehen in einer Reihe. Wer ist Erster, Zweiter, Letzter?",
        pruefen: "Die Eule hat eine Geschichte gelegt. Stimmt die Reihenfolge?",
      },
      steps: "Stufe 1: Geschichten aus drei Bildern, Erster und Letzter. Stufe 2: vier Bilder und der Tagesablauf, bis zum Dritten. Stufe 3: bis zum Fünften, und was davor war.",
      learns: "Abläufe ordnen, Ordnungszahlen (der Erste, der Zweite), Vorher und Nachher.",
    },
    nester: {
      idea: "Was gehört zusammen? Sortieren nach einer Regel.",
      ways: {
        machen: "Sechs Dinge nacheinander in die Körbe sortieren.",
        sehen: "Ein Ding: In welchen Korb gehört es?",
        forschen: "Vier Dinge, drei gehören zusammen. Welches passt nicht?",
        anwenden: "Die Körbe haben kein Schild. Das Kind findet die Regel selbst und legt das neue Ding richtig.",
        pruefen: "Die Eule hat sortiert. Ein Ding kann im falschen Korb liegen.",
      },
      steps: "Stufe 1: nach Art (Tier, Obst, Fahrzeug). Stufe 2: auch nach Farbe. Stufe 3: auch nach Größe, mit drei Körben.",
      learns: "Merkmale erkennen, nach einer Regel ordnen, eine Regel selbst finden.",
    },
    pfuetze: {
      idea: "Genau hinschauen: Unterschiede finden, nachmalen, sich merken.",
      ways: {
        sehen: "Zwei Bilder. Was ist anders?",
        machen: "Ein Muster auf einem Gitter genau nachmalen.",
        forschen: "Das Muster ist nur kurz zu sehen. Dann aus dem Kopf nachmalen.",
        anwenden: "Welches Bild ist genau gleich wie das Vorbild?",
        pruefen: "Die Eule sagt: „Die Bilder sind gleich.“ Stimmt das?",
      },
      steps: "Stufe 1: 2 × 2 Felder, ein Unterschied. Stufe 2: 3 × 3 Felder. Stufe 3: zwei Unterschiede, mit Bildern, die sich ähneln.",
      learns: "Genau vergleichen, Lage auf einem Gitter, sich ein Bild merken.",
    },
    huegel: {
      idea: "Wo ist es? Auf, unter, neben, vor, hinter, links, rechts, zwischen.",
      ways: {
        sehen: "Tiere um einen Tisch. Wer ist unter dem Tisch?",
        machen: "Ein Tier an den richtigen Platz setzen.",
        forschen: "Wo ist der Hase? Das richtige Wort suchen.",
        anwenden: "Tiere auf einer Bank: Wer sitzt zwischen, links, rechts?",
        pruefen: "Die Eule sagt, wo das Tier ist. Stimmt das?",
      },
      steps: "Stufe 1: auf, unter, neben. Stufe 2: auch vor und hinter. Stufe 3: links und rechts statt neben, eine Bank mit fünf Tieren.",
      learns: "Die Wörter für Lage im Raum verstehen und selbst benutzen.",
    },
    kiesel: {
      idea: "Kreis, Dreieck, Quadrat, Rechteck.",
      ways: {
        sehen: "Mehrere Formen: Tipp auf den Kreis.",
        machen: "Ein Bild aus Formen bauen: in jeden Umriss die passende Form.",
        forschen: "Alle Dreiecke finden, zwischen anderen Formen.",
        anwenden: "Dinge aus dem Alltag: Welche Form hat die Uhr?",
        pruefen: "Die Eule sagt, wie die Form heißt. Stimmt das?",
      },
      steps: "Stufe 1: Kreis, Dreieck, Quadrat, gerade hingestellt. Stufe 2: auch das Rechteck, verschiedene Größen und Farben. Stufe 3: gedreht und gestreckt (ein Quadrat auf der Spitze ist immer noch ein Quadrat).",
      learns: "Formen erkennen und benennen, auch wenn sie gedreht, groß oder klein sind.",
    },
    ufer: {
      idea: "Länger, höher, schwerer, der Größe nach.",
      ways: {
        sehen: "Was ist länger, was ist höher, wo ist mehr Wasser?",
        machen: "Dinge vom kleinsten zum größten antippen.",
        forschen: "Die Waage: Was ist schwerer? Erst überlegen, dann wiegen. Groß ist nicht immer schwer.",
        anwenden: "Was passt dem Baby, was dem Kind, was der Mama?",
        pruefen: "Die Eule vergleicht. Stimmt das?",
      },
      steps: "Stufe 1: zwei Dinge, sehr verschieden. Stufe 2: drei Dinge, auch kürzer und niedriger. Stufe 3: Dinge, die sich ähnlicher sind und nicht an einer Linie beginnen.",
      learns: "Vergleichen und ordnen nach Länge, Höhe, Menge und Gewicht. Das bereitet das Messen vor.",
    },

    // Fluss
    steg: {
      idea: "Jede Zahl hat ihren Platz. Die Bretter des Stegs sind der Zahlenstrahl.",
      ways: {
        sehen: "Der Frosch sitzt auf dem Steg. Bei welcher Zahl?",
        machen: "Den Frosch an eine bestimmte Zahl hüpfen lassen.",
        forschen: "Entenküken tragen Zahlen in einer Reihe, in Schritten vorwärts oder rückwärts. Eine Zahl fehlt.",
        anwenden: "Größer oder kleiner? Was kommt davor, was danach? Der wievielte ist es?",
        pruefen: "Die Eule vergleicht zwei Zahlen. Ihr Fehler: Sie schaut zuerst auf die letzte Ziffer (38 > 52, weil 8 > 2).",
      },
      steps: "Zahlen bis 20, bis 100, bis 1000.",
      learns: "Zahlen auf dem Zahlenstrahl finden und einordnen, Zahlen vergleichen, Vorgänger und Nachfolger, in Schritten zählen.",
      second: {
        idea: "Runden heißt: Welcher runde Nachbar ist näher? Genau in der Mitte rundet man auf. Mit gerundeten Zahlen rechnet man schnell ungefähr und sieht, ob ein Ergebnis stimmen kann.",
        ways: {
          sehen: "Der Frosch sitzt bei 37. Ist 30 oder 40 näher?",
          machen: "Den Frosch zum nächsten runden Nachbarn hüpfen lassen.",
          forschen: "3☐ wird zu 40 gerundet: Welche Ziffern passen ins Kästchen?",
          anwenden: "Überschlagen: 38 + 47 ist ungefähr 40 + 50.",
          pruefen: "Die Eule rundet oder hat gerechnet. Ihre Fehler: In der Mitte abgerundet, auf Zehner statt Hunderter gerundet, ein Ergebnis, das weit weg vom Überschlag liegt.",
        },
        steps: "Stufe 1: zweistellige Zahlen auf Zehner. Stufe 2: dreistellige auf Zehner oder Hunderter. Stufe 3: Überschlagen mit Plus, Minus und Mal, Ergebnisse prüfen.",
        learns: "Runden, überschlagen und Ergebnisse auf Plausibilität prüfen.",
      },
    },
    blumenfeld: {
      idea: "Zehn Einer sind ein Zehner, zehn Zehner sind ein Hunderter. Zehn Blumen werden ein Strauß, zehn Sträuße kommen in einen Korb.",
      ways: {
        machen: "Eine Zahl mit Sträußen und Blumen legen.",
        sehen: "Sträuße und einzelne Blumen. Wie viele Blumen sind es?",
        forschen: "Eine Blume mehr, ein Strauß mehr, einer weniger: Was passiert mit der Zahl? Erst sagen, dann sehen.",
        anwenden: "Nur Zahlen in einer Stellenwerttafel: 3 Zehner und 4 Einer. Auch verdreht („4 Einer und 3 Zehner“) und mit mehr als neun Einern („2 Zehner und 13 Einer“).",
        pruefen: "Die Eule hat gezählt. Ihre typischen Fehler: Zehner und Einer vertauscht (43 statt 34), ein Zehner zu viel, die Null vergessen (35 statt 305).",
      },
      steps: "Bis 20 (aus 3 wird 13: ein Zehner kommt dazu), bis 100, bis 1000 (jetzt mit Hundertern).",
      learns: "Den Stellenwert verstehen: was eine Ziffer an welcher Stelle bedeutet, und warum die Null wichtig ist.",
      second: {
        idea: "Große Zahlen in der Stellentafel, wie in der Schule: Zehn Hunderter sind ein Tausender, zehn Tausender ein Zehntausender. Eine leere Stelle schreibt man als 0.",
        ways: {
          sehen: "Plättchen in der Stellentafel. Welche Zahl ist das?",
          machen: "Eine Zahl mit Plättchen legen. Zehn Plättchen in einer Spalte werden zu einem in der nächsten.",
          forschen: "Ein Plättchen kommt in eine Spalte dazu oder geht weg. Welche Zahl entsteht? Auch über eine volle Spalte (2 950 und ein Hunderter mehr).",
          anwenden: "Nur Zahlen: Was kommt nach 9 999? Was ist 45 300 + 1 000? Welche Zahl ist größer?",
          pruefen: "Die Eule liest die Tafel. Ihr Fehler: Sie vergisst die leere Spalte (35 statt 3 050) oder vertauscht zwei Ziffern.",
        },
        steps: "Bis 10 000 (der Tausender ist neu), bis 1 000 000 (Zehntausender und Hunderttausender).",
        learns: "Den Stellenwert auf große Zahlen übertragen, große Zahlen lesen, schreiben und vergleichen.",
      },
    },
    kiesbank: {
      idea: "Formen und Körper, Spiegeln, Messen.",
      ways: {
        sehen: "Welche Form ist das?",
        machen: "Der Spiegel im Wasser: Die eine Hälfte ist gemalt, das Kind malt die andere genau gleich.",
        forschen: "Ecken zählen; bei Körpern auch Flächen und Kanten.",
        anwenden: "Mit dem Lineal messen: Wie lang ist das? Später: Wie viel länger ist das eine als das andere?",
        pruefen: "Die Eule nennt eine Form. Stimmt das?",
      },
      steps: "Stufe 1: einfache Formen, gerade hingelegt; das Lineal fängt bei 0 an. Stufe 2: Fünf- und Sechsecke, gedrehte Formen; das Ding liegt nicht bei 0. Stufe 3: Körper (Würfel, Quader, Kugel, Zylinder, Kegel, Pyramide) und Längen vergleichen.",
      learns: "Formen und Körper unterscheiden, Symmetrie, richtig messen mit dem Lineal.",
    },
    sonnenfels: {
      idea: "Uhr und Kalender. Der kurze Zeiger zeigt die Stunde, der lange die Minuten.",
      ways: {
        sehen: "Wie spät ist es auf der Uhr?",
        machen: "Die Uhr auf eine Zeit stellen.",
        forschen: "Zeitspannen: zwei Uhren, Anfang und Ende. Wie lange dauert es, in Stunden oder Minuten?",
        anwenden: "Wie spät ist es in 3 Stunden? Welcher Tag ist in 4 Tagen? Welcher Monat in 5 Monaten? Wie viele Tage hat der April?",
        pruefen: "Die Eule liest die Uhr. Ihr Fehler: Sie vertauscht die Zeiger.",
      },
      steps: "Stufe 1: volle Stunden, Wochentage. Stufe 2: halbe und Viertelstunden, Monate. Stufe 3: alle fünf Minuten, Tage im Monat.",
      learns: "Die Uhr lesen und stellen, Zeitspannen bestimmen, mit Tagen und Monaten rechnen.",
    },
    muehle: {
      idea: "Größen und Einheiten: Man misst mit gleichen Stücken, den Einheiten. Eine große Einheit besteht aus vielen kleinen: 1 m = 100 cm, 1 kg = 1 000 g, 1 l = 1 000 ml. Jedes Ding hat eine Einheit, die am besten passt.",
      ways: {
        machen: "Stücke zusammenlegen, bis es genau so viel ist.",
        sehen: "Welche Einheit passt? Ein Bleistift ist 15 … cm oder m lang?",
        forschen: "Eine Umrechnungstabelle weiterführen: 1 m = 100 cm, 2 m = 200 cm, 3 m 40 cm = ? cm.",
        anwenden: "Schätzen mit Stützpunkten (Wie schwer ist ein Apfel? 15 g, 150 g oder 1 500 g?) und kleine Sachaufgaben mit zwei Einheiten.",
        pruefen: "Die Eule rechnet um. Ihre Fehler: mit der falschen Zahl gerechnet (1 kg = 100 g), Zahlen nur nebeneinander geschrieben (3 m 5 cm = 35 cm), einfach zusammengezählt.",
      },
      steps: "Stufe 1: Länge (cm, m). Stufe 2: Gewicht (g, kg) und Hohlmaß (ml, l). Stufe 3: alles, auch mm und km, halbe und viertel (½ kg = 500 g).",
      learns: "Größenvorstellungen aufbauen, die passende Einheit wählen, umrechnen.",
    },
    garten: {
      idea: "Fläche und Umfang: Die Fläche ist, wie viele Platten im Beet liegen. Der Umfang ist, wie lang der Zaun rundherum ist. Gleich viele Platten brauchen nicht gleich viel Zaun.",
      ways: {
        machen: "Ein Beet legen: so viele Platten (später auch so viel Zaun, oder ein Rechteck).",
        sehen: "Wie viele Platten hat das Beet? Wie viele Zaunstücke?",
        forschen: "Zwei Beete: Welches hat mehr Platten, welches braucht mehr Zaun? Oder gleich viel?",
        anwenden: "Rechtecke: Länge mal Breite statt Zählen, zuerst noch mit Kästchen, dann nur mit Maßen.",
        pruefen: "Die Eule hat gezählt. Ihre Fehler: Platten und Zaun verwechselt, an der Ecke nur ein Zaunstück gezählt, eine Platte doppelt.",
      },
      steps: "Stufe 1: Fläche durch Zählen. Stufe 2: auch den Zaun zählen, und beides. Stufe 3: Rechtecke mit Maßen, Fläche = Länge mal Breite.",
      learns: "Flächeninhalt und Umfang unterscheiden und bestimmen.",
      second: {
        idea: "Pläne: Ein Plan zeigt von oben, wo etwas ist. Ein Feld hat einen Namen aus Buchstabe und Zahl (B3: Spalte B, Reihe 3). Ein Weg ist eine Reihe von Schritten (→ → ↑). Auf dem Plan steht ein Kästchen für eine echte Länge.",
        ways: {
          sehen: "Wo ist die Ente? In welchem Feld?",
          machen: "Einen Weg aus Pfeilen bauen, von der Ente zum Nest, um die Steine herum.",
          forschen: "Ein Weg aus Pfeilen: Wo kommt die Ente an? Erst tippen, dann läuft sie.",
          anwenden: "Der Maßstab: Ein Kästchen sind 10 m. Wie weit ist es vom Baum zum Haus? Und zurück: Wie viele Kästchen sind 50 m?",
          pruefen: "Die Eule nennt ein Feld. Ihr Fehler: Sie vertauscht Spalte und Reihe oder nimmt das Nachbarfeld.",
        },
        steps: "Stufe 1: Felder benennen, kurze Wege. Stufe 2: längere Wege um Steine, 1 Kästchen = 10 m. Stufe 3: 1 Kästchen = 5 m oder 100 m, von Metern zurück zu Kästchen.",
        learns: "Sich auf Plänen orientieren, Wege beschreiben, mit dem Maßstab rechnen.",
      },
    },
    kisten: {
      idea: "Würfelgebäude: Kisten stehen übereinander. Ein Bauplan von oben sagt in jedem Feld, wie viele Kisten dort stehen. Die Kisten, die man nicht sieht, tragen die oberen. Ein Würfelnetz sind sechs Quadrate, die sich zu einem Würfel falten lassen.",
      ways: {
        machen: "Den Bauplan schreiben: In jedes Feld tippen, bis die Zahl stimmt. Daneben wächst das Gebäude mit.",
        sehen: "Wie viele Kisten sind es?",
        forschen: "Sechs Quadrate: Kann man daraus einen Würfel falten? Danach zeigt das Spiel, welche Seiten gegenüberliegen, oder wo es klemmt.",
        anwenden: "Welcher Bauplan von oben passt zu dem Gebäude?",
        pruefen: "Die Eule zählt Kisten. Ihr Fehler: Sie zählt nur, was sie sieht, oder nur die oberen.",
      },
      steps: "Stufe 1: eine Reihe, bis 6 Kisten. Stufe 2: zwei Reihen, bis 2 hoch. Stufe 3: bis 3 Reihen und 3 hoch, schwierigere Netze.",
      learns: "Räumliches Vorstellen: Gebäude aus Würfeln lesen, in Baupläne übersetzen, Würfelnetze erkennen.",
    },
    weide: {
      idea: "Daten und Zufall. Man zählt mit Strichen, je fünf als Bündel. Ein Diagramm zeigt die Anzahlen als Balken. Beim Zufall weiß man nicht, was herauskommt, aber was sicher, möglich oder unmöglich ist.",
      ways: {
        sehen: "Eine Strichliste: Wie viele Vögel waren es?",
        machen: "Aus einer Strichliste ein Diagramm bauen: jeden Balken so lang machen, wie es Striche sind.",
        forschen: "Kugeln im Beutel: Welche Farbe kommt wohl am öftesten? Sicher, möglich, unmöglich?",
        anwenden: "Ein Diagramm lesen: Wie oft? Wie viel mehr? Später mit dem Würfel: Was ist wahrscheinlicher?",
        pruefen: "Die Eule liest ein Diagramm. Ihr Fehler: Sie liest den Nachbarbalken oder zählt die Kästchen falsch.",
      },
      steps: "Stufe 1: Bilder und Striche bis 10. Stufe 2: Balken mit Skala bis 20. Stufe 3: Skala in Zweierschritten, Würfel.",
      learns: "Daten erfassen und darstellen, Diagramme lesen, Wahrscheinlichkeiten vergleichen.",
    },

    // Feld: die Spielarten stehen einmal oben bei der Welt
    apfelbaum: {
      idea: "Plus: Äpfel am Baum zusammenzählen.",
      steps: "Bis 10: mit Bildern, mit Lücke. Bis 20: Verdoppeln, über den Zehner, mit Lücke. Bis 100: mit Zehnern, Zehner und Einer mit Übergang, zwei Zehnerzahlen. Bis 1000: mit Hundertern, ohne Übergang, mit Übergang.",
      learns: "Addieren mit Strategien statt Abzählen: Verdoppeln, über den Zehner mit den Zehnerfreunden, Zehner und Einer getrennt.",
    },
    beeren: {
      idea: "Minus: Wegnehmen und den Unterschied finden.",
      steps: "Bis 10: mit Bildern, mit Lücke. Bis 20: Halbieren, über den Zehner, mit Lücke. Bis 100: mit Zehnern, Zehner und Einer mit Übergang, zwei Zehnerzahlen. Bis 1000: mit Hundertern, ohne Übergang, mit Übergang.",
      learns: "Subtrahieren als Wegnehmen und als Abstand. Minus als Umkehrung von Plus.",
    },
    huehner: {
      idea: "Mal: gleiche Gruppen, Eier in Reihen.",
      steps: "Bis 10: gleiche Gruppen. Bis 20: Verdoppeln, die Zweier bis Fünfer. Bis 100: 1, 2, 5 und 10 mal, dann die Reihen 3, 4, 6, 8, dann alle. Bis 1000: Zehner mal Einer, Zehnerzahl mal Einer, bis 1000.",
      learns: "Mal als gleiche Gruppen verstehen, das Einmaleins von den leichten Kernaufgaben aus aufbauen.",
    },
    nussbaum: {
      idea: "Geteilt: Nüsse gerecht verteilen und in Säckchen packen.",
      steps: "Bis 10: gerecht verteilen. Bis 20: umgekehrt rechnen. Bis 100: durch 1, 2, 5 und 10, dann das ganze Einmaleins, dann mit Rest. Bis 1000: Zehner teilen, bis 1000.",
      learns: "Teilen als Verteilen und als Aufteilen, Geteilt als Umkehrung von Mal, Rest.",
    },
    lichtung: {
      idea: "Kleine Rechengeschichten, in denen alles zusammenkommt. Die Lichtung öffnet sich, wenn Plus und Minus bis 10 alle Sterne haben.",
      ways: {
        anwenden: "Eine Geschichte hören und lösen. Die Geschichten benutzen nur Rechenarten und Zahlenräume, die Ihr Kind schon geschafft hat.",
      },
      steps: "Stufe 1: ein Rechenschritt. Stufe 2: Welche Rechenart passt? Stufe 3: zwei Schritte. Stufe 4: zwei Schritte und eine Zahl, die man nicht braucht. Stufe 5: rückwärts denken.",
      learns: "Aus einem Text die Rechnung finden, mehrere Schritte planen, unwichtige Angaben weglassen.",
    },
    scheune: {
      idea: "Schriftlich rechnen: Die Zahlen stehen genau untereinander, Einer unter Einern. Man rechnet Stelle für Stelle von rechts. Zehn an einer Stelle werden ein Übertrag; fehlt etwas, tauscht man einen Zehner in zehn Einer. Die Scheune öffnet sich mit 8 Jahren oder wenn Plus und Minus bis 100 geschafft sind.",
      ways: {
        sehen: "Eine Spalte ist dran: Was schreibt man unten hin, was wandert weiter? Oder: Welche von drei Rechnungen steht richtig untereinander?",
        machen: "Selbst rechnen, Spalte für Spalte von rechts. Steht bei Minus oben zu wenig, tippt das Kind selbst auf „Tauschen“.",
        forschen: "In einer fertigen Rechnung fehlt eine Ziffer. Welche? Dafür rechnet man rückwärts.",
        anwenden: "Eine kleine Geschichte vom Hof (Äpfel, Kartoffeln, Mehl). Die Rechnung steht schon untereinander, das Kind rechnet sie aus.",
        pruefen: "Die Eule hat schriftlich gerechnet. Ihre Fehler: Übertrag vergessen, Zahlen verrutscht, bei Minus die kleinere von der größeren Ziffer genommen statt zu tauschen, eine Null oder den Rest einer Stelle vergessen.",
      },
      steps: "Stufe 1: Plus. Stufe 2: Minus. Bei beiden erst zweistellig, dann dreistellig, dann mit mehreren Überträgen. Stufe 3: Mal, eine zwei- oder dreistellige Zahl mal eine Ziffer. Stufe 4: Geteilt durch eine Ziffer, ohne Rest, dann mit Rest. Jede Stufe hat Teilstufen wie die anderen Rechen-Stationen; die Sterne gibt es, wenn alles gemischt kommt.",
      learns: "Die schriftlichen Rechenverfahren verstehen statt nur ausführen: warum der Übertrag, warum das Entbündeln, warum die Stellen untereinander stehen.",
    },
    hofstand: {
      idea: "Geld: Euro-Münzen und -Scheine zählen, bezahlen, Wechselgeld.",
      ways: {
        sehen: "Münzen und Scheine liegen da. Wie viel Geld ist das?",
        machen: "Einen Preis genau bezahlen.",
        forschen: "Denselben Preis auf zwei verschiedene Arten bezahlen.",
        anwenden: "Einkaufen: Was kostet beides zusammen? Wie viel gibt es zurück? Reicht das Geld?",
        pruefen: "Die Eule zählt das Geld. Ihr typischer Fehler: Sie zählt die Münzen statt ihren Wert.",
      },
      steps: "Bis 10 € (1- und 2-Euro-Münzen, 5-Euro-Schein), bis 20 € (auch 10 €), bis 100 € (auch 20 € und 50 €). Dann Cent: alle Münzen bis 5 €, geschrieben mit Komma. Die Eule schreibt 2 € und 5 ct als 2,5 € statt 2,05 €.",
      learns: "Mit Geld umgehen, in Schritten verschiedener Größe zählen, Wechselgeld als Ergänzen.",
    },

    // Berg: die Spielarten stehen einmal oben bei der Welt
    zaun: {
      idea: "Lücken zählen, nicht die Dinge. Zwischen zwei Pfählen hängt ein Brett. Wie viele Pfähle ein Zaun braucht, hängt von seinen Enden ab.",
      example: "Ein Zaun ist 36 m lang, alle 4 m steht ein Pfahl. Wie viele Pfähle? Dieselbe Idee: Wie oft muss man einen Baumstamm sägen? Wie lange schlägt eine Glocke?",
      steps: "Stufe 1: kurze Zäune, Pfähle und Bretter zählen. Stufe 2: mit Metern (36 m, alle 4 m ein Pfahl), Bäume an einem Weg, Glockenschläge, Stockwerke eines Turms. Stufe 3: rückwärts (aus den Pfählen die Länge) und mit Zeit (jeder Schnitt dauert gleich lang), größere Zahlen. Stufe 4: ein Feld mit vier Seiten und Ecken, Zeit rückwärts.",
      learns: "Genau hinsehen, was gezählt wird, und den klassischen Fehler um eins vermeiden.",
    },
    haken: {
      idea: "Alle Möglichkeiten zählen, keine vergessen, keine doppelt.",
      example: "4 Eissorten und 3 Waffeln: Wie viele Eistüten? Wie viele Spiele, wenn jeder gegen jeden spielt? Wie viele Wege durch ein Straßengitter?",
      steps: "Stufe 1: zwei Dinge kombinieren. Stufe 2: drei Dinge, Zahlen aus Ziffernkarten, Zahlenschlösser. Stufe 3: jeder gegen jeden, Wege im Straßengitter, Sitzplätze im Bus. Stufe 4: Wege mit Baustelle, zwei dürfen nicht nebeneinander sitzen, Ziffernsummen, Hin- und Rückspiele.",
      learns: "Systematisch zählen mit Baum, Tabelle und Liste; Fälle abziehen, die nicht gehen.",
    },
    huetten: {
      idea: "Logikrätsel: ausschließen, bis nur eine Möglichkeit bleibt.",
      example: "Fünf Kinder, fünf Hütten und ein paar Hinweise: Wer wohnt wo? Später auch: Wer lügt?",
      steps: "Stufe 1: zwei oder drei Kinder, ein bis drei Hinweise. Stufe 2: vier Kinder, nur Hinweise mit „nicht“. Stufe 3: zwei Sorten Dinge zugleich; zählen, was nach den Hinweisen noch möglich ist. Stufe 4: Plätze in einer Reihe, Lügner, fünf Kinder.",
      learns: "Mit Tabellen und Ausschluss schließen, Hinweise verknüpfen, Aussagen prüfen.",
    },
    vorrat: {
      idea: "Rückwärts denken: Das Ende ist bekannt, der Anfang nicht. Jeden Schritt rückgängig machen, den letzten zuerst.",
      example: "Am Ende sind 12 Nüsse in der Höhle. Vorher wurde erst die Hälfte gegessen, dann kamen 3 dazu. Wie viele waren am Anfang da?",
      steps: "Stufe 1: ein Schritt. Stufe 2: drei Schritte, einer davon Halbieren. Stufe 3: „die Hälfte und noch 3“, eine Seerose, die sich jeden Tag verdoppelt, Treppen zwischen Stockwerken. Stufe 4: ein Drittel, ein Viertel, lange Ketten, größere Zahlen.",
      learns: "Rechenschritte umkehren: Plus wird Minus, Verdoppeln wird Halbieren.",
    },
    ameisen: {
      idea: "Die Regel finden, und dann weit springen, ohne alles aufzuschreiben.",
      example: "Eine Ameisenstraße wächst nach einer Regel. Wie viele Ameisen sind es an Platz 100? Welcher Wochentag ist in 50 Tagen?",
      steps: "Stufe 1: Es kommt immer gleich viel dazu, nicht weit. Stufe 2: weiter weg, zwei Sprünge im Wechsel, ein Muster, das wiederkommt. Stufe 3: Figuren aus Streichhölzern, Wochentage, lange Summen. Stufe 4: Ziffern in einem langen Zahlenband, Quadratzahlen, größere Figuren.",
      learns: "Regeln in Folgen erkennen, mit Tabellen arbeiten, geschickt summieren.",
    },
    waage: {
      idea: "Ersetzen: Was gleich schwer ist, darf tauschen.",
      example: "Ein Kürbis wiegt so viel wie 3 Äpfel. Ein Kürbis und 2 Äpfel wiegen 10 kg. Wie schwer ist ein Apfel?",
      steps: "Stufe 1: Ein großes Ding wiegt so viel wie 2 oder 3 kleine. Stufe 2: zwei Waagen nacheinander, ein Korb, der auf beiden Seiten steht. Stufe 3: Summe und Unterschied, drei Dinge paarweise gewogen. Stufe 4: Waagen wie „2 große wiegen so viel wie 3 kleine“, Gewichte auf beiden Seiten.",
      learns: "Gleichungen verstehen, ohne Buchstaben: auf beiden Seiten dasselbe wegnehmen, ersetzen, bis eine Sorte bleibt.",
    },
    stall: {
      idea: "Annehmen und verbessern: erst alle gleich, dann tauschen.",
      example: "Im Stall sind Hühner und Kühe, zusammen 10 Köpfe und 28 Beine. Wie viele Kühe? Angenommen, alle sind Hühner …",
      steps: "Stufe 1: wenige Tiere, Hühner und Kühe oder Boote. Stufe 2: bis 30 Köpfe, auch Tische und Fahrräder. Stufe 3: Spinnen und Fahrräder, eine dritte Sorte, die nichts ändert. Stufe 4: ein Quiz mit Plus- und Minuspunkten, Münzen, größere Zahlen.",
      learns: "Mit einer Annahme beginnen und schrittweise verbessern; sehen, wie viel ein Tausch ändert.",
    },
    tanz: {
      idea: "Paare bilden: gerade, ungerade und der Rest.",
      example: "Bleibt beim Paartanz jemand übrig? Ein Lichtschalter wird 15-mal gedrückt: Ist das Licht danach an oder aus? Heute ist Montag: Welcher Tag ist in 100 Tagen?",
      steps: "Stufe 1: wenige Kinder beim Paartanz, ein Lichtschalter, gerade oder ungerade Summe. Stufe 2: Gruppen mit Rest (Mannschaften, Abteile im Zug), größere Zahlen. Stufe 3: Dominosteine auf einem Brett, Münzen umdrehen, die letzte Ziffer einer Potenz. Stufe 4: derselbe Rest bei 2, 3 und 4, die letzte Ziffer sehr großer Potenzen.",
      learns: "Gerade und ungerade, Teilen mit Rest, Dinge, die sich im Kreis wiederholen.",
    },
    fels: {
      idea: "Ordentlich zählen und im Kopf drehen.",
      example: "Wie viele Dreiecke stecken in der Figur? Was zeigt die Uhr im Spiegel? Welche Seite liegt beim gefalteten Würfel gegenüber?",
      steps: "Stufe 1: Dreiecke in einer kleinen Figur, Quadrate in einem kleinen Gitter. Stufe 2: größere Figuren, die Uhr im Spiegel. Stufe 3: Würfelnetze, noch größere Figuren. Stufe 4: ein bemalter Würfel wird zerschnitten, gefaltetes Papier mit Loch, Rechtecke im Gitter.",
      learns: "Ordnung beim Zählen, räumliches Vorstellen: spiegeln, falten, drehen.",
    },
    socken: {
      idea: "Der schlimmste Fall: Sicher ist, was auch mit Pech klappt.",
      example: "Im Dunkeln Socken aus der Kiste ziehen: Wie viele, damit sicher zwei gleiche dabei sind?",
      steps: "Stufe 1: zwei oder drei Farben, zwei gleiche. Stufe 2: mehr Farben, bis zu vier gleiche. Stufe 3: von jeder Farbe eine, eine bestimmte Farbe. Stufe 4: Geburtstage im selben Monat, Punkte in einem Quadrat (mehr Dinge als Kästen).",
      learns: "An den ungünstigsten Fall denken; das Schubfachprinzip (mehr Dinge als Kästen).",
    },
    steine: {
      idea: "Vom Ende her: Spiele gegen die Eule. Wer den letzten Stein nimmt, gewinnt.",
      example: "Jeder nimmt 1 bis 3 Steine. Wie viele musst du nehmen, damit die Eule sicher verliert?",
      steps: "Stufe 1: 1 oder 2 Steine nehmen, wenige Steine. Stufe 2: bis zu 5 Steine nehmen, bis 30 Steine. Stufe 3: Wer den letzten nimmt, verliert; ein Zählspiel bis zu einer Zahl. Stufe 4: zwei Haufen, eine Tafel Schokolade brechen.",
      learns: "Vom Ziel aus rückwärts planen, Gewinnstellungen erkennen, Strategien begründen.",
    },
    mauer: {
      idea: "Eingrenzen: Hinweis für Hinweis, bis nur eine Zahl bleibt. Und Zahlenmauern: Jeder Stein ist die Summe der zwei darunter.",
      example: "Unten in der Mauer fehlt ein Stein, oben steht 30. Welche Zahl fehlt? Magische Quadrate, Schlösser mit Hinweisen.",
      steps: "Stufe 1: unten drei Steine mit kleinen Zahlen, den obersten ausrechnen. Stufe 2: ein Stein unten fehlt. Stufe 3: Eingrenzen mit Hinweisen, magische Quadrate. Stufe 4: Ziffernrätsel, alle Mauern zählen, die oben dieselbe Zahl haben.",
      learns: "Mögliche Lösungen Schritt für Schritt eingrenzen, Zusammenhänge in Zahlenmauern erkennen.",
    },
    gipfel: {
      idea: "Wettbewerbsrunden aus dem ganzen Berg. Der Gipfel öffnet sich, wenn alle zwölf Lager geschafft sind.",
      ways: {
        anwenden: "Vier Aufgaben aus den Lagern auf ihrer höchsten Stufe und eine, für die man zwei Strategien zugleich braucht. Vor jeder Aufgabe wählt Ihr Kind, mit welchem Werkzeug es anfängt. Ohne Uhr und ohne Punkte.",
      },
      learns: "Selbst erkennen, welche Strategie zu einer neuen Aufgabe passt, und Strategien verbinden.",
    },
  },

  // ---------- Warum das funktioniert
  why: {
    h: "Warum es so aufgebaut ist",
    items: [
      {
        h: "Erst die Idee, dann das Rechnen",
        p: "Ein Kind, das versteht, dass 8 aus 5 und 3 besteht, muss 8 − 3 nicht auswendig lernen. Darum übt das Tal Begriffe (Menge, Zerlegen, Zehnerfreunde, Teilen) ohne ein einziges Rechenzeichen. Die Rechenzeichen kommen erst am Feld, wenn die Ideen dahinter schon da sind.",
      },
      {
        h: "Jede Idee beginnt bei der kleinsten Zahl, bei der es sie gibt",
        p: "Mengen beginnen bei 1 bis 5. Zehner und Einer beginnen bei 20, weil es sie erst bei zweistelligen Zahlen gibt; Hunderter kommen mit den dreistelligen Zahlen. So sieht Ihr Kind die Idee in ihrer einfachsten Form und muss nicht gleichzeitig mit großen Zahlen kämpfen. Auch ein älteres Kind beginnt bei einer neuen Idee unten. Mit genug Sternen geht es schnell weiter.",
      },
      {
        h: "Zahlenräume sind nur beim Rechnen echte Stufen",
        p: "Beim Rechnen bedeutet ein neuer Zahlenraum eine neue Art zu rechnen: Bis 20 rechnet man mit den Zehnerfreunden über die 10, darüber mit Zehnern und Einern getrennt. Darum sind Plus, Minus, Mal und Geteilt nach Zahlenräumen gestuft, und dort entscheidet das Alter oder ein kurzer Test, wo Ihr Kind anfängt. Bei den anderen Ideen bringt eine neue Stufe schwerere Fragen zur selben Idee, nicht einfach größere Zahlen.",
      },
      {
        h: "Eine Idee von fünf Seiten",
        p: "Wer eine Aufgabe nur auf eine Art kennt, hat oft nur den Ablauf gelernt. Die fünf Spielarten zeigen dieselbe Idee als Bild, mit den Händen, als Vorhersage, in einer neuen Lage und als fremde Lösung, die man prüft. Beim Prüfen muss Ihr Kind erklären können, warum etwas falsch ist, und das ist mehr als richtig antworten. Deshalb bleibt die Eule an einer Station, bis alle Spielarten ausprobiert sind.",
      },
      {
        h: "Vom Ding zum Bild zur Zahl",
        p: "Im Tal zählt Ihr Kind Blumen, Frösche und Nüsse, die es sieht und antippt. Am Fluss werden daraus Sträuße und Körbe für Zehner und Hunderter, am Feld Punkte und Reihen neben der Rechnung. Das Bild ist eine Hilfe, die wegfällt, sobald sie nicht mehr gebraucht wird: Beim Anwenden steht am Feld nur noch die Rechnung, und das Bild kommt erst nach einem Fehler zurück.",
      },
      {
        h: "Fehler sagen, wo man hinschauen muss",
        p: "Viele Fehler haben einen Grund: um eins verzählt, den Zehner vergessen, Ziffern vertauscht. Das Spiel erkennt solche Fehler und sagt genau dazu einen Satz. Die Eule macht dieselben Fehler absichtlich, damit Ihr Kind sie von außen sieht. Es gibt keine Punkte und keine Uhr, damit Ihr Kind nachdenkt statt rät.",
      },
      {
        h: "Wiederholen, bevor es vergessen ist",
        p: "Am Feld kommen Grundaufgaben wieder, wenn sie wackeln, und seltener, wenn sie sitzen. In jeder Runde kommt eine Aufgabe aus dem Zahlenraum darunter. Am Berg kommt in jeder Runde eine Aufgabe aus einem früheren Lager. So bleibt das Gelernte im Gebrauch.",
      },
      {
        h: "Die Schwierigkeit passt sich an",
        p: "Nach guten Runden wird es schwerer, nach schwachen leichter, ohne dass Ihr Kind etwas einstellen muss. Kinder bis 10 Jahre werden nicht gefragt, wie schwer es war; das Spiel sieht es an den Antworten.",
      },
    ],
  },

  // Für eine andere Sprache: Hinweis, dass die Seite noch nicht übersetzt ist. Deutsch braucht ihn nicht.
  note: "",
};
