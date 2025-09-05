export const API = (import.meta as any).env?.VITE_API_URL as string;

if (!API) {
  
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  
  const text = await res.text().catch(() => "");
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data as any).razlog) ||
      (data && typeof data === "string" ? data : undefined) ||
      res.statusText;
    throw new Error(String(msg || "Greška prilikom upita."));
  }

  return (data as T);
}

export const getJson = <T>(path: string) => http<T>(path);
