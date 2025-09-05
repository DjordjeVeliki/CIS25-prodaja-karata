import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { formatDatumVreme } from "../utils/format";
import StarRating from "../komponente/StarRating";
import Komentari from "../komponente/Komentari";
import VremenskaPrognoza from "../komponente/VremenskaPrognoza";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";
import type { Dogadjaj as UiDogadjaj } from "../podaci/dogadjaji";
import { ucitajDogadjaj } from "../servisi/dogadjaji";
import type { Dogadjaj as ApiDogadjaj } from "../servisi/dogadjaji";


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

export default function DetaljDogadjaja() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { dodajUKorpu } = useContext(KorpaKontekst);
  const { korisnik } = useContext(AuthKontekst);
  const { formatiraj } = useContext(ValutaKontekst);

  const [dogadjaj, setDogadjaj] = useState<UiDogadjaj | null>(null);
  const [greska, setGreska] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const dId = Number(id);
    if (!dId) {
      setGreska("Neispravan ID.");
      setLoading(false);
      return;
    }
    setLoading(true);
    ucitajDogadjaj(dId)
      .then((a) => setDogadjaj(adaptApiToUi(a)))
      .catch(() => setGreska("Događaj nije pronađen"))
      .finally(() => setLoading(false));
  }, [id]);

  const onDodaj = () => {
    if (!dogadjaj) return;
    if (!korisnik) {
      navigate("/prijava", { state: { redirectTo: location.pathname } });
      return;
    }
    const ok = dodajUKorpu(
      { idDogadjaja: dogadjaj.id, naziv: dogadjaj.naziv, cena: dogadjaj.cena },
      1
    );
    if (!ok) {
      navigate("/prijava", { state: { redirectTo: location.pathname } });
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-0 my-3">
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (greska || !dogadjaj) {
    return (
      <div className="container-fluid px-0 my-3">
        <h2>Događaj nije pronađen</h2>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 my-3">
      <h2 className="mb-2">{dogadjaj.naziv}</h2>
      <p className="text-muted">{dogadjaj.opis}</p>
      <p className="mb-1">
        <strong>Datum:</strong> {formatDatumVreme(dogadjaj.datum)}
      </p>
      <p className="mb-3">
        <strong>Cena:</strong> {formatiraj(Number(dogadjaj.cena))}
      </p>
      <div className="d-flex align-items-center gap-2 mb-3 mt-3">
        <button
          className="btn btn-primary"
          onClick={onDodaj}
          disabled={!korisnik}
          title={!korisnik ? "Prijavite se da biste dodali u korpu" : "Dodaj u korpu"}
        >
          Dodaj u korpu
        </button>
        {!korisnik && (
          <small className="text-muted">Prijavite se da biste dodali u korpu.</small>
        )}
      </div>

      <div className="mb-4">
        <h6 className="mb-1">Oceni događaj</h6>
        <StarRating dogadjajId={dogadjaj.id} />
      </div>

      {dogadjaj.mesto && (
        <VremenskaPrognoza mesto={dogadjaj.mesto} datumISO={dogadjaj.datum} />
      )}

      <Komentari dogadjajId={dogadjaj.id} />
    </div>
  );
}
