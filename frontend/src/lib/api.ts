export function api(path: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return fetch(`${base}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
}
