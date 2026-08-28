import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for mod in ['pytesseract', 'easyocr', 'PIL', 'pdf2image']:
    try:
        __import__(mod)
        print(f'{mod}: available')
    except ImportError:
        print(f'{mod}: not available')
