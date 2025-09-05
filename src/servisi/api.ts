export const API = import.meta.env.VITE_API_URL as string;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API + path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) } });
  if (!res.ok) throw new Error(await res.text().catch(()=>res.statusText));
  return res.json() as Promise<T>;
}

export const getJson = <T>(path: string) => http<T>(path);
