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

  const onRegistracija = async (e: FormEvent) => {
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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">Registracija</h2>

              <form onSubmit={onRegistracija}>
                <div className="mb-3">
                  <label htmlFor="ime" className="form-label">Ime i prezime</label>
                  <input
                    id="ime"
                    className="form-control"
                    value={ime}
                    onChange={e => setIme(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="lozinka" className="form-label">Lozinka</label>
                  <input
                    id="lozinka"
                    type="password"
                    className="form-control"
                    placeholder="min 6, 1 veliko slovo i broj"
                    value={lozinka}
                    onChange={e => setLozinka(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="potvrda" className="form-label">Potvrda lozinke</label>
                  <input
                    id="potvrda"
                    type="password"
                    className="form-control"
                    value={potvrda}
                    onChange={e => setPotvrda(e.target.value)}
                    required
                  />
                </div>

                {greska && <div className="alert alert-danger py-2">{greska}</div>}

                <button className="btn btn-primary w-100" type="submit">Kreiraj nalog</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
