import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

export default function Prijava() {
  const { prijava } = useContext(AuthKontekst);
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState<string | null>(null);
  const navigate = useNavigate();
  const lok = useLocation() as any;

  const onPrijava = async (e: FormEvent) => {
    e.preventDefault();
    setGreska(null);

    if (!email || !lozinka) {
      setGreska("Unesite email i lozinku.");
      return;
    }

    try {
      await prijava(email, lozinka);
      const back = lok?.state?.from ?? "/";
      navigate(back, { replace: true });
    } catch (err: any) {
      setGreska(err.message ?? "Greška pri prijavi");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">Prijava</h2>
              <form onSubmit={onPrijava}>
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
                    value={lozinka}
                    onChange={e => setLozinka(e.target.value)}
                    required
                  />
                </div>

                {greska && <div className="alert alert-danger py-2">{greska}</div>}

                <button className="btn btn-primary w-100" type="submit">Prijavi se</button>
              </form>

              <div className="text-secondary mt-3">
                Nemate nalog? <NavLink to="/registracija">Registrujte se</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
