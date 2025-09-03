export interface Dogadjaj {
  id: number;
  naziv: string;
  opis: string;
  datum: string;
  cena: number;
  kategorija?: string;
  mesto: string;
}

export const dogadjaji: Dogadjaj[] = [
    {
    id: 1,
    naziv: "Koncert Bajaga i Instruktori",
    opis: "Veliki koncert domaće rok legende.",
    datum: "2025-09-4",
    cena: 1500,
    kategorija: "koncert",
    mesto: "Beograd"
    },
    {
    id: 2,
    naziv: "Pozorišna predstava - Hamlet",
    opis: "Klasik u izvedbi Narodnog pozorišta.",
    datum: "2025-09-05",
    cena: 1200,
    kategorija: "pozoriste",
    mesto: "Novi Sad"
    },
    {
    id: 3,
    naziv: "Muzejska izložba - Egipatske relikvije",
    opis: "Retke relikvije iz drevnog Egipta.",
    datum: "2025-09-07",
    cena: 800,
    kategorija: "izlozba",
    mesto: "Niš"
    }
];
