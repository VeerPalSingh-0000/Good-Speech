import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

TARGET_DIR = "public/stories"
os.makedirs(TARGET_DIR, exist_ok=True)

# Sourcing free direct PDF links
pdf_links = {
    "godan.pdf": "https://poshampa.org/wp-content/uploads/2020/09/Godan.pdf",
    "panchatantra.pdf": "https://ia903204.us.archive.org/32/items/Panchtantra-By-Shri-Vishnu-Sharma/Panchtantra%20by%20Shri%20Vishnu%20Sharma.pdf",
    "jataka.pdf": "https://ia801804.us.archive.org/15/items/jatakkathayen_201912/Jatak%20Kathayen.pdf",
    "kabir_dohe.pdf": "https://archive.org/download/KabirKeDoheInHindiWithMeaning.pdf/%E0%A4%95%E0%A4%AC%E0%A5%80%E0%A4%B0%20%E0%A4%95%E0%A5%87%20%E0%A4%A6%E0%A5%8B%E0%A4%B9%E0%A5%87%20kabir%20ke%20dohe%20in%20hindi%20with%20meaning.pdf"
}

for filename, url in pdf_links.items():
    print(f"Downloading {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=120) as response, open(os.path.join(TARGET_DIR, filename), 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
