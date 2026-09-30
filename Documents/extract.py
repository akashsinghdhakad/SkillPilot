import sys
import glob
import zipfile
import xml.etree.ElementTree as ET
import os

def extract_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text = []
        for paragraph in tree.findall('.//w:p', ns):
            texts = [node.text for node in paragraph.findall('.//w:t', ns) if node.text]
            if texts:
                text.append(''.join(texts))
        return '\n'.join(text)
    except Exception as e:
        return f"Error reading {docx_path}: {e}"

for docx_file in glob.glob("*.docx"):
    txt_file = docx_file.replace(".docx", ".txt")
    print(f"Extracting {docx_file} to {txt_file}...")
    with open(txt_file, "w", encoding="utf-8") as f:
        f.write(extract_text(docx_file))

print("Extraction complete.")
