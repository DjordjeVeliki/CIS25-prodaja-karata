import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { dogadjaji, type Dogadjaj } from "../podaci/dogadjaji";
import DogadjajKartica from "../komponente/DogadjajKartica";

const PO_STRANI = 8;

// helper: skini dijakritiku i spusti na lowercase (radi sa 'pozorište'/'pozoriste')
const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function Dogadjaji() {
  const [params, setParams] = useSearchParams();

  // UI state
  const [kategorija, setKategorija] = useState<string>(""); // "" = sve
  const [minCenaStr, setMinCenaStr] = useState<string>("");
  const [maxCenaStr, setMaxCenaStr] = useState<string>("");

  // sve dostupne kategorije iz podataka
  const kategorije = useMemo(() => {
    const s = new Set<string>();
    dogadjaji.forEach((d) => {
      if (d.kategorija) s.add(d.kategorija);
    });
    return Array.from(s).sort();
  }, []);

  // --- 1) ČITANJE IZ URL-a (inicijalno i na back/forward) -------------------
  useEffect(() => {
    const rawK = params.get("k") ?? params.get("kategorija") ?? "";
    const rawMin = params.get("min") ?? "";
    const rawMax = params.get("max") ?? "";

    // mapiraj param na stvarnu vrednost iz liste (da bi <select> imao tačan value)
    const matchK =
      kategorije.find((k) => norm(k) === norm(rawK)) ?? (rawK ? "" : "");

    setKategorija(matchK);       // "" ako nema ili ne postoji u listi
    setMinCenaStr(rawMin);
    setMaxCenaStr(rawMax);
  }, [params, kategorije]);

  // --- 2) UPIS U URL kad korisnik menja filtere (debounce) ------------------
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params);

      if (kategorija) next.set("k", kategorija);
      else next.delete("k");

      if (minCenaStr) next.set("min", minCenaStr);
      else next.delete("min");

      if (maxCenaStr) next.set("max", maxCenaStr);
      else next.delete("max");

      // resetuj stranicu kad se promene filteri
      next.set("page", "1");
      setParams(next, { replace: true });
    }, 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategorija, minCenaStr, maxCenaStr]); // namerno bez params/setParams

  // --- 3) Parsiranje vrednosti i filtriranje --------------------------------
  const stranica = Math.max(1, Number(params.get("page") ?? "1"));
  const minCena = minCenaStr ? Number(minCenaStr) : Number.NEGATIVE_INFINITY;
  const maxCena = maxCenaStr ? Number(maxCenaStr) : Number.POSITIVE_INFINITY;

  const filtrirani: Dogadjaj[] = useMemo(() => {
    return dogadjaji.filter((d) => {
      const katOK = !kategorija || (d.kategorija ?? "") === kategorija;
      const cena = d.cena;
      const minOK = isFinite(minCena) ? cena >= minCena : true;
      const maxOK = isFinite(maxCena) ? cena <= maxCena : true;
      return katOK && minOK && maxOK;
    });
  }, [kategorija, minCena, maxCena]);

  // --- 4) Paginacija ---------------------------------------------------------
  const ukupnoStrana = Math.max(1, Math.ceil(filtrirani.length / PO_STRANI));
  const bezbednaStrana = Math.min(stranica, ukupnoStrana);
  const od = (bezbednaStrana - 1) * PO_STRANI;
  const prikaz = filtrirani.slice(od, od + PO_STRANI);

  const promeniStranu = (nova: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(Math.min(Math.max(1, nova), ukupnoStrana)));
    setParams(next, { replace: true });
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Spisak događaja</h2>

      {/* FILTERI */}
      <div id="filteri" className="row g-2 align-items-center mb-3">
        <div className="col-12 col-md-4 col-lg-3">
          <select
            className="form-select"
            value={kategorija}
            onChange={(e) => setKategorija(e.target.value)}
          >
            <option value="">Sve kategorije</option>
            {kategorije.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min cena"
            value={minCenaStr}
            onChange={(e) => setMinCenaStr(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max cena"
            value={maxCenaStr}
            onChange={(e) => setMaxCenaStr(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA */}
      {prikaz.length === 0 ? (
        <p className="text-muted">Nema događaja po zadatim filterima.</p>
      ) : (
        <div className="row g-3">
          {prikaz.map((d) => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={d.id}>
              <DogadjajKartica dogadjaj={d} />
            </div>
          ))}
        </div>
      )}

      {/* PAGINACIJA */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={bezbednaStrana <= 1}
          onClick={() => promeniStranu(bezbednaStrana - 1)}
        >
          Prethodna
        </button>

        <span>
          Stranica {bezbednaStrana} od {ukupnoStrana}
        </span>

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={bezbednaStrana >= ukupnoStrana}
          onClick={() => promeniStranu(bezbednaStrana + 1)}
        >
          Sledeća
        </button>
      </div>
    </div>
  );
}
