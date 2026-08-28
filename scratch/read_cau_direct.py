import pypdf
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

pdf_paths = {
    "susi_2026_result": r"c:\work\do_your_best\docs\universities\past_result\중앙대-2026수시입결.pdf",
    "jeongsi_2025_result": r"c:\work\do_your_best\docs\universities\past_result\중앙대-2025정시입결.pdf",
    "susi_2027_guide": r"c:\work\do_your_best\docs\universities\중앙대학교_2027수시모집.pdf",
    "jeongsi_2026_guide": r"c:\work\do_your_best\docs\universities\중앙대학교_2026정시모집.pdf",
}

for name, path in pdf_paths.items():
    if not os.path.exists(path):
        continue
    reader = pypdf.PdfReader(path)
    print(f"=== {name}: {len(reader.pages)} pages ===")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if "지역균형" in text or "융합형" in text or "탐구형" in text or "수능" in text or "모집단위" in text:
            print(f"--- {name} Page {i+1} ---")
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            for l in lines[:40]:
                print(l)
