import sys

sys.stdout.reconfigure(encoding='utf-8')

def convert_to_5grade(g9):
    if g9 is None or g9 <= 0:
        return 1.5
    if g9 <= 1.1:
        return 1.00
    elif g9 <= 1.3:
        return round(1.00 + (g9 - 1.1) * 0.25, 2)
    elif g9 <= 2.0:
        return round(1.05 + (g9 - 1.3) * 0.40, 2)
    elif g9 <= 3.0:
        return round(1.33 + (g9 - 2.0) * 0.42, 2)
    elif g9 <= 4.0:
        return round(1.75 + (g9 - 3.0) * 0.30, 2)
    else:
        return round(2.05 + (g9 - 4.0) * 0.30, 2)

print("Formula ready.")
