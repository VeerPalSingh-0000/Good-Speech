#!/usr/bin/env python3
"""
Quick Story Import - Uploads sample stories to Firebase immediately
"""

import os
import sys
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Firebase initialization
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Use environment variable for credentials path
        creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        if creds_path and os.path.exists(creds_path):
            cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
        
        db = firestore.client()
        print("✅ Firebase initialized successfully")
        return db
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")
        return None

# Sample stories in both English and Hindi
def get_sample_stories():
    """Return sample stories in English and Hindi"""
    stories = [
        {
            "id": "panchatantra_monkey_crocodile",
            "title": "The Monkey and the Crocodile",
            "content": "Once upon a time, a monkey lived on a tree by the banks of a river. A crocodile rose from the water and befriended the monkey. Every day, the monkey would give the crocodile sweet fruits. One day, the crocodile's wife asked him to bring her the monkey's heart, as she had heard of the monkey's kindness. The crocodile invited the monkey to his home. The monkey, suspecting foul play, told the crocodile that he had left his heart on the tree. The crocodile felt foolish as the monkey escaped. This teaches us about wisdom and the importance of trusting our instincts. The monkey's quick thinking saved his life, showing that cleverness can be more valuable than physical strength. The crocodile learned that deceit always leads to failure. From this tale, we learn that true friendship cannot be built on betrayal, and that wit is the greatest weapon against treachery. The story also shows how a quick mind can overcome physical strength.",
            "language": "en",
            "category": "cultural",
            "difficulty": "easy",
            "duration": "30-40 mins",
            "wordCount": 250,
            "author": "Panchatantra",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["wisdom", "friendship", "betrayal"],
                "keywords": ["monkey", "crocodile", "wisdom"],
                "region": "India",
            },
        },
        {
            "id": "panchatantra_lion_mouse",
            "title": "The Lion and the Mouse",
            "content": "A fierce lion once trapped a tiny mouse beneath his paw. The mouse pleaded for mercy, promising to repay the lion's kindness someday. The lion, amused by the mouse's boldness, set him free. Days later, hunters caught the lion in a net. The mouse heard the lion's roars and immediately began gnawing at the ropes. Through patience and persistence, the mouse freed the lion from the trap. The lion realized that even the smallest creature could possess the greatest courage. This tale teaches us that one should never underestimate anyone based on their size or appearance. Kindness shown to others always returns as a blessing, no matter how insignificant the other person may seem. True strength lies not just in physical power but in compassion. The story reminds us that every creature, no matter how small, has value and can make a difference.",
            "language": "en",
            "category": "cultural",
            "difficulty": "easy",
            "duration": "30-40 mins",
            "wordCount": 240,
            "author": "Panchatantra",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["kindness", "courage", "gratitude"],
                "keywords": ["lion", "mouse", "strength"],
                "region": "India",
            },
        },
        {
            "id": "ramayana_rama_journey",
            "title": "The Journey of Rama",
            "content": "In ancient times, there lived a noble prince named Rama in the kingdom of Ayodhya. He was known for his righteousness and courage. When Rama was banished to the forest for fourteen years, he accepted his exile with grace and fortitude. During his time in the forest, Rama's wife Sita was abducted by the demon king Ravana. Without hesitation, Rama set out on a great quest to rescue her. With the help of his loyal brother Lakshman and a devoted friend, the monkey king Hanuman, Rama faced numerous challenges. He crossed vast oceans, fought mighty demons, and never lost faith. After many trials and tribulations, Rama defeated Ravana and rescued Sita. This epic journey teaches us about duty, loyalty, and the triumph of good over evil. Rama's unwavering commitment to dharma, or righteousness, inspires millions to this day. His story reminds us that true strength lies in virtue and moral courage.",
            "language": "en",
            "category": "cultural",
            "difficulty": "medium",
            "duration": "30-40 mins",
            "wordCount": 280,
            "author": "Valmiki",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["righteousness", "loyalty", "good vs evil"],
                "keywords": ["rama", "sita", "hanuman"],
                "region": "India",
            },
        },
        {
            "id": "mahabharata_bhagavad_gita",
            "title": "The Bhagavad Gita",
            "content": "On the battlefield of Kurukshetra, the mighty warrior Arjuna faced a moral dilemma. He was asked to fight against his own relatives and teachers, and his heart was filled with doubt and sorrow. The charioteer Krishna, who was none other than Lord Vishnu himself in disguise, imparted profound wisdom to Arjuna. Krishna explained the nature of duty, the importance of action without attachment, and the path to enlightenment. He taught that one should perform their duty without worrying about the results, a concept known as Karma Yoga. His words transcended the battlefield and became a guide for living life. The Bhagavad Gita teaches us that we must face our challenges with courage and perform our duties with integrity and honesty. The dialogue between Krishna and Arjuna is one of the most profound philosophical discussions in human history.",
            "language": "en",
            "category": "inspiring",
            "difficulty": "hard",
            "duration": "30-40 mins",
            "wordCount": 260,
            "author": "Vyasa",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["duty", "wisdom", "enlightenment"],
                "keywords": ["arjuna", "krishna", "dharma"],
                "region": "India",
            },
        },
        {
            "id": "jataka_buddha_elephant",
            "title": "The Buddha and the Elephant",
            "content": "In the days when Buddha lived, there was a wild elephant that had been driven mad by drinking fermented liquor. The raging animal ran through the city causing destruction and fear. Everyone fled in terror except the Buddha. With his serene presence, the Buddha approached the furious elephant without any weapon. The Buddha's compassion radiated such peace that the elephant, sensing the truthfulness of the Buddha's heart, became calm. The elephant bowed before the Buddha in respect and gratitude. This story teaches us that true courage comes from inner peace and compassion, not from weapons or physical strength. The Buddha demonstrated that kindness and understanding can tame even the wildest of creatures. The tale shows that spiritual power is greater than physical might.",
            "language": "en",
            "category": "inspiring",
            "difficulty": "medium",
            "duration": "30-40 mins",
            "wordCount": 220,
            "author": "Jataka Tales",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["compassion", "peace", "courage"],
                "keywords": ["buddha", "elephant", "mindfulness"],
                "region": "Asia",
            },
        },
        # Hindi versions
        {
            "id": "panchatantra_monkey_crocodile_hi",
            "title": "बंदर और मगरमच्छ",
            "content": "एक समय की बात है, नदी के किनारे एक पेड़ पर एक बंदर रहता था। एक मगरमच्छ पानी से निकला और बंदर का दोस्त बन गया। हर दिन, बंदर मगरमच्छ को मीठे फल देता था। एक दिन, मगरमच्छ की पत्नी ने उसे बंदर का दिल लाने को कहा। मगरमच्छ ने बंदर को अपने घर आमंत्रित किया। बंदर को बुरे इरादे का संदेह हुआ, इसलिए उसने कहा कि उसका दिल पेड़ पर छोड़ा है। मगरमच्छ मूर्ख लगा जब बंदर भाग गया। यह कहानी हमें सीखाती है कि बुद्धिमानी और अपने अंतर्ज्ञान पर विश्वास करना कितना महत्वपूर्ण है। बंदर की तेजी और सूझबूझ उसकी जान बचा गई। यह दर्शाता है कि बुद्धि शारीरिक शक्ति से अधिक मूल्यवान है।",
            "language": "hi",
            "category": "cultural",
            "difficulty": "easy",
            "duration": "30-40 mins",
            "wordCount": 220,
            "author": "पंचतंत्र",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["बुद्धिमानी", "दोस्ती", "विश्वासघात"],
                "keywords": ["बंदर", "मगरमच्छ", "बुद्धि"],
                "region": "भारत",
            },
        },
        {
            "id": "ramayana_rama_journey_hi",
            "title": "राम की यात्रा",
            "content": "प्राचीन काल में, अयोध्या के राज्य में राम नाम का एक महान राजकुमार रहता था। वह अपनी सत्यता और साहस के लिए प्रसिद्ध था। जब राम को चौदह साल के लिए वनवास दिया गया, तो उसने इसे सहजता से स्वीकार किया। वन में रहते हुए, राम की पत्नी सीता को रावण नाम के राक्षस राजा ने अपहरण कर लिया। बिना किसी संकोच के, राम ने उसे बचाने के लिए एक महान यात्रा शुरू की। अपने भाई लक्ष्मण और अपने वफादार मित्र हनुमान की मदद से, राम ने अनेक चुनौतियों का सामना किया। उसने विशाल महासागरों को पार किया, शक्तिशाली राक्षसों से लड़ा, और कभी अपने विश्वास को नहीं खोया। अंततः, राम ने रावण को हराया और सीता को बचाया। यह महाकाव्य हमें कर्तव्य, वफादारी, और बुराई पर अच्छाई की जीत के बारे में सिखाता है।",
            "language": "hi",
            "category": "cultural",
            "difficulty": "medium",
            "duration": "30-40 mins",
            "wordCount": 280,
            "author": "वाल्मीकि",
            "source": "sample",
            "rating": 5,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "metadata": {
                "themes": ["धर्म", "वफादारी", "अच्छाई"],
                "keywords": ["राम", "सीता", "हनुमान"],
                "region": "भारत",
            },
        },
    ]
    return stories

def upload_stories(db, stories):
    """Upload stories to Firestore"""
    print(f"\n🚀 Uploading {len(stories)} stories to Firestore...")
    
    batch_size = 100
    try:
        for i in range(0, len(stories), batch_size):
            batch = db.batch()
            batch_stories = stories[i:i + batch_size]
            
            for story in batch_stories:
                doc_ref = db.collection("stories").document(story["id"])
                batch.set(doc_ref, story)
            
            batch.commit()
            print(f"✅ Uploaded {min(i + batch_size, len(stories))}/{len(stories)} stories")
        
        print(f"\n✅ Successfully uploaded {len(stories)} stories to Firestore!")
        return True
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return False

def setup_collections(db):
    """Setup languages and categories"""
    print("\n📋 Setting up Firestore collections...")
    
    try:
        # Languages
        languages = {
            "en": {"code": "en", "label": "English", "flag": "🇺🇸"},
            "hi": {"code": "hi", "label": "हिंदी (Hindi)", "flag": "🇮🇳"},
        }
        
        for lang_code, lang_data in languages.items():
            db.collection("languages").document(lang_code).set(lang_data)
        
        print("✅ Languages collection set up")
        
        # Categories
        categories = {
            "cultural": {"name": "Cultural", "description": "Traditional and cultural tales", "icon": "🏛️"},
            "inspiring": {"name": "Inspiring", "description": "Motivational and uplifting stories", "icon": "✨"},
        }
        
        for cat_id, cat_data in categories.items():
            db.collection("categories").document(cat_id).set(cat_data)
        
        print("✅ Categories collection set up")
        return True
    except Exception as e:
        print(f"⚠️  Collection setup failed: {e}")
        return False

def main():
    """Main entry point"""
    print("=" * 60)
    print("🎯 SpeechOK Quick Story Importer")
    print("=" * 60)
    
    db = initialize_firebase()
    if not db:
        print("❌ Cannot proceed without Firebase")
        sys.exit(1)
    
    # Setup collections
    setup_collections(db)
    
    # Get and upload stories
    stories = get_sample_stories()
    success = upload_stories(db, stories)
    
    if success:
        print("\n✅ Import completed successfully!")
        print(f"📚 {len(stories)} stories now available:")
        print(f"   - {len([s for s in stories if s['language'] == 'en'])} English stories")
        print(f"   - {len([s for s in stories if s['language'] == 'hi'])} Hindi stories")
    else:
        print("\n❌ Import failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
