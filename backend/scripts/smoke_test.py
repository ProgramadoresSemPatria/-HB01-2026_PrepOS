"""Smoke test da camada de persistência (sem LLM).

Gera um PDF mínimo, faz POST /analysis e GET /analysis/{id}.
Uso: python -m scripts.smoke_test
"""

import base64

import httpx

BASE = "http://localhost:8000"


def build_pdf() -> bytes:
    text_lines = [
        "(Joao Silva - Software Engineer) Tj",
        "0 -20 Td (Skills: React, TypeScript, Node.js, Python) Tj",
        "0 -20 Td (Experience: 5 years building web apps) Tj",
    ]
    content = "BT /F1 12 Tf 72 720 Td " + " ".join(text_lines) + " ET"
    content_bytes = content.encode("latin-1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length "
        + str(len(content_bytes)).encode()
        + b" >>\nstream\n"
        + content_bytes
        + b"\nendstream",
    ]

    pdf = b"%PDF-1.4\n"
    offsets = []
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf += f"{i} 0 obj\n".encode() + obj + b"\nendobj\n"

    xref_pos = len(pdf)
    pdf += f"xref\n0 {len(objects) + 1}\n".encode()
    pdf += b"0000000000 65535 f \n"
    for off in offsets:
        pdf += f"{off:010d} 00000 n \n".encode()
    pdf += (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n".encode()
        + f"startxref\n{xref_pos}\n%%EOF".encode()
    )
    return pdf


def main() -> None:
    pdf = build_pdf()
    print(f"PDF gerado: {len(pdf)} bytes")

    files = {"resume": ("cv.pdf", pdf, "application/pdf")}
    data = {"job_title": "Frontend Engineer", "job_description": "React e TypeScript"}

    r = httpx.post(f"{BASE}/analysis", files=files, data=data, timeout=30)
    print("POST /analysis ->", r.status_code, r.text)
    r.raise_for_status()
    analysis_id = r.json()["analysis_id"]

    r2 = httpx.get(f"{BASE}/analysis/{analysis_id}", timeout=30)
    body = r2.json()
    resume_b64 = body.pop("resume", "")
    decoded_ok = base64.b64decode(resume_b64)[:5] == b"%PDF-"
    print("GET /analysis/{id} ->", r2.status_code, body)
    print(f"resume base64: {len(resume_b64)} chars, decodifica p/ PDF valido: {decoded_ok}")

    r3 = httpx.get(f"{BASE}/analysis/nao-existe", timeout=30)
    print("GET inexistente ->", r3.status_code, r3.json())


if __name__ == "__main__":
    main()
