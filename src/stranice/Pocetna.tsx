import { Link } from "react-router-dom";
import DogadjajKartica from "../komponente/DogadjajKartica";
import { useEffect, useMemo, useState } from "react";
import type { Dogadjaj as UiDogadjaj } from "../podaci/dogadjaji";
import { ucitajDogadjaje } from "../servisi/dogadjaji";
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

export default function Pocetna() {
  const [svi, setSvi] = useState<UiDogadjaj[]>([]);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    ucitajDogadjaje({ page: 1, pageSize: 200, sort: "datum", order: "asc" })
      .then((res) => setSvi(res.items.map(adaptApiToUi)))
      .catch((e) => setGreska(e?.message || "Greška pri učitavanju."));
  }, []);

  const istaknuti = useMemo(() => {
    try {
      const sada = Date.now();
      return [...svi]
        .filter((d) => new Date(d.datum).getTime() >= sada) 
        .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
        .slice(0, 3);
    } catch {
      return [];
    }
  }, [svi]);

  return (
    <div className="container py-4">
      <div className="row align-items-center g-4 mb-4">
        <div className="col-lg-7">
          <h1 className="display-5 fw-bold">Pronađi i kupi karte za omiljene događaje</h1>
          <p className="lead text-secondary">
            Koncerti, pozorište i izložbe – sve na jednom mestu. Brza kupovina,
            sigurno plaćanje i pregled narudžbina na tvom profilu.
          </p>
          <div className="d-flex gap-2">
            <Link to="/dogadjaji" className="btn btn-primary btn-lg">
              Pregled događaja
            </Link>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="border rounded-3 p-3 bg-light">
            <h2 className="h5 mb-3">Zašto baš mi?</h2>
            <ul className="mb-0">
              <li>Jednostavna kupovina i korpa</li>
              <li>Ocene i komentari za događaje</li>
              <li>Vremenska prognoza na stranici detalja</li>
              <li>Prikaz cena u RSD/EUR</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="kategorije" className="mb-4">
        <h2 className="h4 mb-3">Kategorije</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <Link to="/dogadjaji?kategorija=koncert" className="text-decoration-none">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 mb-1">Koncerti</h3>
                  <p className="text-secondary mb-0">Rock, pop, jazz i više</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/dogadjaji?kategorija=pozorište" className="text-decoration-none">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 mb-1">Pozorište</h3>
                  <p className="text-secondary mb-0">Klasici i savremene predstave</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/dogadjaji?kategorija=izložba" className="text-decoration-none">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 mb-1">Izložbe</h3>
                  <p className="text-secondary mb-0">Muzejske i tematske postavke</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <h2 className="h4 mb-3">Izdvojeno</h2>

        {greska && <div className="alert alert-danger">{greska}</div>}

        {istaknuti.length === 0 ? (
          <p className="text-secondary">Nema izdvojenih događaja.</p>
        ) : (
          <div className="row g-3">
            {istaknuti.map((d) => (
              <div className="col-md-4" key={d.id}>
                <DogadjajKartica dogadjaj={d} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
