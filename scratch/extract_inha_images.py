import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

out_dir = r"c:\work\do_your_best\scratch\inha_images"
os.makedirs(out_dir, exist_ok=True)

for pdf_name in ["인하대-2026수시학생부교과입결.pdf", "인하대-2026수시학생부종합입결.pdf", "인하대-2026정시입결.pdf"]:
    path = os.path.join(r"c:\work\do_your_best\docs\universities\past_result", pdf_name)
    reader = pypdf.PdfReader(path)
    clean_prefix = "inha_gyogwa" if "교과" in pdf_name else "inha_jonghap" if "종합" in pdf_name else "inha_jeongsi"
    img_idx = 0
    for page_idx, page in enumerate(reader.pages):
        for name, img in page.images.items():
            safe_name = name.replace("/", "_").replace("\\", "_")
            if not safe_name.endswith(".png") and not safe_name.endswith(".jpg"):
                safe_name += ".png"
            img_path = os.path.join(out_dir, f"{clean_prefix}_p{page_idx+1}_{img_idx}_{safe_name}")
            with open(img_path, "wb") as f:
                f.write(img.data)
            print(f"Saved: {img_path} ({len(img.data)} bytes)")
            img_idx += 1
