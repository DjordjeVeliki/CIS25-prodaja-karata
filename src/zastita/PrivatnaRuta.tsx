import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthKontekst } from "../kontekst/AuthKontekst";

export default function PrivatnaRuta() {
  const { korisnik } = useContext(AuthKontekst);
  const lokacija = useLocation();

  if (!korisnik) {
    return <Navigate to="/prijava" replace state={{ from: lokacija.pathname }} />;
  }
  return <Outlet />;
}
