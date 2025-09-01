import { Link } from "react-router-dom";
import { useContext } from "react";
import { OceneMenadzer } from "../klase/OceneMenadzer";
import type { Dogadjaj } from "../podaci/dogadjaji";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";


function formatDatum(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("sr-RS");
}

export default function DogadjajKartica({ dogadjaj }: { dogadjaj: Dogadjaj }) {
  const om = new OceneMenadzer();
  const prosek = om.prosek(dogadjaj.id);
  const broj = om.brojOcena(dogadjaj.id);

  const { formatiraj } = useContext(ValutaKontekst);

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{dogadjaj.naziv}</h5>
          {dogadjaj.kategorija && (
            <span className="badge text-bg-secondary ms-2">{dogadjaj.kategorija}</span>
          )}
        </div>

        <p className="card-text text-muted small mb-2">
          Datum: {formatDatum(dogadjaj.datum)}
        </p>

        <p className="fw-semibold mb-2">
          Cena: {formatiraj(dogadjaj.cena)}
        </p>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">Ocena: {prosek} ({broj})</small>
          <Link to={`/dogadjaji/${dogadjaj.id}`} className="btn btn-outline-primary btn-sm">
            Detalji
          </Link>
        </div>
      </div>
    </div>
  );
}
