import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthKontekst } from "../kontekst/AuthKontekst";

export default function PrivatnaRuta() {
  const { korisnik } = useContext(AuthKontekst);
  const lokacija = useLocation();

  if (!korisnik) {
    // čuvamo gde je hteo da ide pa ga vraćamo posle prijave
    return <Navigate to="/prijava" replace state={{ from: lokacija.pathname }} />;
  }
  return <Outlet />;
}
