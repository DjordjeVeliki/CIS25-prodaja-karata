import type { Narudzbina } from "../modeli/Narudzbina";

const kljuc = (korisnikId: string) => `narudzbine_${korisnikId}`;

export function ucitajNarudzbine(korisnikId: string): Narudzbina[] {
  try {
    const raw = localStorage.getItem(kljuc(korisnikId));
    return raw ? (JSON.parse(raw) as Narudzbina[]) : [];
  } catch {
    return [];
  }
}

export function sacuvajNarudzbine(korisnikId: string, n: Narudzbina[]) {
  localStorage.setItem(kljuc(korisnikId), JSON.stringify(n));
}

export function dodajNarudzbinu(korisnikId: string, narudzbina: Narudzbina) {
  const sve = ucitajNarudzbine(korisnikId);
  sve.unshift(narudzbina); // najnovija na vrh
  sacuvajNarudzbine(korisnikId, sve);
}
