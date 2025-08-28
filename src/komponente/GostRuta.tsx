import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthKontekst } from "../kontekst/AuthKontekst";

export default function GostRuta({ children }: { children: JSX.Element }) {
  const { korisnik } = useContext(AuthKontekst);
  return korisnik ? <Navigate to="/profil" replace /> : children;
}
