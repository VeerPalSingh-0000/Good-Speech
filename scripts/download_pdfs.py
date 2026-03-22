import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

TARGET_DIR = "public/stories"
os.makedirs(TARGET_DIR, exist_ok=True)

pdf_links = {
    "alice.pdf": "https://www.adobe.com/be_en/active-use/pdf/Alice_in_Wonderland.pdf",
    "aesop.pdf": "https://www.ibiblio.org/ebooks/Aesop/Aesops_Fables.pdf",
    "peterpan.pdf": "https://www.ibiblio.org/ebooks/Barrie/PeterPan.pdf"
}

for filename, url in pdf_links.items():
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, os.path.join(TARGET_DIR, filename))
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
