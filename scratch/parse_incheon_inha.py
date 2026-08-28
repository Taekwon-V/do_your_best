import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read incheon raw texts
with open("scratch/incheon_susi_raw.txt", "r", encoding="utf-8") as f:
    inc_susi = f.read()

with open("scratch/incheon_jeongsi_raw.txt", "r", encoding="utf-8") as f:
    inc_jeongsi = f.read()

with open("scratch/inha_susi_raw.txt", "r", encoding="utf-8") as f:
    inha_susi = f.read()

with open("scratch/inha_jeongsi_raw.txt", "r", encoding="utf-8") as f:
    inha_jeongsi = f.read()

print("=== INCHEON JEONGSI MATCHES ===")
lines = inc_jeongsi.split("\n")
for l in lines:
    if any(k in l for k in ["학과", "학부", "전공"]) and any(c.isdigit() for c in l):
        print(l)

print("\n=== INHA SUSI DEPARTMENTS ===")
# Find table of recruitment in inha
for l in inha_susi.split("\n"):
    if any(k in l for k in ["공학과", "학부", "교육과", "학과", "의예과", "간호학과"]) and len(l) < 60:
        print(l.strip())
