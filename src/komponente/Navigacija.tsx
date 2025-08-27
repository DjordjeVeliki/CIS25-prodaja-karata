import { Link } from "react-router-dom";
import { useContext } from "react";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";

export default function Navigacija() {
  const { ukupnoKomada } = useContext(KorpaKontekst);

  return (
    <nav style={{display:"flex",gap:"16px",padding:"12px",borderBottom:"1px solid #ccc"}}>
      <Link to="/">Početna</Link>
      <Link to="/dogadjaji">Događaji</Link>
      <Link to="/korpa">Korpa ({ukupnoKomada})</Link>
      <Link to="/profil">Profil</Link>
      <span style={{marginLeft:"auto"}}>
        <Link to="/prijava">Prijava</Link> | <Link to="/registracija">Registracija</Link>
      </span>
    </nav>
  );
}
