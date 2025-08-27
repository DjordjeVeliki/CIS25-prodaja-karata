import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { useNavigate } from "react-router-dom";

export default function Registracija() {
  const { registracija } = useContext(AuthKontekst);
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState<string | null>(null);
  const navigate = useNavigate();

  const proveriEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGreska(null);

    if (!proveriEmail(email)) {
      setGreska("Unesite ispravnu e-mail adresu!");
      return;
    }

    if (lozinka.length < 6) {
      setGreska("Lozinka mora imati najmanje 6 karaktera!");
      return;
    }

    try {
      await registracija(ime, email, lozinka);
      navigate("/profil", { replace: true });
    } catch (err: any) {
      setGreska(err.message ?? "Greška pri registraciji");
    }
  };

  return (
    <div>
      <h2>Registracija</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Ime i prezime"
          />
        </div>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            placeholder="Lozinka"
          />
        </div>
        {greska && <p style={{ color: "crimson" }}>{greska}</p>}
        <button>Kreiraj nalog</button>
      </form>
    </div>
  );
}
