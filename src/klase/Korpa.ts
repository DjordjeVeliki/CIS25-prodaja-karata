import type { StavkaKorpe } from "../modeli/StavkaKorpe";

export class Korpa {
  stavke: StavkaKorpe[] = [];

  constructor(pocetne?: StavkaKorpe[]) {
    if (pocetne) this.stavke = pocetne;
  }

  dodaj(stavka: Omit<StavkaKorpe, "kolicina">, kolicina = 1) {
    const postojeca = this.stavke.find(s => s.idDogadjaja === stavka.idDogadjaja);
    if (postojeca) postojeca.kolicina += kolicina;
    else this.stavke.push({ ...stavka, kolicina });
  }

  ukloni(idDogadjaja: number) {
    this.stavke = this.stavke.filter(s => s.idDogadjaja !== idDogadjaja);
  }

  promeniKolicinu(idDogadjaja: number, kolicina: number) {
    const s = this.stavke.find(x => x.idDogadjaja === idDogadjaja);
    if (!s) return;
    s.kolicina = Math.max(1, kolicina);
  }

  ocisti() {
    this.stavke = [];
  }

  ukupno(): number {
    return this.stavke.reduce((sum, s) => sum + s.cena * s.kolicina, 0);
  }

  ukupnoKomada(): number {
    return this.stavke.reduce((sum, s) => sum + s.kolicina, 0);
  }
}
