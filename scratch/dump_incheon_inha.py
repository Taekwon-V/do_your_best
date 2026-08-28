import pypdf
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def analyze_incheon():
    print("=== INCHEON UNIVERSITY DEPARTMENTS & SCORES ===")
    r_susi = pypdf.PdfReader(r"c:\work\do_your_best\docs\universities\past_result\인천대-2026수시입결.pdf")
    susi_text = "\n".join([p.extract_text() for p in r_susi.pages])
    
    r_jeongsi = pypdf.PdfReader(r"c:\work\do_your_best\docs\universities\past_result\인천대-2026정시입결.pdf")
    jeongsi_text = "\n".join([p.extract_text() for p in r_jeongsi.pages])
    
    with open("scratch/incheon_susi_raw.txt", "w", encoding="utf-8") as f:
        f.write(susi_text)
    with open("scratch/incheon_jeongsi_raw.txt", "w", encoding="utf-8") as f:
        f.write(jeongsi_text)
    print("Incheon raw dumped successfully")

def analyze_inha():
    print("=== INHA UNIVERSITY DEPARTMENTS ===")
    r_susi = pypdf.PdfReader(r"c:\work\do_your_best\docs\universities\인하대-2027수시모집.pdf")
    susi_text = "\n".join([p.extract_text() for p in r_susi.pages])
    
    r_jeongsi = pypdf.PdfReader(r"c:\work\do_your_best\docs\universities\인하대-2027정시모집.pdf")
    jeongsi_text = "\n".join([p.extract_text() for p in r_jeongsi.pages])
    
    with open("scratch/inha_susi_raw.txt", "w", encoding="utf-8") as f:
        f.write(susi_text)
    with open("scratch/inha_jeongsi_raw.txt", "w", encoding="utf-8") as f:
        f.write(jeongsi_text)
    print("Inha raw dumped successfully")

analyze_incheon()
analyze_inha()
