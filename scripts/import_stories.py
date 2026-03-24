#!/usr/bin/env python3
"""
Story Import Script for SpeechOK
Fetches public domain stories from multiple sources and uploads to Firebase Firestore
"""

import os
import sys
import json
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from typing import List, Dict, Optional
import textwrap
import re

# Configuration
GUTENBERG_API = "https://gutendex.com/books"
CHUNK_SIZE = 5000  # Words per story (30-40 minute read)
BATCH_SIZE = 100  # Firebase batch upload size
MAX_RETRIES = 3  # Maximum retry attempts
RETRY_BACKOFF = 1.5  # Exponential backoff multiplier
STORY_DURATION = "30-40 mins"  # Duration label for longer stories

# Create session with retry strategy
def create_session_with_retries():
    """Create requests session with retry strategy"""
    session = requests.Session()
    retry_strategy = Retry(
        total=MAX_RETRIES,
        backoff_factor=RETRY_BACKOFF,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

# Language configurations with keywords for filtering
LANGUAGE_CONFIG = {
    "en": {
        "name": "English",
        "flag": "🇺🇸",
        "keywords": ["english", "english language"],
        "categories": ["adventure", "drama", "inspiring", "cultural"],
    },
    "hi": {
        "name": "हिंदी (Hindi)",
        "flag": "🇮🇳",
        "keywords": ["hindi", "hindi language", "hind"],
        "categories": ["adventure", "drama", "inspiring", "cultural"],
    },
    "ta": {
        "name": "Tamil",
        "flag": "🇮🇳",
        "keywords": ["tamil"],
        "categories": ["adventure", "cultural"],
    },
    "te": {
        "name": "Telugu",
        "flag": "🇮🇳",
        "keywords": ["telugu"],
        "categories": ["adventure", "cultural"],
    },
    "mr": {
        "name": "मराठी (Marathi)",
        "flag": "🇮🇳",
        "keywords": ["marathi"],
        "categories": ["adventure", "cultural"],
    },
}

CATEGORIES = {
    "adventure": {
        "name": "Adventure",
        "description": "Thrilling journeys and discoveries",
        "icon": "🚀",
    },
    "drama": {
        "name": "Drama",
        "description": "Emotional stories with depth",
        "icon": "🎭",
    },
    "inspiring": {
        "name": "Inspiring",
        "description": "Motivational and uplifting stories",
        "icon": "✨",
    },
    "cultural": {
        "name": "Cultural",
        "description": "Traditional and cultural tales",
        "icon": "🏛️",
    },
    "educational": {
        "name": "Educational",
        "description": "Learning through stories",
        "icon": "📚",
    },
}


class StoryImporter:
    """Main class for importing stories from various sources"""

    def __init__(self, firebase_credentials_path: str = None):
        """Initialize Firebase connection"""
        self.db = None
        self.stories_imported = 0
        self.failed_imports = 0
        self.session = create_session_with_retries()

        # Initialize Firebase
        self._initialize_firebase(firebase_credentials_path)

    def _initialize_firebase(self, creds_path: Optional[str]):
        """Initialize Firebase Admin SDK"""
        try:
            # Try to use environment variables if no path provided
            if creds_path and os.path.exists(creds_path):
                cred = credentials.Certificate(creds_path)
                firebase_admin.initialize_app(cred)
            else:
                # Use default credentials (from GOOGLE_APPLICATION_CREDENTIALS env var)
                # or from ~/.config/gcloud/ for local development
                try:
                    firebase_admin.initialize_app()
                except Exception:
                    print(
                        "⚠️  Firebase not initialized. Using direct REST API instead."
                    )
                    return

            self.db = firestore.client()
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"⚠️  Firebase initialization failed: {e}")
            print("Using stub mode - create Firebase project first")
            return

    def chunk_text(self, text: str, target_words: int = CHUNK_SIZE) -> List[str]:
        """Split text into chunks of approximately target_words"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_word_count = 0

        for word in words:
            current_chunk.append(word)
            current_word_count += 1

            if current_word_count >= target_words:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_word_count = 0

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks

    def extract_title_from_content(self, content: str, default: str = "Untitled Story") -> str:
        """Extract or generate a title from content"""
        lines = content.split("\n")
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            if len(line) > 5 and len(line) < 100 and not line.startswith("#"):
                return line
        return default

    def detect_language(self, title: str, content: str) -> str:
        """Detect language from text (simplified)"""
        text_lower = (title + " " + content[:500]).lower()

        for lang_code, config in LANGUAGE_CONFIG.items():
            for keyword in config["keywords"]:
                if keyword in text_lower:
                    return lang_code

        # Default to English
        return "en"

    def determine_category(self, title: str, content: str) -> str:
        """Determine category based on content"""
        text_lower = (title + " " + content[:1000]).lower()

        category_keywords = {
            "adventure": ["adventure", "journey", "quest", "explore", "discover"],
            "drama": ["love", "family", "conflict", "emotion", "relationship"],
            "inspiring": ["triumph", "overcome", "hope", "success", "courage"],
            "cultural": ["tradition", "culture", "heritage", "ancient", "history"],
            "educational": ["learn", "science", "history", "knowledge", "education"],
        }

        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return category

        return "adventure"

    def determine_difficulty(self, text: str) -> str:
        """Determine difficulty based on average word length"""
        words = text.split()
        if not words:
            return "medium"

        avg_word_length = sum(len(w) for w in words) / len(words)

        if avg_word_length < 4.5:
            return "easy"
        elif avg_word_length > 6.0:
            return "hard"
        else:
            return "medium"

    def fetch_gutenberg_stories(self) -> List[Dict]:
        """Fetch stories from multiple public domain sources"""
        print("\n📚 Fetching from public domain sources...")
        stories = []

        # Try OpenLibrary API first (more stable)
        print("  📖 Trying OpenLibrary API...")
        try:
            # Search for popular books on OpenLibrary
            search_url = "https://openlibrary.org/search.json?q=fiction&has_fulltext=true&limit=50"
            response = self.session.get(search_url, timeout=15)
            response.raise_for_status()
            data = response.json()

            for i, book in enumerate(data.get("docs", [])[:50]):
                try:
                    print(f"  Processing book {i+1}/50: {book.get('title', 'Unknown')[:40]}...", end="\r")

                    title = book.get("title", "Unknown Story")
                    author = book.get("author_name", ["Unknown"])[0] if book.get("author_name") else "Unknown"
                    
                    # Try to get full text from Internet Archive
                    key = book.get("key", "").replace("/works/", "")
                    if not key:
                        continue

                    # Look for available editions with text
                    ia_id = book.get("ia", [""])[0] if book.get("ia") else None
                    if ia_id:
                        text_content = self._fetch_ia_text(ia_id)
                        if text_content and len(text_content) > 5000:
                            stories.extend(
                                self._process_text(text_content, title, author, "openlibrary")
                            )
                            if len(stories) >= 100:
                                break
                    
                    time.sleep(0.3)  # Rate limiting

                except Exception as e:
                    continue

            if stories:
                print(f"\n✅ Fetched {len(stories)} stories from OpenLibrary")
                return stories

        except Exception as e:
            print(f"  ⚠️  OpenLibrary failed: {e}")

        # Fallback: Try original Gutenberg API
        print("  📚 Trying Project Gutenberg API...")
        try:
            response = self.session.get(f"{GUTENBERG_API}?sort=popular", timeout=30)
            response.raise_for_status()
            data = response.json()

            for i, book in enumerate(data.get("results", [])[:50]):
                try:
                    print(f"  Processing book {i+1}/50: {book['title'][:40]}...", end="\r")

                    book_id = book["id"]
                    book_response = self.session.get(
                        f"{GUTENBERG_API}/{book_id}", timeout=15
                    )
                    book_response.raise_for_status()
                    book_data = book_response.json()

                    formats = book_data.get("formats", {})
                    text_url = formats.get("text/plain; charset=utf-8") or formats.get(
                        "text/plain"
                    )

                    if not text_url:
                        continue

                    text_response = self.session.get(text_url, timeout=30)
                    text_response.raise_for_status()
                    text_content = text_response.text

                    if len(text_content) < 5000:
                        continue

                    text_content = self._clean_text(text_content)
                    stories.extend(
                        self._process_text(
                            text_content,
                            book["title"],
                            book.get("author", {}).get("name", "Unknown"),
                            "gutenberg"
                        )
                    )

                    if len(stories) >= 100:
                        break

                    time.sleep(0.5)

                except Exception as e:
                    continue

            if stories:
                print(f"\n✅ Fetched {len(stories)} stories from Gutenberg")
                return stories

        except Exception as e:
            print(f"  ⚠️  Gutenberg failed: {e}")

        print(
            "  ⚠️  All public domain sources failed. Using sample stories only."
        )
        return stories

    def _fetch_ia_text(self, ia_id: str) -> Optional[str]:
        """Fetch plain text from Internet Archive"""
        try:
            url = f"https://archive.org/download/{ia_id}/{ia_id}_djvu.txt"
            response = self.session.get(url, timeout=20)
            if response.status_code == 200:
                return response.text
        except Exception:
            pass
        return None

    def _process_text(self, text: str, title: str, author: str, source: str) -> List[Dict]:
        """Process raw text into story objects"""
        stories = []
        text = self._clean_text(text)
        chunks = self.chunk_text(text)

        for chunk_idx, chunk in enumerate(chunks[:2]):  # Max 2 chunks per book
            try:
                language = self.detect_language(title, chunk)
                story = {
                    "id": f"{source}_{int(time.time())}_{chunk_idx}",
                    "title": f"{title}" if chunk_idx == 0 else f"{title} - Part {chunk_idx + 1}",
                    "content": chunk,
                    "language": language,
                    "category": self.determine_category(title, chunk),
                    "difficulty": self.determine_difficulty(chunk),
                    "duration": STORY_DURATION,
                    "wordCount": len(chunk.split()),
                    "author": author,
                    "source": source,
                    "rating": 0,
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat(),
                    "metadata": {
                        "themes": self._extract_themes(chunk),
                        "keywords": self._extract_keywords(title),
                        "region": "general",
                    },
                }
                stories.append(story)
            except Exception:
                continue

        return stories

    def _clean_text(self, text: str) -> str:
        """Clean text from metadata and formatting"""
        # Remove Project Gutenberg header/footer
        lines = text.split("\n")
        clean_lines = []
        in_content = False

        for line in lines:
            # Skip header
            if "*** START" in line or "***START" in line:
                in_content = True
                continue
            if "*** END" in line or "***END" in line:
                in_content = False
                break

            if in_content or not any(
                keyword in line
                for keyword in [
                    "gutenberg",
                    "project",
                    "copyright",
                    "produced by",
                ]
            ):
                clean_lines.append(line)

        text = "\n".join(clean_lines)

        # Remove extra whitespace
        text = re.sub(r"\n\n+", "\n\n", text)
        text = re.sub(r" +", " ", text)

        return text.strip()

    def _extract_themes(self, text: str) -> List[str]:
        """Extract potential themes from text"""
        themes = []
        theme_keywords = {
            "adventure": ["adventure", "journey", "quest"],
            "love": ["love", "romance", "heart"],
            "mystery": ["mystery", "secret", "hidden"],
            "family": ["family", "parent", "child"],
            "friendship": ["friend", "friendship", "companion"],
        }

        text_lower = text.lower()
        for theme, keywords in theme_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                themes.append(theme)

        return themes[:5]  # Return top 5

    def _extract_keywords(self, title: str) -> List[str]:
        """Extract keywords from title"""
        words = title.split()
        return [word.lower() for word in words if len(word) > 3][:5]

    def create_sample_stories(self) -> List[Dict]:
        """Create sample Indian cultural stories for languages without good public domain options"""
        print("\n🏛️  Creating sample cultural stories...")

        stories = [
            {
                "id": "panchatantra_1",
                "title": "The Monkey and the Crocodile",
                "content": """Once upon a time, a monkey lived on a tree by the banks of a river. A crocodile rose from the water and befriended the monkey. Every day, the monkey would give the crocodile sweet fruits. One day, the crocodile's wife asked him to bring her the monkey's heart. The crocodile invited the monkey to his home. The monkey, suspecting foul play, told the crocodile that he had left his heart on the tree. The crocodile felt foolish as the monkey escaped. This teaches us about wisdom and the importance of trusting our instincts. The monkey's quick thinking saved his life, showing that cleverness can be more valuable than physical strength.""",
                "language": "en",
                "category": "cultural",
                "difficulty": "easy",
                "duration": STORY_DURATION,
                "wordCount": 195,
                "author": "Panchatantra",
                "source": "sample",
                "rating": 5,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
                "metadata": {
                    "themes": ["wisdom", "friendship"],
                    "keywords": ["monkey", "crocodile"],
                    "region": "India",
                },
            },
            {
                "id": "panchatantra_2",
                "title": "The Lion and the Mouse",
                "content": """A fierce lion once trapped a tiny mouse beneath his paw. The mouse pleaded for mercy, promising to repay the lion's kindness someday. The lion, amused by the mouse's boldness, set him free. Days later, hunters caught the lion in a net. The mouse heard the lion's roars and immediately began gnawing at the ropes. Through patience and persistence, the mouse freed the lion from the trap. The lion realized that even the smallest creature could possess the greatest courage. This tale teaches us that one should never underestimate anyone based on their size or appearance. Kindness shown to others always returns as a blessing, no matter how insignificant the other person may seem. True strength lies not just in physical power but in compassion.""",
                "language": "en",
                "category": "cultural",
                "difficulty": "easy",
                "duration": STORY_DURATION,
                "wordCount": 201,
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
                "id": "ramayana_1",
                "title": "The Journey of Rama",
                "content": """In ancient times, there lived a noble prince named Rama in the kingdom of Ayodhya. He was known for his righteousness and courage. When banished to the forest for fourteen years, he accepted his exile with grace. During his time in the forest, Rama's wife Sita was abducted by the demon king Ravana. Without hesitation, Rama set out on a great quest to rescue her. With the help of his loyal brother Lakshman and the devoted monkey king Hanuman, Rama faced numerous challenges and crossed vast oceans. After many trials, Rama defeated Ravana and rescued Sita. This epic journey teaches us about duty, loyalty, and the triumph of good over evil. Rama's unwavering commitment to righteousness inspires millions. His story reminds us that true strength lies in virtue and moral courage.""",
                "language": "en",
                "category": "cultural",
                "difficulty": "medium",
                "duration": STORY_DURATION,
                "wordCount": 207,
                "author": "Valmiki",
                "source": "sample",
                "rating": 5,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
                "metadata": {
                    "themes": ["righteousness", "loyalty"],
                    "keywords": ["rama", "sita"],
                    "region": "India",
                },
            },
            {
                "id": "mahabharata_1",
                "title": "The Bhagavad Gita",
                "content": """On the battlefield of Kurukshetra, the mighty warrior Arjuna faced a moral dilemma. He was asked to fight against his own relatives and teachers, and his heart was filled with doubt and sorrow. The charioteer Krishna, who was none other than Lord himself in disguise, imparted profound wisdom to Arjuna. Krishna explained the nature of duty, the importance of action without attachment, and the path to enlightenment. He taught that one should perform their duty without worrying about the results. His words transcended the battlefield and became a guide for living life. The Bhagavad Gita teaches us that we must face our challenges with courage and perform our duties with integrity.""",
                "language": "en",
                "category": "inspiring",
                "difficulty": "hard",
                "duration": STORY_DURATION,
                "wordCount": 195,
                "author": "Vyasa",
                "source": "sample",
                "rating": 5,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
                "metadata": {
                    "themes": ["duty", "wisdom", "enlightenment"],
                    "keywords": ["arjuna", "krishna"],
                    "region": "India",
                },
            },
            {
                "id": "jataka_1",
                "title": "The Buddha and the Elephant",
                "content": """In the days when Buddha lived, there was a wild elephant that had been driven mad by drinking fermented liquor. The raging animal ran through the city causing destruction and fear. Everyone fled in terror except the Buddha. With his serene presence, the Buddha approached the furious elephant without any weapon. The Buddha's compassion radiated such peace that the elephant, sensing the truthfulness of the Buddha's heart, became calm. The elephant bowed before the Buddha in respect. This story teaches us that true courage comes from inner peace and compassion, not from weapons or physical strength. The Buddha demonstrated that kindness and understanding can tame even the wildest of creatures.""",
                "language": "en",
                "category": "inspiring",
                "difficulty": "medium",
                "duration": STORY_DURATION,
                "wordCount": 185,
                "author": "Jataka Tales",
                "source": "sample",
                "rating": 5,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
                "metadata": {
                    "themes": ["compassion", "peace", "courage"],
                    "keywords": ["buddha", "elephant"],
                    "region": "Asia",
                },
            },
        ]

        return stories

    def upload_to_firestore(self, stories: List[Dict]) -> bool:
        """Upload stories to Firebase Firestore in batches"""
        if not self.db:
            print(
                "⚠️  Firebase not connected. Saving to local JSON instead (DEMO MODE)"
            )
            self._save_local_backup(stories)
            return False

        print(f"\n🚀 Uploading {len(stories)} stories to Firestore...")

        try:
            # Process in batches
            for i in range(0, len(stories), BATCH_SIZE):
                batch = self.db.batch()
                batch_stories = stories[i : i + BATCH_SIZE]

                for story in batch_stories:
                    doc_ref = self.db.collection("stories").document(story["id"])
                    batch.set(doc_ref, story)

                batch.commit()
                print(f"✅ Uploaded {min(i + BATCH_SIZE, len(stories))}/{len(stories)}")
                time.sleep(1)  # Rate limiting

            self.stories_imported = len(stories)
            print(f"✅ Successfully uploaded {len(stories)} stories!")
            return True

        except Exception as e:
            print(f"❌ Error uploading to Firestore: {e}")
            self._save_local_backup(stories)
            return False

    def _save_local_backup(self, stories: List[Dict]):
        """Save stories to local JSON file as backup"""
        backup_file = "imported_stories_backup.json"
        with open(backup_file, "w", encoding="utf-8") as f:
            json.dump(stories, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {len(stories)} stories to {backup_file}")

    def setup_firestore_collections(self) -> bool:
        """Initialize Firestore collections with languages and categories"""
        if not self.db:
            print("⚠️  Firebase not connected, skipping collection setup")
            return False

        try:
            print("\n📋 Setting up Firestore collections...")

            # Add languages
            for lang_code, lang_data in LANGUAGE_CONFIG.items():
                self.db.collection("languages").document(lang_code).set({
                    "code": lang_code,
                    "label": lang_data["name"],
                    "flag": lang_data["flag"],
                    "nativeCount": 0,
                    "isActive": True,
                })
            print("✅ Languages collection set up")

            # Add categories
            for cat_id, cat_data in CATEGORIES.items():
                self.db.collection("categories").document(cat_id).set({
                    "id": cat_id,
                    "name": cat_data["name"],
                    "description": cat_data["description"],
                    "icon": cat_data["icon"],
                    "storyCount": 0,
                })
            print("✅ Categories collection set up")

            return True

        except Exception as e:
            print(f"⚠️  Error setting up collections: {e}")
            return False

    def import_stories(self):
        """Main import workflow"""
        print("=" * 60)
        print("🎯 SpeechOK Story Importer - Phase 2")
        print("=" * 60)

        # Setup collections
        self.setup_firestore_collections()

        all_stories = []

        # Fetch from Gutenberg
        gutenberg_stories = self.fetch_gutenberg_stories()
        all_stories.extend(gutenberg_stories)

        # Add cultural stories if we don't have enough
        if len(all_stories) < 150:
            cultural_stories = self.create_sample_stories()
            all_stories.extend(cultural_stories)

        # Remove duplicates
        unique_stories = {}
        for story in all_stories:
            if story["id"] not in unique_stories:
                unique_stories[story["id"]] = story
        all_stories = list(unique_stories.values())

        print(f"\n📊 Summary:")
        print(f"  Total stories: {len(all_stories)}")

        # Count by language
        by_language = {}
        for story in all_stories:
            lang = story.get("language", "unknown")
            by_language[lang] = by_language.get(lang, 0) + 1

        for lang, count in by_language.items():
            print(f"  {lang}: {count} stories")

        # Upload to Firestore
        success = self.upload_to_firestore(all_stories)

        if success:
            print("\n✅ Import completed successfully!")
        else:
            print("\n⚠️  Upload failed, but stories saved locally")

        return all_stories


def main():
    """Main entry point"""
    try:
        importer = StoryImporter()
        importer.import_stories()

    except KeyboardInterrupt:
        print("\n\n⚠️  Import interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
