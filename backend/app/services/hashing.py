import hashlib
import re


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_email(email: str | None) -> str | None:
    if not email:
        return None
    return sha256_hex(email.strip().lower())


def hash_name_part(part: str | None) -> str | None:
    if not part:
        return None
    cleaned = re.sub(r"[^\w\u0600-\u06FF]+", "", part.strip().lower(), flags=re.UNICODE)
    if not cleaned:
        return None
    return sha256_hex(cleaned)


def split_name(name: str | None) -> tuple[str | None, str | None]:
    if not name:
        return None, None
    bits = name.strip().split()
    if not bits:
        return None, None
    if len(bits) == 1:
        return bits[0], None
    return bits[0], " ".join(bits[1:])


def hash_phone(phone: str | None) -> str | None:
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    if not digits:
        return None
    return sha256_hex(digits)


def user_hashes(name: str | None, email: str | None, phone: str | None = None) -> dict[str, str]:
    fn, ln = split_name(name)
    out: dict[str, str] = {}
    em = hash_email(email)
    if em:
        out["em"] = em
    hfn = hash_name_part(fn)
    hln = hash_name_part(ln)
    if hfn:
        out["fn"] = hfn
    if hln:
        out["ln"] = hln
    ph = hash_phone(phone)
    if ph:
        out["ph"] = ph
    return out
