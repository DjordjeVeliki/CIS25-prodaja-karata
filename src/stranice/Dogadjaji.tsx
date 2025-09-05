import { useMemo, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DogadjajKartica from "../komponente/DogadjajKartica";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";
import type { Dogadjaj as UiDogadjaj } from "../podaci/dogadjaji";
import { ucitajDogadjaje } from "../servisi/dogadjaji";
import type { Dogadjaj as ApiDogadjaj } from "../servisi/dogadjaji";
import { ucitajKategorije } from "../servisi/kategorije";

const PO_STRANI = 8;

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();


function adaptApiToUi(d: ApiDogadjaj): UiDogadjaj {
  return {
    id: d.id,
    naziv: d.naziv,
    opis: d.opis ?? "",
    datum: typeof d.datum === "string" ? d.datum : new Date(d.datum).toISOString(),
    cena: d.cena,
    kategorija: d.kategorija ?? "",
    mesto: d.mesto,
  };
}

export default function Dogadjaji() {
  const [params, setParams] = useSearchParams();
  const { valuta, konvertuj } = useContext(ValutaKontekst);


  const [sviDogadjaji, setSviDogadjaji] = useState<UiDogadjaj[]>([]);
  const [kategorijeApi, setKategorijeApi] = useState<string[]>([]);

  const urlKategorija = params.get("k") ?? params.get("kategorija") ?? "";
  const minCenaStr = params.get("min") ?? "";
  const maxCenaStr = params.get("max") ?? "";
  const stranica = Math.max(1, Number(params.get("page") ?? "1"));

  const setParam = (key: "k" | "min" | "max" | "page", value: string) => {
    const next = new URLSearchParams(params);
    if (key === "k") {
      if (value) next.set("k", value);
      else next.delete("k");
      next.delete("kategorija");
      next.set("page", "1");
      setParams(next, { replace: true });
      return;
    }
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };


  useEffect(() => {
    ucitajKategorije().then(setKategorijeApi).catch(console.error);
  }, []);


  useEffect(() => {
    ucitajDogadjaje({ page: 1, pageSize: 1000, sort: "datum", order: "asc" })
      .then((res) => setSviDogadjaji(res.items.map(adaptApiToUi)))
      .catch(console.error);
  }, []);


  const kategorije = useMemo(() => {
    if (kategorijeApi.length) return kategorijeApi;
    const s = new Set<string>();
    sviDogadjaji.forEach((d) => d.kategorija && s.add(d.kategorija));
    return Array.from(s).sort();
  }, [kategorijeApi, sviDogadjaji]);

  const selectKategorija = useMemo(() => {
    return kategorije.find((k) => norm(k) === norm(urlKategorija)) ?? "";
  }, [kategorije, urlKategorija]);

  const minCena = minCenaStr ? Number(minCenaStr) : Number.NEGATIVE_INFINITY;
  const maxCena = maxCenaStr ? Number(maxCenaStr) : Number.POSITIVE_INFINITY;

  const cenaUValuti = (rsd: number) =>
    valuta === "RSD" ? rsd : (konvertuj(rsd) ?? NaN);

  const filtrirani: UiDogadjaj[] = useMemo(() => {
    const kNorm = norm(urlKategorija);
    return sviDogadjaji.filter((d) => {
      const katOK = !urlKategorija || norm(d.kategorija ?? "") === kNorm;
      const cena = cenaUValuti(d.cena);
      const minOK = isFinite(minCena) ? cena >= minCena : true;
      const maxOK = isFinite(maxCena) ? cena <= maxCena : true;
      return katOK && minOK && maxOK;
    });
  }, [sviDogadjaji, urlKategorija, minCena, maxCena, valuta, konvertuj]);

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

      <div id="filteri" className="row g-2 align-items-center mb-3">
        <div className="col-12 col-md-4 col-lg-3">
          <select
            className="form-select"
            value={selectKategorija}
            onChange={(e) => setParam("k", e.target.value)}
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
            placeholder={`Min cena (${valuta})`}
            value={minCenaStr}
            onChange={(e) => setParam("min", e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <input
            type="number"
            className="form-control"
            placeholder={`Max cena (${valuta})`}
            value={maxCenaStr}
            onChange={(e) => setParam("max", e.target.value)}
          />
        </div>
      </div>

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
