import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { useNavigate } from "react-router-dom";

export default function Registracija() {
  const { registracija } = useContext(AuthKontekst);
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [potvrda, setPotvrda] = useState("");
  const [greska, setGreska] = useState<string | null>(null);
  const navigate = useNavigate();

  const proveriEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const regexLozinka = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // min 6, bar 1 veliko i 1 cifra

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGreska(null);

    if (!ime.trim()) {
      setGreska("Unesite ime i prezime.");
      return;
    }
    if (!proveriEmail(email)) {
      setGreska("Unesite ispravnu e-mail adresu!");
      return;
    }
    if (!regexLozinka.test(lozinka)) {
      setGreska("Lozinka mora imati min. 6 karaktera, jedno veliko slovo i jedan broj.");
      return;
    }
    if (lozinka !== potvrda) {
      setGreska("Lozinke se ne poklapaju.");
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
            type="email"
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
            placeholder="Lozinka (min 6, 1 veliko slovo, 1 broj)"
          />
        </div>
        <div>
          <input
            type="password"
            value={potvrda}
            onChange={(e) => setPotvrda(e.target.value)}
            placeholder="Potvrda lozinke"
          />
        </div>
        {greska && <p style={{ color: "crimson" }}>{greska}</p>}
        <button>Kreiraj nalog</button>
      </form>
    </div>
  );
}
