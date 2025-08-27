import { useContext } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";

export default function Profil() {
  const { korisnik, odjava } = useContext(AuthKontekst);
  if (!korisnik) return null; // realno ovde ne dolazimo jer je ruta zaštićena

  return (
    <div>
      <h2>Profil</h2>
      <p><strong>Ime:</strong> {korisnik.ime}</p>
      <p><strong>Email:</strong> {korisnik.email}</p>
      <button onClick={odjava}>Odjava</button>
    </div>
  );
}
