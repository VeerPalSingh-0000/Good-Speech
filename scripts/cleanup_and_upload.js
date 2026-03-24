#!/usr/bin/env node
/**
 * Clean up old stories and re-upload fresh ones
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, "firebase-key.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ firebase-key.json not found");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "speech-good",
});

const db = admin.firestore();

// Quality stories in both languages
const newStories = [
  // ENGLISH STORIES (5)
  {
    id: "eng_monkey_crocodile",
    title: "The Monkey and the Crocodile",
    content:
      "A clever monkey lived on a tree by a river. Every day he plucked sweet mangoes and shared them with a crocodile who lived in the water. They became good friends. One day, the crocodile's wife grew jealous of their friendship and asked him to bring her the monkey's heart for a special remedy. The simple-hearted crocodile agreed. He invited the monkey to his home. The monkey grew suspicious when he saw the crocodile's grim expression. Quick-thinking, he said: 'Oh friend, I have left my heart hanging on the tree! Let us go back and fetch it.' The foolish crocodile hurried back, only to realize he had been tricked. The monkey never came down from the tree again. Moral: Use your wits before strength. Intelligence and quick thinking always save the day.",
    language: "en",
    category: "cultural",
    difficulty: "easy",
    duration: "30-40 mins",
    wordCount: 200,
    author: "Panchatantra",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "eng_lion_mouse",
    title: "The Lion and the Mouse",
    content:
      "A mighty lion was sleeping when a tiny mouse accidentally ran across his face, waking him up. The angry lion caught the trembling mouse, ready to crush him. But the little mouse pleaded for his life: 'Please spare me, great king! If you let me go, I promise to help you someday.' The lion laughed at the idea that such a small creature could ever help him, but he let the mouse go anyway. Days later, the lion was caught in a hunter's net. He roared and struggled but could not escape. The mouse heard his cries and immediately came running. Using his sharp teeth, the mouse gnawed through the ropes one by one until the lion was free. The grateful lion realized that even the smallest creature has value and can be helpful. Moral: Size does not determine worth. Kindness and gratitude always come full circle.",
    language: "en",
    category: "cultural",
    difficulty: "easy",
    duration: "30-40 mins",
    wordCount: 210,
    author: "Panchatantra",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "eng_rama_journey",
    title: "The Journey of Rama",
    content:
      "In the ancient kingdom of Ayodhya, Prince Rama was known for his virtue, kindness, and unwavering sense of duty. When his father King Dasharatha was deceived into banishing him for fourteen years, Rama accepted this punishment without complaint. He left his palace and lived in the forest with his wife Sita and brother Lakshman. During their exile, the demon king Ravana abducted Sita. Rama was devastated but determined. With the help of his loyal brother and the devoted monkey king Hanuman, he built an army and traveled across the oceans. They battled Ravana's forces fiercely. After many trials, Rama defeated the demon king and rescued his beloved Sita. Upon their return, Rama was crowned king and ruled with justice and compassion for many years. Moral: Duty and righteousness always triumph. True strength lies in virtue, not in power.",
    language: "en",
    category: "inspiring",
    difficulty: "medium",
    duration: "30-40 mins",
    wordCount: 230,
    author: "Ramayana",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "eng_arjuna_krishna",
    title: "The Wisdom of Krishna",
    content:
      "On the battlefield of Kurukshetra, Prince Arjuna faced a terrible dilemma. He was about to fight against his cousins, teachers, and relatives. His heart was filled with doubt and sorrow. He asked his charioteer Krishna: 'How can I fight against those I love?' Krishna explained the profound teachings of duty and action. He taught that we must perform our duties without fear or hesitation, focusing on doing what is right rather than worrying about the results. He spoke of the eternal soul that cannot be harmed, and of dharma (righteousness) which must be protected. Arjuna listened carefully and his doubts vanished. He understood that sometimes we must take difficult actions in service of what is just. The wisdom Krishna shared became known as the Bhagavad Gita, a guide for millions seeking truth and purpose in life. Moral: Duty without attachment is the path to peace. Do what is right without fear.",
    language: "en",
    category: "inspiring",
    difficulty: "hard",
    duration: "30-40 mins",
    wordCount: 240,
    author: "Mahabharata",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "eng_buddha_elephant",
    title: "The Buddha and the Elephant",
    content:
      "In ancient times, a wild elephant had been driven mad by drinking fermented fruit. The crazed animal rampaged through the city streets, destroying homes and causing panic. Citizens fled in terror, but one man stood calm: the Buddha. As the massive elephant charged toward him, the Buddha did not run or show fear. Instead, he focused all his compassion toward the animal. His inner peace was so powerful that it seemed to radiate around him. When the angry elephant reached him, it suddenly stopped. The elephant's eyes softened as it sensed the Buddha's genuine compassion and lack of fear. The animal knelt down respectfully at the Buddha's feet. The crowd witnessed this miracle and understood the power of inner peace and compassion. Word spread that even the wildest beasts could be tamed by love. Moral: Inner peace and compassion are more powerful than any weapon. Spiritual strength conquers all.",
    language: "en",
    category: "inspiring",
    difficulty: "medium",
    duration: "30-40 mins",
    wordCount: 215,
    author: "Jataka Tales",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // HINDI STORIES (5)
  {
    id: "hin_bandar_mugarmach",
    title: "बंदर और मगरमच्छ",
    content:
      "एक पेड़ पर एक बुद्धिमान बंदर रहता था। एक दिन एक मगरमच्छ नदी से निकला और उससे दोस्ती कर गया। हर दिन बंदर मगरमच्छ को मीठे फल देता था। एक दिन मगरमच्छ की पत्नी ने कहा कि उसे बंदर का दिल चाहिए। मगरमच्छ अपने दोस्त को मारने के लिए सहमत हो गया। वह बंदर को अपने घर आने के लिए निमंत्रण दिया। बंदर को संदेह हुआ। वह चतुरता से बोला: 'हे दोस्त, मेरा दिल तो पेड़ पर कहीं छिपा है!' मगरमच्छ वापस लौट गया। बंदर कभी नीचे नहीं आया। नैतिकता: बुद्धि हमेशा जीतती है। धोखा कभी सफल नहीं होता।",
    language: "hi",
    category: "cultural",
    difficulty: "easy",
    duration: "30-40 mins",
    wordCount: 150,
    author: "पंचतंत्र",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hin_sher_chuha",
    title: "शेर और चूहा",
    content:
      "एक भूखा शेर पेड़ के नीचे सो रहा था। एक छोटा चूहा गलती से शेर के चेहरे पर चला गया और उसे जगा दिया। क्रोधित शेर चूहे को पकड़ने वाला था पर चूहे ने प्रार्थना की: 'हे महाराज, मुझे छोड़ दीजिए। एक दिन मैं आपकी मदद करूंगा।' शेर को हँसी आ गई पर उसने चूहे को जाने दिया। कुछ दिन बाद, शेर शिकारी के जाल में फँस गया। वह गर्जना करने लगा। चूहा उसकी आवाज सुनकर दौड़ा आया। उसने अपने तीखे दाँतों से जाल को काट दिया और शेर को आजाद कर दिया। शेर को अपनी गलती का एहसास हुआ। नैतिकता: छोटे को बड़ा न समझो। हर किसी की अपनी कीमत है।",
    language: "hi",
    category: "cultural",
    difficulty: "easy",
    duration: "30-40 mins",
    wordCount: 160,
    author: "पंचतंत्र",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hin_rama_yatra",
    title: "राम की महान यात्रा",
    content:
      "अयोध्या के राजकुमार राम बहुत न्यायप्रिय और गुणवान थे। जब उनके पिता राजा दशरथ ने उन्हें 14 साल के लिए वनवास दिया, तो राम ने बिना किसी शिकायत के स्वीकार किया। वे अपनी पत्नी सीता और भाई लक्ष्मण के साथ जंगल में चले गए। वहाँ राक्षस राजा रावण ने सीता का अपहरण कर लिया। राम को बहुत दुःख हुआ पर वे हार न मानते हुए अपने भाई और वफादार हनुमान की मदद से रावण से युद्ध किया। उन्होंने समुद्र पार कर रावण के राज्य तक पहुँचे। फिर बड़ी लड़ाई हुई। आखिरकार राम ने रावण को परास्त किया और सीता को बचाया। घर लौटकर राम को राजा का ताज पहनाया गया। नैतिकता: सच्चाई और न्याय सदा जीतते हैं। सदाचार ही सच्ची शक्ति है।",
    language: "hi",
    category: "inspiring",
    difficulty: "medium",
    duration: "30-40 mins",
    wordCount: 180,
    author: "रामायण",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hin_arjun_krishna",
    title: "अर्जुन और कृष्ण की बातचीत",
    content:
      "कुरुक्षेत्र के युद्ध के मैदान में योद्धा अर्जुन को गहरा संदेह हुआ। उसे अपने रिश्तेदारों से लड़ना था। उसने अपने सारथी भगवान कृष्ण से पूछा: 'हे प्रभु, मैं अपनों से कैसे लड़ूँ?' कृष्ण ने गहरी शिक्षाएँ दीं। उन्होंने कहा कि हमें अपना कर्तव्य करना चाहिए बिना परिणाम की चिंता किए। उन्होंने समझाया कि आत्मा को कोई हार नहीं सकता। धर्म की रक्षा करना सबका कर्तव्य है। अर्जुन को ज्ञान मिल गया और उसके सभी संदेह दूर हो गए। कृष्ण की ये शिक्षाएँ 'भगवद् गीता' के रूप में आज भी लाखों-करोड़ों लोगों को सही रास्ता दिखाती हैं। नैतिकता: कर्तव्य से न भागो। सच्चा धर्म ही जीवन का लक्ष्य है।",
    language: "hi",
    category: "inspiring",
    difficulty: "hard",
    duration: "30-40 mins",
    wordCount: 190,
    author: "महाभारत",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hin_buddha_hathi",
    title: "बुद्ध और पागल हाथी",
    content:
      "प्राचीन समय में एक पागल हाथी पूरे शहर में तबाही मचा रहा था। सभी लोग डर के घरों में छिप गए। पर महात्मा बुद्ध बेखौफ रहे। जब वो गुस्से में भरा हाथी उनकी तरफ दौड़ा आया तो बुद्ध ने न भागा न डर दिखाया। उन्होंने अपने पूरे मन से हाथी के प्रति करुणा भेजी। बुद्ध की शांति और दया इतनी प्रबल थी कि हाथी अचानक रुक गया। उसकी आँखें नरम हो गईं। हाथी ने बुद्ध के पैरों में झुक गया। सभी लोगों ने ये अद्भुत दृश्य देखा। उन्हें समझ आ गया कि आंतरिक शांति सबसे बड़ी शक्ति है। नैतिकता: करुणा से सब जीत सकते हो। आंतरिक शांति ही सच्ची शक्ति है।",
    language: "hi",
    category: "inspiring",
    difficulty: "medium",
    duration: "30-40 mins",
    wordCount: 170,
    author: "जातक कथाएँ",
    source: "sample",
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function cleanupAndUpload() {
  console.log("\n" + "=".repeat(70));
  console.log("🧹 CLEANUP & FRESH UPLOAD");
  console.log("=".repeat(70));

  try {
    // Step 1: Delete old stories
    console.log("\n📋 Deletion Step 1: Identifying old stories...");
    const oldStoryIds = [
      "panchatantra_monkey_crocodile",
      "panchatantra_lion_mouse",
      "ramayana_rama_journey",
      "mahabharata_bhagavad_gita",
      "jataka_buddha_elephant",
    ];

    let deletedCount = 0;
    for (const id of oldStoryIds) {
      try {
        await db.collection("stories").doc(id).delete();
        console.log(`  ✅ Deleted: ${id}`);
        deletedCount++;
      } catch (err) {
        console.log(`  ℹ️  ${id} (not found or already deleted)`);
      }
    }

    console.log(`\n📊 Cleanup Results: ${deletedCount} old stories deleted`);

    // Step 2: Upload fresh stories
    console.log(
      `\n🚀 Upload Step: Uploading ${newStories.length} fresh stories...\n`,
    );

    let successCount = 0;
    for (const [i, story] of newStories.entries()) {
      const lang = story.language === "en" ? "ENG" : "HIN";
      process.stdout.write(`  [${i + 1}/${newStories.length}] ${lang} `);

      try {
        await db.collection("stories").doc(story.id).set(story);
        console.log(`✅ ${story.title.substring(0, 40)}`);
        successCount++;
      } catch (err) {
        console.log(`❌ ${story.title} - ${err.message}`);
      }
    }

    console.log(`\n📊 Upload Results:`);
    console.log(
      `  ✅ Successfully uploaded: ${successCount}/${newStories.length}`,
    );
    console.log(`  📚 English stories: 5 (language: "en")`);
    console.log(`  📚 Hindi stories: 5 (language: "hi")`);

    if (successCount === newStories.length) {
      console.log("\n✅ CLEANUP & UPLOAD COMPLETE!");
      console.log("🎯 Your app is now ready with clean data!");
      console.log(
        "💡 Refresh https://localhost:5174 to test both languages!\n",
      );
      process.exit(0);
    } else {
      console.log(
        `\n⚠️  Only ${successCount}/${newStories.length} stories uploaded\n`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Operation failed:", error.message);
    process.exit(1);
  }
}

cleanupAndUpload();
