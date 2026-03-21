import fs from 'fs';
const src = "C:\\Users\\Veer Pal Singh\\.gemini\\antigravity\\brain\\dd5e5b01-ec79-4a09-b8df-e40d6ab3134b\\speechgood_icon_1774115547164.png";

try {
  fs.copyFileSync(src, 'public/pwa-192x192.png');
  fs.copyFileSync(src, 'public/pwa-512x512.png');
  fs.copyFileSync(src, 'public/apple-touch-icon.png');
  console.log('Success!');
} catch (e) {
  console.error(e);
}
