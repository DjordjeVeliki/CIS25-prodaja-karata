export type MapaOcena = Record<string, Record<string, number>>;


export class OceneMenadzer {
  private kljuc = "ocene_dogadjaja";

  
  private ucitaj(): MapaOcena {
    try {
      const sirovo = localStorage.getItem(this.kljuc);
      if (!sirovo) return {};
      const data = JSON.parse(sirovo);


      for (const k of Object.keys(data)) {
        if (Array.isArray(data[k])) {
          const arr: number[] = data[k];
          data[k] = {};
          arr.forEach((o: number, i: number) => {
            data[k][`legacy-${i}`] = this.ograniči(o);
          });
        }
      }
      return data as MapaOcena;
    } catch {
      return {};
    }
  }

  private sačuvaj(mapa: MapaOcena) {
    localStorage.setItem(this.kljuc, JSON.stringify(mapa));
  }

  private ograniči(o: number) {
    return Math.max(1, Math.min(5, o));
  }

  oceni(dogadjajId: number, korisnikKljuč: string, ocena: number) {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    if (!mapa[d]) mapa[d] = {};
    mapa[d][korisnikKljuč] = this.ograniči(ocena);
    this.sačuvaj(mapa);
  }

  jeVecOcenio(dogadjajId: number, korisnikKljuč: string): boolean {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    return Boolean(mapa[d]?.[korisnikKljuč]);
  }

  mojaOcena(dogadjajId: number, korisnikKljuč: string): number | null {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    return mapa[d]?.[korisnikKljuč] ?? null;
  }

  prosek(dogadjajId: number): number {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    const vrednosti = Object.values(mapa[d] ?? {});
    if (!vrednosti.length) return 0;
    const avg = vrednosti.reduce((s, n) => s + n, 0) / vrednosti.length;
    return Number(avg.toFixed(2));
    }

  brojOcena(dogadjajId: number): number {
    const mapa = this.ucitaj();
    const d = String(dogadjajId);
    return Object.keys(mapa[d] ?? {}).length;
  }
}
