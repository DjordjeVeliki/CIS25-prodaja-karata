import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Korisnik } from "../modeli/Korisnik";

type AuthTip = {
  korisnik: Korisnik | null;
  prijava: (email: string, lozinka: string) => Promise<void>;
  registracija: (ime: string, email: string, lozinka: string) => Promise<void>;
  odjava: () => void;
};

export const AuthKontekst = createContext<AuthTip>({} as AuthTip);

export function AuthProvajder({ children }: { children: ReactNode }) {
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);


  useEffect(() => {
    const raw = localStorage.getItem("auth_korisnik");
    if (raw) {
      try {
        setKorisnik(JSON.parse(raw));
      } catch {
        localStorage.removeItem("auth_korisnik");
      }
    }
  }, []);


  useEffect(() => {
    if (korisnik) localStorage.setItem("auth_korisnik", JSON.stringify(korisnik));
    else localStorage.removeItem("auth_korisnik");
  }, [korisnik]);


  type ZapisUBazi = { id: string; ime: string; email: string; lozinka: string };

  const getBaza = (): ZapisUBazi[] => {
    const raw = localStorage.getItem("auth_baza");
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ZapisUBazi[];
    } catch {
      localStorage.removeItem("auth_baza");
      return [];
    }
  };

  const setBaza = (b: ZapisUBazi[]) => {
    localStorage.setItem("auth_baza", JSON.stringify(b));
  };

  const registracija: AuthTip["registracija"] = async (ime, email, lozinka) => {
    const baza = getBaza();
    if (baza.find((u) => u.email === email)) {
      throw new Error("Korisnik sa tim emailom već postoji");
    }
    const u: ZapisUBazi = { id: crypto.randomUUID(), ime, email, lozinka };
    baza.push(u);
    setBaza(baza);
    setKorisnik({ id: u.id, ime: u.ime, email: u.email });
  };

  const prijava: AuthTip["prijava"] = async (email, lozinka) => {
    const baza = getBaza();
    const u = baza.find((x) => x.email === email && x.lozinka === lozinka);
    if (!u) throw new Error("Pogrešan email ili lozinka");
    setKorisnik({ id: u.id, ime: u.ime, email: u.email });
  };

  const odjava = () => setKorisnik(null);

  return (
    <AuthKontekst.Provider value={{ korisnik, prijava, registracija, odjava }}>
      {children}
    </AuthKontekst.Provider>
  );
}
