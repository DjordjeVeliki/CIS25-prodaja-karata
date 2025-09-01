import { createContext, useEffect, useMemo, useState } from "react";
import useKursEur from "../kuke/useKursEur";

export type Valuta = "RSD" | "EUR";

type Ctx = {
  valuta: Valuta;
  kurs: number | null;                
  setValuta: (v: Valuta) => void;
  formatiraj: (iznosRsd: number) => string;
  konvertuj: (iznosRsd: number) => number | null;
};

export const ValutaKontekst = createContext<Ctx>({} as any);

const KEY_VALUTA = "preferovana_valuta";
const KEY_KURS   = "eur_per_rsd_last"; 

const rsdFmt = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", minimumFractionDigits: 0 });
const eurFmt = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

export function ValutaKontekstProvajder({ children }: { children: React.ReactNode }) {

  const [valuta, setValuta] = useState<Valuta>(() => (localStorage.getItem(KEY_VALUTA) as Valuta) || "RSD");


  const kursHook = useKursEur(); 

 
  let eurPerRsd: number | null = null;
  if (typeof kursHook === "number") {
    
    eurPerRsd = kursHook > 3 ? 1 / kursHook : kursHook; 
  }


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

  const efikasniKurs = eurPerRsd ?? eurPerRsdState ?? 0.0085;

  const formatiraj = (rsd: number) => {
    if (valuta === "RSD") return rsdFmt.format(rsd);
    const eur = rsd * efikasniKurs;
    return eurFmt.format(eur);
  };

  const konvertuj = (rsd: number) => (efikasniKurs ? rsd * efikasniKurs : null);

  const value = useMemo(
    () => ({ valuta, kurs: eurPerRsd ?? eurPerRsdState, setValuta, formatiraj, konvertuj }),
    [valuta, eurPerRsd, eurPerRsdState]
  );

  return <ValutaKontekst.Provider value={value}>{children}</ValutaKontekst.Provider>;
}
