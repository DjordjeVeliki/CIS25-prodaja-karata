import { useEffect, useState } from "react";

export function useLokalnoSkladiste<T>(kljuc: string, pocetnaVrednost: T) {
  const [vrednost, setVrednost] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(kljuc);
      return raw ? (JSON.parse(raw) as T) : pocetnaVrednost;
    } catch {
      return pocetnaVrednost;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(kljuc, JSON.stringify(vrednost));
    } catch {}
  }, [kljuc, vrednost]);

  return [vrednost, setVrednost] as const;
}
