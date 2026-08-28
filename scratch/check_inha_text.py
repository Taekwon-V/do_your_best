import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for pdf_name in ["인하대-2026수시학생부교과입결.pdf", "인하대-2026수시학생부종합입결.pdf", "인하대-2026정시입결.pdf", "인하대-2027수시모집.pdf", "인하대-2027정시모집.pdf", "인천대-2027수시모집.pdf", "인천대-2027정시모집.pdf"]:
    path = os.path.join(r"c:\work\do_your_best\docs\universities\past_result" if "입결" in pdf_name else r"c:\work\do_your_best\docs\universities", pdf_name)
    if not os.path.exists(path):
        print(f"NOT FOUND: {path}")
        continue
    reader = pypdf.PdfReader(path)
    total_text = ""
    for p in reader.pages:
        t = p.extract_text()
        if t: total_text += t + "\n"
    print(f"File: {pdf_name}, Total chars: {len(total_text)}")
    if len(total_text) > 0:
        print("Sample (first 200 chars):", total_text[:200].replace("\n", " "))
