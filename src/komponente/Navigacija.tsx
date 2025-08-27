import { Link, useNavigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";

export default function Navigacija() {
  const { korisnik, odjava } = useContext(AuthKontekst);
  const { stavke, ukupnoKomada } = useContext(KorpaKontekst);
  const navigate = useNavigate();

  // fallback: izračunaj broj komada direktno iz stavki ako iz nekog razloga nema ukupnoKomada
  const brojUKorpi = useMemo(
    () => (typeof ukupnoKomada === "number" ? ukupnoKomada : stavke.reduce((s, x) => s + x.kolicina, 0)),
    [ukupnoKomada, stavke]
  );

  const handleOdjava = () => {
    odjava();
    navigate("/", { replace: true });
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", marginBottom: 16, alignItems: "center" }}>
      <Link to="/">Početna</Link>
      <Link to="/dogadjaji">Događaji</Link>

      <Link to="/korpa" style={{ position: "relative" }}>
        Korpa
        {brojUKorpi > 0 && (
          <span
            style={{
              position: "absolute",
              top: -8,
              right: -12,
              background: "crimson",
              color: "white",
              borderRadius: 12,
              padding: "0 6px",
              fontSize: 12,
              lineHeight: "18px",
              minWidth: 18,
              textAlign: "center",
            }}
            aria-label={`Broj artikala u korpi: ${brojUKorpi}`}
          >
            {brojUKorpi}
          </span>
        )}
      </Link>

      <Link to="/profil">Profil</Link>

      <div style={{ marginLeft: "auto" }}>
        {korisnik ? (
          <>
            <span style={{ marginRight: 10 }}>
              Ulogovan: <b>{korisnik.ime}</b>
            </span>
            <button onClick={handleOdjava}>Odjavi se</button>
          </>
        ) : (
          <>
            <Link to="/prijava">Prijava</Link> | <Link to="/registracija">Registracija</Link>
          </>
        )}
      </div>
    </nav>
  );
}
