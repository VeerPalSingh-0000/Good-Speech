const word = "किताब";
const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
const segments = Array.from(segmenter.segment(word));
console.log("Hindi 1:", segments[0].segment);

const word2 = "प्रगति";
const segments2 = Array.from(segmenter.segment(word2));
console.log("Hindi 2:", segments2[0].segment);

const word3 = "ज्ञान";
const segments3 = Array.from(segmenter.segment(word3));
console.log("Hindi 3:", segments3[0].segment);

const engWords = ["apple", "evening", "smooth", "rhythm", "quiet", "airplane"];
engWords.forEach(w => {
  const match = w.match(/^[^aeiouyAEIOUY]*[aeiouyAEIOUY]+/);
  console.log("Eng:", w, "->", match ? match[0] : w[0]);
});
