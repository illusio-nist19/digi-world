from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException
from fastapi.responses import FileResponse

VAULT_FILES: dict[str, str] = {
    "DW-SYS-009": "DW-SYS-009-smb-ai-governance-kit.zip",
    "DW-SYS-010": "DW-SYS-010-photographer-os.zip",
    "DW-SYS-011": "DW-SYS-011-client-tracker.zip",
    "DW-SYS-012": "DW-SYS-012-invoice-desk.zip",
    "DW-SYS-013": "DW-SYS-013-proposal-desk.zip",
    "DW-SYS-014": "DW-SYS-014-expense-desk.zip",
    "DW-SYS-015": "DW-SYS-015-content-planner.zip",
    "DW-SYS-016": "DW-SYS-016-meeting-desk.zip",
    "DW-SYS-017": "DW-SYS-017-time-rate-desk.zip",
    "DW-SYS-018": "DW-SYS-018-contract-desk.zip",
    "DW-SYS-019": "DW-SYS-019-onboarding-desk.zip",
    "DW-SYS-020": "DW-SYS-020-sop-desk.zip",
    "DW-SYS-021": "DW-SYS-021-testimonial-vault.zip",
    "DW-SYS-022": "DW-SYS-022-subscription-desk.zip",
    "DW-EBK-001": "DW-EBK-001-key-fob-programming-mastery.zip",
}

ROOTS = (
    Path(__file__).resolve().parents[2] / "vault",
    Path("/app/vault"),
)


def vault_path(sku: str) -> Path:
    name = VAULT_FILES.get(sku)
    if not name:
        raise HTTPException(404, "no file for this system")
    for root in ROOTS:
        path = root / name
        if path.is_file():
            return path
    raise HTTPException(404, "vault file missing")


def file_response(sku: str) -> FileResponse:
    path = vault_path(sku)
    return FileResponse(
        path,
        media_type="application/zip",
        filename=path.name,
        headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"},
    )
