export type StavkaNarudzbine = {
  idDogadjaja: string;
  naziv: string;
  cena: number;     
  kolicina: number;
};

export type Narudzbina = {
  id: string;
  korisnikId: string;
  datumISO: string;
  medjuzbir?: number; 
  popust?: number;    
  kupon?: string;    
  ukupno: number;    
  stavke: StavkaNarudzbine[];
};
