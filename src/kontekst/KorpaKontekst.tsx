import { createContext, useMemo, useEffect, useState, type ReactNode, useContext } from "react";
import { Korpa } from "../klase/Korpa";
import type { StavkaKorpe } from "../modeli/StavkaKorpe";
import { AuthKontekst } from "./AuthKontekst";

type KorpaKontekstTip = {
  korpa: Korpa;
  stavke: StavkaKorpe[];
  dodajUKorpu: (p: { idDogadjaja: number; naziv: string; cena: number }, kolicina?: number) => void;
  ukloniIzKorpe: (idDogadjaja: number) => void;
  promeniKolicinu: (idDogadjaja: number, kolicina: number) => void;
  ocistiKorpu: () => void;
  ukupno: number;
  ukupnoKomada: number;
};

export const KorpaKontekst = createContext<KorpaKontekstTip>({} as any);

export function KorpaKontekstProvajder({ children }: { children: ReactNode }) {
  const { korisnik } = useContext(AuthKontekst);

  // dinamički ključ po korisniku
  const kljuc = korisnik ? `korpa_stavke_${korisnik.id}` : "korpa_stavke_gost";

  // lokalno stanje korpe
  const [stavke, setStavke] = useState<StavkaKorpe[]>(() => {
    try {
      const raw = localStorage.getItem(kljuc);
      return raw ? (JSON.parse(raw) as StavkaKorpe[]) : [];
    } catch {
      return [];
    }
  });

  // kad se promeni korisnik/ključ -> učitaj njegovu korpu
  useEffect(() => {
    try {
      const raw = localStorage.getItem(kljuc);
      setStavke(raw ? (JSON.parse(raw) as StavkaKorpe[]) : []);
    } catch {
      setStavke([]);
    }
  }, [kljuc]);

  // svaki put kad se korpa promeni -> snimi pod aktivnim ključem
  useEffect(() => {
    try {
      localStorage.setItem(kljuc, JSON.stringify(stavke));
    } catch {}
  }, [kljuc, stavke]);

  const korpa = useMemo(() => new Korpa(structuredClone(stavke)), [stavke]);

  const sync = (k: Korpa) => setStavke(structuredClone(k.stavke));

  const dodajUKorpu: KorpaKontekstTip["dodajUKorpu"] = (p, kolicina = 1) => {
    const k = new Korpa(structuredClone(stavke));
    k.dodaj(p, kolicina);
    sync(k);
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
