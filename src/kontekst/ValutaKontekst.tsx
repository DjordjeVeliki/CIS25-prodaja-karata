import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import useKursEur from "../kuke/useKursEur";

export type Valuta = "RSD" | "EUR";

type Ctx = {
  valuta: Valuta;
  kurs: number | null;                 // EUR po 1 RSD (preporuka)
  setValuta: (v: Valuta) => void;
  formatiraj: (iznosRsd: number) => string;
  konvertuj: (iznosRsd: number) => number | null;
};

export const ValutaKontekst = createContext<Ctx>({} as any);

const KEY_VALUTA = "preferovana_valuta";
const KEY_KURS   = "eur_per_rsd_last"; // poslednji uspešan kurs (EUR po 1 RSD)

const rsdFmt = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", minimumFractionDigits: 0 });
const eurFmt = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

export function ValutaKontekstProvajder({ children }: { children: React.ReactNode }) {
  // 1) Učitaj poslednju valutu
  const [valuta, setValuta] = useState<Valuta>(() => (localStorage.getItem(KEY_VALUTA) as Valuta) || "RSD");

  // 2) Učitaj kurs (hook) i zapamti poslednji dobar u localStorage
  const kursHook = useKursEur(); // može vratiti: 0.0085 (EUR/RSD) ili 117.6 (RSD/EUR) u zavisnosti od tvoje implementacije

  // kurs koji ćemo koristiti: EUR po 1 RSD
  let eurPerRsd: number | null = null;
  if (typeof kursHook === "number") {
    // Ako ti hook vraća RSD po EUR (npr. 117.6), prebaci na EUR po RSD:
    eurPerRsd = kursHook > 3 ? 1 / kursHook : kursHook; // prag 3 jer EUR/RSD je ~0.0085
  }

  // fallback: koristi poslednji snimljen kurs ili razuman default (0.0085 ≈ 1/118)
  const [eurPerRsdState, setEurPerRsdState] = useState<number | null>(() => {
    const saved = localStorage.getItem(KEY_KURS);
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    if (eurPerRsd != null && Number.isFinite(eurPerRsd)) {
      setEurPerRsdState(eurPerRsd);
      localStorage.setItem(KEY_KURS, String(eurPerRsd));
    }
  }, [eurPerRsd]);

  useEffect(() => {
    localStorage.setItem(KEY_VALUTA, valuta);
  }, [valuta]);

  const efikasniKurs = eurPerRsd ?? eurPerRsdState ?? 0.0085; // fallback da EUR radi i bez mreže

  const formatiraj = (rsd: number) => {
    if (valuta === "RSD") return rsdFmt.format(rsd);
    const eur = rsd * efikasniKurs; // rsd → eur (jer efikasniKurs je EUR/RSD)
    return eurFmt.format(eur);
  };

  const konvertuj = (rsd: number) => (efikasniKurs ? rsd * efikasniKurs : null);

  const value = useMemo(
    () => ({ valuta, kurs: eurPerRsd ?? eurPerRsdState, setValuta, formatiraj, konvertuj }),
    [valuta, eurPerRsd, eurPerRsdState]
  );

  return <ValutaKontekst.Provider value={value}>{children}</ValutaKontekst.Provider>;
}
