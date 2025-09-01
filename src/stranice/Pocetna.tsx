import { Link } from "react-router-dom";
import DogadjajKartica from "../komponente/DogadjajKartica";
import { dogadjaji } from "../podaci/dogadjaji"; // prilagodi ako ti je drugačiji export
import { useMemo } from "react";


export default function Pocetna() {
  

  
  const istaknuti = useMemo(() => {
    try {
      return [...dogadjaji]
        .sort((a: any, b: any) => new Date(a.datumISO).getTime() - new Date(b.datumISO).getTime())
        .slice(0, 3);
    } catch {
      return [];
    }
  }, []);

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
            <Link to="/dogadjaji" className="btn btn-primary btn-lg">Pregled događaja</Link>
            
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
        {istaknuti.length === 0 ? (
          <p className="text-secondary">Nema izdvojenih događaja.</p>
        ) : (
          <div className="row g-3">
            {istaknuti.map((d: any) => (
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
