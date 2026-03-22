import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

TARGET_DIR = "public/stories"
os.makedirs(TARGET_DIR, exist_ok=True)

# Free public domain Internet Archive PDF downloads
pdf_links = {
    "panchatantra.pdf": "https://archive.org/download/panchtantrabyshrivishnusharma/Panchtantra%20by%20Shri%20Vishnu%20Sharma.pdf",
    "jataka.pdf": "https://archive.org/download/jatakkathayen_201912/Jatak%20Kathayen.pdf",
    "hitopadesha.pdf": "https://archive.org/download/in.ernet.dli.2015.346889/2015.346889.Hitopadesha.pdf",
    "godan.pdf": "https://archive.org/download/GODANGODAN/GODAN%20%E0%A4%97%E0%A5%8B%E0%A4%A6%E0%A4%BE%E0%A4%A8.pdf"
}

for filename, url in pdf_links.items():
    print(f"Downloading {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=60) as response, open(os.path.join(TARGET_DIR, filename), 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
