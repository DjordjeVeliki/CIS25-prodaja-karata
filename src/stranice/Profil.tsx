import { useContext, useMemo } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { ucitajNarudzbine } from "../servisi/narudzbine";
import { formatDatumVreme } from "../utils/format";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";




export default function Profil() {
  const { korisnik, odjava } = useContext(AuthKontekst);
  const { formatiraj } = useContext(ValutaKontekst);

  const narudzbine = useMemo(
    () => (korisnik ? ucitajNarudzbine(korisnik.id) : []),
    [korisnik]
  );

  if (!korisnik) return null;

  return (
    <div className="container py-4">
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Profil</h2>
              <p className="mb-1"><strong>Ime:</strong> {korisnik?.ime}</p>
              <p className="mb-3"><strong>Email:</strong> {korisnik?.email}</p>
              <button className="btn btn-outline-secondary btn-sm" onClick={odjava}>
                Odjava
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h5 mb-3">Moje narudžbine</h3>

              {narudzbine.length === 0 ? (
                <p className="text-secondary">Nema narudžbina.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {narudzbine.map(n => (
                    <li key={n.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>Datum:</strong> {formatDatumVreme(n.datumISO)}
                        </div>
                        <div>
                          <strong>Ukupno:</strong> {formatiraj(n.ukupno)}
                        </div>
                      </div>
                      <div className="mt-2 small text-secondary">
                        {n.stavke.map((s: any, i: number) => (
                          <div key={i}>
                            {s.naziv} × {s.kolicina} = {formatiraj(s.kolicina * s.cena)}
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
);

}
