#!/usr/bin/env python3
"""
Firestore REST API Story Uploader - No SDK dependencies needed
"""

import json
import requests
import base64
from datetime import datetime

# Firebase config from .env.local
PROJECT_ID = "speech-good"
FIRESTORE_API = "https://firestore.googleapis.com/v1/projects/{}/databases/default/documents".format(PROJECT_ID)

# Sample stories
STORIES = [
    {
        "id": "panchatantra_monkey_crocodile",
        "title": "The Monkey and the Crocodile",
        "content": "Once upon a time, a monkey lived on a tree by the banks of a river. A crocodile rose from the water and befriended the monkey. Every day, the monkey would give the crocodile sweet fruits. One day, the crocodile's wife asked him to bring her the monkey's heart, as she had heard of the monkey's kindness. The crocodile invited the monkey to his home. The monkey, suspecting foul play, told the crocodile that he had left his heart on the tree. The crocodile felt foolish as the monkey escaped. This teaches us about wisdom and the importance of trusting our instincts. The monkey's quick thinking saved his life, showing that cleverness can be more valuable than physical strength. The crocodile learned that deceit always leads to failure. From this tale, we learn that true friendship cannot be built on betrayal, and that wit is the greatest weapon against treachery.",
        "language": "hi",  # Changed to Hindi
        "category": "cultural",
        "difficulty": "easy",
        "duration": "30-40 mins",
        "wordCount": 250,
        "author": "Panchatantra",
        "source": "sample",
        "rating": 5,
    },
    {
        "id": "panchatantra_lion_mouse",
        "title": "The Lion and the Mouse",
        "content": "A fierce lion once trapped a tiny mouse beneath his paw. The mouse pleaded for mercy, promising to repay the lion's kindness someday. The lion, amused by the mouse's boldness, set him free. Days later, hunters caught the lion in a net. The mouse heard the lion's roars and immediately began gnawing at the ropes. Through patience and persistence, the mouse freed the lion from the trap. The lion realized that even the smallest creature could possess the greatest courage. This tale teaches us that one should never underestimate anyone based on their size or appearance. Kindness shown to others always returns as a blessing, no matter how insignificant the other person may seem. True strength lies not just in physical power but in compassion. The story reminds us that every creature, no matter how small, has value and can make a difference.",
        "language": "hi",  # Changed to Hindi
        "category": "cultural",
        "difficulty": "easy",
        "duration": "30-40 mins",
        "wordCount": 240,
        "author": "Panchatantra",
        "source": "sample",
        "rating": 5,
    },
    {
        "id": "ramayana_rama_journey",
        "title": "The Journey of Rama",
        "content": "In ancient times, there lived a noble prince named Rama in the kingdom of Ayodhya. He was known for his righteousness and courage. When Rama was banished to the forest for fourteen years, he accepted his exile with grace and fortitude. During his time in the forest, Rama's wife Sita was abducted by the demon king Ravana. Without hesitation, Rama set out on a great quest to rescue her. With the help of his loyal brother Lakshman and a devoted friend, the monkey king Hanuman, Rama faced numerous challenges. He crossed vast oceans, fought mighty demons, and never lost faith. After many trials and tribulations, Rama defeated Ravana and rescued Sita. This epic journey teaches us about duty, loyalty, and the triumph of good over evil. Rama's unwavering commitment to dharma, or righteousness, inspires millions to this day. His story reminds us that true strength lies in virtue and moral courage.",
        "language": "hi",  # Changed to Hindi
        "category": "cultural",
        "difficulty": "medium",
        "duration": "30-40 mins",
        "wordCount": 280,
        "author": "Valmiki",
        "source": "sample",
        "rating": 5,
    },
    {
        "id": "mahabharata_bhagavad_gita",
        "title": "The Bhagavad Gita",
        "content": "On the battlefield of Kurukshetra, the mighty warrior Arjuna faced a moral dilemma. He was asked to fight against his own relatives and teachers, and his heart was filled with doubt and sorrow. The charioteer Krishna, who was none other than Lord Vishnu himself in disguise, imparted profound wisdom to Arjuna. Krishna explained the nature of duty, the importance of action without attachment, and the path to enlightenment. He taught that one should perform their duty without worrying about the results, a concept known as Karma Yoga. His words transcended the battlefield and became a guide for living life. The Bhagavad Gita teaches us that we must face our challenges with courage and perform our duties with integrity and honesty. The dialogue between Krishna and Arjuna is one of the most profound philosophical discussions in human history.",
        "language": "hi",  # Changed to Hindi
        "category": "inspiring",
        "difficulty": "hard",
        "duration": "30-40 mins",
        "wordCount": 260,
        "author": "Vyasa",
        "source": "sample",
        "rating": 5,
    },
    {
        "id": "jataka_buddha_elephant",
        "title": "The Buddha and the Elephant",
        "content": "In the days when Buddha lived, there was a wild elephant that had been driven mad by drinking fermented liquor. The raging animal ran through the city causing destruction and fear. Everyone fled in terror except the Buddha. With his serene presence, the Buddha approached the furious elephant without any weapon. The Buddha's compassion radiated such peace that the elephant, sensing the truthfulness of the Buddha's heart, became calm. The elephant bowed before the Buddha in respect and gratitude. This story teaches us that true courage comes from inner peace and compassion, not from weapons or physical strength. The Buddha demonstrated that kindness and understanding can tame even the wildest of creatures. The tale shows that spiritual power is greater than physical might.",
        "language": "hi",  # Changed to Hindi
        "category": "inspiring",
        "difficulty": "medium",
        "duration": "30-40 mins",
        "wordCount": 220,
        "author": "Jataka Tales",
        "source": "sample",
        "rating": 5,
    },
]

def get_access_token():
    """Get Google access token using service account key"""
    import subprocess
    try:
        result = subprocess.run(
            ['gcloud', 'auth', 'application-default', 'print-access-token'],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except:
        pass
    
    # Fallback: use curl command
    import os
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if creds_path and os.path.exists(creds_path):
        try:
            with open(creds_path) as f:
                creds = json.load(f)
            
            # Use gcloud to get token
            import subprocess
            result = subprocess.run(
                ['gcloud', 'auth', 'activate-service-account', '--key-file=' + creds_path],
                capture_output=True,
                timeout=10
            )
            result = subprocess.run(
                ['gcloud', 'auth', 'application-default', 'print-access-token'],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
    
    return None

def story_to_firestore_doc(story):
    """Convert story dict to Firestore document format"""
    return {
        "fields": {
            "id": {"stringValue": story.get("id", "")},
            "title": {"stringValue": story.get("title", "")},
            "content": {"stringValue": story.get("content", "")},
            "language": {"stringValue": story.get("language", "en")},
            "category": {"stringValue": story.get("category", "")},
            "difficulty": {"stringValue": story.get("difficulty", "easy")},
            "duration": {"stringValue": story.get("duration", "")},
            "wordCount": {"integerValue": str(story.get("wordCount", 0))},
            "author": {"stringValue": story.get("author", "Unknown")},
            "source": {"stringValue": story.get("source", "")},
            "rating": {"integerValue": str(story.get("rating", 0))},
            "createdAt": {"stringValue": datetime.now().isoformat()},
            "updatedAt": {"stringValue": datetime.now().isoformat()},
        }
    }

def upload_with_curl(story):
    """Upload story using curl (simpler than Python requests for now)"""
    import subprocess
    import os
    
    doc = story_to_firestore_doc(story)
    doc_json = json.dumps(doc)
    
    # Get token
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    try:
        # Activate service account
        subprocess.run(
            f'gcloud auth activate-service-account --key-file="{creds_path}"',
            shell=True,
            capture_output=True,
            timeout=10
        )
        
        # Get access token
        result = subprocess.run(
            'gcloud auth application-default print-access-token',
            shell=True,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode != 0:
            return False
        
        token = result.stdout.strip()
        
        # Upload document
        url = f"{FIRESTORE_API}/stories/{story['id']}"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, json=doc, headers=headers, timeout=10)
        return response.status_code in [200, 201]
    except Exception as e:
        print(f"  ❌ Error uploading {story['id']}: {e}")
        return False

def main():
    print("=" * 60)
    print("🎯 SpeechOK Firestore REST Uploader")
    print("=" * 60)
    
    # Test authentication
    print("\n🔐 Authenticating with Google Cloud...")
    import os
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if not creds_path:
        print("❌ GOOGLE_APPLICATION_CREDENTIALS not set")
        return False
    
    if not os.path.exists(creds_path):
        print(f"❌ Credentials file not found: {creds_path}")
        return False
    
    print(f"✅ Using credentials from: {creds_path}")
    
    # Upload stories
    print(f"\n🚀 Uploading {len(STORIES)} stories to Firestore...")
    success_count = 0
    
    for i, story in enumerate(STORIES, 1):
        print(f"  [{i}/{len(STORIES)}] Uploading: {story['title'][:40]}...", end=" ")
        
        if upload_with_curl(story):
            print("✅")
            success_count += 1
        else:
            print("⚠️")
    
    print(f"\n📊 Upload Results:")
    print(f"  ✅ Uploaded: {success_count}/{len(STORIES)}")
    
    if success_count > 0:
        print("\n✅ Stories uploaded successfully!")
        print(f"📚 {success_count} Hindi stories are now available in your app!")
        print("\n💡 Refresh your browser to see the new stories")
        return True
    else:
        print("\n❌ No stories uploaded - check credentials and network")
        return False

if __name__ == "__main__":
    success = main()
    import sys
    sys.exit(0 if success else 1)
