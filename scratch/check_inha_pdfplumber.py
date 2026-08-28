import pdfplumber
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for pdf_name in ["인하대-2026수시학생부교과입결.pdf", "인하대-2026수시학생부종합입결.pdf", "인하대-2026정시입결.pdf"]:
    path = os.path.join(r"c:\work\do_your_best\docs\universities\past_result", pdf_name)
    print(f"=== PDFPLUMBER: {pdf_name} ===")
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            tables = page.extract_tables()
            print(f"Page {i+1}: text_len={len(text) if text else 0}, tables_count={len(tables)}")
            if text:
                print("Text snippet:", text[:200])
            if tables:
                for t in tables[:2]:
                    for row in t[:5]:
                        print("Row:", row)
