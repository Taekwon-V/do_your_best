import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scratch/cau_dump.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i in range(min(120, len(lines))):
    print(lines[i].strip())
