import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthKontekst } from "../kontekst/AuthKontekst";

export default function GostRuta({ children }: { children: ReactNode }) {
  const { korisnik } = useContext(AuthKontekst);
  return korisnik ? <Navigate to="/profil" replace /> : <>{children}</>;
}
