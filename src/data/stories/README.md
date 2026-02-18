# HOW TO ADD NEW STORIES

## 📁 Folder Structure

\`\`\`
src/data/stories/
├── index.js          <- Main file that combines all stories
├── hindiStories.js   <- Hindi folktales
├── harryPotter.js    <- Harry Potter chapters in Hindi
├── newStories.js     <- Your new story collection (example)
└── README.md         <- This file
\`\`\`

## 🆕 To Add a New Story Collection

1. **Create a new file** in this folder (e.g., `panchatantra.js`)

2. **Use this template**:

   \`\`\`javascript
   export const panchatantraStories = [
     {
       id: 'panch-1',           // Unique ID (prefix + number)
       title: "कहानी का नाम",    // Story title
       difficulty: "Easy",      // Easy, Medium, or Hard
       category: "Panchatantra", // Category name
       excerpt: "छोटा सारांश...", // Short preview (shown on card)
       content: \`पूरी कहानी यहाँ लिखें...\`, // Full story content
     },
     // Add more stories here...
   ];
   \`\`\`

3. **Import and add to index.js**:

   In \`index.js\`, add:

   \`\`\`javascript
   import { panchatantraStories } from './panchatantra';
   
   export const allStories = [
     ...hindiStories,
     ...harryPotterStories,
     ...panchatantraStories,  // Add this line
   ];
   \`\`\`

## 📝 Story Object Properties

- **id**: `string` (unique, use prefix like 'hp-1', 'hindi-2', 'panch-3')
- **title**: `string` (story title in Hindi or English)
- **difficulty**: `"Easy" | "Medium" | "Hard"`
- **category**: `string` (for filtering/grouping)
- **excerpt**: `string` (short preview, 1-2 sentences)
- **content**: `string` (full story content, use backticks \` for multiline)

## ✨ Tips

- Use unique id prefixes for each collection (hp-, hindi-, panch-, etc.)
- Keep excerpts short (under 200 characters)
- Use template literals (backticks) for content with line breaks
- Organize stories by difficulty within each collection

🎉 That's it! Your new stories will automatically appear in the app!
