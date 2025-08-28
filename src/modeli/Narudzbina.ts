export interface StavkaNarudzbine {
  idDogadjaja: number;
  naziv: string;
  cena: number;
  kolicina: number;
}

export interface Narudzbina {
  id: string;
  korisnikId: string;
  ukupno: number;
  stavke: StavkaNarudzbine[];
  datumISO: string; 
}
