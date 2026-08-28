import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

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
    print(f"\n=======================================================")
    print(f"=== {os.path.basename(pdf_path)} (Pages: {len(reader.pages)}) ===")
    print(f"=======================================================")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"\n--- [Page {i+1}] ---")
        print(text)
