import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def parse_pdf_text(path, label):
    if not os.path.exists(path):
        print("NOT FOUND:", path)
        return ""
    reader = pypdf.PdfReader(path)
    print(f"=== {label} ({os.path.basename(path)}) Total Pages: {len(reader.pages)} ===")
    full_text = []
    for i, p in enumerate(reader.pages):
        t = p.extract_text()
        print(f"--- Page {i+1} ---")
        lines = [l.strip() for l in t.split("\n") if l.strip()]
        for l in lines[:30]:
            print(l)
        full_text.append(t)
    return "\n".join(full_text)

# Check Incheon & Inha Result PDFs
parse_pdf_text(r"c:\work\do_your_best\docs\universities\past_result\인천대-2026수시입결.pdf", "인천대 2026 수시 입결")
parse_pdf_text(r"c:\work\do_your_best\docs\universities\past_result\인천대-2026정시입결.pdf", "인천대 2026 정시 입결")
parse_pdf_text(r"c:\work\do_your_best\docs\universities\past_result\인하대-2026수시학생부교과입결.pdf", "인하대 2026 교과 입결")
parse_pdf_text(r"c:\work\do_your_best\docs\universities\past_result\인하대-2026수시학생부종합입결.pdf", "인하대 2026 학종 입결")
parse_pdf_text(r"c:\work\do_your_best\docs\universities\past_result\인하대-2026정시입결.pdf", "인하대 2026 정시 입결")
