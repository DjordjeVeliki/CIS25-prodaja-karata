import { useEffect, useState } from "react";

const KEY = "kurs_eur_rsd_v2";
const TTL_MS = 12 * 60 * 60 * 1000; 

type Saved = { value: number; at: number };


export default function useKursEur() {
  const [kurs, setKurs] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const saved: Saved = JSON.parse(raw);
      if (Date.now() - saved.at < TTL_MS) return saved.value;
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(
          "https://api.exchangerate.host/convert?from=RSD&to=EUR&amount=1"
        );
        if (!r.ok) return;
        const data = await r.json();
        const value: number | null =
          typeof data?.result === "number"
            ? data.result
            : typeof data?.info?.rate === "number"
            ? data.info.rate
            : null;

        if (alive && typeof value === "number" && isFinite(value) && value > 0) {
          setKurs(value);
          try {
            localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
          } catch {}
        }
      } catch {
       
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return kurs;
}
