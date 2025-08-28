// src/stranice/Dogadjaji.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { dogadjaji, type Dogadjaj } from "../podaci/dogadjaji";
import DogadjajKartica from "../komponente/DogadjajKartica";

const PO_STRANI = 8;

export default function Dogadjaji() {
  const [params, setParams] = useSearchParams();

  // početne vrednosti iz URL-a
  const startKategorija = params.get("k") ?? "";
  const startMin = params.get("min") ?? "";
  const startMax = params.get("max") ?? "";
  const stranica = Math.max(1, Number(params.get("page") ?? "1"));

  // state za kontrole 
  const [kategorija, setKategorija] = useState<string>(startKategorija);
  const [minCenaStr, setMinCenaStr] = useState<string>(startMin);
  const [maxCenaStr, setMaxCenaStr] = useState<string>(startMax);

  // auto-primena filtera (debounce 300ms)
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams();
      if (kategorija) next.set("k", kategorija);
      if (minCenaStr) next.set("min", minCenaStr);
      if (maxCenaStr) next.set("max", maxCenaStr);
      next.set("page", "1");
      setParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(id);
  }, [kategorija, minCenaStr, maxCenaStr, setParams]);

  // jedinstvene kategorije
  const kategorije = useMemo(() => {
    const s = new Set<string>();
    dogadjaji.forEach((d) => { if (d.kategorija) s.add(d.kategorija); });
    return Array.from(s).sort();
  }, []);

  const minCena = minCenaStr ? Number(minCenaStr) : Number.NEGATIVE_INFINITY;
  const maxCena = maxCenaStr ? Number(maxCenaStr) : Number.POSITIVE_INFINITY;

  // filtriranje
  const filtrirani: Dogadjaj[] = useMemo(() => {
    return dogadjaji.filter((d) => {
      const katOK = !kategorija || (d.kategorija ?? "") === kategorija;
      const cena = d.cena;
      const minOK = isFinite(minCena) ? cena >= minCena : true;
      const maxOK = isFinite(maxCena) ? cena <= maxCena : true;
      return katOK && minOK && maxOK;
    });
  }, [kategorija, minCena, maxCena]);

  // paginacija
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

      {/* FILTER BAR (bez submit dugmeta) */}
      <div className="row g-2 align-items-center mb-3">
        <div className="col-12 col-md-4 col-lg-3">
          <select className="form-select" value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
            <option value="">Sve kategorije</option>
            {kategorije.map((k) => (
              <option key={k} value={k}>{k}</option>
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

      {/* GRID KARTICA */}
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

        <span>Stranica {bezbednaStrana} od {ukupnoStrana}</span>

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
