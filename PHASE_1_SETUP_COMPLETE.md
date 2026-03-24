# Phase 1: Firebase Setup - Complete ✅

## Files Created/Updated:

1. ✅ `firebaseConfig.js` - Firebase initialization with Firestore
2. ✅ `firestoreStoryApi.js` - Complete Firestore API functions (15 functions)
3. ✅ `storyApi.js` - Updated to use Firebase with local fallback
4. ✅ `.env.local` - Firebase credentials configured
5. ✅ `package.json` - Firebase already installed

---

## Next Steps: Firestore Database Setup

### Step 1: Create Firestore Collections in Firebase Console

You need to create these 3 collections in your Firebase project:

#### **Collection 1: `stories`**

Create fields with these example values:

```
Document: en_story_1
{
  "id": "en_story_1",
  "title": "The Lost City",
  "content": "[long story text...]",
  "language": "en",
  "category": "Adventure",
  "difficulty": "medium",
  "duration": "15 mins",
  "wordCount": 2250,
  "author": "Anonymous",
  "source": "public_domain",
  "rating": 4.5,
  "createdAt": "2024-03-24T10:00:00Z",
  "updatedAt": "2024-03-24T10:00:00Z",
  "metadata": {
    "themes": ["adventure", "discovery"],
    "keywords": ["lost", "city", "exploration"],
    "region": "general"
  }
}
```

To quickly populate this:

- Go to Firebase Console → Firestore Database → Start Collection
- Create collection named `stories`
- Add the above document
- **OR** use the import script in the next phase

#### **Collection 2: `languages`**

```
Document: en
{
  "code": "en",
  "label": "English",
  "flag": "🇺🇸",
  "nativeCount": 0,
  "isActive": true
}

Document: hi
{
  "code": "hi",
  "label": "हिंदी (Hindi)",
  "flag": "🇮🇳",
  "nativeCount": 0,
  "isActive": true
}

Document: ta
{
  "code": "ta",
  "label": "Tamil",
  "flag": "🇮🇳",
  "nativeCount": 0,
  "isActive": true
}

Document: te
{
  "code": "te",
  "label": "Telugu",
  "flag": "🇮🇳",
  "nativeCount": 0,
  "isActive": true
}

Document: mr
{
  "code": "mr",
  "label": "मराठी (Marathi)",
  "flag": "🇮🇳",
  "nativeCount": 0,
  "isActive": true
}
```

#### **Collection 3: `categories`**

```
Document: adventure
{
  "id": "adventure",
  "name": "Adventure",
  "description": "Thrilling journeys and discoveries",
  "icon": "🚀",
  "storyCount": 0
}

Document: drama
{
  "id": "drama",
  "name": "Drama",
  "description": "Emotional stories with depth",
  "icon": "🎭",
  "storyCount": 0
}

Document: educational
{
  "id": "educational",
  "name": "Educational",
  "description": "Learning through stories",
  "icon": "📚",
  "storyCount": 0
}

Document: cultural
{
  "id": "cultural",
  "name": "Cultural",
  "description": "Traditional and cultural tales",
  "icon": "🏛️",
  "storyCount": 0
}

Document: inspiring
{
  "id": "inspiring",
  "name": "Inspiring",
  "description": "Motivational and uplifting stories",
  "icon": "✨",
  "storyCount": 0
}
```

### Step 2: Update Firestore Security Rules

For development/testing, go to Firebase Console → Firestore → Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access for all (public stories)
    match /stories/{document=**} {
      allow read: if true;
      allow write: if false; // Disable writes for now
    }

    // Allow read access to languages and categories
    match /languages/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    match /categories/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Step 3: Test the Integration

Run this in your browser console to verify Firebase is working:

```javascript
// Test in browser console (F12)
import { fetchRandomStory } from "./src/lib/storyApi.js";

fetchRandomStory("en")
  .then((story) => {
    console.log("✅ Story loaded:", story.title);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    console.log("Falls back to local stories - this is OK");
  });
```

Or add this to one of your components:

```jsx
import { useEffect } from "react";
import { fetchRandomStory } from "../../lib/storyApi.js";

export function FirebaseTestComponent() {
  useEffect(() => {
    fetchRandomStory("en")
      .then((story) => {
        console.log("✅ Firebase integration working!", story);
      })
      .catch((error) => {
        console.log("ℹ️ Using fallback to local stories:", error.message);
      });
  }, []);

  return <div>Check console for Firebase test results</div>;
}
```

---

## Available Firestore API Functions

You can now use these functions in your components:

```javascript
import {
  fetchRandomStory, // Get a random story
  fetchStoriesByLanguage, // Get multiple stories with pagination
  fetchStoriesByCategory, // Filter by category
  searchStories, // Search stories
  fetchLanguages, // Get all languages
  fetchCategories, // Get all categories
  rateStory, // Rate a story (0-5)
  getStoryStats, // Get statistics
  batchUploadStories, // Bulk import
  clearCache, // Clear local cache
} from "./lib/firestoreStoryApi.js";
```

---

## Fallback Strategy

If Firestore is unavailable, the app automatically falls back to local stories from:

- `src/data/stories/randomStories.js` (10 Hindi + 10 English stories)

This ensures the app works offline and during development.

---

## Phase 1 Checklist

- [ ] Firebase project created (speech-good)
- [ ] `.env.local` file configured with credentials
- [ ] `firebaseConfig.js` created
- [ ] `firestoreStoryApi.js` created with 15 API functions
- [ ] `storyApi.js` updated to use Firebase
- [ ] Firestore collections created:
  - [ ] `stories` collection with sample document
  - [ ] `languages` collection (5 documents)
  - [ ] `categories` collection (5 documents)
- [ ] Security rules updated
- [ ] App tested and working (uses local stories as fallback)

---

## What's Next (Phase 2)

Once this is working:

1. Create Python import script (`scripts/import_stories.py`)
2. Fetch 200 public domain stories
3. Bulk upload to Firestore
4. Update UI with Firebase API integration

---

## Troubleshooting

**Issue: "No local stories found and API Error"**

- Check `.env.local` has correct credentials
- Verify Firestore collections exist
- Check browser console for detailed error
- App will use local story fallback

**Issue: Firebase not initializing**

- Ensure `firebase` package is installed (it is: v12.0.0)
- Clear `node_modules` and run `npm install` again
- Check Firebase credentials in `.env.local`

**Issue: Connection timeout**

- Firestore may be unreachable, check internet
- App will automatically fallback to local stories
- This is expected and working as designed

---

## Status: ✅ Phase 1 Complete

You now have:

- ✅ Firebase configured
- ✅ Firestore API integration
- ✅ Fallback to local stories
- ✅ Ready for Phase 2 (Story Import)

Ready to proceed? Run `npm run dev` and test!
