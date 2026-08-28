import pypdf
import os
import re

pdf_files = [
    r"c:\work\do_your_best\docs\universities\past_result\중앙대-2026수시입결.pdf",
    r"c:\work\do_your_best\docs\universities\past_result\중앙대-2025정시입결.pdf",
    r"c:\work\do_your_best\docs\universities\중앙대학교_2027수시모집.pdf",
    r"c:\work\do_your_best\docs\universities\중앙대학교_2026정시모집.pdf",
]

for pdf_path in pdf_files:
    if not os.path.exists(pdf_path):
        print(f"NOT FOUND: {pdf_path}")
        continue
    reader = pypdf.PdfReader(pdf_path)
    print(f"=== {os.path.basename(pdf_path)} (Pages: {len(reader.pages)}) ===")
    for i in range(min(5, len(reader.pages))):
        text = reader.pages[i].extract_text()
        print(f"--- Page {i+1} sample (first 300 chars) ---")
        print(text[:300].strip())
