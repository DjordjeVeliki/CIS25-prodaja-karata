import { useContext, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";
import { dodajNarudzbinu } from "../servisi/narudzbine";
import type { Narudzbina } from "../modeli/Narudzbina";

export default function Korpa() {
  const { stavke, promeniKolicinu, ukloniIzKorpe, ocistiKorpu, korpa } =
    useContext(KorpaKontekst);
  const { korisnik } = useContext(AuthKontekst);
  const { formatiraj } = useContext(ValutaKontekst);

  const [poruka, setPoruka] = useState<string | null>(null);

  
  const ukupno = useMemo(() => korpa.ukupno(), [korpa, stavke]);

  const onKupi = (e: FormEvent) => {
    e.preventDefault();
    setPoruka(null);

    if (!korisnik) {
      setPoruka("Morate biti prijavljeni da biste završili kupovinu.");
      return;
    }
    if (stavke.length === 0) {
      setPoruka("Korpa je prazna.");
      return;
    }

    const narudzbina: Narudzbina = {
      id: crypto.randomUUID(),
      korisnikId: korisnik.id,
      ukupno,
      datumISO: new Date().toISOString(),
      stavke: stavke.map((s) => ({
        idDogadjaja: s.idDogadjaja,
        naziv: s.naziv,
        cena: s.cena,
        kolicina: s.kolicina,
      })),
    };

    dodajNarudzbinu(korisnik.id, narudzbina);
    ocistiKorpu();
    setPoruka("Kupovina uspešna! Račun je sačuvan u vašim narudžbinama.");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Korpa</h2>

      {poruka && (
        <div className="alert alert-info" role="status" aria-live="polite">
          {poruka}
        </div>
      )}

      {stavke.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="mb-3">Korpa je prazna.</p>
          <Link to="/dogadjaji" className="btn btn-primary">
            Pregled događaja
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="text-start">Događaj</th>
                  <th style={{ width: 120 }}>Cena</th>
                  <th style={{ width: 160 }}>Količina</th>
                  <th style={{ width: 140 }}>Ukupno</th>
                  <th className="text-end" style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {stavke.map((s) => (
                  <tr key={s.idDogadjaja}>
                    <td className="fw-medium">{s.naziv}</td>
                    <td>{formatiraj(s.cena)}</td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label={`Promena količine za ${s.naziv}`}
                      >
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            promeniKolicinu(
                              s.idDogadjaja,
                              Math.max(1, s.kolicina - 1)
                            )
                          }
                          aria-label="Smanji količinu"
                        >
                          −
                        </button>
                        <span className="px-2 d-inline-block" style={{ minWidth: 24, textAlign: "center" }}>
                          {s.kolicina}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            promeniKolicinu(s.idDogadjaja, s.kolicina + 1)
                          }
                          aria-label="Povećaj količinu"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="fw-semibold">
                      {formatiraj(s.cena * s.kolicina)}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => ukloniIzKorpe(s.idDogadjaja)}
                      >
                        Ukloni
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <div className="row mt-3">
            <div className="col-md-6 col-lg-4 ms-auto">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary">Ukupno</span>
                    <strong className="fs-5">{formatiraj(ukupno)}</strong>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary w-50"
                      onClick={ocistiKorpu}
                    >
                      Isprazni korpu
                    </button>
                    <button
                      className="btn btn-primary w-50"
                      onClick={onKupi as any}
                    >
                      Završi kupovinu
                    </button>
                  </div>

                  
                  <div className="form-text mt-2">
                    Savet: proverite količine pre završetka kupovine.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
