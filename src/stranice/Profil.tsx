import { useContext, useMemo } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { ucitajNarudzbine } from "../servisi/narudzbine";

export default function Profil() {
  const { korisnik, odjava } = useContext(AuthKontekst);

  const narudzbine = useMemo(
    () => (korisnik ? ucitajNarudzbine(korisnik.id) : []),
    [korisnik]
  );

  if (!korisnik) return null;

  return (
    <div>
      <h2>Profil</h2>
      <p><strong>Ime:</strong> {korisnik.ime}</p>
      <p><strong>Email:</strong> {korisnik.email}</p>
      <button onClick={odjava}>Odjava</button>

      <h3 style={{ marginTop: 24 }}>Moje narudžbine</h3>
      {narudzbine.length === 0 ? (
        <p>Nema sačuvanih narudžbina.</p>
      ) : (
        <ul>
          {narudzbine.map(n => (
            <li key={n.id} style={{ marginBottom: 12 }}>
              <div>
                <strong>Datum:</strong> {new Date(n.datumISO).toLocaleString()} |
                <strong> Ukupno:</strong> {n.ukupno} RSD
              </div>
              <div>
                {n.stavke.map(s => (
                  <div key={s.idDogadjaja}>
                    {s.naziv} × {s.kolicina} = {s.kolicina * s.cena} RSD
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
