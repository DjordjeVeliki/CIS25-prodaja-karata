import { Link } from "react-router-dom";

export default function Navigacija() {
  return (
    <nav style={{display:"flex",gap:"16px",padding:"12px",borderBottom:"1px solid #ccc"}}>
      <Link to="/">Početna</Link>
      <Link to="/dogadjaji">Događaji</Link>
      <Link to="/korpa">Korpa</Link>
      <Link to="/profil">Profil</Link>
      <span style={{marginLeft:"auto"}}>
        <Link to="/prijava">Prijava</Link> | <Link to="/registracija">Registracija</Link>
      </span>
    </nav>
  );
}
