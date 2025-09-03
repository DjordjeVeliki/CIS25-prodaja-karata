import { useEffect, useMemo, useState } from "react";
import { geokodiraj, prognozaZaLokaciju, opisPrognoze, type PrognozaDan } from "../servisi/vreme";

type Props = {
  mesto: string;
  datumISO: string;
};

export default function VremenskaPrognoza({ mesto, datumISO }: Props) {
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);
  const [lista, setLista] = useState<PrognozaDan[]>([]);

  const danTrazen = useMemo(() => {
    try {
      return new Date(datumISO).toISOString().slice(0, 10);
    } catch {
      return datumISO.slice(0, 10); 
    }
  }, [datumISO]);


  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setGreska(null);
        const geo = await geokodiraj(mesto);
        if (!geo) { setGreska("Nije pronađena lokacija."); setLoading(false); return; }
        const d = await prognozaZaLokaciju(geo.lat, geo.lon);
        if (!alive) return;
        setLista(d);
      } catch (e:any) {
        setGreska(e?.message ?? "Greška pri preuzimanju prognoze.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [mesto]);

  const zaDan = useMemo(() => lista.find(x => x.datum === danTrazen), [lista, danTrazen]);

  if (loading) return <p className="text-muted">Učitavanje prognoze…</p>;
  if (greska) return <p className="text-danger">Prognoza: {greska}</p>;
  if (!zaDan) return <p className="text-muted">Prognoza za taj datum još nije dostupna.</p>;

  return (
    <div className="card mt-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">Prognoza za {mesto} ({zaDan.datum})</h6>
          <small className="text-muted">{opisPrognoze(zaDan.wcode)}</small>
        </div>
        <div className="text-end">
          <div className="fw-semibold">🌡️ {Math.round(zaDan.tMin)}° / {Math.round(zaDan.tMax)}°C</div>
          <small className="text-muted">🌧️ {zaDan.padavineProcenat ?? 0}%</small>
        </div>
      </div>
    </div>
  );
}
