import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Prijava() {
  const { prijava } = useContext(AuthKontekst);
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState<string | null>(null);
  const navigate = useNavigate();
  const lok = useLocation() as any;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGreska(null);
    try {
      await prijava(email, lozinka);
      const back = lok?.state?.from ?? "/";
      navigate(back, { replace: true });
    } catch (err: any) {
      setGreska(err.message ?? "Greška pri prijavi");
    }
  };

  return (
    <div>
      <h2>Prijava</h2>
      <form onSubmit={onSubmit}>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /></div>
        <div><input type="password" value={lozinka} onChange={e=>setLozinka(e.target.value)} placeholder="Lozinka" /></div>
        {greska && <p style={{color:"crimson"}}>{greska}</p>}
        <button>Prijavi se</button>
      </form>
      <p>Nemate nalog? <Link to="/registracija">Registrujte se</Link></p>
    </div>
  );
}
