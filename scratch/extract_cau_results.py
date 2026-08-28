import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def parse_pdf(path, title):
    if not os.path.exists(path):
        print("NOT FOUND:", path)
        return
    reader = pypdf.PdfReader(path)
    print(f"==================================================")
    print(f"=== {title} (Total Pages: {len(reader.pages)}) ===")
    print(f"==================================================")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"\n--- [Page {i+1}] ---")
        print(text)

parse_pdf(r"c:\work\do_your_best\docs\universities\past_result\중앙대-2026수시입결.pdf", "중앙대 2026 수시 입결")
parse_pdf(r"c:\work\do_your_best\docs\universities\past_result\중앙대-2025정시입결.pdf", "중앙대 2025 정시 입결")
