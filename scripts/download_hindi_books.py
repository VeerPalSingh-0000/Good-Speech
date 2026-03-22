import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

TARGET_DIR = "public/stories"
os.makedirs(TARGET_DIR, exist_ok=True)

pdf_links = {
    # Public domain Premchand novels from Hindustan Books
    "godan.pdf": "http://hindustanbooks.com/pdfs/10121404-Godan.pdf",
    "gaban.pdf": "http://hindustanbooks.com/pdfs/10121405-Gaban.pdf",
    "karmbhumi.pdf": "http://hindustanbooks.com/pdfs/10121402-Karmbhumi.pdf",
    "rangbhumi.pdf": "http://hindustanbooks.com/pdfs/10121406-Rangbhumi.pdf"
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
