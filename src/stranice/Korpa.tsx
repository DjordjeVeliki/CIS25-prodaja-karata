import { useContext, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";
import { dodajNarudzbinu } from "../servisi/narudzbine";
import type { Narudzbina } from "../modeli/Narudzbina";
import { KUPONI } from "../podaci/kuponi";

export default function Korpa() {
  const { stavke, promeniKolicinu, ukloniIzKorpe, ocistiKorpu, korpa } = useContext(KorpaKontekst);
  const { korisnik } = useContext(AuthKontekst);
  const { formatiraj } = useContext(ValutaKontekst);

  const [poruka, setPoruka] = useState<string | null>(null);
  const [kodInput, setKodInput] = useState("");
  const [primenjenKod, setPrimenjenKod] = useState<string | null>(null);
  const [greskaKoda, setGreskaKoda] = useState<string | null>(null);

  const medjuzbirRsd = useMemo(() => korpa.ukupno(), [korpa, stavke]);

  const popustRsd = useMemo(() => {
    if (!primenjenKod) return 0;
    const def = KUPONI[primenjenKod];
    if (!def) return 0;
    if (def.min && medjuzbirRsd < def.min) return 0;
    if (def.type === "percent") return Math.floor((medjuzbirRsd * def.value) / 100);
    return Math.min(def.value, medjuzbirRsd);
  }, [primenjenKod, medjuzbirRsd]);

  const zaPlacanjeRsd = Math.max(0, medjuzbirRsd - popustRsd);

  const onPrimeniKupon = () => {
    setGreskaKoda(null);
    const kod = kodInput.trim().toUpperCase();
    if (!kod) {
      setGreskaKoda("Unesite kod.");
      return;
    }
    const def = KUPONI[kod];
    if (!def) {
      setGreskaKoda("Nepostojeći kod.");
      return;
    }
    if (def.min && medjuzbirRsd < def.min) {
      setGreskaKoda(`Ovaj kod važi za porudžbine od najmanje ${formatiraj(def.min)}.`);
      return;
    }
    setPrimenjenKod(kod);
  };

  const onUkloniKupon = () => {
    setPrimenjenKod(null);
    setGreskaKoda(null);
    setKodInput("");
  };

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
      datumISO: new Date().toISOString(),
      medjuzbir: medjuzbirRsd,
      popust: popustRsd,
      kupon: primenjenKod ?? undefined,
      ukupno: zaPlacanjeRsd,
      stavke: stavke.map((s) => ({
        idDogadjaja: String(s.idDogadjaja),
        naziv: s.naziv,
        cena: s.cena,
        kolicina: s.kolicina,
      })),
    };

    dodajNarudzbinu(korisnik.id, narudzbina);
    ocistiKorpu();
    setPrimenjenKod(null);
    setKodInput("");
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
                      <div className="btn-group" role="group" aria-label={`Promena količine za ${s.naziv}`}>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => promeniKolicinu(s.idDogadjaja, Math.max(1, s.kolicina - 1))}
                          aria-label="Smanji količinu"
                        >
                          −
                        </button>
                        <span className="px-2 d-inline-block" style={{ minWidth: 24, textAlign: "center" }}>
                          {s.kolicina}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => promeniKolicinu(s.idDogadjaja, s.kolicina + 1)}
                          aria-label="Povećaj količinu"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="fw-semibold">{formatiraj(s.cena * s.kolicina)}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm" onClick={() => ukloniIzKorpe(s.idDogadjaja)}>
                        Ukloni
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-3">
            <div className="col-lg-5 col-xl-4 ms-auto">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Kod za popust</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        placeholder="npr. STUDENT10"
                        value={kodInput}
                        onChange={(e) => setKodInput(e.target.value)}
                        disabled={!!primenjenKod}
                      />
                      {!primenjenKod ? (
                        <button className="btn btn-outline-primary" onClick={onPrimeniKupon}>
                          Primeni
                        </button>
                      ) : (
                        <button className="btn btn-outline-secondary" onClick={onUkloniKupon}>
                          Ukloni kupon
                        </button>
                      )}
                    </div>
                    {primenjenKod && (
                      <div className="form-text">
                        Aktivno: <strong>{primenjenKod}</strong>{" "}
                        {KUPONI[primenjenKod]?.description ? `— ${KUPONI[primenjenKod]?.description}` : ""}
                      </div>
                    )}
                    {greskaKoda && <div className="text-danger small mt-1">{greskaKoda}</div>}
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Međuzbir</span>
                    <span>{formatiraj(medjuzbirRsd)}</span>
                  </div>

                  {popustRsd > 0 && (
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Popust</span>
                      <span className="text-success">− {formatiraj(popustRsd)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <strong>Za plaćanje</strong>
                    <strong className="fs-5">{formatiraj(zaPlacanjeRsd)}</strong>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-outline-secondary w-50" onClick={ocistiKorpu}>
                      Isprazni korpu
                    </button>
                    <button className="btn btn-primary w-50" onClick={onKupi as any}>
                      Završi kupovinu
                    </button>
                  </div>

                  <div className="form-text mt-2">Proverite količine i kupon pre plaćanja.</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
