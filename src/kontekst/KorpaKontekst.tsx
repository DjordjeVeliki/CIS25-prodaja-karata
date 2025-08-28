import { createContext, useMemo, useEffect, useState, type ReactNode, useContext } from "react";
import { Korpa } from "../klase/Korpa";
import type { StavkaKorpe } from "../modeli/StavkaKorpe";
import { AuthKontekst } from "./AuthKontekst";

type KorpaKontekstTip = {
  korpa: Korpa;
  stavke: StavkaKorpe[];

  dodajUKorpu: (p: { idDogadjaja: number; naziv: string; cena: number }, kolicina?: number) => boolean;
  ukloniIzKorpe: (idDogadjaja: number) => void;
  promeniKolicinu: (idDogadjaja: number, kolicina: number) => void;
  ocistiKorpu: () => void;
  ukupno: number;
  ukupnoKomada: number;
};

export const KorpaKontekst = createContext<KorpaKontekstTip>({} as any);

export function KorpaKontekstProvajder({ children }: { children: ReactNode }) {
  const { korisnik } = useContext(AuthKontekst);


  const kljuc = korisnik ? `korpa_stavke_${korisnik.id}` : "korpa_stavke_gost";


  const [stavke, setStavke] = useState<StavkaKorpe[]>(() => {
    try {
      const raw = localStorage.getItem(kljuc);
      return raw ? (JSON.parse(raw) as StavkaKorpe[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(kljuc);
      setStavke(raw ? (JSON.parse(raw) as StavkaKorpe[]) : []);
    } catch {
      setStavke([]);
    }
  }, [kljuc]);


  useEffect(() => {
    try {
      localStorage.setItem(kljuc, JSON.stringify(stavke));
    } catch {}
  }, [kljuc, stavke]);

  const korpa = useMemo(() => new Korpa(structuredClone(stavke)), [stavke]);
  const sync = (k: Korpa) => setStavke(structuredClone(k.stavke));

  const dodajUKorpu: KorpaKontekstTip["dodajUKorpu"] = (p, kolicina = 1) => {

    if (!korisnik) {
      return false;
    }
    const k = new Korpa(structuredClone(stavke));
    k.dodaj(p, kolicina);
    sync(k);
    return true;
  };

  const ukloniIzKorpe = (id: number) => {
    const k = new Korpa(structuredClone(stavke));
    k.ukloni(id);
    sync(k);
  };

  const promeniKolicinu = (id: number, q: number) => {
    const k = new Korpa(structuredClone(stavke));
    k.promeniKolicinu(id, q);
    sync(k);
  };

  const ocistiKorpu = () => {
    const k = new Korpa();
    sync(k);
  };

  return (
    <KorpaKontekst.Provider
      value={{
        korpa,
        stavke,
        dodajUKorpu,
        ukloniIzKorpe,
        promeniKolicinu,
        ocistiKorpu,
        ukupno: korpa.ukupno(),
        ukupnoKomada: korpa.ukupnoKomada(),
      }}
    >
      {children}
    </KorpaKontekst.Provider>
  );
}
