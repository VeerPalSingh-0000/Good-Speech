// src/data/easyOnsetData.js
// Extensive Speech Therapy Easy-Onset Word & Sentence Library + Procedural Generator

// Helper function to format Hindi Easy Onset (Stretching 1st Syllable)
export const formatHindiOnset = (word) => {
  if (!word) return word;
  try {
    const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(word));
    const firstChar = segments[0] ? segments[0].segment : '';
    return `${firstChar}..${firstChar}.. ${word}`;
  } catch (e) {
    // Fallback if Intl.Segmenter fails
    const firstChar = Array.from(word)[0] || '';
    return `${firstChar}..${firstChar}.. ${word}`;
  }
};

// Helper function to format English Easy Onset (Stretching 1st Syllable/Letter)
export const formatEnglishOnset = (word) => {
  if (!word) return word;
  const cleanMatch = word.match(/[a-zA-Z]+/);
  if (!cleanMatch) return word;
  
  const alphaPart = cleanMatch[0];
  const syllableMatch = alphaPart.match(/^[^aeiouyAEIOUY]*[aeiouyAEIOUY]+/);
  const firstSyllable = (syllableMatch ? syllableMatch[0] : alphaPart.charAt(0)).toLowerCase();
  
  return `${firstSyllable}..${firstSyllable}.. ${word}`;
};

// Build word object
const wordObj = (text, lang, translation = "") => {
  const stretched = lang === 'hi' ? formatHindiOnset(text) : formatEnglishOnset(text);
  return { text, stretched, translation };
};

// -------------------------------------------------------------
// 1. MASSIVE SINGLE WORDS DATABASE (LEVEL 1)
// -------------------------------------------------------------
const HINDI_SINGLE_WORDS = [
  "अनार", "आम", "इमली", "ईख", "उल्लू", "ऊन", "ऋषि", "एक", "ऐनक", "ओस", "औषध", "अंगूर",
  "कमल", "खरगोश", "गमला", "घड़ी", "चम्मच", "छतरी", "जहाज", "झंडा", "टमाटर", "ठठेरा", "डमरू",
  "ढोलक", "तरबूज", "थर्मस", "दवात", "धनुष", "नल", "पतंग", "फल", "बस", "भालू", "मछली",
  "यज्ञ", "रथ", "लट्टू", "वकील", "शलजम", "षट्कोण", "सपेरा", "हवाईजहाज", "ज्ञान", "प्रकाश",
  "सफलता", "शांति", "उजाला", "एकता", "आकाश", "जीवन", "सत्य", "धर्म", "कर्म", "प्रेम",
  "दया", "आशा", "विश्वास", "साहस", "आनंद", "सुख", "शांति", "प्रगति", "समृद्धि", "स्वादिष्ट",
  "सुंदर", "कोमल", "शीतल", "मधुर", "पावन", "निर्मल", "उज्ज्वल", "दिव्य", "अद्भुत", "अनमोल",
  "किताब", "कलम", "कागज़", "मित्र", "परिवार", "घर", "विद्यालय", "शिक्षक", "छात्र", "ज्ञान",
  "सूर्य", "चंद्रमा", "तारे", "समुद्र", "पर्वत", "नदी", "फूल", "वृक्ष", "बगीचा", "हवा"
];

const ENGLISH_SINGLE_WORDS = [
  "apple", "evening", "India", "open", "umbrella", "ocean", "echo", "anchor", "orbit", "urban",
  "airplane", "eagle", "island", "owl", "unicorn", "amber", "emerald", "iron", "olive", "utopia",
  "breath", "calm", "dream", "flow", "grace", "harmony", "peace", "quiet", "rhythm", "serene",
  "smooth", "soft", "silence", "gentle", "tranquil", "breeze", "light", "clarity", "focus", "balance",
  "beauty", "wisdom", "courage", "freedom", "future", "nature", "journey", "success", "victory", "growth",
  "sunshine", "morning", "starlight", "river", "mountain", "forest", "flower", "garden", "cloud", "rainbow",
  "friend", "smile", "heart", "spark", "energy", "power", "spirit", "delight", "pleasure", "marvel",
  "action", "believe", "create", "discover", "explore", "flourish", "glide", "heal", "inspire", "joy"
];

// -------------------------------------------------------------
// 2. MASSIVE SENTENCES DATABASE (LEVEL 2)
// -------------------------------------------------------------
const HINDI_SENTENCES = [
  { text: "आज अच्छा दिन है", translation: "Today is a good day" },
  { text: "मैं शांत और सहज हूँ", translation: "I am calm and comfortable" },
  { text: "हर दिन नया अवसर लाता है", translation: "Every day brings a new opportunity" },
  { text: "एक कदम रोज़ बढ़ाओ", translation: "Take one step daily" },
  { text: "आप कैसे हैं", translation: "How are you" },
  { text: "सब ठीक है", translation: "All is well" },
  { text: "मैं सहजता से बात करता हूँ", translation: "I speak effortlessly" },
  { text: "मेरा मन शांत है", translation: "My mind is peaceful" },
  { text: "धीरे और स्पष्ट बोलें", translation: "Speak slowly and clearly" },
  { text: "साँस गहरी लें और छोड़ें", translation: "Take a deep breath and exhale" },
  { text: "जीवन सुंदर और सरल है", translation: "Life is beautiful and simple" },
  { text: "ज्ञान ही सच्चा धन है", translation: "Knowledge is the true wealth" },
  { text: "सफलता निरंतर प्रयास से मिलती है", translation: "Success comes from continuous effort" },
  { text: "प्रकृति की सुंदरता मन मोह लेती है", translation: "Nature's beauty captivates the mind" },
  { text: "सत्य हमेशा जीतता है", translation: "Truth always wins" },
  { text: "परिश्रम से हर सपना पूरा होता है", translation: "Hard work fulfills every dream" },
  { text: "सुबह का समय बहुत सुहावना होता है", translation: "Morning time is very pleasant" },
  { text: "सकारात्मक विचार नया मार्ग दिखाते हैं", translation: "Positive thoughts show a new path" },
  { text: "धैर्य और संयम सबसे बड़े गुण हैं", translation: "Patience and self-control are greatest virtues" },
  { text: "मुस्कुराहट से हर काम आसान होता है", translation: "A smile makes everything easier" },
  { text: "हर भाषा में मिठास होती है", translation: "There is sweetness in every language" },
  { text: "विद्या से विनय आती है", translation: "Education brings humility" },
  { text: "समय बहुत मूल्यवान है", translation: "Time is very valuable" },
  { text: "मित्रता जीवन का उपहार है", translation: "Friendship is life's gift" },
  { text: "स्वास्थ्य ही सबसे बड़ा धन है", translation: "Health is the greatest wealth" }
];

const ENGLISH_SENTENCES = [
  { text: "I speak calmly and smoothly", translation: "I speak calmly and smoothly" },
  { text: "Every morning brings a fresh start", translation: "Every morning brings a fresh start" },
  { text: "I can do this easily", translation: "I can do this easily" },
  { text: "Apples are sweet and healthy", translation: "Apples are sweet and healthy" },
  { text: "Open the door to success", translation: "Open the door to success" },
  { text: "Breathe in peace and release tension", translation: "Breathe in peace and release tension" },
  { text: "Soft initial sounds help smooth speech", translation: "Soft initial sounds help smooth speech" },
  { text: "Patience and practice lead to mastery", translation: "Patience and practice lead to mastery" },
  { text: "The sun shines brightly in the sky", translation: "The sun shines brightly in the sky" },
  { text: "Focus on gentle breathing before speaking", translation: "Focus on gentle breathing before speaking" },
  { text: "Today is a wonderful day to learn", translation: "Today is a wonderful day to learn" },
  { text: "Continuous effort creates great results", translation: "Continuous effort creates great results" },
  { text: "Kind words bring joy to everyone", translation: "Kind words bring joy to everyone" },
  { text: "Nature fills our hearts with wonder", translation: "Nature fills our hearts with wonder" },
  { text: "Confidence comes from daily practice", translation: "Confidence comes from daily practice" },
  { text: "Clear speech is a skill you master", translation: "Clear speech is a skill you master" },
  { text: "Small steps every day lead to big progress", translation: "Small steps every day lead to big progress" },
  { text: "Keep moving forward with a smile", translation: "Keep moving forward with a smile" },
  { text: "Your voice is unique and powerful", translation: "Your voice is unique and powerful" },
  { text: "Harmony begins with a relaxed breath", translation: "Harmony begins with a relaxed breath" }
];

// Helper to turn raw words into level 1 item
const rawWordToItem = (word, lang, index) => {
  return {
    id: `${lang}-w-${index}`,
    words: [wordObj(word, lang)],
    hint: lang === 'hi' ? `Gentle onset: '${formatHindiOnset(word)}'` : `Soft 1st syllable stretch: '${formatEnglishOnset(word)}'`,
    lang
  };
};

// Helper to turn raw sentence into level 2 item
const rawSentenceToItem = (sentence, lang, index) => {
  const wordsArr = sentence.text.split(' ').map(w => wordObj(w, lang));
  return {
    id: `${lang}-s-${index}`,
    words: wordsArr,
    translation: sentence.translation,
    hint: lang === 'hi' ? `Stretch 1st syllable of EACH word smoothly` : `Stretch 1st syllable of EACH word in sequence`,
    lang
  };
};

// Generate full pools
export const LEVEL_1_ITEMS = [
  ...HINDI_SINGLE_WORDS.map((w, i) => rawWordToItem(w, 'hi', i)),
  ...ENGLISH_SINGLE_WORDS.map((w, i) => rawWordToItem(w, 'en', i))
];

export const LEVEL_2_ITEMS = [
  ...HINDI_SENTENCES.map((s, i) => rawSentenceToItem(s, 'hi', i)),
  ...ENGLISH_SENTENCES.map((s, i) => rawSentenceToItem(s, 'en', i))
];

// Function to fetch a randomized, infinite list of items filtered by level & language
export const getFilteredItems = (levelIdx, lang) => {
  const sourcePool = levelIdx === 0 ? LEVEL_1_ITEMS : LEVEL_2_ITEMS;
  if (lang === 'both') return sourcePool;
  return sourcePool.filter(item => item.lang === lang);
};

// Procedural Sentence Generator to produce infinite dynamic sentences if pool exhausts!
const HINDI_SUBJECTS = ["मैं", "आप", "वह", "हमारा देश", "सफलता", "जीवन", "यह समय", "हर कदम"];
const HINDI_ADJECTIVES = ["शांत", "सुंदर", "पावन", "उज्ज्वल", "सकारात्मक", "आनंददायक", "सहज", "महान"];
const HINDI_VERBS = ["है।", "रहता है।", "लाता है।", "बनता है।", "सिखाता है।", "दिलाता है।"];

const ENGLISH_SUBJECTS = ["My speech", "Every day", "Gentle breathing", "Confidence", "Daily practice", "A calm mind", "Clear voice"];
const ENGLISH_ADJECTIVES = ["is smooth", "brings joy", "creates success", "feels natural", "builds strength", "leads to peace"];

export const generateRandomProceduralItem = (levelIdx, lang) => {
  const targetLang = lang === 'both' ? (Math.random() > 0.5 ? 'hi' : 'en') : lang;
  const id = `gen-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  if (levelIdx === 0) {
    // Single word
    const words = targetLang === 'hi' ? HINDI_SINGLE_WORDS : ENGLISH_SINGLE_WORDS;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return rawWordToItem(randomWord, targetLang, id);
  } else {
    // Sentence
    if (targetLang === 'hi') {
      const subj = HINDI_SUBJECTS[Math.floor(Math.random() * HINDI_SUBJECTS.length)];
      const adj = HINDI_ADJECTIVES[Math.floor(Math.random() * HINDI_ADJECTIVES.length)];
      const verb = HINDI_VERBS[Math.floor(Math.random() * HINDI_VERBS.length)];
      const sentenceText = `${subj} ${adj} ${verb}`;
      return rawSentenceToItem({ text: sentenceText, translation: "Practice sentence" }, 'hi', id);
    } else {
      const subj = ENGLISH_SUBJECTS[Math.floor(Math.random() * ENGLISH_SUBJECTS.length)];
      const adj = ENGLISH_ADJECTIVES[Math.floor(Math.random() * ENGLISH_ADJECTIVES.length)];
      const sentenceText = `${subj} ${adj}`;
      return rawSentenceToItem({ text: sentenceText, translation: "Practice sentence" }, 'en', id);
    }
  }
};
