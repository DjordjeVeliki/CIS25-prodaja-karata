import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";
import { ValutaKontekst } from "../kontekst/ValutaKontekst";



export default function Navigacija() {
  const { korisnik, odjava } = useContext(AuthKontekst);
  const { stavke, ukupnoKomada } = useContext(KorpaKontekst);
  const navigate = useNavigate();
  const { valuta, setValuta, kurs } = useContext(ValutaKontekst);

  const brojUKorpi = useMemo(
    () =>
      typeof ukupnoKomada === "number"
        ? ukupnoKomada
        : stavke.reduce((s, x) => s + x.kolicina, 0),
    [ukupnoKomada, stavke]
  );

  const handleOdjava = () => {
    odjava();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">🎟️ Prodaja Karata</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Početna</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/dogadjaji">Događaji</NavLink></li>
            <li className="nav-item position-relative">
              <NavLink className="nav-link" to="/korpa">
                Korpa
                {brojUKorpi > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {brojUKorpi}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
          <div className="ms-3 btn-group" role="group" aria-label="Valuta">
            <button
              className={`btn btn-sm ${valuta === "RSD" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setValuta("RSD")}
            >
              RSD
            </button>
            <button
              className={`btn btn-sm ${valuta === "EUR" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setValuta("EUR")}
              title={kurs == null ? "Kurs se učitava…" : "Prikaz cena u EUR"}
            >
              EUR
            </button>
          </div>

          <ul className="navbar-nav">
            {korisnik ? (
              <>
                <li className="nav-item d-flex align-items-center me-2">
                  Ulogovan: <b className="ms-1">{korisnik.ime}</b>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleOdjava}>
                    Odjavi se
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/prijava">Prijava</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/registracija">Registracija</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
