export interface TipKomentara {
  id: string;                 // unikatan id komentara
  autorKljuc: string;         // stabilan ključ korisnika (id:, email:, ime:)
  autorPrikaz: string;        // kako da prikažemo ime autora
  tekst: string;
  vreme: number;              // Date.now()
}

export type MapaKomentara = Record<string, TipKomentara[]>;
// localStorage struktura: { [dogadjajId]: TipKomentara[] }

export class KomentariMenadzer {
  private kljuc = "komentari_dogadjaja";

  private ucitaj(): MapaKomentara {
    try {
      const raw = localStorage.getItem(this.kljuc);
      return raw ? (JSON.parse(raw) as MapaKomentara) : {};
    } catch {
      return {};
    }
  }

  private sacuvaj(mapa: MapaKomentara) {
    localStorage.setItem(this.kljuc, JSON.stringify(mapa));
  }

  svi(dogadjajId: number): TipKomentara[] {
    const mapa = this.ucitaj();
    return (mapa[String(dogadjajId)] ?? []).sort((a,b) => b.vreme - a.vreme);
  }

  dodaj(dogadjajId: number, autorKljuc: string, autorPrikaz: string, tekst: string): TipKomentara {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    const novi: TipKomentara = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      autorKljuc,
      autorPrikaz,
      tekst: tekst.trim(),
      vreme: Date.now(),
    };
    mapa[d] = [novi, ...(mapa[d] ?? [])];
    this.sacuvaj(mapa);
    return novi;
  }

  obrisi(dogadjajId: number, komentarId: string, trazilacKljuc: string): boolean {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    const lista = mapa[d] ?? [];
    const pre = lista.length;
    const posle = lista.filter(k => !(k.id === komentarId && k.autorKljuc === trazilacKljuc));
    if (posle.length !== pre) {
      mapa[d] = posle;
      this.sacuvaj(mapa);
      return true;
    }
    return false;
  }
}
