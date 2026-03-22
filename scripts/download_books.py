import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

TARGET_DIR = "public/stories"
os.makedirs(TARGET_DIR, exist_ok=True)

pdf_links = {
    "frankenstein.pdf": "https://www.planetebook.com/free-ebooks/frankenstein.pdf",
    "pride_and_prejudice.pdf": "https://www.planetebook.com/free-ebooks/pride-and-prejudice.pdf",
    "gatsby.pdf": "https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf"
}

for filename, url in pdf_links.items():
    print(f"Downloading {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=30) as response, open(os.path.join(TARGET_DIR, filename), 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
