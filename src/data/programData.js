// src/data/programData.js
// Speech Improvement Program — Phase-based architecture
// Phase 1: Foundation (30 days / 4 weeks)
// Future: Phase 2 (Intermediate), Phase 3 (Advanced), Phase 4 (Mastery), etc.

// Activity types that map to app features
export const ACTIVITY_TYPES = {
  BREATHING: 'breathing',
  VARNMALA: 'varnmala',
  READING: 'reading',
  LOUD_READING: 'loudReading',
  TONGUE_TWISTERS: 'tongueTwisters',
  SPEAKING: 'speaking',
  EASY_ONSET: 'easyOnset',
};

// Week themes with colors
export const WEEK_THEMES = {
  1: { color: 'emerald', emoji: '🌿', gradient: 'from-emerald-500 to-teal-600' },
  2: { color: 'blue', emoji: '🔵', gradient: 'from-blue-500 to-indigo-600' },
  3: { color: 'purple', emoji: '🟣', gradient: 'from-purple-500 to-violet-600' },
  4: { color: 'rose', emoji: '🔴', gradient: 'from-rose-500 to-red-600' },
};

const getRecommendedWPM = (day) => {
  if (day >= 1 && day <= 3) return 40;
  if (day >= 4 && day <= 6) return 45;
  if (day >= 7 && day <= 9) return 50;
  if (day >= 10 && day <= 12) return 55;
  if (day >= 13 && day <= 15) return 60;
  if (day >= 16 && day <= 20) return 65 + (day - 16);
  if (day >= 21 && day <= 25) return 75 + (day - 21);
  if (day >= 26 && day <= 30) return 85 + (day - 26) * 3;
  if (day > 30) return 100;
  return 40;
};

// Curated Hindi sentences for breathing exercises — progressive difficulty
const BREATHING_SENTENCES = {
  // Week 1: Very simple, short
  week1: [
    ["मेरा नाम वीर है", "मैं आज अभ्यास कर रहा हूँ"],
    ["आज मौसम अच्छा है", "मैं शांत हूँ"],
    ["मुझे पढ़ना पसंद है", "मैं रोज़ अभ्यास करता हूँ"],
    ["यह मेरा घर है", "मैं खुश हूँ आज"],
    ["सूरज निकला है", "हवा ठंडी है"],
    ["मैं स्कूल जाता हूँ", "पानी पीना ज़रूरी है"],
    ["आज रविवार है", "मैं आराम कर रहा हूँ"],
  ],
  // Week 2: Slightly longer, more natural
  week2: [
    ["म्म्मेरा नाम वीर है और मैं अभ्यास कर रहा हूँ", "ह्ह्हम सब मिलकर बोलेंगे"],
    ["आज का दिन बहुत अच्छा है", "मैं धीरे धीरे बोल रहा हूँ"],
    ["मुझे अपने परिवार से प्यार है", "हम सब साथ में रहते हैं"],
    ["सुबह जल्दी उठना अच्छी आदत है", "मैं रोज़ सुबह उठता हूँ"],
    ["पेड़ पौधे हमें ऑक्सीजन देते हैं", "प्रकृति बहुत सुंदर है"],
    ["मैं अपना काम समय पर करता हूँ", "मेहनत से सफलता मिलती है"],
    ["किताबें ज्ञान का भंडार हैं", "पढ़ाई में मन लगाना चाहिए"],
  ],
  // Week 3: Natural conversational
  week3: [
    ["आज मैंने सुबह जल्दी उठकर अभ्यास किया और अच्छा लगा"],
    ["मेरे दोस्त ने मुझसे पूछा कि मैं कैसे इतना अच्छा बोलने लगा"],
    ["हमें हर दिन कुछ नया सीखने की कोशिश करनी चाहिए"],
    ["बारिश में भीगना मुझे बहुत पसंद है लेकिन ठंड भी लगती है"],
    ["मैंने आज बाज़ार जाकर सब्ज़ियाँ खरीदीं और खाना बनाया"],
    ["जब मैं छोटा था तब मुझे क्रिकेट खेलना बहुत पसंद था"],
    ["अगर हम रोज़ अभ्यास करें तो हम ज़रूर सफल होंगे"],
  ],
  // Week 4: Complex, expressive
  week4: [
    ["मैं आज बहुत आत्मविश्वास से भरा हुआ महसूस कर रहा हूँ"],
    ["हर इंसान के अंदर बहुत ताकत होती है बस उसे पहचानना होता है"],
    ["मेरा मानना है कि निरंतर अभ्यास से हर मुश्किल आसान हो जाती है"],
    ["जीवन में सबसे ज़रूरी चीज़ है कि हम खुद पर विश्वास रखें"],
    ["मैंने सीखा है कि धैर्य और मेहनत से हर लक्ष्य हासिल किया जा सकता है"],
    ["आज मैं फ़ोन पर अपने दोस्त से बात करूँगा बिना किसी डर के"],
    ["जब हम अपनी कमज़ोरियों को स्वीकार करते हैं तब असली ताकत आती है"],
    ["मैं अपनी बोलने की क्षमता पर गर्व करता हूँ और आगे बढ़ता रहूँगा"],
    ["हर दिन एक नया मौका है कि हम कल से बेहतर बनें"],
  ],
  // Week 5 (Phase 2): Block Desensitization & Voluntary Tension Release
  week5: [
    ["अगर रुकावट आए तो घबराएँ नहीं, सांस लेकर सहज रहें"],
    ["मैं जानबूझकर हल्का सा अटक कर शांति से आगे बढ़ता हूँ"],
    ["बोलने में कोई तनाव नहीं है, श्वास एकदम हल्की है"],
    ["जब भी ब्लॉक बने, 2 सेकंड रुकें और दोबारा श्वास लें"],
    ["हर शब्द को दबाव के बिना बोलना मेरा लक्ष्य है"],
    ["हकलाना कोई कमी नहीं है, बस एक आदत है जिसे बदलना है"],
    ["शांत मन से बोला गया हर शब्द प्रभाव छोड़ता है"],
  ],
  // Week 6 (Phase 2): Prolongation & Gentle Sound Glide
  week6: [
    ["स्वरों को खिंचते हुए सहजता से अगले शब्द पर जाएं"],
    ["पहला अक्षर लम्बा और मुलायम बोलें, बिना किसी ज़ोर के"],
    ["आअाज का अभ्यास मुझे और अधिक निडर बना रहा है"],
    ["हर वाक्य की शुरुआत एक धीमी श्वास के साथ करें"],
    ["शब्दों का प्रवाह नदी की तरह निरंतर और शांत है"],
    ["बोलने की गति मेरी अपनी पसंद है, कोई जल्दबाज़ी नहीं"],
    ["मैं अपनी आवाज़ की लय का आनंद ले रहा हूँ"],
  ],
  // Week 7 (Phase 2): Controlled Conversation & Phone Practice
  week7: [
    ["हेलो, मैं अपने अभ्यास के सिलसिले में आपसे बात कर रहा हूँ"],
    ["फ़ोन पर बात करते समय मैं अपनी गति नियंत्रित रखता हूँ"],
    ["बाज़ार में या दुकान पर बोलते समय आत्मविश्वास बना रहता है"],
    ["किसी से भी सवाल पूछते समय पहले मन में श्वास लें"],
    ["मैं अपनी बात पूरी स्पष्टता और ठहराव के साथ कहूँगा"],
    ["दूसरों की प्रतिक्रिया से बेपरवाह होकर अपनी लय बनाए रखें"],
    ["हर बातचीत मेरे लिए एक नया सीखने का अवसर है"],
  ],
  // Week 8 (Phase 2): Resilience, Flow & Self-Correction
  week8: [
    ["रुकावट आने पर स्वयं को तुरंत शांत करना मेरी शक्ति है"],
    ["गलतियों से घबराने के बजाय मैं आसानी से रीसेट करता हूँ"],
    ["लंबी बातचीत में भी मेरी श्वास संतुलित रहती है"],
    ["आज मैं सार्वजनिक रूप से आत्मविश्वास से अपनी राय रखूँगा"],
    ["प्रवाह का अर्थ बिना रुके बोलना नहीं, बल्कि तनावमुक्त बोलना है"],
    ["मैं अपनी बोलने की हर सफलता का जश्न मनाता हूँ"],
    ["60 दिनों का यह निरंतर अभ्यास मेरी पहचान बदल रहा है"],
  ],
};

// Speaking prompts for mirror/real-life practice
const SPEAKING_PROMPTS = {
  week1: [
    { hindi: "अपना नाम और उम्र बताइए", english: "Tell your name and age" },
    { hindi: "आज का मौसम कैसा है बताइए", english: "Describe today's weather" },
    { hindi: "अपने परिवार के बारे में बताइए", english: "Tell about your family" },
    { hindi: "आपका पसंदीदा खाना क्या है", english: "What is your favorite food" },
    { hindi: "अपने घर का वर्णन कीजिए", english: "Describe your home" },
    { hindi: "आज आपने क्या किया बताइए", english: "Tell what you did today" },
    { hindi: "अपने सबसे अच्छे दोस्त के बारे में बताइए", english: "Tell about your best friend" },
  ],
  week2: [
    { hindi: "दुकानदार से कोई चीज़ का दाम पूछिए", english: "Ask a shopkeeper for a price" },
    { hindi: "किसी से रास्ता पूछिए", english: "Ask someone for directions" },
    { hindi: "अपने दिन की योजना बताइए", english: "Share your day's plan" },
    { hindi: "अपनी पसंदीदा फ़िल्म के बारे में बताइए", english: "Talk about your favorite movie" },
    { hindi: "किसी को फ़ोन पर हाल-चाल पूछिए", english: "Call someone and ask how they are" },
    { hindi: "अपने शहर के बारे में बताइए", english: "Tell about your city" },
    { hindi: "किसी विषय पर 1 मिनट बोलिए", english: "Speak for 1 minute on any topic" },
  ],
  week3: [
    { hindi: "किसी दोस्त को 2-3 मिनट तक कोई कहानी सुनाइए", english: "Tell a 2-3 min story to a friend" },
    { hindi: "कोई विषय चुनकर उसे किसी को समझाइए (जैसे शिक्षक)", english: "Explain a topic like a teacher" },
    { hindi: "अपनी आवाज़ रिकॉर्ड करके सुनिए", english: "Record yourself speaking and listen" },
    { hindi: "किसी अनजान व्यक्ति से बात कीजिए", english: "Talk to a stranger" },
    { hindi: "फ़ोन पर किसी से 2 मिनट बात कीजिए", english: "Have a 2 min phone conversation" },
    { hindi: "किसी को अपना पसंदीदा व्यंजन बनाना सिखाइए", english: "Teach someone your favorite recipe" },
    { hindi: "आज का अख़बार पढ़कर किसी को ख़बर सुनाइए", english: "Read news and share it with someone" },
  ],
  week4: [
    { hindi: "किसी से फ़ोन पर 5 मिनट बात कीजिए", english: "Have a 5 min phone call" },
    { hindi: "किसी ग्रुप में कोई विषय पर बोलिए", english: "Speak on a topic in a group" },
    { hindi: "दुकान में जाकर 3-4 चीज़ें माँगिए और मोलभाव कीजिए", english: "Shop and bargain for items" },
    { hindi: "किसी से अपने सपनों के बारे में बात कीजिए", english: "Talk about your dreams" },
    { hindi: "कोई प्रश्न पूछिए किसी अनजान व्यक्ति से", english: "Ask a question to a stranger" },
    { hindi: "अपने 30 दिन के अनुभव के बारे में बताइए", english: "Share your 30-day experience" },
    { hindi: "किसी भी विषय पर 5 मिनट बिना रुके बोलिए", english: "Speak for 5 minutes non-stop" },
    { hindi: "अपनी उपलब्धियों को दूसरों के साथ साझा कीजिए", english: "Share your achievements" },
    { hindi: "आत्मविश्वास से किसी भी बातचीत में भाग लीजिए", english: "Confidently join any conversation" },
  ],
  week5: [
    { hindi: "जानबूझकर हल्का हकलाकर (Voluntary Stutter) वाक्य पूरा कीजिए", english: "Practice voluntary stuttering comfortably in front of a mirror" },
    { hindi: "ब्लॉक आने पर 3 सेकंड रुककर गहरी श्वास लें", english: "Pause 3 sec during a simulated block & breathe smoothly" },
    { hindi: "अपनी किसी कमजोरी के बारे में बिना झिझक 2 मिनट बोलिए", english: "Speak freely for 2 mins about an obstacle you faced" },
    { hindi: "शीशे में देखते हुए गले के तनाव को ढीला महसूस कीजिए", english: "Look in the mirror and conscious relax throat muscles" },
    { hindi: "किसी दोस्त को फ़ोन करके अपना अभ्यास लक्ष्य बताएं", english: "Call a friend and explain your speech practice goals" },
    { hindi: "दुकानदार से जानबूझकर धीरे और रुककर बात कीजिए", english: "Talk to a shopkeeper with deliberate slow pacing" },
    { hindi: "आज के अभ्यास से आपने क्या सीखा बताइए", english: "Summarize today's progress and lessons learned" },
  ],
  week6: [
    { hindi: "हर शब्द के पहले स्वर को 2 सेकंड खींचकर बोलिए", english: "Stretch the initial sound of every sentence for 2 seconds" },
    { hindi: "अपनी पसंदीदा पुस्तक का एक पैरा सॉफ्ट ऑनसेट से पढ़ें", english: "Read a paragraph using ultra-soft easy onset" },
    { hindi: "किसी अनजान व्यक्ति से रास्ता पूछने का नाटक कीजिए", english: "Roleplay asking a stranger for street directions" },
    { hindi: "गहरी श्वास लेकर स्वर अ-इ-उ का लंबा उच्चारण करें", english: "Hold long relaxed vowel sounds with full diaphragmatic breath" },
    { hindi: "फ़ोन पर ऑनलाइन ऑर्डर देने का अभ्यास कीजिए", english: "Simulate placing a food or grocery order over the phone" },
    { hindi: "किसी कठिन शब्द को प्रोलोंगेशन तकनीक से बोलें", english: "Glide through a difficult word using prolongation technique" },
    { hindi: "आईने के सामने 3 मिनट तक सहज गति से बोलें", english: "Speak at a relaxed smooth pace in front of mirror for 3 mins" },
  ],
  week7: [
    { hindi: "फ़ोन पर किसी कस्टमर केयर या दोस्त से 3 मिनट बात करें", english: "Conduct a 3-minute real or practice phone call calmly" },
    { hindi: "दुकान पर जाकर किसी वस्तु के बारे में विस्तार से पूछें", english: "Inquire about product details at a local store" },
    { hindi: "किसी मित्र के साथ चाय/कॉफ़ी पर 5 मिनट संवाद करें", english: "Have a 5-minute relaxed conversation over coffee" },
    { hindi: "अपने काम या पढ़ाई के बारे में 2 मिनट की प्रस्तुति दें", english: "Give a 2-minute presentation about your work or studies" },
    { hindi: "बातचीत में बीच-बीच में 2 सेकंड का विराम (Pause) लें", english: "Practice inserting deliberate 2-second pauses while talking" },
    { hindi: "किसी पारिवारिक चर्चा में बिना डरे अपना पक्ष रखें", english: "Express your opinions clearly in a family discussion" },
    { hindi: "आज दिन भर की 3 सफल बातचीतों के बारे में बताएं", english: "Recount 3 successful conversation experiences from today" },
  ],
  week8: [
    { hindi: "किसी ग्रुप चर्चा में आत्मविश्वास के साथ 3 मिनट बोलें", english: "Participate in a group discussion for 3 minutes confidently" },
    { hindi: "अचानक आए ब्लॉक को बिना घबराए रीसेट करके आगे बढ़ें", english: "Recover immediately and smoothly from an unexpected speech block" },
    { hindi: "अपने 60 दिन के भाषण सुधार यात्रा का वर्णन करें", english: "Deliver a speech reflecting on your 60-day recovery journey" },
    { hindi: "अनजान व्यक्ति से किसी विषय पर विचार-विमर्श करें", english: "Initiate a short casual debate/discussion with a acquaintance" },
    { hindi: "बिना किसी तनाव के 5 मिनट तक निरंतर प्रवाहमयी बोलें", english: "Speak continuously for 5 minutes focusing purely on relaxation" },
    { hindi: "सकारात्मक अफ़र्मेशन (Affirmations) ज़ोर से बोलें", english: "Recite positive speech confidence affirmations aloud" },
    { hindi: "भविष्य की बातचीत की चुनौतियों के लिए स्वयं को तैयार करें", english: "Prepare yourself mentally for upcoming high-pressure talks" },
  ],
};

// Helper to build a day's activities
const buildDay = (dayNum, weekNum, config) => {
  const { breathingSentences, speakingPrompt } = config;
  const targetWPM = getRecommendedWPM(dayNum);

  return {
    day: dayNum,
    week: weekNum,
    activities: [
      {
        id: `day${dayNum}-breathing`,
        type: ACTIVITY_TYPES.BREATHING,
        title: 'श्वास अभ्यास (Diaphragmatic Breathing)',
        titleEn: 'Diaphragmatic Breathing Warm-Up',
        icon: 'fas fa-wind',
        duration: 2,
        instructions: 'बोलने से पहले गहरी श्वास लें। पेट को फूलने दें।',
        instructionsEn: 'Inhale deeply through nose, exhale smoothly with a hum or sigh. Zero throat tension.',
        sentences: breathingSentences,
        linkedView: '/breathing',
      },
      {
        id: `day${dayNum}-varnmala`,
        type: ACTIVITY_TYPES.VARNMALA,
        title: 'वर्णमाला और स्वर अभ्यास',
        titleEn: 'Varnmala / Syllable Prolongation',
        icon: 'fas fa-language',
        duration: 3,
        instructions: 'स्वरों और व्यंजनों का ज़ोर से और स्पष्ट उच्चारण करें। पहले अक्षर को खींचें।',
        instructionsEn: 'Practice vowels/consonants. Gently stretch the first sound (e.g., ककक-अ).',
        linkedView: '/varnmala',
      },
      {
        id: `day${dayNum}-easy-onset`,
        type: ACTIVITY_TYPES.EASY_ONSET,
        title: 'आसान शुरुआत (Easy Onset)',
        titleEn: 'Easy Onset (Syllable Stretching)',
        icon: 'fas fa-feather-alt',
        duration: 4,
        instructions: 'हर शब्द के पहले अक्षर को हल्का सा खींचें (जैसे a..a.. apple)।',
        instructionsEn: 'Gently stretch the first syllable of EVERY word without tension.',
        linkedView: '/easy-onset',
      },
      {
        id: `day${dayNum}-reading`,
        type: ACTIVITY_TYPES.READING,
        title: 'नियंत्रित गति से पढ़ना',
        titleEn: 'Controlled Speed Reading',
        icon: 'fas fa-book-reader',
        duration: 15,
        instructions: `सख्ती से ${targetWPM} WPM की गति से पढ़ें। रुकें तो ज़ोर न लगाएं।`,
        instructionsEn: `Read strictly at ${targetWPM} WPM. If blocked: stop, breathe, try again slowly.`,
        targetWPM,
        linkedView: '/stories',
      },
      {
        id: `day${dayNum}-speaking`,
        type: ACTIVITY_TYPES.SPEAKING,
        title: 'आईना अभ्यास (Spontaneous Mirror)',
        titleEn: 'Spontaneous Mirror Practice',
        icon: 'fas fa-user',
        duration: 6,
        instructions: `आईने के सामने ${targetWPM} WPM पर अभ्यास करें: ${speakingPrompt.hindi}`,
        instructionsEn: `Speak freely at ${targetWPM} WPM: ${speakingPrompt.english}`,
        prompt: speakingPrompt,
        linkedView: '/mirror',
      },
    ],
  };
};

// Build all 30 days
const buildPhase1Days = () => {
  const days = [];

  // WEEK 1 (Days 1-7): Control & Awareness
  for (let d = 0; d < 7; d++) {
    days.push(buildDay(d + 1, 1, {
      breathingSentences: BREATHING_SENTENCES.week1[d],
      speakingPrompt: SPEAKING_PROMPTS.week1[d],
    }));
  }

  // WEEK 2 (Days 8-14): Stability & Confidence
  for (let d = 0; d < 7; d++) {
    days.push(buildDay(d + 8, 2, {
      breathingSentences: BREATHING_SENTENCES.week2[d],
      speakingPrompt: SPEAKING_PROMPTS.week2[d],
    }));
  }

  // WEEK 3 (Days 15-21): Real Speaking Control
  for (let d = 0; d < 7; d++) {
    days.push(buildDay(d + 15, 3, {
      breathingSentences: BREATHING_SENTENCES.week3[d],
      speakingPrompt: SPEAKING_PROMPTS.week3[d],
    }));
  }

  // WEEK 4 (Days 22-30): Fluency & Confidence (9 days to reach 30)
  for (let d = 0; d < 9; d++) {
    const weekSentences = BREATHING_SENTENCES.week4;
    const weekPrompts = SPEAKING_PROMPTS.week4;
    days.push(buildDay(d + 22, 4, {
      breathingSentences: weekSentences[d % weekSentences.length],
      speakingPrompt: weekPrompts[d % weekPrompts.length],
    }));
  }

  return days;
};

// Helper to dynamically build days for later phases
const buildPhaseDays = (startDay, endDay, weeks) => {
  const days = [];
  for (let d = startDay; d <= endDay; d++) {
    const week = weeks.find(w => d >= w.dayRange[0] && d <= w.dayRange[1]);
    const weekId = week ? week.id : Math.ceil(d / 7);
    const weekSentences = BREATHING_SENTENCES[`week${weekId}`] || BREATHING_SENTENCES.week4;
    const weekPrompts = SPEAKING_PROMPTS[`week${weekId}`] || SPEAKING_PROMPTS.week4;
    const dayIndexInWeek = Math.abs((d - (week?.dayRange[0] || startDay))) % weekSentences.length;
    
    days.push(buildDay(d, weekId, {
      breathingSentences: weekSentences[dayIndexInWeek],
      speakingPrompt: weekPrompts[dayIndexInWeek]
    }));
  }
  return days;
};

// Main program data export
export const PROGRAM_DATA = {
  phases: [
    {
      id: 1,
      title: 'Foundation (Days 1–30)',
      titleHi: 'नींव (दिन 1–30)',
      description: 'Build control over your speech muscles, breathing, and rhythm.',
      descriptionHi: 'अपनी बोली की मांसपेशियों, श्वास और लय पर नियंत्रण बनाएँ।',
      totalDays: 30,
      weeks: [
        {
          id: 1,
          title: 'Control & Awareness',
          titleHi: 'नियंत्रण और जागरूकता',
          goal: 'Slow down speech + remove tension',
          goalHi: 'बोलने की गति धीमी करें + तनाव दूर करें',
          rule: "Don't try to sound normal — try to sound controlled",
          ruleHi: 'सामान्य बोलने की कोशिश न करें — नियंत्रित बोलने की कोशिश करें',
          emoji: '🌿',
          color: 'emerald',
          dayRange: [1, 7],
          tabLabel: 'Week 1',
          tabShortLabel: 'W1',
        },
        {
          id: 2,
          title: 'Stability & Confidence',
          titleHi: 'स्थिरता और आत्मविश्वास',
          goal: 'Speak slow but more natural',
          goalHi: 'धीरे बोलें लेकिन ज़्यादा स्वाभाविक',
          rule: 'Slow + Slightly natural = progress',
          ruleHi: 'धीमा + थोड़ा स्वाभाविक = प्रगति',
          emoji: '🔵',
          color: 'blue',
          dayRange: [8, 14],
          tabLabel: 'Week 2',
          tabShortLabel: 'W2',
        },
        {
          id: 3,
          title: 'Real Speaking Control',
          titleHi: 'असल बोलचाल पर नियंत्रण',
          goal: 'Apply control in real conversations',
          goalHi: 'असली बातचीत में नियंत्रण लागू करें',
          rule: "Don't avoid difficult words",
          ruleHi: 'कठिन शब्दों से बचें नहीं',
          emoji: '🟣',
          color: 'purple',
          dayRange: [15, 21],
          tabLabel: 'Week 3',
          tabShortLabel: 'W3',
        },
        {
          id: 4,
          title: 'Fluency & Confidence',
          titleHi: 'प्रवाह और आत्मविश्वास',
          goal: 'Speak naturally with control',
          goalHi: 'नियंत्रण के साथ स्वाभाविक बोलें',
          rule: 'Focus on communication, not perfection',
          ruleHi: 'संवाद पर ध्यान दें, पूर्णता पर नहीं',
          emoji: '🔴',
          color: 'rose',
          dayRange: [22, 30],
          tabLabel: 'Week 4',
          tabShortLabel: 'W4',
        },
      ],
      days: buildPhase1Days(),
    },
    {
      id: 2,
      title: 'Block Control (Days 31–60)',
      titleHi: 'ब्लॉक नियंत्रण (दिन 31–60)',
      description: 'Manage speech blocks with greater comfort, desensitization & easy onset.',
      descriptionHi: 'सहजता और आसान ऑनसेट के साथ स्पीच ब्लॉक को नियंत्रित करें।',
      totalDays: 30,
      weeks: [
        { id: 5, title: 'Block Desensitization', titleHi: 'ब्लॉक विसंवेदीकरण', goal: 'Release physical tension during blocks', rule: 'Breathe through the block without forcing', emoji: '🟢', color: 'emerald', dayRange: [31, 37], tabLabel: 'Week 5', tabShortLabel: 'W5' },
        { id: 6, title: 'Prolongation & Glide', titleHi: 'प्रोलोंगेशन और ग्लाइड', goal: 'Stretch first sounds smoothly', rule: 'Glide softly into vowels', emoji: '🔵', color: 'blue', dayRange: [38, 44], tabLabel: 'Week 6', tabShortLabel: 'W6' },
        { id: 7, title: 'Controlled Conversations', titleHi: 'नियंत्रित बातचीत', goal: 'Practice controlled speech in daily calls', rule: 'Maintain 60 WPM pace', emoji: '🟣', color: 'purple', dayRange: [45, 52], tabLabel: 'Week 7', tabShortLabel: 'W7' },
        { id: 8, title: 'Resilience & Flow', titleHi: 'लचीलापन और प्रवाह', goal: 'Handle unexpected speech blocks calmly', rule: 'Focus on communication clarity', emoji: '🔴', color: 'rose', dayRange: [53, 60], tabLabel: 'Week 8', tabShortLabel: 'W8' },
      ],
      get days() { return buildPhaseDays(31, 60, this.weeks); }
    },
    {
      id: 3,
      title: '100-Day Habit (Days 61–100)',
      titleHi: '100-दिन की आदत (दिन 61–100)',
      description: 'Establish permanent daily speech habits & spontaneous fluency.',
      descriptionHi: 'स्थायी दैनिक भाषण की आदतें और सहज प्रवाह स्थापित करें।',
      totalDays: 40,
      weeks: [
        { id: 9, title: 'Voluntary Stuttering', titleHi: 'ऐच्छिक हकलाना', goal: 'Reduce speech anxiety and fear of blocks', rule: 'Control the block consciously', emoji: '🟢', color: 'emerald', dayRange: [61, 70], tabLabel: 'Days 61-70', tabShortLabel: '61-70' },
        { id: 10, title: 'Public Speaking Practice', titleHi: 'सार्वजनिक भाषण अभ्यास', goal: 'Speak in front of groups with confidence', rule: 'Use diaphragmatic breathing before starting', emoji: '🔵', color: 'blue', dayRange: [71, 80], tabLabel: 'Days 71-80', tabShortLabel: '71-80' },
        { id: 11, title: 'High-Pressure Situations', titleHi: 'उच्च दबाव वाली स्थितियां', goal: 'Maintain techniques during interviews/meetings', rule: 'Take deliberate pauses', emoji: '🟣', color: 'purple', dayRange: [81, 90], tabLabel: 'Days 81-90', tabShortLabel: '81-90' },
        { id: 12, title: '100-Day Habit Mastery', titleHi: '100-दिन आदत मास्टर', goal: 'Lock in permanent daily practice routine', rule: 'Speech control is now your second nature', emoji: '🔴', color: 'rose', dayRange: [91, 100], tabLabel: 'Days 91-100', tabShortLabel: '91-100' },
      ],
      get days() { return buildPhaseDays(61, 100, this.weeks); }
    },
    {
      id: 4,
      title: 'Skill Mastery (Months 3–6)',
      titleHi: 'कौशल मास्टर (माह 3–6)',
      description: 'Develop stronger speech-management skills & social communication confidence.',
      descriptionHi: 'मजबूत भाषण प्रबंधन कौशल और सामाजिक संचार आत्मविश्वास विकसित करें।',
      totalDays: 90,
      weeks: [
        { id: 13, title: 'Month 4 Integration', titleHi: 'महीना 4 एकीकरण', goal: 'Speak freely in all social environments', rule: 'Embrace natural pauses', emoji: '🟢', color: 'emerald', dayRange: [101, 130], tabLabel: 'Month 4', tabShortLabel: 'M4' },
        { id: 14, title: 'Month 5 Communication', titleHi: 'महीना 5 संचार', goal: 'Deliver presentations with low throat tension', rule: 'Focus on clear message delivery', emoji: '🔵', color: 'blue', dayRange: [131, 160], tabLabel: 'Month 5', tabShortLabel: 'M5' },
        { id: 15, title: '6-Month Milestone', titleHi: '6-महीने का मील का पत्थर', goal: 'Consolidate speech-management confidence', rule: 'Manage speech fluctuations effortlessly', emoji: '🟣', color: 'purple', dayRange: [161, 190], tabLabel: 'Month 6', tabShortLabel: 'M6' }
      ],
      get days() { return buildPhaseDays(101, 190, this.weeks); }
    },
    {
      id: 5,
      title: 'Life Fluency (1 Year+)',
      titleHi: 'लाइफ फ़्लूएंसी (1 वर्ष+)',
      description: 'Maintain and generalize skills to all real-life situations with lifetime control.',
      descriptionHi: 'आजीवन नियंत्रण के साथ सभी वास्तविक परिस्थितियों में कौशलों को बनाए रखें।',
      totalDays: 175,
      weeks: [
        { id: 16, title: 'Real-World Generalization', titleHi: 'वास्तविक दुनिया में सामान्यीकरण', goal: 'Apply speech control in all life scenarios', rule: 'Focus on connection, not perfection', emoji: '⭐', color: 'emerald', dayRange: [191, 365], tabLabel: 'Months 7-12', tabShortLabel: 'M7-12' }
      ],
      get days() { return buildPhaseDays(191, 365, this.weeks); }
    }
  ],
};

// Golden habits — always shown
export const GOLDEN_HABITS = [
  {
    id: 'pause',
    title: 'Pause is Power',
    titleHi: 'रुकना ताकत है',
    description: 'Speak → pause → continue. This prevents blocks.',
    descriptionHi: 'बोलें → रुकें → जारी रखें। यह रुकावट को रोकता है।',
    icon: '⏸️',
  },
  {
    id: 'no-rush',
    title: 'Never Rush',
    titleHi: 'कभी जल्दबाज़ी न करें',
    description: 'Even if stuck: slow down instead of forcing.',
    descriptionHi: 'अगर अटकें भी: ज़बरदस्ती की बजाय धीमे करें।',
    icon: '🐢',
  },
  {
    id: 'accept',
    title: 'Accept Small Blocks',
    titleHi: 'छोटी रुकावटें स्वीकारें',
    description: "Don't panic if you stammer. Stay calm and continue.",
    descriptionHi: 'अगर हकलाएँ तो घबराएँ नहीं। शांत रहें और जारी रखें।',
    icon: '🧘',
  },
];

// Expected results milestones
export const EXPECTED_RESULTS = [
  { day: 7, result: 'Better control', resultHi: 'बेहतर नियंत्रण', icon: '🎯' },
  { day: 14, result: 'Less hesitation', resultHi: 'कम हिचकिचाहट', icon: '💪' },
  { day: 21, result: 'Improved confidence', resultHi: 'बेहतर आत्मविश्वास', icon: '⭐' },
  { day: 30, result: 'Noticeable fluency improvement', resultHi: 'ध्यान देने योग्य प्रवाह सुधार', icon: '🏆' },
];

// Long-term recovery timeline (Months over Days strategy)
export const RECOVERY_TIMELINE = [
  { timeframe: 'First 30 Days', milestone: 'Build consistency, control tension & breathing.', badge: 'Habit Base', icon: '🌱' },
  { timeframe: '60–100 Days', milestone: 'Manage speech blocks with greater comfort & ease.', badge: 'Block Control', icon: '🎯' },
  { timeframe: '6 Months', milestone: 'Develop stronger speech-management skills & confidence.', badge: 'Skill Mastery', icon: '⚡' },
  { timeframe: '1 Year+', milestone: 'Maintain & generalize skills to real-life situations.', badge: 'Life Fluency', icon: '🏆' },
];

// Principle
export const FINAL_PRINCIPLE = {
  text: 'Fluency grows from control, not speed.',
  textHi: 'प्रवाह नियंत्रण से बढ़ता है, गति से नहीं।',
};

// Helper to get a specific day's data
export const getDayData = (dayNumber, phaseId = null) => {
  if (phaseId !== null) {
    const phase = PROGRAM_DATA.phases.find(p => p.id === phaseId);
    if (!phase) return null;
    return phase.days.find(d => d.day === dayNumber) || null;
  }
  for (const phase of PROGRAM_DATA.phases) {
    const day = phase.days.find(d => d.day === dayNumber);
    if (day) return day;
  }
  return null;
};

// Helper to get the week for a given day
export const getWeekForDay = (dayNumber, phaseId = null) => {
  if (phaseId !== null) {
    const phase = PROGRAM_DATA.phases.find(p => p.id === phaseId);
    if (!phase) return null;
    return phase.weeks.find(w => dayNumber >= w.dayRange[0] && dayNumber <= w.dayRange[1]) || null;
  }
  for (const phase of PROGRAM_DATA.phases) {
    const week = phase.weeks.find(w => dayNumber >= w.dayRange[0] && dayNumber <= w.dayRange[1]);
    if (week) return week;
  }
  return null;
};

// Get total duration for a day (sum of all activity durations)
export const getDayTotalDuration = (dayNumber, phaseId = null) => {
  const day = getDayData(dayNumber, phaseId);
  if (!day) return 0;
  return day.activities.reduce((sum, a) => sum + a.duration, 0);
};

// Helper to get phase for a given day number
export const getPhaseForDay = (dayNumber) => {
  for (const phase of PROGRAM_DATA.phases) {
    if (phase.days.some(d => d.day === dayNumber)) return phase;
  }
  return PROGRAM_DATA.phases[0];
};

// Helper to get maximum day number across all available phases
export const getMaxProgramDays = () => {
  const lastPhase = PROGRAM_DATA.phases[PROGRAM_DATA.phases.length - 1];
  if (!lastPhase || !lastPhase.days || lastPhase.days.length === 0) return 365;
  return lastPhase.days[lastPhase.days.length - 1].day;
};
