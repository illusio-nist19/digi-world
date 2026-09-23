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
    "DW-EBK-002": "DW-EBK-002-little-cozy-days.zip",
    "DW-EBK-003": "DW-EBK-003-cartoon-buddies.zip",
    "DW-EBK-004": "DW-EBK-004-cozy-little-animals.zip",
    "DW-EBK-005": "DW-EBK-005-dino-friends.zip",
    "DW-EBK-006": "DW-EBK-006-magic-unicorn-days.zip",
    "DW-EBK-007": "DW-EBK-007-busy-little-wheels.zip",
    "DW-EBK-008": "DW-EBK-008-the-secret-sleep-keeps.zip",
    "DW-EBK-009": "DW-EBK-009-the-kindness-cave.zip",
    "DW-EBK-010": "DW-EBK-010-ember-who-shared-his-fire.zip",
    "DW-EBK-011": "DW-EBK-011-the-brave-little-lantern.zip",
    "DW-EBK-012": "DW-EBK-012-the-whispering-market.zip",
    "DW-EBK-013": "DW-EBK-013-the-fox-who-kept-his-word.zip",
    "DW-EBK-014": "DW-EBK-014-the-soft-word-door.zip",
    "DW-EBK-015": "DW-EBK-015-flash-and-nibble.zip",
    "DW-EBK-016": "DW-EBK-016-the-friendship-pot.zip",
    "DW-EBK-017": "DW-EBK-017-ruby-cloaks-true-path.zip",
    "DW-EBK-018": "DW-EBK-018-three-little-nest-builders.zip",
    "DW-EBK-019": "DW-EBK-019-luna-and-the-three-soft-chairs.zip",
    "DW-EBK-020": "DW-EBK-020-pip-and-the-sky-beans.zip",
    "DW-EBK-021": "DW-EBK-021-the-speckled-duckling.zip",
    "DW-EBK-022": "DW-EBK-022-cinders-and-the-kind-slippers.zip",
    "DW-EBK-023": "DW-EBK-023-tiny-paws-big-rescue.zip",
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
