// src/data/programData.js
// Speech Improvement Program — Phase-based architecture
// Phase 1: Foundation (30 days / 4 weeks)
// Future: Phase 2 (Intermediate), Phase 3 (Advanced), Phase 4 (Mastery), etc.

// Activity types that map to app features
export const ACTIVITY_TYPES = {
  BREATHING: 'breathing',
  READING: 'reading',
  TONGUE_TWISTERS: 'tongueTwisters',
  SPEAKING: 'speaking',
};

// Week themes with colors
export const WEEK_THEMES = {
  1: { color: 'emerald', emoji: '🌿', gradient: 'from-emerald-500 to-teal-600' },
  2: { color: 'blue', emoji: '🔵', gradient: 'from-blue-500 to-indigo-600' },
  3: { color: 'purple', emoji: '🟣', gradient: 'from-purple-500 to-violet-600' },
  4: { color: 'rose', emoji: '🔴', gradient: 'from-rose-500 to-red-600' },
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
};

// Helper to build a day's activities
const buildDay = (dayNum, weekNum, config) => {
  const { breathingDuration, readingDuration, twisterDuration, speakingDuration, targetWPM, breathingSentences, speakingPrompt, speakingType } = config;

  return {
    day: dayNum,
    week: weekNum,
    activities: [
      {
        id: `day${dayNum}-breathing`,
        type: ACTIVITY_TYPES.BREATHING,
        title: 'श्वास अभ्यास',
        titleEn: 'Breathing Exercise',
        icon: 'fas fa-wind',
        duration: breathingDuration,
        instructions: weekNum === 1
          ? 'श्वास लें (4 सेकंड) → धीरे-धीरे बोलते हुए श्वास छोड़ें। नीचे दिए गए वाक्य बोलें:'
          : weekNum === 2
            ? 'Easy Onset: शब्दों को नरम शुरुआत दें। जैसे: म्म्मेरा, ह्ह्हम। श्वास लें और बोलें:'
            : 'गहरी श्वास लें और स्वाभाविक रूप से बोलें:',
        instructionsEn: weekNum <= 2
          ? `Inhale (4 sec) → Speak slowly while exhaling. Say the sentences below:`
          : 'Deep breath and speak naturally:',
        sentences: breathingSentences,
        linkedView: '/breathing',
      },
      {
        id: `day${dayNum}-reading`,
        type: ACTIVITY_TYPES.READING,
        title: 'पढ़ने का अभ्यास',
        titleEn: 'Reading Practice',
        icon: 'fas fa-book-open',
        duration: readingDuration,
        instructions: `${targetWPM} WPM की गति से पढ़ें। ${weekNum <= 2 ? '2-3 शब्द → रुकें → फिर आगे।' : 'प्राकृतिक लय बनाए रखें।'} अपनी पसंद की कहानी चुनें।`,
        instructionsEn: `Read at ${targetWPM} WPM. ${weekNum <= 2 ? 'Speak 2-3 words → pause → continue.' : 'Maintain natural rhythm.'} Pick a story of your choice.`,
        targetWPM,
        linkedView: '/stories',
      },
      {
        id: `day${dayNum}-twisters`,
        type: ACTIVITY_TYPES.TONGUE_TWISTERS,
        title: 'जीभ के व्यायाम',
        titleEn: 'Tongue Twisters',
        icon: 'fas fa-layer-group',
        duration: twisterDuration,
        instructions: weekNum === 1
          ? 'केवल शुरुआती (Beginner) स्तर। शब्दांशों में तोड़कर बोलें।'
          : weekNum === 2
            ? 'मध्यम (Intermediate) स्तर। धीरे → फिर थोड़ा तेज़।'
            : weekNum === 3
              ? 'उन्नत (Advanced) स्तर। स्पष्टता बनाए रखें।'
              : 'सभी स्तर। तेज़ गति पर भी स्पष्टता बनाएँ।',
        instructionsEn: weekNum === 1
          ? 'Beginner level only. Break into syllables.'
          : weekNum === 2
            ? 'Intermediate level. Slow → then slightly faster.'
            : weekNum === 3
              ? 'Advanced level. Maintain clarity.'
              : 'All levels. Maintain clarity at higher speed.',
        linkedView: '/twisters',
      },
      {
        id: `day${dayNum}-speaking`,
        type: ACTIVITY_TYPES.SPEAKING,
        title: speakingType === 'mirror' ? 'आईना अभ्यास' : 'बोलने का अभ्यास',
        titleEn: speakingType === 'mirror' ? 'Mirror Practice' : 'Speaking Practice',
        icon: speakingType === 'mirror' ? 'fas fa-user' : 'fas fa-comments',
        duration: speakingDuration,
        instructions: speakingType === 'mirror'
          ? 'आईने के सामने खड़े हों। अपनी आँखों में देखें। 5-6 सरल वाक्य बोलें।'
          : `आज का अभ्यास: ${speakingPrompt.hindi}`,
        instructionsEn: speakingType === 'mirror'
          ? 'Stand in front of a mirror. Look into your eyes. Speak 5-6 simple sentences.'
          : `Today's task: ${speakingPrompt.english}`,
        prompt: speakingPrompt,
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
      breathingDuration: 5,
      readingDuration: 10,
      twisterDuration: 5,
      speakingDuration: 5,
      targetWPM: 40 + (d * 2), // 40-52 WPM progressive
      breathingSentences: BREATHING_SENTENCES.week1[d],
      speakingPrompt: SPEAKING_PROMPTS.week1[d],
      speakingType: 'mirror',
    }));
  }

  // WEEK 2 (Days 8-14): Stability & Confidence
  for (let d = 0; d < 7; d++) {
    days.push(buildDay(d + 8, 2, {
      breathingDuration: 5,
      readingDuration: 10,
      twisterDuration: 6,
      speakingDuration: 5,
      targetWPM: 50 + (d * 3), // 50-71 WPM
      breathingSentences: BREATHING_SENTENCES.week2[d],
      speakingPrompt: SPEAKING_PROMPTS.week2[d],
      speakingType: 'real',
    }));
  }

  // WEEK 3 (Days 15-21): Real Speaking Control
  for (let d = 0; d < 7; d++) {
    days.push(buildDay(d + 15, 3, {
      breathingDuration: 3,
      readingDuration: 9,
      twisterDuration: 6,
      speakingDuration: 10,
      targetWPM: 70 + (d * 3), // 70-91 WPM
      breathingSentences: BREATHING_SENTENCES.week3[d],
      speakingPrompt: SPEAKING_PROMPTS.week3[d],
      speakingType: 'real',
    }));
  }

  // WEEK 4 (Days 22-30): Fluency & Confidence (9 days to reach 30)
  for (let d = 0; d < 9; d++) {
    const weekSentences = BREATHING_SENTENCES.week4;
    const weekPrompts = SPEAKING_PROMPTS.week4;
    days.push(buildDay(d + 22, 4, {
      breathingDuration: 3,
      readingDuration: 6,
      twisterDuration: 5,
      speakingDuration: 15,
      targetWPM: 90 + (d * 3), // 90-114 WPM
      breathingSentences: weekSentences[d % weekSentences.length],
      speakingPrompt: weekPrompts[d % weekPrompts.length],
      speakingType: 'real',
    }));
  }

  return days;
};

// Main program data export
export const PROGRAM_DATA = {
  phases: [
    {
      id: 1,
      title: 'Foundation',
      titleHi: 'नींव',
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
        },
      ],
      days: buildPhase1Days(),
    },
    // Future phases can be added here:
    // { id: 2, title: 'Intermediate', ... },
    // { id: 3, title: 'Advanced', ... },
    // { id: 4, title: 'Mastery', ... },
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

// Principle
export const FINAL_PRINCIPLE = {
  text: 'Fluency grows from control, not speed.',
  textHi: 'प्रवाह नियंत्रण से बढ़ता है, गति से नहीं।',
};

// Helper to get a specific day's data
export const getDayData = (dayNumber, phaseId = 1) => {
  const phase = PROGRAM_DATA.phases.find(p => p.id === phaseId);
  if (!phase) return null;
  return phase.days.find(d => d.day === dayNumber) || null;
};

// Helper to get the week for a given day
export const getWeekForDay = (dayNumber, phaseId = 1) => {
  const phase = PROGRAM_DATA.phases.find(p => p.id === phaseId);
  if (!phase) return null;
  return phase.weeks.find(w => dayNumber >= w.dayRange[0] && dayNumber <= w.dayRange[1]) || null;
};

// Get total duration for a day (sum of all activity durations)
export const getDayTotalDuration = (dayNumber, phaseId = 1) => {
  const day = getDayData(dayNumber, phaseId);
  if (!day) return 0;
  return day.activities.reduce((sum, a) => sum + a.duration, 0);
};
