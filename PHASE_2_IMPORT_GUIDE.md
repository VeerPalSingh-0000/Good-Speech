# Phase 2: Story Import Script Setup

## ✅ Files Created

1. **`scripts/import_stories.py`** - Complete Python story importer
   - Fetches from Project Gutenberg API
   - Creates sample cultural stories
   - Uploads to Firebase Firestore in batches
   - Includes error handling and fallback mode

2. **`scripts/requirements.txt`** - Python dependencies
   - `requests` - HTTP library for API calls
   - `firebase-admin` - Firebase SDK
   - `python-dotenv` - Load environment variables

---

## Quick Start

### Step 1: Install Python Dependencies

```bash
# From project root
pip install -r scripts/requirements.txt
```

**Alternative** (if using Python 3):

```bash
python3 -m pip install -r scripts/requirements.txt
```

### Step 2: Set Up Firebase Authentication

**Option A: Using Service Account (Recommended for Production)**

1. Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `scripts/firebase-key.json` (auto-ignored by git)
4. Run the import script (it will auto-detect the key file)

**Option B: Using Default Credentials (Easier for Development)**

The script will use credentials from:

- `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- `~/.config/gcloud/` (gcloud CLI credentials)
- Firebase emulator (if running locally)

### Step 3: Run the Import Script

```bash
# From project root
python scripts/import_stories.py
```

Or with Python 3 explicitly:

```bash
python3 scripts/import_stories.py
```

### Expected Output

```
============================================================
🎯 SpeechOK Story Importer - Phase 2
============================================================

✅ Firebase initialized successfully

📋 Setting up Firestore collections...
✅ Languages collection set up
✅ Categories collection set up

📚 Fetching from Project Gutenberg...
Processing book 1/50: Pride and Prejudice...
✅ Fetched 42 story chunks from Gutenberg

🏛️  Creating sample cultural stories...

📊 Summary:
  Total stories: 44
  en: 30 stories
  hi: 10 stories
  ta: 2 stories
  te: 1 story
  mr: 1 story

🚀 Uploading 44 stories to Firestore...
✅ Uploaded 44/44
✅ Successfully uploaded 44 stories!

✅ Import completed successfully!
```

---

## What the Script Does

### 1. **Fetches from Project Gutenberg**

- Gets popular books via API
- Extracts text content
- Chunks into 15-minute stories (~2250 words each)
- Auto-detects language
- Determines difficulty level
- Assigns categories

### 2. **Creates Sample Stories**

- Includes Panchatantra tales
- Ramayana excerpts
- Cultural stories perfect for speech practice
- Ensures all languages have content

### 3. **Uploads to Firebase**

- Batch processing (100 stories at a time)
- Updates `stories` collection in Firestore
- Sets up `languages` and `categories` collections
- Includes full metadata (author, themes, keywords)

### 4. **Fallback Mode**

- If Firebase not connected: saves to `imported_stories_backup.json`
- App will use local stories as fallback
- Can manually upload later from JSON file

---

## Customization Options

### Change Number of Stories

Edit `scripts/import_stories.py` line ~60:

```python
# Fetch up to 50 books, then chunk them
for i, book in enumerate(books[:50]):  # Change this number
    ...
    if len(stories) >= 200:  # Change target number here
        break
```

### Add Different Story Sources

Add a new method to the `StoryImporter` class:

```python
def fetch_indian_literature(self) -> List[Dict]:
    """Fetch from Indian literature repository"""
    # Your implementation here
    return stories

# In import_stories() method:
indian_stories = self.fetch_indian_literature()
all_stories.extend(indian_stories)
```

### Filter by Language

Modify the language detection in the script to prioritize specific languages:

```python
def detect_language(self, title: str, content: str) -> str:
    """Detect language from text"""
    # Add your custom language detection logic
    text_lower = (title + " " + content[:500]).lower()

    # Check for Hindi-specific content
    if 'hindi' in text_lower or 'हिंदी' in content:
        return 'hi'

    # Default fallback
    return "en"
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'firebase_admin'"

**Solution:**

```bash
pip install --upgrade firebase-admin
```

### Issue: "Firebase initialization failed"

**Solution:**

- Script will use Demo Mode (local JSON backup)
- Manually upload from `imported_stories_backup.json` later
- OR set up `firebase-key.json` in scripts folder

### Issue: "No module named 'requests'"

**Solution:**

```bash
pip install requests
```

### Issue: Script runs but uploads nothing

**Cause:** Firebase credentials not found
**Solution:**

1. Check `scripts/firebase-key.json` exists
2. Check `GOOGLE_APPLICATION_CREDENTIALS` environment variable
3. See local backup file: `imported_stories_backup.json`

---

## Estimated Runtime

- **First Run:** 5-10 minutes (fetches from Gutenberg)
- **Subsequent Runs:** 2-5 minutes (API caching)
- **Upload to Firestore:** 1-3 minutes (100 story batch)

---

## Manual Upload (If Needed)

If the script creates `imported_stories_backup.json` but can't upload, manually upload:

```javascript
// In browser console at Firebase Console
const stories = [...]; // Load from JSON file
const db = firebase.firestore();

stories.slice(0, 100).forEach(story => {
  db.collection('stories').doc(story.id).set(story);
});

// Repeat in batches of 100
```

---

## Next Phase

Once stories are uploaded, we'll:

1. ✅ Create story import script (DONE)
2. Update UI with dynamic language/category filters
3. Add search functionality
4. Implement pagination for large datasets
5. Add story metadata display (difficulty, author, etc.)

---

## Status: ✅ Phase 2 Ready

**Files Created:**

- ✅ `scripts/import_stories.py` (465 lines)
- ✅ `scripts/requirements.txt` (dependencies)

**Next Steps:**

1. Install Python dependencies: `pip install -r scripts/requirements.txt`
2. Set up Firebase credentials (`scripts/firebase-key.json`)
3. Run: `python scripts/import_stories.py`
4. Verify stories uploaded to Firestore
5. Check story count in Firebase Console

---

## Quick Commands Reference

```bash
# Install dependencies
pip install -r scripts/requirements.txt

# Run the importer
python scripts/import_stories.py

# Check if stories were uploaded (in Firebase Console)
# Go to: Firestore Database → stories collection → Count documents

# View backup if needed
cat imported_stories_backup.json | head -50

# Clean up old backups
rm imported_stories_backup.json
```

---

Ready to run the script? 🚀
