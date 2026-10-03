let vokabeln = [];
let aktuelleVokabel = null;
let runde = 0;


// ================================
// CSV einlesen
// ================================

async function vokabelnEinlesen() {
    try {
        const response = await fetch("vocabeln.csv");

        if (!response.ok) {
            throw new Error("CSV-Datei konnte nicht geladen werden.");
        }

        const text = await response.text();

        const zeilen = text
            .split("\n")
            .map(zeile => zeile.trim())
            .filter(zeile => zeile.length > 0);

        vokabeln = zeilen.map(zeile => {
            const woerter = zeile.split(";");

            return {
                englisch: woerter[0].trim(),
                deutsch: woerter[1].trim()
            };
        });

        neueRunde();

    } catch (error) {
        ausgabe("Fehler: " + error.message);
    }
}


// ================================
// Neue Runde
// ================================

function neueRunde() {

    if (vokabeln.length === 0) {
        ausgabe("\nFertig! Alle Vokabeln wurden richtig beantwortet.");
        ausgabe("Du hast " + runde + " Runden gebraucht.");
        document.getElementById("answer").disabled = true;
        return;
    }

    runde++;

    ausgabe("\nRunde " + runde);
    ausgabe("Noch " + vokabeln.length + " Wörter!\n");

    naechsteVokabel();
}


// ================================
// Nächste Vokabel
// ================================

function naechsteVokabel() {

    const zufallsIndex = Math.floor(Math.random() * vokabeln.length);

    aktuelleVokabel = vokabeln[zufallsIndex];

    ausgabe("Übersetze: " + aktuelleVokabel.deutsch);


    document.getElementById("answer").focus();
}


// ================================
// Antwort überprüfen
// ================================

function antwortPruefen() {

    const input = document.getElementById("answer");
    const antwort = input.value.trim();

    if (antwort === "") {
        return;
    }

    const richtig =
        antwort.toLowerCase() ===
        aktuelleVokabel.englisch.toLowerCase();


    if (richtig) {

        ausgabe(
            "Richtig: " +
            aktuelleVokabel.deutsch +
            " -> " +
            aktuelleVokabel.englisch
        );

        vokabeln.splice(vokabeln.indexOf(aktuelleVokabel), 1);

    } else {

        ausgabe(
            "Falsch: " +
            aktuelleVokabel.deutsch +
            " -> " +
            aktuelleVokabel.englisch
        );

        // Falsche Vokabel bleibt in der Liste
    }

    input.value = "";

    // Wenn die Runde fertig ist
    if (vokabeln.length === 0) {
        neueRunde();
        return;
    }

    // Nächste Vokabel
    naechsteVokabel();
}


// ================================
// Text im Terminal ausgeben
// ================================

function ausgabe(text) {

    const output = document.getElementById("output");

    const zeile = document.createElement("div");
    zeile.textContent = text;

    output.appendChild(zeile);

    window.scrollTo(0, document.body.scrollHeight);
}


// ================================
// Enter-Taste
// ================================

document
    .getElementById("answer")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            antwortPruefen();
        }

    });


// ================================
// Start
// ================================

vokabelnEinlesen();
