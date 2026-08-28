import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader(r"c:\work\do_your_best\docs\universities\past_result\중앙대-2026수시입결.pdf")
print(f"Total pages: {len(reader.pages)}")
for i, p in enumerate(reader.pages):
    print(f"\n=== PAGE {i+1} ===")
    print(p.extract_text())
