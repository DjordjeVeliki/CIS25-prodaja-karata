import { createContext, useMemo } from "react";
import type { ReactNode } from "react";                // ⬅️ type-only
import { useLokalnoSkladiste } from "../kuke/useLokalnoSkladiste";
import { Korpa } from "../klase/Korpa";
import type { StavkaKorpe } from "../modeli/StavkaKorpe"; // ⬅️ type-only


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
  const [stavke, setStavke] = useLokalnoSkladiste<StavkaKorpe[]>("korpa_stavke", []);

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

  const vrednosti: KorpaKontekstTip = {
    korpa,
    stavke,
    dodajUKorpu,
    ukloniIzKorpe,
    promeniKolicinu,
    ocistiKorpu,
    ukupno: korpa.ukupno(),
    ukupnoKomada: korpa.ukupnoKomada(),
  };

  return <KorpaKontekst.Provider value={vrednosti}>{children}</KorpaKontekst.Provider>;
}
