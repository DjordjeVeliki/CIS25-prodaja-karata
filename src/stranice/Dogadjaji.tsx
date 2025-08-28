import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { dogadjaji, type Dogadjaj } from "../podaci/dogadjaji";
import { Filteri } from "../komponente/filtriranje/Filteri";
import { Paginacija } from "../komponente/filtriranje/Paginacija";
import { formatCena } from "../utils/format";


const PO_STRANI = 5;

export default function Dogadjaji() {
  // query parametri: ?k=koncert&min=0&max=2000&page=2
  const [params, setParams] = useSearchParams();

  const kategorija = params.get("k") ?? "";
  const minCena = Number(params.get("min") ?? "0");
  const maxCena = Number(params.get("max") ?? `${Number.POSITIVE_INFINITY}`);
  const stranica = Math.max(1, Number(params.get("page") ?? "1"));

  // filtriranje
  const filtrirani: Dogadjaj[] = useMemo(() => {
    return dogadjaji.filter((d) => {
      const katOK = !kategorija || (d.kategorija ?? "") === kategorija;
      const cenaOK = d.cena >= (isFinite(minCena) ? minCena : 0) &&
                     d.cena <= (isFinite(maxCena) ? maxCena : Number.POSITIVE_INFINITY);
      return katOK && cenaOK;
    });
  }, [kategorija, minCena, maxCena]);

  // paginacija
  const ukupnoStrana = Math.max(1, Math.ceil(filtrirani.length / PO_STRANI));
  const bezbednaStrana = Math.min(stranica, ukupnoStrana);
  const od = (bezbednaStrana - 1) * PO_STRANI;
  const prikaz = filtrirani.slice(od, od + PO_STRANI);

  const primeniFiltere = (k: string, min: number, max: number) => {
    const next = new URLSearchParams(params);
    if (k) next.set("k", k); else next.delete("k");
    if (isFinite(min) && min > 0) next.set("min", String(min)); else next.delete("min");
    if (isFinite(max)) next.set("max", String(max)); else next.delete("max");
    next.set("page", "1"); // reset na prvu stranu kada menjamo filtere
    setParams(next, { replace: true });
  };

  const promeniStranu = (nova: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(Math.min(Math.max(1, nova), ukupnoStrana)));
    setParams(next, { replace: true });
  };

  return (
    <div>
      <h2>Spisak događaja</h2>

      <Filteri onFilter={primeniFiltere} />

      {prikaz.length === 0 ? (
        <p>Nema događaja po zadatim filterima.</p>
      ) : (
        <ul>
          {prikaz.map((d) => (
            <li key={d.id} style={{ marginBottom: "12px" }}>
              <strong>{d.naziv}</strong>
              {d.kategorija ? <> — <em>{d.kategorija}</em></> : null}
              <br />
              Datum: {d.datum} — Cena: {formatCena(d.cena)}
              <br />
              <Link to={`/dogadjaji/${d.id}`}>Detalji</Link>
            </li>
          ))}
        </ul>
      )}

      <Paginacija
        trenutna={bezbednaStrana}
        ukupno={ukupnoStrana}
        onPromeni={promeniStranu}
      />
    </div>
  );
}
